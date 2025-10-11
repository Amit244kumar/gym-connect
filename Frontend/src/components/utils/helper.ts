import { config } from "@/axios/config";


export const getFullImageUrl=(url:string)=>{
    if(!url) return null;
    console.log("Config Base URL:", `${config.baseURL}/public/profileImage/${url}`);  
    return `${config.baseURL}/public/profileImage/${url}`;

}