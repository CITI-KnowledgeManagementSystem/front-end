import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest){
    console.log(request);
    const formData = await request.formData();
    const request_chat = formData.get("request");
    const 
}