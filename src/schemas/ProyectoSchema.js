import z from "zod"

//se asegura que los campos ingresados al crear un proyecto sean validos
export const createEschema = z.object({
    hourly_rate: z.number({
        required_error: 'Tarifa es requerido',
        invalid_type_error: 'Tarifa debe ser un número'
        }).nonnegative({
            message: 'Tarifa debe ser un número positivo'
        }),
    name: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser una cadena de carácteres'
        }).max(255, {
            message: 'Nombre debe tener 255 o menos carácteres'
        }),
    id_technician: z.string({
        invalid_type_error: 'Id del técnico debe ser tipo cadena de carácteres'
        }).uuid({
            message: "Id del técnico debe ser tipo UUID"
        }).nullable(),
    id_user: z.string({
        required_error: 'Id del usuario es requerido',
        invalid_type_error: 'Id del usuario debe ser tipo cadena de carácteres'
        }).uuid({
            message: "Id del usuario debe ser tipo UUID"
        }).nullable(),
    status: z.number({
        required_error: 'Estado es requerido',
        invalid_type_error: 'Estado debe ser tipo numérico'
    }),
    start_date: z.date({
        required_error: "Fecha de inicio es requerido",
        invalid_type_error: "La fecha de inicio debe ser una cadena de caráteres y formato ISO 8601",
    })
})

//se asegura que los campos ingresados al actualizar un proyecto sean validos
export const updateEschema = z.object({
    id: z.string({
        invalid_type_error: 'Id de proyecto debe ser tipo cadena de carácteres'
        }).uuid({
            message: "Id de proyecto debe ser tipo UUID"
        }),
    hourly_rate: z.number({
        invalid_type_error: 'Tarifa debe ser un número'
        }).nonnegative({
            message: 'Tarifa debe ser un número positivo'
        }),
    name: z.string({
        invalid_type_error: 'Nombre debe ser una cadena de carácteres'
        }).max(255, {
            message: 'Nombre debe tener 255 o menos carácteres'
        }),
    id_technician: z.string({
        invalid_type_error: 'Id del técnico debe ser tipo cadena de carácteres'
        }).uuid({
            message: "Id del técnico debe ser tipo UUID"
        }),
    id_user: z.string({
        invalid_type_error: 'Id del usuario debe ser tipo cadena de carácteres'
        }).uuid({
            message: "Id del usuario debe ser tipo UUID"
        }),
    status: z.number({
        invalid_type_error: 'Estado debe ser tipo numérico'
    }),
    start_date: z.date({
        invalid_type_error: "La fecha de inicio debe ser una cadena de caráteres y formato ISO 8601",
    })
}).partial()
