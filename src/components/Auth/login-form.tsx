"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/Auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";

// Google Auth imports
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

interface GooglePayload {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

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

  // Normal login mutation
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.user, data.tokens); // save to context
      toast.success("Login successful!");
      if (data.user.role !== "Buyer") {
        router.push(`/${data.user.role}/dashboard`);
      } else {
        router.push(`/`);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  // Google login handler
  const handleGoogleLogin = () => {
    try {
      
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google login failed");
    }
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutation.mutate(values);
  };

  return (
    <CardWrapper
      headerLabel="Welcome back !! please login to access our services"
      headerTitle=""
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >

        <div className="mt-4 w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error("Google login failed")}
        />
      </div>

        <div className="flex w-full items-center mt-6 mb-6" >
          <span className="w-1/3 h-1 bg-pink-400 "></span>
          <span className="w-1/3 text-center">Or</span>
          <span className="w-1/3 h-1 bg-pink-400 "></span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="emmanuel@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            variant="link"
            className="font-normal w-full"
            size="sm"
            asChild
          >
            <Link href="/forgot-password">Forgot password</Link>
          </Button>

          <Button type="submit" disabled={mutation.isPending} variant="default" className="w-full" >
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

    

      {/* Google Login Button */}
    
    </CardWrapper>
  );
};
