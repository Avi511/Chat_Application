import { createClient } from "redis";

class RedisService {
    constructor() {
        this.client = null;
        this.memoryStore = new Map();
    }
    async initialize() {
        if (this.client) return;
        try {
            this.client = createClient({
                url: process.env.REDIS_URL,
                socket: { reconnectStrategy: false }
            });

            this.client.on("error", (error) => {
            });

            await this.client.connect();
            console.log("Redis Client Connected");
        } catch (error) {
            console.log("Failed to connect to Redis. Using in-memory fallback for local dev.");
            this.client = null;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            console.log("Redis Client Disconnected");
        }
    }


    async setSession(userId, socketId, expiresIn = 86400) {
        try {
            await this.client.set(`user:${userId}`, socketId);
            await this.client.set(`user:expiry:${userId}`, socketId);
            await this.client.expire(`user:expiry:${userId}`, expiresIn);
        } catch (error) {
            console.error("Error setting session", error);
        }
    }

    async getSocketId(userId) {
        try {
            return await this.client.get(`user:${userId}`);
        } catch (error) {
            console.error("Error getting socket ID", error);
            return null;
        }
    }

    async deleteSession(userId, socketId) {
        try {
            await this.client.del(`user:${userId}`);
            await this.client.del(`user:expiry:${userId}`);
        } catch (error) {
            console.error("Error deleting session", error);
        }
    }

    async isUserOnline(userId) {
        try {
            const socketId = await this.client.get(`user:${userId}`);
            return !!socketId;
        } catch (error) {
            console.error("Error checking if user is online", error);
            return false;
        }
    }

    async cleanupExpiredSessions() {
        try {
            const allUsers = await this.client.keys("user:expiry:*ty:*");
            const now = Date.now();

            for (const key of allUsers) {
                const expiryTime = await this.client.ttl(key);
                if (expiryTime <= 0) {
                    const userId = key.replace("user:expiry:", "");
                    await this.deleteSession(userId, null);
                }
            }
        } catch (error) {
            console.error("Error cleaning up sessions", error);
        }
    }

    async _safe(action, fallback = null) {
        try {
            return await action();
        } catch (error) {
            console.error("Error in Redis", error);
            return fallback;
        }
    }

    async addUserSession(userId, socketId) {
        if (!this.client) {
            if (!this.memoryStore.has(userId)) this.memoryStore.set(userId, new Set());
            this.memoryStore.get(userId).add(socketId);
            return;
        }
        await this._safe(async () => {
            const key = `user:${userId}`;
            await this.client.sAdd(key, socketId);
            await this.client.set(`user:expiry:${userId}`, "active");
            await this.client.expire(`user:expiry:${userId}`, 86400);
        })
    }

    async removeUserSession(userId, socketId) {
        if (!this.client) {
            if (this.memoryStore.has(userId)) {
                this.memoryStore.get(userId).delete(socketId);
                if (this.memoryStore.get(userId).size === 0) this.memoryStore.delete(userId);
            }
            return;
        }
        await this._safe(async () => {
            const key = `user:${userId}`;
            await this.client.sRem(key, socketId);

            const remainingSocketIds = await this.client.sCard(key);
            if (remainingSocketIds === 0) {
                await this.client.del(`user:expiry:${userId}`);
            }
        })
    }

    async isUserOnline(userId) {
        if (!this.client) {
            return this.memoryStore.has(userId) && this.memoryStore.get(userId).size > 0;
        }
        return this._safe(async () => {
            const count = await this.client.sCard(`user:${userId}`);
            return count > 0;
        }, false);
    }

    async removeAllUserSessions(userId) {
        if (!this.client) {
            this.memoryStore.delete(userId);
            return;
        }
        await this._safe(async () => {
            await this.client.del(`user:${userId}`);
            await this.client.del(`user:expiry:${userId}`);
        })
    }
}

const redisService = new RedisService();

export default redisService;