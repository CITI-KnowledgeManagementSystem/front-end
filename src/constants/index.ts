import { BsDatabase } from "react-icons/bs";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdOutlineWorkspacePremium } from "react-icons/md";


export const dashboardMenu = [
    {
        name: 'My Documents',
        url: 'my-documents',
        icon: BsDatabase
    },
    {
        name: 'Analytics',
        url: 'my-analytics',
        icon: MdOutlineAnalytics
    },
    {
        name: 'Go Premium',
        url: 'go-premium',
        icon: MdOutlineWorkspacePremium
    }
]

export const rowsPerPageValues = [10, 30, 50]