import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";
import { PrivateRoute, GuestRoute } from "./pages/PageGuards";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Chat />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors duration={2000} toastOptions={{ style: { fontSize: '16px', textAlign: 'center', width: '400px' } }} />
    </>
  );
}

export default App;