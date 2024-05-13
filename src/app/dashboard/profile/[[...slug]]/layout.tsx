import React from "react";
import SidebarPrompt from "@/components/sidebar-prompt";

const PromptLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-screen w-screen">{children}</div>;
};

export default PromptLayout;
