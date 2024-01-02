import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Form from "./Pages/SignUpForm";
import LoginForm from "./Pages/LoginForm";

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/signup" element={<Form />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </Router>
  );
}
