import {} from "bcrypt"
import bcrypt from "bcryptjs";

export async function hashPassword(password:string):Promise<string> {
    return bcrypt.hash(password , 12)
}

export async function veriyPassword(password:string , hashdPassword:string):Promise<boolean> {
    return bcrypt.compare(password , hashdPassword)
}