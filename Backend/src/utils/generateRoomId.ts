const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"

function randomSegment(): string {
  let s = ""
  for (let i = 0; i < 3; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return s
}

export function generateRoomId(): string {
  return `${randomSegment()}-${randomSegment()}`
}
