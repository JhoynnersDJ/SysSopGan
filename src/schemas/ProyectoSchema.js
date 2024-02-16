import z from "zod"

//se asegura que los campos ingresados en la creacion sean validos
export const createEschema = z.object({
    fee: z.number({
        required_error: 'Tarifa is required',
        invalid_type_error: 'Tarifa must be a number'
        }).nonnegative({
            message: 'Tarifa must be a positive number'
        }),
    name: z.string({
        required_error: 'Nombre is required',
        invalid_type_error: 'Nombre must be a number'
        }).max(255, {
            message: 'Nombre Must be 255 or fewer characters long'
        }),
    id_technician: z.string({
        invalid_type_error: 'Id tecnico must be a string'
        }).uuid({
            message: "Id técnico must be UUID"
        }).nullable(),
    id_user: z.string({
        required_error: 'Id usuario is required',
        invalid_type_error: 'Id usuario must be a string'
        }).uuid({
            message: "Id usuario must be UUID type"
        }).nullable(),
    status: z.number({
        required_error: 'Status is required',
        invalid_type_error: 'Status must be a number'
    })
})


