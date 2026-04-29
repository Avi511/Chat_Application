import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";

export function PrivateRoute() {
    const { user, isLoading, isAuthenticated } = useAuthStore();

    if (isLoading) {
        return <div className="min-h-screen flex w-full items-center justify-center">
            <div className="size-10 bg-sky-200 rounded-full animate-bounce"></div>
        </div>
    }

    if (!isAuthenticated || !user) return <Navigate to="/auth" />

    return <Outlet />
}

export function GuestRoute() {
    const { user, isLoading, isAuthenticated } = useAuthStore();

    if (isLoading) {
        return <div className="min-h-screen flex w-full items-center justify-center">
            <div className="size-10 bg-sky-200 rounded-full animate-bounce"></div>
        </div>
    }

    return (!isAuthenticated || !user) ? <Outlet /> : <Navigate to="/" />
}