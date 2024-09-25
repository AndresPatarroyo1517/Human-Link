import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import Login from './components/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthProvider>
        <Login />
     </AuthProvider>,
  </StrictMode>,
)
