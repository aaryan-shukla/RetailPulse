import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNavigation } from "../Context/navigationProvider";

const LoginSuccessRedirect = ({ user }) => {
  const { setNavigation } = useNavigation();

  useEffect(() => {
    setNavigation({ user });
  }, [setNavigation, user]);

  return <Navigate to="/retail" state={{ user }} />;
};

export default LoginSuccessRedirect;
