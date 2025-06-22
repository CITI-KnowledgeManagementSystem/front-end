import React from "react";
import PromptPage from "./prompt-page";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserInfo } from "@/lib/user-queries";
import { checkIfUserExistInDb, registerUser } from "@/lib/user-queries";
import { MessageProps } from "@/types";
import { getChatMessages } from "@/lib/utils";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { slug: string } }) => {
  const { userId, getToken } = await auth();
  const token = await getToken();

  if (userId && !(await checkIfUserExistInDb(userId))) {
    const user = await currentUser();
    await registerUser(
      userId,
      user?.emailAddresses[0].emailAddress || "",
      user?.firstName + " " + user?.lastName,
      user?.firstName || "",
      user?.lastName || "",
      user?.imageUrl || ""
    );
  }

  const user = await getUserInfo(userId || "");

  var conversations: MessageProps[] = [];

  if (
    params.slug &&
    params.slug.length !== 0 &&
    params.slug[0].indexOf(".") === -1
  ) {
    conversations = await getChatMessages(params.slug[0]);
    if (conversations.length === 0) {
      return redirect("/prompt");
    }
  }

  return <PromptPage user={user} conversations={conversations} />;
};

export default Page;
