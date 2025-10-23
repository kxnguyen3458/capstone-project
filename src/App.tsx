// import './App.css'
// import { HomePage } from './pages/HomePage.tsx';
// import NotFound from './pages/NotFound.tsx';
// import AuthenticationPage from './pages/AuthenticationPage.tsx';
// import {
//   Route,
//   Routes,
// } from "react-router-dom";
// import Layout from "./components/Layout.tsx";
// import Unauthorized from './components/Unauthorized.tsx';
// import ProtectedRoute from './components/ProtectedRoute.tsx';
// import RequestProfile from './components/profile/RequestProfile.tsx';
// import ForgotPassword from './components/ForgotPassword.tsx';
// import { Toaster } from "@/components/ui/sonner"
// import ResetPassword from './components/ResetPassword.tsx';

// function App() {
//   return (
//     <>
//       <Toaster offset={0} />

//       <Routes>
//         {/* public routes */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<HomePage />}></Route>
//         </Route>
//         <Route path="/login" element={<AuthenticationPage />}></Route>
//         <Route path="/register" element={<AuthenticationPage />}></Route>
//         <Route path='/unauthorized' element={<Unauthorized />}></Route>
//         <Route path='/updateProfile' element={<RequestProfile />}></Route>
//         <Route path='/forgot-password' element={<ForgotPassword />}></Route>
//         <Route path='/reset-password' element={<ResetPassword />}></Route>
//         <Route path='/not-found' element={<NotFound/>}></Route>


//         {/* Protected Routes */}
//         <Route element={<ProtectedRoute allowedRoles={"customer"} />}>

//         </Route>

//         <Route element={<ProtectedRoute allowedRoles={"vendor"} />}>

//         </Route>



//       </Routes>


//     </>
//   )
// }

// export default App

// App.tsx
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const Layout = lazy(() => import("./components/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthenticationPage = lazy(() => import("./pages/AuthenticationPage"));
const Unauthorized = lazy(() => import("./components/Unauthorized"));
const RequestProfile = lazy(() => import("./components/profile/RequestProfile"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

function App() {
  return (
    <>
      <Toaster offset={0} />

      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Routes>
          {/* public */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/register" element={<AuthenticationPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/updateProfile" element={<RequestProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/not-found" element={<NotFound />} />

          {/* protected */}
          <Route element={<ProtectedRoute allowedRoles={"customer"} />}>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={"vendor"} />}>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
