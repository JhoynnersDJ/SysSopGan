const z = require('zod');

//se asegura que los campos ingresados al registro sean validos
const registerSchema = z.object({
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
    })

})

//se asegura que los campos ingresados al login sean validos
const loginSchema = z.object({
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

module.exports = {"registerSchema": registerSchema, "loginSchema":loginSchema}