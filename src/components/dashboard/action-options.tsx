import React, { Dispatch, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BsPencil } from "react-icons/bs";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { FiDelete } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import { TableContentProps } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { RiGlobalLine } from "react-icons/ri";
import { NextResponse } from "next/server";
import { toast } from "sonner";

interface SuccessToastProp {
  msg: string;
}

type Props = {
  documentId: string;
  isPublic: Boolean;
  tag: string;
  title: string;
  topic: string;
  tableContents: TableContentProps[];
  setTableContents: Dispatch<TableContentProps[]>;
};

const SuccessToast = ({ msg }: SuccessToastProp) => {
  return (
    <div className="w-full">
      <p className="text-sm font-semibold">{msg}</p>
      <p className="text-sm">Refresh the page to see the file</p>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => window.location.reload()}
          size={"sm"}
          className="bg-blue-700"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

const ActionsOption = ({
  documentId,
  isPublic,
  tag,
  title,
  topic,
  tableContents,
  setTableContents,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const { userId } = useAuth();

  const showToast = (promise: Promise<string>) => {
    toast.promise(promise, {
      loading: "Your file is being moved to other collections",
      success: (msg) => {
        return <SuccessToast msg={msg} />;
      },
      error: "Error when moving the file",
    });
  };

  const deleteDocument = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/document/?id=${documentId}&user_id=${userId}`,
      { method: "DELETE" }
    )
      .then()
      .catch();
    const newContents = tableContents.filter((item) => item.id !== documentId);
    setTableContents(newContents);
  };

  const switchToCollections = async (
    isPublic: Boolean,
    tag: string,
    title: string,
    topic: string
  ) => {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_LLM_SERVER_URL
      }/document/delete?document_id=${documentId}&collection_name=${
        isPublic ? "public" : "private"
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return "Error during Switching Collections";
    }

    const body = {
      document_id: documentId,
      user_id: userId,
      tag: tag,
      collection_name: isPublic ? "public" : "private",
      change: true,
    };

    const res2 = await fetch(
      `${process.env.NEXT_PUBLIC_LLM_SERVER_URL}/document/insert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res2.ok) {
      return "Error during Switching Collections";
    }

    const formData = new FormData();
    formData.append("id", documentId);
    formData.append("title", title);
    formData.append("topic", topic);
    formData.append("public", (!isPublic).toString());

    const res3 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/document`, {
      method: "PUT",
      body: formData,
    });

    if (!res3.ok) {
      return "Error during Updating Records";
    }

    const newData = [...tableContents];
    const index = newData.findIndex((item) => item.id === documentId);

    if (index !== -1) {
      newData[index] = {
        ...newData[index],
        public: !isPublic,
      };

      setTableContents(newData);
    }

    return `Document has been moved to ${
      isPublic ? "private" : "public"
    } collections.`;
  };

  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteDocument}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size={"sm"}
            variant={"ghost"}
            className="flex items-center gap-[3px] w-[25px] h-[25px] p-0"
          >
            <PiDotsThreeOutlineFill />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-32 right-0" align="end">
          <div className="p-1">
            <Button
              size={"sm"}
              className="w-full text-xs h-7 rounded justify-between font-normal"
              variant={"ghost"}
            >
              Edit <BsPencil className="text-muted-foreground" size={13} />
            </Button>
            <Link href={`/api/document?id=${documentId}`}>
              <Button
                size={"sm"}
                className="w-full text-xs h-7 rounded justify-between font-normal"
                variant={"ghost"}
              >
                Download{" "}
                <MdOutlineFileDownload
                  className="text-muted-foreground"
                  size={13}
                />{" "}
              </Button>
            </Link>
            <Button
              size={"sm"}
              className="w-full text-xs h-7 rounded justify-between font-normal"
              variant={"ghost"}
              onClick={() =>
                showToast(switchToCollections(isPublic, tag, title, topic))
              }
            >
              Publicize{" "}
              <RiGlobalLine className="text-muted-foreground" size={13} />
            </Button>
            <Separator className="my-1" />
            <Button
              size={"sm"}
              className="w-full text-red-500 hover:text-red-500 text-xs h-7 rounded justify-between font-normal"
              variant={"ghost"}
              onClick={() => setIsAlertOpen(true)}
            >
              Delete <FiDelete size={13} />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ActionsOption;
