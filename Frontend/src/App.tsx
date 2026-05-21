import { Routes, Route } from "react-router"
import Home from "./pages/home"
import CreateRoom from "./pages/create-room"
import JoinRoom from "./pages/join-room"
import ChatRoom from "./pages/chat-room"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/room/:roomId" element={<ChatRoom />} />
    </Routes>
  )
}

export default App
