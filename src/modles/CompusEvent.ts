import mongoose, { Schema, Document, Model } from "mongoose";



export interface ICampusEvent extends Document {

    title:string
    description:string
    data:Date
    location:string
    image?:string
    createdAt:Date
    updatedAt:Date
}   

const CamupsEventSchema = new Schema<ICampusEvent>(
    {
        title:{
            type:String,
            required:[true,'عنوان الفعالية المطلوب'],
            trim:true
        },
        description:{
            type:String,
            required:[true,"الوصف المطلوب"]
        },
        data:{
            type:Date,
            required:[true,'التاريخ المطلوب']
        },
        location:{
            type:String,
            required:[true,'الموقع المطلوب']
        },
        image:{
            type:String,
            trim:true
        }
    },
    {timestamps:true}
)

const CamupsEvent:Model<ICampusEvent>=mongoose.models.CamupsEvent || mongoose.model<ICampusEvent>('CampusEvent',CamupsEventSchema)

export default CamupsEvent;