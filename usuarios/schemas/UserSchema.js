import z from 'zod';

//se asegura que los campos ingresados al registro sean validos
export const registerSchema = z.object({
    name: z.string({
        required_error: 'name is required'
    }),
    lastName: z.string({
        required_error: 'lastName is required'
    }),
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid email'
    }),
    password: z.string({
        required_error: 'password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    }),
    cellphone: z.string({
        required_error: 'cellphone is required, in string'
    }),
    empress: z.string({
        required_error: 'empress is required, in string'
    }),
    cargo: z.string({
        required_error: 'cargo is required, in string'
    }),
    departament: z.string({
        required_error: 'departament is required, in string'
    }),


})

//se asegura que los campos ingresados al login sean validos
export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid email'
    }),
    password: z.string({
        required_error: 'password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    })
})

