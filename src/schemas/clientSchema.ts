import { string, z } from "zod"
import { createUserSchema } from "./userSchema"


export const createClientSchema = createUserSchema.merge(z.object({
    preferredGenres: z.string().array().optional(),
    phone: z.string().min(9, 'Deve ter no minimo 9 digitos').max(12, 'Deve ter no maximo 12 digitos'),
    dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de nascimento deve estar no formato DD/MM/YYYY' })
        .transform((val) => {
            const [day, month, year] = val.split('/');
            return new Date(`${year}-${month}-${day}`).toISOString();
        })
}))

export const updateClientSchema = z.object({
    name: z.string().optional(),
    email: string().email({ message: 'Email invalido' }).optional(),
    password: string()
        .min(8, { message: "Senha deve ter no mínimo 8 caracteres" })
        .regex(/[a-z]/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
        .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
        .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
        .regex(/[^A-Za-z0-9]/, { message: 'Senha deve conter pelo menos um caractere especial' })
    ,
    preferredGenres: z.string().array().optional(),
    phone: z.string().min(9, 'Deve ter no minimo 9 digitos').max(12, 'Deve ter no maximo 12 digitos'),
    dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de nascimento deve estar no formato DD/MM/YYYY' })
        .transform((val) => {
            const [day, month, year] = val.split('/');
            return new Date(`${year}-${month}-${day}`).toISOString();
        })
})
export type createClientSchema = z.infer<typeof createClientSchema>;
export type updateClientSchema = z.infer<typeof updateClientSchema>;