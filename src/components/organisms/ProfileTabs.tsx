"use client";

import React from "react";
import { Tabs, Tab } from "@mui/material";

interface ProfileTabsProps {
  value: number;
  onChange: (value: number) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ value, onChange }) => (
  <Tabs value={value} onChange={(e, newValue) => onChange(newValue)} centered>
    <Tab label="Posts" />
    <Tab label="About" />
    <Tab label="Friends" />
  </Tabs>
);
