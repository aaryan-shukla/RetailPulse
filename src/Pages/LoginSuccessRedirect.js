import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNavigation } from "../Context/navigationProvider";

const LoginSuccessRedirect = ({ user }) => {
  const { setNavigation } = useNavigation();

  useEffect(() => {
    setNavigation({ user });
    localStorage.setItem("user", JSON.stringify(user));
  }, [setNavigation, user]);

  return user ? <Navigate to="/retail" state={{ user }} /> : null;
};

export default LoginSuccessRedirect;
