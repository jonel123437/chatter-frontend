"use client";

import React, { useState } from "react";
import { useRegister } from "./hooks/useRegister";
import { RegisterPayload } from "@/types/auth";
import { RegisterForm } from "@/components/molecules/RegisterForm";

export default function RegisterPage() {
  const { handleRegister, loading, error } = useRegister();
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
  });

  // callback for the RegisterForm
  const onSubmit = (name: string, email: string, password: string) => {
    handleRegister({ name, email, password });
  };

  return (
    <div>
      <RegisterForm
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
