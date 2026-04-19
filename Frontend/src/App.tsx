import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;