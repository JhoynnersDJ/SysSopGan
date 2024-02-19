import z from "zod"

//se asegura que los campos ingresados al crear un rol sean validos
export const createEschema = z.object({
    name: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Nombre debe tener 255 o menos carácteres'
        }),
    description: z.string({
        invalid_type_error: 'Descripción debe ser tipo cadena de carácteres'
        }).max(255, {
            message: "Descripción debe tener 255 o menos carácteres"
        }).nullable()
})

//se asegura que los campos ingresados al actualizar un proyecto sean validos
export const updateEschema = z.object({
    name: z.string({
        invalid_type_error: 'Nombre debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Nombre debe tener 255 o menos carácteres'
        }),
    description: z.string({
        invalid_type_error: 'Descripción debe ser tipo cadena de carácteres'
        }).max(255, {
            message: "Descripción debe tener 255 o menos carácteres"
        }).nullable()
}).partial()