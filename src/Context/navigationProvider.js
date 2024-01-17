import React, { createContext, useContext, useState, useEffect } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [navigationData, setNavigationData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? { user: JSON.parse(storedUser) } : null;
  });

  const setNavigation = (data) => {
    setNavigationData(data);
  };

  useEffect(() => {
    if (navigationData && navigationData.user) {
      localStorage.setItem("user", JSON.stringify(navigationData.user));
    }
  }, [navigationData]);

  return (
    <NavigationContext.Provider value={{ navigationData, setNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
