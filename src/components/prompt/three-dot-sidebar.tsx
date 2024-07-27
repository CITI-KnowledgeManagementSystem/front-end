import React, { useState } from "react";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FiDelete, FiArchive } from "react-icons/fi";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/useStore";
import { usePathname } from "next/navigation";

interface ChildProps {
  id: string;
  enableRename: () => void;
}

const ThreeDotSidebar: React.FC<ChildProps> = ({ id, enableRename }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const idOnPath = pathname.split("/")[2];

  const triggerFunction = useStore((state) => state.triggerFunction);

  const deleteChatBox = async () => {
    fetch(`/api/chatbox?id=${id}`, { method: "DELETE" }).then((res) => {
      if (!res.ok) {
        console.log("Error occured");
        return;
      }

      triggerFunction();
      router.push("/prompt");
    });
    setIsOpen(!isOpen);
  };

  const renameChatBox = (e: React.MouseEvent<HTMLElement>) => {
    setIsOpen(!isOpen);
    enableRename();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <HoverCard openDelay={300}>
        <HoverCardTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant={"ghost"}
              className={`rounded-md h-fit p-[3px] hover:bg-slate-200 ${
                id === idOnPath ? "group-hover:block block" : "hidden"
              }`}
            >
              <PiDotsThreeOutlineFill />
            </Button>
          </PopoverTrigger>
        </HoverCardTrigger>
        <HoverCardContent className="z-40 w-fit text-xs py-1 px-2 bg-slate-700 text-white rounded-md mt-1">
          <p>More</p>
        </HoverCardContent>
      </HoverCard>
      <PopoverContent className="w-32 p-0" align="end">
        <Button
          onClick={renameChatBox}
          variant={"ghost"}
          className="px-4 w-full rounded-none justify-between"
          size={"sm"}
        >
          Rename <MdDriveFileRenameOutline />
        </Button>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant={"ghost"}
          className="px-4 w-full rounded-none justify-between"
          size={"sm"}
        >
          Archive <FiArchive />
        </Button>
        <Separator />
        <DeleteAlert deleteFunction={deleteChatBox} />
      </PopoverContent>
    </Popover>
  );
};

interface AlertProps {
  deleteFunction: () => Promise<void>;
}

const DeleteAlert = ({ deleteFunction }: AlertProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.stopPropagation();
    await deleteFunction();
  };

  const handleClickOpen = (e: React.MouseEvent<HTMLElement>) => {
    setIsOpen(!isOpen);
    e.stopPropagation();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={handleClickOpen}
          variant={"ghost"}
          className="px-4 w-full rounded-none justify-between text-red-500"
          size={"sm"}
        >
          Delete <FiDelete />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the selected chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-700" onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ThreeDotSidebar;
