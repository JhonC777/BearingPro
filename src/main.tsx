import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import { Toaster } from "sonner"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ style: { background: '#111118', border: '1px solid rgba(255,255,255,0.06)', color: '#f0f0f5' } }} />
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
