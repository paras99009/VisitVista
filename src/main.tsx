import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.tsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const queryClient = new QueryClient(); // Initialize QueryClient

createRoot(document.getElementById('root')!).render(
     <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
    </BrowserRouter>
     </QueryClientProvider>
)
