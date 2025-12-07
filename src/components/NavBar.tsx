import useAuth from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const { currentUser, logout } = useAuth();

  const role = currentUser?.role;
  const isVendor = role === "vendor";
  const isCustomer = role === "customer";

  const vendorProfilePath = "/profile";
  const vendorServicesPath = "/vendor/services";
  const vendorDashBoardPath = "/dashboard";

  const customerProfilePath = "/profile";
  const customerBookingsPath = "/mybookings";

  return (
    <nav className="grid grid-cols-[85%_15%] items-center p-5 bg-slate-200">
      <div className="grid grid-cols-[85%_10%]">
        <p className="font-bold text-2xl text-purple-600">
          Home Service Provider
        </p>
        <ul className="flex justify-between text-center items-center">
          <li>
            <NavLink
              className={({ isActive }) =>
                `font-bold hover:text-purple-700 ${isActive ? "text-purple-700" : "text-black"
                }`
              }
              to="/"
            >
              Home
            </NavLink>
          </li>

          <li>
            {isCustomer && <>
              <NavLink
                className={({ isActive }) =>
                  `font-bold hover:text-purple-700 ${isActive ? "text-purple-700" : "text-black"
                  }`
                }
                to="/cart"
              >
                <ShoppingCart size={20} />
              </NavLink>
            </>}

          </li>
        </ul>
      </div>

      <div>
        <ul className="flex space-x-3 text-center items-center">
          {!currentUser && (
            <>
              <Link to="/login">
                <Button
                  variant={"outline"}
                  className="bg-slate-300 font-bold text-black hover:bg-slate-200"
                >
                  Log in
                </Button>
              </Link>

              <Link to="/register">
                <Button className="hover:bg-gray-700">Sign Up</Button>
              </Link>
            </>
          )}

          {currentUser && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-slate-100 p-0 hover:bg-slate-200 w-10 h-10 rounded-3xl"
                  >
                    <User size={25} className="w-[25px]! h-[25px]!" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  {isVendor && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={vendorProfilePath}>Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={vendorServicesPath}>Services</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={vendorDashBoardPath}>Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isCustomer && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={customerProfilePath}>Profile</Link>
                      </DropdownMenuItem>
                
                      <DropdownMenuItem asChild>
                        <Link to={customerBookingsPath}>My Bookings</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 ml-2"
              >
                Logout
              </Button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
