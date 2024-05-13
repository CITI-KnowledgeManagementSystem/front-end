import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkIfUserExistInDb, registerUser } from "@/lib/user-queries";

export default async function Home() {
  const { userId } = auth();
  
  // check if the userId is already in the database, if not, create
  if (userId && !await checkIfUserExistInDb(userId)) {
    const user = await currentUser()
    await registerUser(userId, user?.emailAddresses[0].emailAddress || "", (user?.firstName + " " + user?.lastName), user?.firstName || "", user?.lastName || "", user?.imageUrl || "")
  }
  
  

  return redirect('/prompt')
}
