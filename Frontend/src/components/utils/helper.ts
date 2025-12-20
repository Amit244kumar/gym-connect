import { config } from "@/axios/config";
import { BadgeProps } from "../ui/badge";


export const getFullImageUrl=(url:string)=>{
    if(!url) return null;
    console.log("Config Base URL:", `${config.baseURL}/public/${url}`);  
    return `http://localhost:5000/public/${url}`;

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
export const vibrateSuccess = () => {
  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200]); // success pattern
  }
};

export const playSuccessSound = () => {
  
  new Audio("/sounds/success.mp3").play().catch(() => {});
};
