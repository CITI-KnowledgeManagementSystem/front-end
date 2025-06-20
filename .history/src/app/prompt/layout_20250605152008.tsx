"use client"
import React from "react";
import NotebookLayout from "@/components/notebook/notebook-layout";

const PromptLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotebookLayout>
      {children}
    </NotebookLayout>
  );
};

export default PromptLayout;
