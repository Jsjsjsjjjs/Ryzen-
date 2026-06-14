import { useState, useEffect } from "react";

const ADMIN_EMAIL = "rewardadmin@gmail.com";
const ADMIN_PASS = "AdminRewards70";
const STORAGE_KEY = "rc_admin_auth";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setIsAuthenticated(stored === "true");
    setChecked(true);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, checked, login, logout };
}
