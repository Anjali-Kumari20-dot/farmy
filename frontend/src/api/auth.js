import apiClient from "./client";

export const sendOtp = (mobileNumber, purpose = "registration") => {
  return apiClient.post("/auth/send-otp", { mobileNumber, purpose });
};

export const verifyOtp = (mobileNumber, otp, purpose = "registration") => {
  return apiClient.post("/auth/verify-otp", { mobileNumber, otp, purpose });
};

export const registerFarmer = ({ fullname, mobileNumber, password, otp }) => {
  return apiClient.post("/auth/register", { fullname, mobileNumber, password, otp });
};

export const loginFarmer = ({ mobileNumber, password }) => {
  return apiClient.post("/auth/login", { mobileNumber, password });
};

export const resetPassword = ({ mobileNumber, newPassword, otp }) => {
  return apiClient.post("/auth/reset-password", { mobileNumber, newPassword, otp });
};

export const getCurrentFarmer = () => {
  return apiClient.get("/auth/me");
};
