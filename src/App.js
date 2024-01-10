// app.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./Pages/SignUpForm";
import LoginForm from "./Pages/LoginForm";
import ShoppingPageWithNavigation from "./Pages/ShoppingPage";
import { NavigationProvider } from "./Context/navigationProvider";
export default function App() {
  return (
    <Router>
      <NavigationProvider>
        <div>
          <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/signup" element={<Form />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/retail" element={<ShoppingPageWithNavigation />} />
          </Routes>
        </div>
      </NavigationProvider>
    </Router>
  );
}
