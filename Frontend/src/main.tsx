import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConversationProvider } from './context/ConversationContext.tsx'
import { SocketProvider } from './context/SocketContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <ConversationProvider>
            <App />
          </ConversationProvider>
        </SocketProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
