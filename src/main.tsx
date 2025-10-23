import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import { AuthProvider } from './context/AuthProvider.tsx';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

