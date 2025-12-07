import AuthContext from "@/context/AuthProvider";
import { useContext } from "react";

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside of a AuthProvider");
  }
  return ctx;
};

export default useAuth;
