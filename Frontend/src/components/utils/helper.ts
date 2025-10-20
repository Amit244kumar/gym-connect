import { config } from "@/axios/config";


export const getFullImageUrl=(url:string)=>{
    if(!url) return null;
    console.log("Config Base URL:", `${config.baseURL}/public/${url}`);  
    return `${config.baseURL}/public/${url}`;

}

export const formatDate= (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-GB', options).replace(/ /g, '-').toLowerCase();
}
