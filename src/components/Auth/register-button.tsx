"use client"
import { useRouter } from "next/navigation";
interface LoginButtonProps{
    children:React.ReactNode;
    modal?:"modal"|"redirect",
    asChild?:boolean
};

export const RegisterButton=({
    children,
    modal="redirect",
    // asChild,
}:LoginButtonProps)=>{
    const router=useRouter();

     const onClick=()=>{
        router.push("/Login")
     }

     if(modal==="modal"){
        return(
            <span>
                TODO:Implement modal
            </span>
        )
     }
    return(
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}