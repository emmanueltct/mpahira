import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

 const font=Poppins({
    subsets:["latin"],
    weight:["600"]
 })

 interface HeaderPropos{
    label:string,
    headerTitle:string
 }

 export const Header=({
    label,headerTitle
 }:HeaderPropos)=>{

    return(
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn("uppercase text-gray-800 dark:text-white text-xl pr-2",font.className)}>
               <span className={cn("uppercase text-gray-800 dark:text-white text-xl pr-2",font.className)}>
                {""} 
            </span>{headerTitle}
            </h1>
            {/* <span className="w-30 h-2 bg-gray-800 dark:bg-white mb-1"></span> */}
            <p className="text-muted-foreground text-sm">
                {label}
            </p>
        </div>
    )
 }