import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/home"
import CreateRoom from "./pages/create-room"
import JoinRoom from "./pages/join-room"
import ChatRoom from "./pages/chat-room"
import JsonLd from "@/components/json-ld"

export function App() {
  const location = useLocation()

  return (
    <>
      {location.pathname === "/" && <JsonLd />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
    </>
  )
}

export default App
