import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import { AuthProvider } from './context/AuthProvider.tsx';
import App from './App.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </StrictMode>
)

