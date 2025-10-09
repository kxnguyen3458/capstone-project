import { Toaster } from "@/components/ui/sonner"
import './App.css'
import { HomePage } from './pages/HomePage.tsx';
import NotFound from './pages/NotFound.tsx';
import AuthenticationPage from './pages/AuthenticationPage.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./components/RootLayout.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <NotFound />,
      children:[
        {index: true, element:<HomePage/>},
        
      ]
    },
    
    {
      path: "/login",
      element: <AuthenticationPage />,

    },
    {
      path: "/register",
      element: <AuthenticationPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster offset={0} />
    </>
  )
}

export default App
