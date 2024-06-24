import React from "react";
import SidebarPrompt from "@/components/prompt/sidebar-prompt";
import { Toaster } from "@/components/ui/toaster";

const PromptLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full justify-center items-center">
      <div className="absolute top-0 left-0 z-10">
        <SidebarPrompt />
      </div>
      <div className="relative w-full h-full z-0">{children}</div>
    </div>
  );
};

export default PromptLayout;
