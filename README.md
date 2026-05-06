# 💬 Chat Pad - Next-Gen Secure Messaging

**Chat Pad** is a state-of-the-art, high-performance real-time messaging platform prioritizing user privacy and security through robust **End-to-End Encryption (E2EE)**. Designed with a sleek, modern UI, Chat Pad delivers a seamless chat experience akin to leading messaging applications, without compromising on data security.

## 🌟 Key Features

### 🔒 Military-Grade Security
- **True End-to-End Encryption (E2EE):** All messages are encrypted directly in the browser using the **Web Crypto API**. The server only ever handles encrypted ciphertexts.
- **Hybrid Cryptography:** Utilizes **RSA-OAEP** for secure key exchange and **AES-GCM** for fast, authenticated symmetric message encryption.
- **Zero-Knowledge Architecture:** Private keys never leave your device. They are stored securely in the browser's `localStorage`.

### ⚡ Real-Time Interactions
- **Instant Delivery:** Powered by **Socket.io**, messages are delivered instantaneously without requiring page refreshes.
- **Typing Indicators:** Real-time visual feedback when the other participant is typing.
- **Live Presence Tracking:** See exactly who is online and when they were last active, synchronized seamlessly across multiple devices using **Redis**.

### 🎨 Premium User Experience
- **Stunning UI/UX:** A highly polished, master-detail interface tailored with **Tailwind CSS**. Features dynamic micro-animations, glassmorphism, and a meticulously crafted dark mode.
- **Fully Responsive:** Offers a flawless, app-like experience on desktops, tablets, and mobile devices.
- **Media Management:** Seamless profile picture uploads and management integrated with **Cloudinary**.

### 🛠️ Resilient Infrastructure
- **Auto-Healing State Management:** Graceful handling of cryptographic key mismatches. If a database reset occurs, the application intelligently renegotiates keys without breaking the user experience.
- **Stateless Authentication:** Robust JWT-based authentication flow ensuring API security and identity verification.

---

## 🏗️ Technical Architecture

### Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, TypeScript | High-performance SPA with fast HMR |
| **State Management** | Zustand | Lightweight, unopinionated state management |
| **Styling** | Tailwind CSS, Lucide Icons | Utility-first CSS framework for rapid UI development |
| **Backend** | Node.js, Express | Fast, unopinionated web framework |
| **Database** | MongoDB (Mongoose) | NoSQL database for flexible data modeling |
| **Real-time Engine** | Socket.io | Bi-directional, event-based communication |
| **Caching & Pub/Sub** | Redis | High-speed data store for presence tracking |
| **Cryptography** | Web Crypto API | Native, high-performance browser cryptography |
| **Media Storage** | Cloudinary | Cloud-based image and video management |

### The E2EE Workflow
1. **Key Generation:** Upon registration, a unique RSA public/private key pair is generated locally in the user's browser.
2. **Key Distribution:** The public key is sent to the server and shared with contacts. The private key remains securely in `localStorage`.
3. **Message Encryption:** 
   - A random AES key is generated for each message.
   - The message is encrypted using the AES key (AES-GCM).
   - The AES key is encrypted using the recipient's RSA Public Key.
4. **Transmission:** The encrypted message and encrypted AES key are sent to the server.
5. **Decryption:** 
   - The recipient downloads the payload.
   - The AES key is decrypted using the recipient's RSA Private Key.
   - The message is decrypted using the decrypted AES key.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (Atlas cluster or local instance)
- Redis (Optional for local dev, will fallback to in-memory maps if not provided)

### 1. Clone the Repository
```bash
git clone https://github.com/Avi511/Chat_Application
cd chat-pad
```

### 2. Backend Setup
Navigate to the backend directory and set up the environment:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chatpad
JWT_SECRET=your_super_secret_jwt_string
REDIS_URL=redis://localhost:6379 # Optional
CLIENT_ORIGIN=http://localhost:5173

# Cloudinary Setup for Profile Pictures
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🛠️ Development & Debugging

### Database Reset Utility
During development, especially when modifying the encryption flow or database schema, you may want to start fresh. We provide a script to securely purge the database of all messages, conversations, and user keys.

```bash
# Run from the root directory or inside the Backend folder
node Backend/reset-db.js
```

### Known Limitations
- **Key Loss:** Because private keys are stored exclusively in `localStorage`, clearing browser data or logging in from an entirely new device (without a key migration mechanism) will render historical encrypted messages unreadable.
- **Group Chats:** The current E2EE implementation is optimized for 1-on-1 messaging. Group chat encryption using a centralized server-side tree or pairwise encryption is planned for future releases.

---

## 🤝 Contributing
Contributions are always welcome! Whether it's reporting a bug, discussing improvements, or submitting a pull request, your input helps make Chat Pad better.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
