import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./Pages/SignUpForm";
import LoginForm from "./Pages/LoginForm";
import ShoopingPage from "./Pages/ShoppingPage";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/signup" element={<Form />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/retail" element={<ShoopingPage />} />
        </Routes>
      </div>
    </Router>
  );
}
