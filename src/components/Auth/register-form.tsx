"use client";

import React from 'react'
import axios,{AxiosError} from "axios";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useState } from "react";
import {useForm} from "react-hook-form";
import * as z from "zod"
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { CardWrapper } from '@/components/Auth/card-wrapper'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '../ui/loading-spiner';
import axiosInstance from '@/lib/axios';

// import { FormSuccess } from '../form-success';


export const RegisterForm = () => {
      const router = useRouter();
     const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    
    const form=useForm<z.infer<typeof RegisterSchema>>({
        resolver:zodResolver(RegisterSchema),
        defaultValues:{
            firstName:"",
            lastName:"",
            email:"",
            telephone:"",
            password:""
        }
    })

    const onSubmit= async (values:z.infer<typeof RegisterSchema>)=>{
             
           setServerError(""); // reset previous error
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/signup", values); // replace with your API
      console.log("Success:", res.data);
      router.push('/login');
        toast.success('Registration successful!', {
        duration: 3000, // optional: show toast for 3 seconds
        });
    
    } catch (error:any) {

    // Handle Zod validation errors from backend
    const issues = error?.response?.data?.error?.issues;
    if (issues && Array.isArray(issues)) {
      issues.forEach((issue:AxiosError) => {
        toast.error(issue.message);
      });
    } else {
      // Handle unexpected errors
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  }

     finally {
      setLoading(false);
    }
  }; 
    
  return (
    
    <CardWrapper 
    headerLabel="Welcome to our platform !! please if it's your first time create account to access our services"
   headerTitle="Signup page"
    backButtonLabel="I already have an account?"
    backButtonHref="/login"
 
    >
    
{/*         
        <FormSuccess message="Login Succeed!"/> */} 
        <Form{...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-6"
            >
                <div className="space-y-4">
                {/* firstName field start here ------------------------------------- */}
                <FormField 
                    control={form.control} 
                    name="firstName"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input {...field}
                                 placeholder="Mugabo"
                                 type="text"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

               {/* Lastname field start here ------------------------------------- */}
                <FormField 
                    control={form.control} 
                    name="lastName"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input {...field}
                                 placeholder="John "
                                 type="text"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
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
                  {/* Email field start here ------------------------------------- */}
                <FormField 
                    control={form.control} 
                    name="telephone"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Telephone</FormLabel>
                            <FormControl>
                                <Input {...field}
                                 placeholder="07x xxx xxxx"
                                 type="number"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                {/* password form field start here */}
                 <FormField 
                    control={form.control} 
                    name="password"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Paswword</FormLabel>
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
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                    <>
                         <LoadingSpinner/> Submitting...
                    </>
                    ) : (
                    'Sign Up'
                    )}
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

