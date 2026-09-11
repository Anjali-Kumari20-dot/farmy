import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

function LoginPage() {
  const [showResetPassword, setShowResetPassword] = useState(false);

  return (
    <AuthLayout
      eyebrow="ROOTED IN SOIL"
      title={"CROP\nPROCUREMENT\nCENTER"}
      imageUrl="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85"
      imageAlt="Lush agricultural field"
    >
      {!showResetPassword ? (
        <LoginForm onForgotPassword={() => setShowResetPassword(true)} />
      ) : (
        <ResetPasswordForm onBackToLogin={() => setShowResetPassword(false)} />
      )}
    </AuthLayout>
  );
}

export default LoginPage;
