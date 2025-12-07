import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import { AuthProvider } from './context/AuthProvider.tsx';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import PersistLogin from './components/auth/PersisLogin.tsx';



const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* <PersistLogin> */}
            <App />

          {/* </PersistLogin> */}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)

