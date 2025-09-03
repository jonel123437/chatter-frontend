"use client";

import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/molecules/Header";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Header />
      <div style={{ padding: 20 }}>
        <h1>Welcome to the Dashboard</h1>
        <p>Only accessible if logged in!</p>
      </div>
    </ProtectedRoute>
  );
}
