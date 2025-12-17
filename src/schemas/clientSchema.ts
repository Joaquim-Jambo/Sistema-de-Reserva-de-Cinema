import { z } from "zod"
import { createUserSchema } from "./userSchema"

export const createClientSchema = createUserSchema.merge(z.object({
    preferredGenres: z.string().array().optional(),
    phone: z.string().min(9, 'Deve ter no minimo 9 digitos').max(12, 'Deve ter no maximo 12 digitos'),
    dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de nascimento deve estar no formato DD/MM/YYYY' })
        .transform((val) => {
            // Convert DD/MM/YYYY to ISO-8601
            const [day, month, year] = val.split('/');
            return new Date(`${year}-${month}-${day}`).toISOString();
        })
}))

export type createClientSchema = z.infer<typeof createClientSchema>;