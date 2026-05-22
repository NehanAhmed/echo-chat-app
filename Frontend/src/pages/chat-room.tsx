import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout04Icon,
  Sun01Icon,
  Moon01Icon,
  UserGroupIcon,
  Copy01Icon,
  Tick01Icon,
  ArrowLeft01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useJoinRoom } from "@/hooks/useJoinRoom"
import { useSocket } from "@/hooks/useSocket"
import { useSendMessage } from "@/hooks/useSendMessage"
import { useChatStore } from "@/store/chatStore"
import { useTheme } from "@/components/theme-provider"
import Logo from "@/components/logo"

function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const displayName = searchParams.get("name") || ""

  const { joinRoom, leaveRoom } = useJoinRoom()
  const { input, setInput, sendMessage, handleKeyDown } = useSendMessage()
  const { messages, onlineUsers, isConnected, error } = useChatStore()
  const { theme, setTheme } = useTheme()
  const viewportRef = useRef<HTMLDivElement>(null)
  const hasJoined = useRef(false)
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const copyRoomId = useCallback(async () => {
    if (!roomId) return
    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy room ID:", err)
    }
    setTimeout(() => setCopied(false), 1500)
  }, [roomId])

  useSocket()

  useEffect(() => {
    if (!roomId || !displayName || hasJoined.current) return
    hasJoined.current = true
    joinRoom(roomId, displayName)
  }, [roomId, displayName, joinRoom])

  const handleLeave = useCallback(() => {
    if (roomId) leaveRoom(roomId)
    setSidebarOpen(false)
    navigate("/")
  }, [roomId, leaveRoom, navigate])

  const toggleTheme = useCallback(() => {
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme
    setTheme(resolved === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const otherUsers = onlineUsers.filter((u) => u !== displayName)

  useEffect(() => {
    const viewport = viewportRef.current
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages])

  if (!roomId || !displayName) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm text-muted-foreground">Missing room information.</p>
          <Link
            to="/"
            className="mt-4 text-xs text-primary transition-colors hover:text-primary/80"
          >
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex h-dvh">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar
          fixed inset-y-0 left-0 z-40 transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:z-auto md:translate-x-0
        `}
      >
        {/* Branding */}
        <div className="flex items-center justify-center">
          <Logo className="h-24 w-auto sm:h-30" />
        </div>

        <div className="mx-5 h-px bg-sidebar-border" />

        {/* Online users */}
        <div className="flex flex-1 flex-col overflow-hidden px-4 pt-4">
          <div className="mb-3 flex items-center gap-2 px-1">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={14}
              className="text-sidebar-foreground/50"
            />
            <span className="text-[0.625rem] font-medium uppercase tracking-wider text-sidebar-foreground/50">
              Online
            </span>
            <span className="ml-auto inline-flex size-4 items-center justify-center rounded-full bg-sidebar-accent text-[0.625rem] font-medium text-sidebar-accent-foreground">
              {onlineUsers.length}
            </span>
          </div>

          <ScrollArea className="h-full">
            <div className="space-y-0.5 pr-3">
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent">
                <Avatar size="sm" className="shrink-0">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                    {displayName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 items-baseline gap-1.5">
                  <span className="truncate text-xs font-medium text-sidebar-foreground">
                    {displayName}
                  </span>
                  <span className="shrink-0 text-[0.625rem] text-sidebar-foreground/40">
                    (you)
                  </span>
                </div>
              </div>

              {otherUsers.map((user) => (
                <div
                  key={user}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
                >
                  <Avatar size="sm" className="shrink-0">
                    <AvatarFallback>
                      {user[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs font-medium text-sidebar-foreground">
                    {user}
                  </span>
                </div>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>

        {/* Bottom actions */}
        <div className="space-y-1 border-t border-sidebar-border px-4 py-3">
          <Button
            variant="ghost"
            size="default"
            className="w-full justify-start gap-2.5 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={toggleTheme}
          >
            <HugeiconsIcon
              icon={isDark ? Sun01Icon : Moon01Icon}
              size={14}
            />
            {isDark ? "Light mode" : "Dark mode"}
          </Button>

          <Button
            variant="ghost"
            size="default"
            className="w-full justify-start gap-2.5 text-destructive hover:bg-destructive/10"
            onClick={handleLeave}
          >
            <HugeiconsIcon icon={Logout04Icon} size={14} />
            Leave chat
          </Button>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon-xs"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <HugeiconsIcon icon={Menu01Icon} size={14} />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => navigate("/")} aria-label="Back">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            </Button>
            <span className="h-3.5 w-px bg-border" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate text-xs font-medium text-foreground">
                {roomId}
              </span>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={copyRoomId}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label={copied ? "Copied" : "Copy room ID"}
              >
                <HugeiconsIcon
                  icon={copied ? Tick01Icon : Copy01Icon}
                  size={12}
                />
              </Button>
              <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] text-muted-foreground">
                <span
                  className={`inline-block size-1.5 rounded-full ${isConnected ? "bg-primary" : "bg-muted-foreground/40"}`}
                />
                {onlineUsers.length}
              </span>
            </div>
          </div>
        </header>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-border bg-destructive/5 px-4 sm:px-6"
            >
              <p className="py-2 text-xs text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4 sm:px-6">
          <div ref={viewportRef} className="mx-auto max-w-2xl space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-8 text-center text-xs text-muted-foreground"
                >
                  No messages yet. Start the conversation.
                </motion.p>
              )}

              {messages.map((msg) => {
                const isOwn = msg.displayName === displayName
                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-start gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar size="sm" className="mt-0.5 shrink-0">
                      <AvatarFallback>{msg.displayName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={`flex max-w-[75%] flex-col sm:max-w-[70%] ${isOwn ? "items-end" : ""}`}>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-[0.625rem] font-medium ${isOwn ? "text-primary" : "text-foreground"}`}
                        >
                          {isOwn ? "You" : msg.displayName}
                        </span>
                        <span className="text-[0.625rem] text-muted-foreground/60">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 rounded-lg px-3 py-1.5 text-sm leading-relaxed ${
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          <ScrollBar />
        </ScrollArea>

        {/* Input bar */}
        <div className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3 sm:gap-3 sm:px-6">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
            className="text-sm"
          />
          <Button
            size="default"
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
          >
            Send
          </Button>
        </div>
      </div>
    </main>
  )
}

export default ChatRoom
