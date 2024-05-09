import React, { useState } from 'react'
import { FiUpload } from "react-icons/fi";
import { Card, CardTitle, CardContent, CardDescription, CardFooter, CardHeader } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'


const UploadCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState<string>("")
  const [topic, setTopic] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const showToast = () => {
    toast("Your file is being uploaded", {
        description: "This page will be refreshed automatically when it's finished",
    })
}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
        setSelectedFile(file)
    }
}

const uploadDocument = () => {
    if (!selectedFile || title === "" || topic === "") {
        setError("Fill all the required fields")
        return
    }
    setIsLoading(true)
    setIsOpen(false)
    showToast()
    // postDocument('1', selectedFile, title, topic).then(_ => {
    //     setIsLoading(false)
    //     window.location.reload()
    // }).catch(_ => setError("Upload error"))
}

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
            <Button variant={"outline"} className='text-xs h-8 shadow'>
                <FiUpload size={12} className='mr-2'/> 
                Upload
            </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 w-fit border-none' align='start'>
        <Card className='w-[350px]'>
            <CardHeader>
                <CardTitle className='text-base'>Add a new document</CardTitle>
                <CardDescription className='text-sm'>Fill the required document informations</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor='document'>Upload Document</Label>
                            <Input type='file' className='cursor-pointer' onChange={handleFileChange}></Input>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor='Document Name'>Document Name</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} type='text' placeholder='Name of your document'></Input>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor='Document Topic'>Document Topic</Label>
                            <Input value={topic} onChange={(e) => setTopic(e.target.value)} type='text' placeholder='Topic of your document'></Input>
                        </div>
                    </div>
                    <p className="text-xs text-red-500 mt-2">{ error }</p>
                </form>
            </CardContent>
            <CardFooter className='flex justify-between'>
                <Button variant={"outline"} size={"sm"} onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant={"default"} size={"sm"} onClick={uploadDocument}>Upload</Button>
            </CardFooter>
        </Card>
        </PopoverContent>
    </Popover>
  )
}

export default UploadCard