"use client";

import React from 'react'
import {useForm} from "react-hook-form";
import * as z from "zod"
import { ForgotPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"

import { CardWrapper } from '@/components/Auth/card-wrapper'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { FormError } from '../form-error';
// import { FormSuccess } from '../form-success';

export const ForgotPasswordForm = () => {
    const form=useForm<z.infer<typeof ForgotPasswordSchema >>({
        resolver:zodResolver(ForgotPasswordSchema ),
        defaultValues:{
            email:"",
        }
    })

    const onSubmit=(values:z.infer<typeof ForgotPasswordSchema >)=>{
        console.log(values)
    }
  return (
    
    <CardWrapper 
    headerLabel="If you have a trouble to remember your password you can reset it here"
   headerTitle="Reset Password"
    backButtonLabel="I remembered my password"
    backButtonHref="/login"
    
    >
        {/* <FormError message="Something went wrong !"/>
        <FormSuccess message="Login Succeed!"/> */}
        <Form{...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-6"
            >
                <div className="space-y-4">
                {/* Email field start here ------------------------------------- */}
                <FormField 
                    control={form.control} 
                    name="email"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field}
                                 placeholder="emmanuel@gmail.com"
                                 type="email"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>
                <Button type="submit" className="w-full">
                   Reset Password
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

