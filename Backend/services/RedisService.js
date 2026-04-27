import { createClient } from "redis";

class RedisService {
    constructor() {
        this.client = null;
    }
    async initialize() {
        if (this.client) return;
        try {
            this.client = createClient({
                url: process.env.REDIS_URL
            });

            this.client.on("error", (error) => {
                console.error("Redis Client Error", error);
            })

            await this.client.connect();
            console.log("Redis Client Connected");
        } catch (error) {
            console.error("Redis Client Error", error);
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
            // Set user socket ID
            await this.client.set(`user:${userId}`, socketId);

            // Create an expiry key to clean up disconnected sockets
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
            // Delete both the session and expiry keys to clean up
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
            // This is a simplified cleanup. In production, you might want to iterate through users
            // or use a more robust pattern.
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
        await this._safe(async () => {
            const key = `user:${userId}`;
            await this.client.sAdd(key, socketId); // Use sAdd for Sets to support multiple tabs
            await this.client.set(`user:expiry:${userId}`, "active");
            await this.client.expire(`user:expiry:${userId}`, 86400);
        })
    }

    async removeUserSession(userId, socketId) {
        await this._safe(async () => {
            const key = `user:${userId}`;
            await this.client.sRem(key, socketId); // Remove specific socket tab

            const remainingSocketIds = await this.client.sCard(key); // Count remaining sockets
            if (remainingSocketIds === 0) {
                await this.client.del(`user:expiry:${userId}`);
            }
        })
    }

    // Overriding the previous isUserOnline to correctly use Set logic
    async isUserOnline(userId) {
        return this._safe(async () => {
            const count = await this.client.sCard(`user:${userId}`);
            return count > 0;
        }, false);
    }

    async removeAllUserSessions(userId) {
        await this._safe(async () => {
            await this.client.del(`user:${userId}`);
            await this.client.del(`user:expiry:${userId}`);
        })
    }
}

const redisService = new RedisService();

export default redisService;