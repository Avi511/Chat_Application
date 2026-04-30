/**
 * End-to-End Encryption Utility using Web Crypto API
 */

const RSA_ALGORITHM = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: { name: "SHA-256" },
};

const AES_ALGORITHM = {
    name: "AES-GCM",
    length: 256,
};

export class CryptoUtils {
    /**
     * Generate a new RSA key pair
     */
    static async generateKeyPair() {
        return await window.crypto.subtle.generateKey(
            RSA_ALGORITHM,
            true, // extractable
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Export a public key to JWK format (string)
     */
    static async exportPublicKey(publicKey: CryptoKey): Promise<string> {
        const jwk = await window.crypto.subtle.exportKey("jwk", publicKey);
        return JSON.stringify(jwk);
    }

    /**
     * Import a public key from JWK string
     */
    static async importPublicKey(jwkString: string): Promise<CryptoKey> {
        const jwk = JSON.parse(jwkString);
        return await window.crypto.subtle.importKey(
            "jwk",
            jwk,
            RSA_ALGORITHM,
            true,
            ["encrypt"]
        );
    }

    /**
     * Export a private key to JWK format (string)
     */
    static async exportPrivateKey(privateKey: CryptoKey): Promise<string> {
        const jwk = await window.crypto.subtle.exportKey("jwk", privateKey);
        return JSON.stringify(jwk);
    }

    /**
     * Import a private key from JWK string
     */
    static async importPrivateKey(jwkString: string): Promise<CryptoKey> {
        const jwk = JSON.parse(jwkString);
        return await window.crypto.subtle.importKey(
            "jwk",
            jwk,
            RSA_ALGORITHM,
            true,
            ["decrypt"]
        );
    }

    /**
     * Encrypt a message using AES-GCM and encrypt the AES key with RSA-OAEP
     */
    static async encryptMessage(message: string, recipientPublicKey: CryptoKey, senderPublicKey: CryptoKey) {
        // 1. Generate random AES key
        const aesKey = await window.crypto.subtle.generateKey(
            AES_ALGORITHM,
            true,
            ["encrypt", "decrypt"]
        );

        // 2. Encrypt message with AES
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedMessage = new TextEncoder().encode(message);
        const encryptedContentBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            aesKey,
            encodedMessage
        );

        // 3. Export AES key
        const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

        // 4. Encrypt AES key with recipient's RSA public key
        const recipientEncryptedKeyBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            recipientPublicKey,
            rawAesKey
        );

        // 5. Encrypt AES key with sender's RSA public key (so sender can read it too)
        const senderEncryptedKeyBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            senderPublicKey,
            rawAesKey
        );

        // Convert to Base64 for transmission
        return {
            content: this.bufferToBase64(new Uint8Array([...iv, ...new Uint8Array(encryptedContentBuffer)])),
            recipientKey: this.bufferToBase64(new Uint8Array(recipientEncryptedKeyBuffer)),
            senderKey: this.bufferToBase64(new Uint8Array(senderEncryptedKeyBuffer)),
        };
    }

    /**
     * Decrypt a message using RSA-OAEP and AES-GCM
     */
    static async decryptMessage(encryptedData: string, encryptedKey: string, privateKey: CryptoKey): Promise<string> {
        try {
            // 1. Decrypt AES key with RSA private key
            const encryptedKeyBuffer = this.base64ToBuffer(encryptedKey);
            const rawAesKey = await window.crypto.subtle.decrypt(
                { name: "RSA-OAEP" },
                privateKey,
                encryptedKeyBuffer
            );

            // 2. Import AES key
            const aesKey = await window.crypto.subtle.importKey(
                "raw",
                rawAesKey,
                AES_ALGORITHM,
                true,
                ["decrypt"]
            );

            // 3. Decrypt content with AES
            const fullBuffer = this.base64ToBuffer(encryptedData);
            const iv = fullBuffer.slice(0, 12);
            const content = fullBuffer.slice(12);

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                aesKey,
                content
            );

            return new TextDecoder().decode(decryptedBuffer);
        } catch (error: any) {
            console.error("Decryption failed:", error.name, error.message);
            throw error;
        }
    }

    private static bufferToBase64(buffer: Uint8Array): string {
        let binary = "";
        const len = buffer.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(buffer[i]);
        }
        return btoa(binary);
    }

    private static base64ToBuffer(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
}
