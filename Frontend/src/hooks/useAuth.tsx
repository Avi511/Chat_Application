import { useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    return { user, setUser, token, setToken };
}