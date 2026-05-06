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
    static async generateKeyPair() {
        return await window.crypto.subtle.generateKey(
            RSA_ALGORITHM,
            true, // extractable
            ["encrypt", "decrypt"]
        );
    }

    static async exportPublicKey(publicKey: CryptoKey): Promise<string> {
        const jwk = await window.crypto.subtle.exportKey("jwk", publicKey);
        return JSON.stringify(jwk);
    }

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

    static async exportPrivateKey(privateKey: CryptoKey): Promise<string> {
        const jwk = await window.crypto.subtle.exportKey("jwk", privateKey);
        return JSON.stringify(jwk);
    }


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

    static async encryptMessage(message: string, recipientPublicKey: CryptoKey, senderPublicKey: CryptoKey) {
        const aesKey = await window.crypto.subtle.generateKey(
            AES_ALGORITHM,
            true,
            ["encrypt", "decrypt"]
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedMessage = new TextEncoder().encode(message);
        const encryptedContentBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            aesKey,
            encodedMessage
        );

        const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

        const recipientEncryptedKeyBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            recipientPublicKey,
            rawAesKey
        );

        const senderEncryptedKeyBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            senderPublicKey,
            rawAesKey
        );

        return {
            content: this.bufferToBase64(new Uint8Array([...iv, ...new Uint8Array(encryptedContentBuffer)])),
            recipientKey: this.bufferToBase64(new Uint8Array(recipientEncryptedKeyBuffer)),
            senderKey: this.bufferToBase64(new Uint8Array(senderEncryptedKeyBuffer)),
        };
    }

    static async decryptMessage(encryptedData: string, encryptedKey: string, privateKey: CryptoKey): Promise<string> {
        try {
            const encryptedKeyBuffer = this.base64ToBuffer(encryptedKey);
            const rawAesKey = await window.crypto.subtle.decrypt(
                { name: "RSA-OAEP" },
                privateKey,
                encryptedKeyBuffer
            );

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
            throw error;
        }
    }

    /**
     * Verify that a public key matches a private key
     */
    static async verifyKeyPair(
        publicKeyJwk: string,
        privateKeyJwk: string
    ): Promise<boolean> {
        try {
            const publicKey = await this.importPublicKey(publicKeyJwk);
            const privateKey = await this.importPrivateKey(privateKeyJwk);

            const challenge = window.crypto.getRandomValues(new Uint8Array(32));

            const encrypted = await window.crypto.subtle.encrypt(
                { name: "RSA-OAEP" },
                publicKey,
                challenge
            );

            const decrypted = new Uint8Array(
                await window.crypto.subtle.decrypt(
                    { name: "RSA-OAEP" },
                    privateKey,
                    encrypted
                )
            );

            return (
                challenge.length === decrypted.length &&
                challenge.every((byte, index) => byte === decrypted[index])
            );
        } catch {
            return false;
        }
    }

    /**
     * Derive a public key JWK from a private key JWK string
     */
    static publicKeyFromPrivateKey(privateKeyJwk: string): string {
        const jwk = JSON.parse(privateKeyJwk);

        return JSON.stringify({
            kty: jwk.kty,
            n: jwk.n,
            e: jwk.e,
            alg: jwk.alg || "RSA-OAEP-256",
            ext: true,
            key_ops: ["encrypt"],
        });
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
