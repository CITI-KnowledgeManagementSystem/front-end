import React from "react";
import SidebarPrompt from "@/components/sidebar-prompt";
import { Toaster } from "@/components/ui/toaster";

const PromptLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen">
      {children}
      <Toaster />
    </div>
  );
};

export default PromptLayout;
