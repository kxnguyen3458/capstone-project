
import './App.css'
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ProfilePage from "./pages/ProfilePage";
import ServicesPages from "./pages/VendorServicesPages";
import VendorPage from './pages/VendorPage';
import Cart from './pages/Cart';
import BookingDetailPage from './pages/BookingsDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import VendorDashboard from './pages/VendorDashBoard';


const Layout = lazy(() => import("./components/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthenticationPage = lazy(() => import("./pages/AuthenticationPage"));
const Unauthorized = lazy(() => import("./components/Unauthorized"));
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

          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/vendors/:vendor_id" element={<VendorPage />}></Route>
            <Route path="/cart" element={<Cart />}></Route>


            <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
              <Route path="/vendor/services" element={<ServicesPages />} />
              <Route path="/dashboard" element={<VendorDashboard/>} />

            </Route>

            <Route element={<ProtectedRoute allowedRoles={["customer", "vendor"]} />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>


            <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
              <Route path="/mybookings" element={<MyBookingsPage />} />
              <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />

            </Route>

          </Route>



          {/* PUBLIC ROUTES WITHOUT LAYOUT */}
          <Route path="/auth" element={<AuthenticationPage />} />
          <Route path="/login" element={<Navigate to="/auth?tab=login" replace />} />
          <Route path="/register" element={<Navigate to="/auth?tab=register" replace />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/not-found" element={<NotFound />} />


        </Routes>
      </Suspense>

    </>
  );
}

export default App;
