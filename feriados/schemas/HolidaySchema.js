import z from "zod";

export const createHolidaySchema = z.object({
    name: z.string({
        required_error: 'Name is required'
    }),
    date: z.coerce.date({
        required_error: 'Date must be a string and date type'
    }),

})

export const updateHolidaySchema = z.object({
    name: z.string({
        required_error: 'Name is required'
    }).optional(),
    date: z.string().datetime({
        required_error: 'Date must be a string and date type'
    }).optional(),

})