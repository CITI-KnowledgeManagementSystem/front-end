import { BsDatabase } from "react-icons/bs";
import { MdOutlineAnalytics, MdOutlineWorkspacePremium, MdOutlineChat } from "react-icons/md";
import { CgProfile } from "react-icons/cg";


export const dashboardMenu = [
    {
        name: 'My Documents',
        url: 'dashboard/my-documents',
        icon: BsDatabase
    },
    {
        name: 'My Profile',
        url: 'dashboard/profile',
        icon: CgProfile
    },
    {
        name: 'Chat',
        url: 'prompt',
        icon: MdOutlineChat
    },
    {
        name: 'Analytics',
        url: 'dashboard/my-analytics',
        icon: MdOutlineAnalytics
    },
    {
        name: 'Go Premium',
        url: 'dashboard/go-premium',
        icon: MdOutlineWorkspacePremium
    }
]

export const llmModels = [
    {
        name: "Mistral 7B",
    },
    {
        name: "Llama 2 70B",
    }
]

export const rowsPerPageValues = [10, 30, 50]