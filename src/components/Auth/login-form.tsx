"use client";

import React from 'react'
import {useForm} from "react-hook-form";
import * as z from "zod"

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"

import { CardWrapper } from '@/components/Auth/card-wrapper'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '../ui/loading-spiner';
// import { FormError } from '../form-error';
// import { FormSuccess } from '../form-success';

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from '@/lib/axios';

export const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const res=await axiosInstance.post("/auth/login", data)
      return res.data;
    },
    onSuccess: (data) => {
      login(data.user,data.tokens); // save to context
      toast.success("Login successful!");
      if (data.user.role !== "Buyer") {
        router.push(`/${data.user.role}/dashboard`);
      }else{
         router.push(`/`);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutation.mutate(values);
  };
  return (
    
    <CardWrapper 
    headerLabel="Welcome back !! please login to access our services"
    headerTitle="Login page"
    backButtonLabel="Don't have an account?"
    backButtonHref="/Register"
    showSocial
    >
        {/* <FormError message="Something went wrong !"/>
        <FormSuccess message="Login Succeed!"/> */}
        <Form{...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-6"
            >
                <div className="space-y-4">
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
                <Button
                    variant="link"
                    className="font-normal w-full"
                    size="sm"
                    asChild
                >
                    <Link href="/forgot-password"> Forgot password</Link>
                </Button>
                 <Button type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

