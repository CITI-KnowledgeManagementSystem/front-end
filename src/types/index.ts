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
    createdAt: string,
    file_size_formatted: string,
    tag: string,
    topic: string
}

export interface OptionProps {
    value: string,
    isChoosen?: boolean
}

export interface UserProfileProps {
    id: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    img_url: string
}