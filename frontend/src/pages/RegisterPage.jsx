import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

const registerFeatureCards = [
  {
    badge: "SMART PROCUREMENT",
    heading: "Efficient crop buying made transparent.",
    description: "Farmers can book slots, check queue status, and track procurement steps without long delays or uncertainty.",
    accent: true,
  },
  {
    badge: "SUPPORT",
    heading: "Guidance at every stage.",
    description: "Clear updates and support channels help farmers move through registration, verification, and dispatch with ease.",
  },
  {
    badge: "ACCESSIBILITY",
    heading: "Simple and farmer-friendly operations.",
    description: "Designed to reduce congestion, simplify scheduling, and make procurement processes smoother for rural communities.",
  },
];

function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="GROW • HARVEST • PROSPER"
      title={"FARMER\nREGISTRATION"}
      imageUrl="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85"
      imageAlt="Farmer working in agricultural field"
      featureCards={registerFeatureCards}
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
