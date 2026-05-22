import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "@fontsource-variable/dm-sans"
import "@fontsource-variable/montserrat"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      Skip to main content
    </a>
    <ThemeProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
