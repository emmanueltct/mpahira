import * as z from "zod";

export const LoginSchema=z.object({
    email:z.string().email({
        message:"Email is required"
    }),
    password:z.string().min(1,{
        message:"Password is required",
    })
})

export const RegisterSchema=z.object({
    firstName:z.string().min(2,{
        message:"Firstname is too short"
    }),
    lastName:z.string().min(2,{
        message:"Last name is too short"
    }),
    telephone:z.string
    ().min(10,{
        message:"must be a 10 digits"
    }),
    email:z.string().email({
        message:"Email is required"
    }),
    password:z.string().min(1,{
        message:"Password is required",
    })
})

export const ForgotPasswordSchema =z.object({
    email:z.string().email({
        message:"Email is required"
    })
})

export const NewPasswordSchema =z.object({
     newpassword:z.string().min(1,{
        message:"New Password is required",
    }).min(8,{
        message:"Password must be atleast 8 characters long"
    }),

     confirmpassword:z.string().min(1,{
        message:"Confirm Password is required",
    })

})