import React from 'react'
import PromptPage from './prompt-page'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getUserInfo } from '@/lib/user-queries'
import { checkIfUserExistInDb, registerUser } from "@/lib/user-queries"

const Page = async () => {
    const { userId } = auth()
    if (userId && !await checkIfUserExistInDb(userId)) {
        const user = await currentUser()
        await registerUser(userId, user?.emailAddresses[0].emailAddress || "", (user?.firstName + " " + user?.lastName), user?.firstName || "", user?.lastName || "", user?.imageUrl || "")
    }
    
    const user = await getUserInfo(userId || "")
    
  return (
    <PromptPage user={user}/>
  )
}

export default Page