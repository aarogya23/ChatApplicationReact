import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Chat from "./Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
