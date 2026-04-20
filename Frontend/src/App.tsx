import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Toaster position="top-right" richColors duration={2000} toastOptions={{ style: { fontSize: '16px', textAlign: 'center', width: '400px' } }} />
    </>
  );
}

export default App;