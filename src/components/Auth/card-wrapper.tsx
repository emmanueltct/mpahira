"use client";

import { Card, CardContent,CardFooter,CardHeader} from "@/components/ui/card";
import { Header } from "@/components/Auth/header";
import {Social} from "@/components/Auth/Social";
import { BackButton } from "./back-button";

interface CardWrapperProps{
    children:React.ReactNode,
    headerLabel:string,
    headerTitle:string,
    backButtonLabel:string,
    backButtonHref:string,
    showSocial?:boolean
}

export const CardWrapper=({
   children,
    headerLabel,
    headerTitle,
    backButtonLabel,
    backButtonHref,
    showSocial,
}:CardWrapperProps)=>{
    return(
        <Card className=" w-[350px] sm:w-[500px] shadow-md mt-30">
            <CardHeader>
                <Header label={headerLabel} headerTitle={headerTitle}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>

            {showSocial&&(
                <CardFooter>
                   <Social/>
                </CardFooter>
            )}

            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
             
        </Card>
    )
}