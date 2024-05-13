"use client";
import { notFound, useParams } from "next/navigation";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
const formSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  img_url: z.string(),
});

// const DashboardPage = () => {
//   const params = useParams()

//   if (params.pageName === 'my-documents') {
//     return <DocumentPage/>
//   }
//   return (
//     notFound()
//   )
// }

// export default DashboardPage

function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values);
}

const ProfilePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "karina",
      email: "",
      first_name: "",
      last_name: "",
      img_url: "",
    },
  });

  return (
    <div className="flex-col p-10">
      <div className="pb-7">
        <h1 className="text-3xl font-bold text-blue-700">Profile Setting</h1>
        <p>This is the profile page</p>
      </div>
      <div className="p-10 border-2 rounded-lg">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/12/230601_Karina_%28aespa%29.jpg"
          alt=""
          className="rounded-full h-[200px] w-[200px] overflow-hidden object-cover mx-auto"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-10"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input placeholder="Username" {...field} />
                  <FormMessage>
                    {formState.errors.username?.message}
                  </FormMessage>
                  {/* <FormDescription>Your username</FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="example@example.com" {...field} />
                  <FormMessage>{formState.errors.email?.message}</FormMessage>
                  {/* <FormDescription>Your username</FormDescription> */}
                </FormItem>
              )}
            />
            <div className="justify-center flex">
              <div className="flex-1 pr-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <Input placeholder="John" {...field} />
                      <FormMessage>
                        {formState.errors.first_name?.message}
                      </FormMessage>
                      {/* <FormDescription>Your username</FormDescription> */}
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1 pl-2">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <Input placeholder="Duke" {...field} />
                      <FormMessage>
                        {formState.errors.last_name?.message}
                      </FormMessage>
                      {/* <FormDescription>Your username</FormDescription> */}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button className="bg-blue-700">
              <span>Save</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
