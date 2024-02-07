import z from 'zod';

//se asegura que los campos ingresados al registro sean validos
export const registerSchema = z.object({
    username: z.string({
        required_error: 'Username is required'
    }),
    email: z.string({
        required_error: 'Email is required'
    }).email({
        meassage: 'Invalid email'
    }),
    password: z.string({
        required_error: 'password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    }),


})

//se asegura que los campos ingresados al login sean validos
export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).email({
        meassage: 'Invalid email'
    }),
    password: z.string({
        required_error: 'password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    })
})

