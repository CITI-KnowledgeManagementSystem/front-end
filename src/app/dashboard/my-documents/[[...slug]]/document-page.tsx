"use client";
import React, { useEffect } from "react";
import DocTable from "@/components/dashboard/doctable-dashboard";
import { getUserInfo } from "@/lib/user-queries";
import { useAuth } from "@clerk/nextjs";
import { useSession } from "@clerk/clerk-react";
import { auth } from "@clerk/nextjs/server";

const DocumentPage = () => {
  const { userId } = useAuth();
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo(userId?.toString() || "");
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userId]);

  const { isLoaded, session, isSignedIn } = useSession();

  if (!isLoaded) {
    console.log("Redirecting to sign in");
    auth().redirectToSignIn();
    return null;
  }
  if (!isSignedIn) {
    auth().redirectToSignIn();
    return null;
  }

  return (
    <div className="bg-white w-full h-full p-7 flex flex-col">
      <div className="p-3 bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
        <h1 className="text-3xl font-bold">Welcome, {user?.username || ""} </h1>
        <p className="text-muted-foreground font-light">
          Manage your documents here
        </p>
      </div>
      <div className="flex-1 overflow-hidden py-5 px-3">
        <DocTable />
      </div>
    </div>
  );
};

export default DocumentPage;
