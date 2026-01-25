import { config } from "@/axios/config";
import { BadgeProps } from "../ui/badge";


export const getFullImageUrl=(url:string)=>{
    if(!url) return null;
    console.log("Config Base URL:", `${config.baseURL}/public/${url}`);  
    return `http://localhost:5000/public/${url}`;

}

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleTimeString('en-GB', timeOptions).toLowerCase();
};

export default function formatLastVisit(lastVisitDate) {
  const now = new Date();
  const lastVisit = new Date(lastVisitDate);
  
  // Get UTC dates at midnight for accurate day comparison
  const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const lastVisitUTC = Date.UTC(lastVisit.getUTCFullYear(), lastVisit.getUTCMonth(), lastVisit.getUTCDate());
  
  const diffInDays = Math.floor((nowUTC - lastVisitUTC) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Today";
  } else if ( diffInDays === 1) {
    return "Yesterday";
  } else {
    // Customize date format as needed
    return lastVisit.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
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
export const vibrateSuccess = (f=300,s=300,t=400) => {
  if ("vibrate" in navigator) {
    navigator.vibrate([f, s ,t]); // success pattern
  }
};

export const playSuccessSound = () => {
  
  new Audio("/sounds/success.mp3").play().catch(() => {});
};
