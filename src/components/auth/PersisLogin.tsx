// components/PersistLogin.tsx
import { useEffect, useState } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import useAuth from "@/hooks/useAuth";

const PersistLogin = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { accessToken } = useAuth();

  useEffect(() => {
    const verify = async () => {
      try {
        if (!accessToken) {
          await refresh(); 
        }
      } catch (err) {
        console.error("Persist login failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default PersistLogin;
