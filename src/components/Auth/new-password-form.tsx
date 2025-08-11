"use client";

import React from 'react'
import {useForm} from "react-hook-form";
import * as z from "zod"
import {NewPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"

import { CardWrapper } from '@/components/Auth/card-wrapper'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { FormError } from '../form-error';
// import { FormSuccess } from '../form-success';

export const CreatePasswordForm = () => {
    const form=useForm<z.infer<typeof  NewPasswordSchema>>({
        resolver:zodResolver( NewPasswordSchema),
        defaultValues:{
            newpassword:"",
            confirmpassword:""
        }
    })

    const onSubmit=(values:z.infer<typeof NewPasswordSchema>)=>{
        console.log(values)
    }
  return (
    
    <CardWrapper 
    headerLabel="please create easy password to remember and not easy to guess"
    headerTitle="New Password"
    backButtonLabel=""
    backButtonHref="#"
    
    >
        {/* <FormError message="Something went wrong !"/>
        <FormSuccess message="Login Succeed!"/> */}
        <Form{...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-6"
            >
                <div className="space-y-4">
              
                {/* New password form field start here */}
                 <FormField 
                    control={form.control} 
                    name="newpassword"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>New Paswword</FormLabel>
                            <FormControl>
                                <Input {...field}
                                 placeholder="********"
                                 type="password"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                  {/* Re-type password form field start here */}
                 <FormField 
                    control={form.control} 
                    name="confirmpassword"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Re-type Paswword</FormLabel>
                            <FormControl>
                                <Input {...field}
                                 placeholder="********"
                                 type="password"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>
                <Button type="submit" className="w-full">
                   Create Password
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

