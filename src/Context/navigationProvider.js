import React, { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [navigationData, setNavigationData] = useState(null);

  const setNavigation = (data) => {
    setNavigationData(data);
  };

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
