import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Landing from "./Landing";
import Login from "./Login";
import Loading from "./Loading";
import CropDemand from "./demand";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Landing />} />
        <Route path="/demand" element={<CropDemand />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);