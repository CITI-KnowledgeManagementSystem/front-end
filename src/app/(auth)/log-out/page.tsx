"use client"
import { useClerk } from "@clerk/clerk-react"
import { redirect } from "next/navigation"

export default function Page () {
    const { signOut } = useClerk()
    signOut()
    return redirect("/")
}