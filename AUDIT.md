# Web Quality Audit — echo-chat-app

Comprehensive quality review based on Google Lighthouse audit standards. Covers **Performance**, **Accessibility**, **SEO**, and **Best Practices**.

---

## Critical issues (2 found)

- **[Best Practices/Security] MongoDB credentials hardcoded in `.env`.** File: `Backend/.env:4`
  - **Impact:** Exposed `mongodb+srv://nehan-user:M6xZOiwO2chonqZn@cluster0...` — full read/write access to the database if committed or leaked.
  - **Fix:** Use environment variables only at deploy-time (e.g., CI secrets, Docker env). Ensure `.env` stays in `.gitignore` (it is). Rotate the exposed password immediately.

- **[Best Practices/Security] No Content Security Policy (CSP) headers.** File: `Backend/src/app.ts:10`
  - **Impact:** No XSS protection — inline scripts and unauthorized origins can execute in the browser.
  - **Fix:** Add `helmet` middleware with CSP configuration:
    ```ts
    import helmet from "helmet"
    app.use(helmet())
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", process.env.CLIENT_URL || "http://localhost:5173"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],  // needed for Tailwind
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
        },
      })
    )
    ```

---

## High priority (6 found)

- **[Performance] Fonts loaded via CSS `@import` — render-blocking.** File: `Frontend/src/index.css:4-5`
  - **Impact:** Each `@import` adds sequential network round-trips before the browser can render anything. Delays LCP by 200–800ms on slow connections.
  - **Fix:** Replace with `<link>` tags in `index.html` with `font-display: swap`:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Montserrat:wght@500;600;700&display=swap"
      media="print"
      onload="this.media='all'"
    />
    ```
    Or via preload for self-hosted fontsource files:
    ```html
    <link rel="preload" href="/node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
    ```

- **[Accessibility] Home page missing `<h1>` heading.** File: `Frontend/src/pages/home.tsx:17`
  - **Impact:** Screen readers have no landmark heading. The page fails heading hierarchy (WCAG 1.3.1). Hurts SEO.
  - **Fix:** Wrap the tagline in `<h1>` (styled to match current appearance):
    ```tsx
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 max-w-xs px-4 text-center text-sm leading-relaxed text-muted-foreground sm:max-w-sm"
    >
      Real-time conversations that disappear without a trace.
    </motion.h1>
    ```

- **[Accessibility] No "Skip to main content" link.** File: `Frontend/index.html`
  - **Impact:** Keyboard users must tab through all sidebar navigation on every page load. WCAG 2.4.1 failure.
  - **Fix:** Add a skip link as the first focusable element in `main.tsx`:
    ```tsx
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground">
      Skip to main content
    </a>
    ```
    Then add `id="main-content"` to each page's `<main>` element.

- **[Best Practices/Security] No security headers middleware.** File: `Backend/src/app.ts`
  - **Impact:** Missing `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`. Vulnerable to clickjacking and MIME sniffing.
  - **Fix:** Install and use `helmet`:
    ```bash
    pnpm add helmet
    pnpm add -D @types/helmet
    ```
    ```ts
    import helmet from "helmet"
    app.use(helmet())
    ```

- **[Best Practices] Zod validation schema defined but unused.** File: `Frontend/src/types/room.types.ts`
  - **Impact:** `create-room.tsx` duplicates validation logic inline. Zod schema is dead code.
  - **Fix:** Use the Zod schema in `create-room.tsx`:
    ```tsx
    import { roomCreateSchema } from "@/types/room.types"

    const result = roomCreateSchema.safeParse({ name: trimmedName, createdBy: trimmedCreatedBy })
    if (!result.success) {
      setValidationError(result.error.issues[0].message)
      return
    }
    ```

- **[Performance/INP] Large motion library imported globally.** File: `Frontend/src/pages/chat-room.tsx:3`
  - **Impact:** `motion/react` adds ~30KB gzipped. Used for subtle micro-animations (opacity, y shifts) that could be CSS transitions. On low-power devices, animation startup can delay first interaction.
  - **Fix:** Replace trivial opacity/y animations with CSS transitions (they only animate `transform` and `opacity` per design rules). Reserve `motion` for spring-based/gesture-driven animations only.

---

## Medium priority (8 found)

- **[SEO] Missing `robots.txt` and XML sitemap.**
  - **Impact:** Search crawlers have no guidance. Client-rendered SPA pages may not be indexed properly.
  - **Fix:** Add `Frontend/public/robots.txt`:
    ```
    User-agent: *
    Allow: /
    Sitemap: https://yourdomain.com/sitemap.xml
    ```

- **[SEO] Title tag too short (9 characters).** File: `Frontend/index.html:15`
  - **Impact:** Google typically displays 50–60 chars. "Echo Chat" squanders prime SERP real estate.
  - **Fix:** Make titles page-specific using a React Helmet equivalent:
    ```html
    <title>Echo Chat — Ephemeral Real-Time Messaging</title>
    ```

- **[Accessibility] No `<h1>` on Join Room and Create Room pages have `<h1>` — inconsistent.** File: `Frontend/src/pages/home.tsx`
  - **Impact:** Home (landing page) has no `<h1>` while child pages do. Breaks expected heading hierarchy.
  - **Fix:** Add `<h1>` to home page as noted above.

- **[Performance] No resource hints (preconnect/preload).** File: `Frontend/index.html`
  - **Impact:** Socket server connection and API calls are delayed by DNS/TCP/TLS negotiation.
  - **Fix:** Add preconnect hints:
    ```html
    <link rel="preconnect" href="http://localhost:5000" crossorigin />
    ```

- **[Performance] Static images are PNG — not optimized.** Files: `Frontend/public/logo.png`, `og-image.png`, etc.
  - **Impact:** PNG files are 2–3× larger than WebP at equivalent quality. Adds ~25KB unnecessary bytes.
  - **Fix:** Convert to WebP/AVIF during build with a Vite plugin (`vite-plugin-imagemin`):
    ```ts
    import imagemin from "vite-plugin-imagemin"
    plugins: [react(), tailwindcss(), imagemin()]
    ```

- **[Best Practices] Empty catch block swallows errors.** File: `Frontend/src/pages/create-room.tsx:37`
  - **Impact:** If mutation fails outside the `error` state path, the error is silently lost — impossible to debug.
  - **Fix:** Log or surface the error:
    ```tsx
    } catch (err) {
      console.error("Room creation failed:", err)
    }
    ```

- **[Best Practices] Production console.log statements.** File: `Backend/src/index.ts:17`, `Backend/src/socket/index.ts:29,77,151`
  - **Impact:** Logs server internals and user actions (room join/leave) to stdout in production. Information disclosure risk.
  - **Fix:** Use a proper logging library or guard behind `NODE_ENV`:
    ```ts
    if (process.env.NODE_ENV !== "production") {
      console.log(`✅ Socket connected: ${socket.id}`)
    }
    ```

- **[Performance/PWA] No service worker registered.** File: `Frontend/src/main.tsx`
  - **Impact:** App not installable as PWA. No offline support. No cache-first strategy for static assets.
  - **Fix:** Add `vite-plugin-pwa`:
    ```ts
    import { VitePWA } from "vite-plugin-pwa"
    plugins: [react(), tailwindcss(), VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["*.png", "favicon.ico"],
      manifest: {
        name: "Echo Chat",
        short_name: "Echo Chat",
        // ...existing manifest content
      }
    })]
    ```

---

## Low priority (4 found)

- **[Performance] SVG logo (react.svg) in assets is unused.** File: `Frontend/src/assets/react.svg`
  - **Impact:** Bloat in the repo. Not imported anywhere.
  - **Fix:** Delete the file.

- **[Performance] `logo.png` has no explicit dimensions in HTML.** File: `Frontend/src/components/logo.tsx:7`
  - **Impact:** Without `width`/`height`, the browser cannot reserve space. Can cause CLS as the image loads.
  - **Fix:** Add width/height attributes:
    ```tsx
    <motion.img
      src="/logo.png"
      alt="Echo Chat"
      width={512}
      height={512}
      className={className}
      ...
    />
    ```

- **[Accessibility] Avatar fallback text repeated by adjacent label.** File: `Frontend/src/pages/chat-room.tsx:157-161`
  - **Impact:** Screen readers announce the first initial twice (once from `AvatarFallback`, once from the name span). Minor redundancy.
  - **Fix:** Add `aria-hidden="true"` to the `AvatarFallback`:
    ```tsx
    <AvatarFallback aria-hidden="true">
      {displayName[0].toUpperCase()}
    </AvatarFallback>
    ```

- **[Best Practices] No rate limiting on Socket.IO events.** File: `Backend/src/socket/index.ts:32,85`
  - **Impact:** A malicious client can flood `sendMessage` or `joinRoom` events, causing DB overload.
  - **Fix:** Add a simple in-memory rate limiter per socket:
    ```ts
    const messageCounts = new Map<string, { count: number; resetAt: number }>()

    // Before processing sendMessage:
    const now = Date.now()
    const entry = messageCounts.get(socket.id) || { count: 0, resetAt: now + 1000 }
    if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 1000 }
    entry.count++
    if (entry.count > 10) { socket.emit("error", "Rate limited"); return }
    messageCounts.set(socket.id, entry)
    ```

---

## Summary

| Category | Issues | Critical | High | Medium | Low |
|----------|--------|----------|------|--------|-----|
| Performance | 6 | 0 | 2 | 3 | 1 |
| Accessibility | 4 | 0 | 2 | 1 | 1 |
| SEO | 3 | 0 | 0 | 3 | 0 |
| Best Practices | 7 | 2 | 2 | 2 | 1 |
| **Total** | **20** | **2** | **6** | **8** | **4** |

## Recommended priority

1. **Fix critical issues first** — Rotate the exposed MongoDB credentials, add CSP/security headers. Without these the app is vulnerable to data breach and XSS.
2. **Fix high-priority accessibility + performance** — Font loading via `@import` is blocking LCP; missing `<h1>` and skip link are WCAG failures. These directly impact user experience and compliance.
3. **Medium-priority optimizations** — `robots.txt`, proper title tags, preconnect hints, service worker, removing dead Zod code. Sprint-level work.
4. **Low-priority polish** — Unused SVG, image dimensions, `aria-hidden` on decorative avatars, rate limiting. Fix when convenient.
