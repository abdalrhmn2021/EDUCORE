import { NextResponse } from "next/server";
import dbConnect from "@/lib/moongodb";
import Course from "@/modles/Course";
import { success } from "zod";
import {getSession} from "@/lib/auth"
import { addMaterialSchema } from "@/lib/validations";



export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {

    try{
        const session = await getSession()

        if(!session ) {
            return NextResponse.json({
                success:false,message:""
            },{status:401})
        }

        const {id} = await params
    
        await dbConnect()

        const course = await Course.findById(id)
        if(!course){
            return NextResponse.json(
                {success:false , message:""},
                {status:404}
            )
        }

        if(session.role !== "admin" && course.professor.toString() !== session.userId){

            return NextResponse.json(
                {success:false , message:""},
                {status:403}
            )
        }

        const body = await request.json()

        const validtionResult = addMaterialSchema.safeParse(body)

        if(!validtionResult.success){
            const errors = validtionResult.error.issues.map((e)=> e.message)
            return NextResponse.json(
                {success:false , meassage:""},
                {status:400}
            )
        }
        course.materials.push(validtionResult.data)

        await course.save()

        return NextResponse.json(
            {success:true , message:"", course}
        )

    }catch(error) {
        console.error("Add material error:",error)
    }

    
}