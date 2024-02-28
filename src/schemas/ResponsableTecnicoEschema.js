import z from "zod"

//se asegura que los campos ingresados al registrar un responsable tecnico sean validos
export const createEschema = z.object({
    nombre: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser tipo cadena de carácteres'
        }).max(100, {
            message: 'Nombre debe tener 100 o menos carácteres'
        }),
    cargo: z.string({
        invalid_type_error: 'Cargo debe ser tipo cadena de carácteres'
        }).nullable(),
    email: z.string({
        invalid_type_error: 'Correo debe ser tipo cadena de carácteres'
        }).email({
            message: "Dirección de correo inválida"
        }).nullable(),
    num_tel: z.string({
        invalid_type_error: 'Número de teléfono debe ser tipo cadena de carácteres'
    }).nullable()
})

//se asegura que los campos ingresados al actualizar un responsable tecnico sean validos
export const updateEschema = z.object({
    nombre: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser tipo cadena de carácteres'
        }).max(100, {
            message: 'Nombre debe tener 100 o menos carácteres'
        }),
    cargo: z.string({
        invalid_type_error: 'Cargo debe ser tipo cadena de carácteres'
        }).nullable(),
    email: z.string({
        invalid_type_error: 'Correo debe ser tipo cadena de carácteres'
        }).email({
            message: "Dirección de correo inválida"
        }).nullable(),
    num_tel: z.string({
        invalid_type_error: 'Número de teléfono debe ser tipo cadena de carácteres'
    }).nullable()
}).partial()