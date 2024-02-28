import z from "zod"

//se asegura que los campos ingresados al crear un rol sean validos
export const createEschema = z.object({
    id_servicio: z.string({
        required_error: 'ID es requerido',
        invalid_type_error: 'ID debe ser tipo cadena de carácteres'
        }).max(36,{
            message: 'ID debe tener 36 o menos carácteres'
        }),
    nombre: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser tipo cadena de carácteres'
        }).max(255,{
            message: 'Nombre debe tener 255 o menos carácteres'
        }),
    descripcion: z.string({
        required_error: 'Descripción es requerido',
        invalid_type_error: 'Descripción debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Descripción debe tener 255 o menos carácteres'
        }),
    tipo: z.string({
        required_error: 'Tipo de servicio es requerido',
        invalid_type_error: 'Tipo de servicio debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Tipo de servicio debe tener 255 o menos carácteres'
        }),
    categoria: z.string({
        required_error: 'Categoría es requerido',
        invalid_type_error: 'Categoría debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Categoría debe tener 255 o menos carácteres'
        }),
    plataforma: z.string({
        required_error: 'Plataforma es requerido',
        invalid_type_error: 'Plataforma debe ser tipo cadena de carácteres'
    }).max(255, {
        message: 'Plataforma debe tener 255 o menos carácteres'
    })
})

//se asegura que los campos ingresados al actualizar un rol sean validos
export const updateEschema = z.object({
    name: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser tipo cadena de carácteres'
        }).max(255,{
            message: 'Nombre debe tener 255 o menos carácteres'
        }),
    description: z.string({
        required_error: 'Descripción es requerido',
        invalid_type_error: 'Descripción debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Descripción debe tener 255 o menos carácteres'
        }),
    type: z.string({
        required_error: 'Tipo de servicio es requerido',
        invalid_type_error: 'Tipo de servicio debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Tipo de servicio debe tener 255 o menos carácteres'
        }),
    category: z.string({
        required_error: 'Categoría es requerido',
        invalid_type_error: 'Categoría debe ser tipo cadena de carácteres'
        }).max(255, {
            message: 'Categoría debe tener 255 o menos carácteres'
        }),
    platform: z.string({
        required_error: 'Plataforma es requerido',
        invalid_type_error: 'Plataforma debe ser tipo cadena de carácteres'
    }).max(255, {
        message: 'Plataforma debe tener 255 o menos carácteres'
    })
}).partial()