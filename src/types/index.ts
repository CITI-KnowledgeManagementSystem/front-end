import { IconType } from "react-icons/lib"

export interface MessageProps {
    type: string,
    message: string
}

export interface SidebarItems {
    name: string,
    url: string,
    icon?: IconType
}

export interface TableContentProps {
    id:string,
    user_id:string,
    title: string,
    created_at: string,
    size: string,
    tag: string,
    topic: string
}

export interface OptionProps {
    value: string,
    isChoosen?: boolean
}