import { email, z } from "zod"

export const createUserSchema = z.object({
    email: z.string().email({ message: 'Email invalido' }),
    password: z.string()
        .min(8, { message: "Senha deve ter no minimo 8 caracteres" })
        .regex(/[a-z]/, { message: 'Senha deve conter pelo menos uma letra minuscula' })
        .regex(/[A-Z]/, { message: 'Senha deve conter pelos menos uma letra maiscula' })
        .regex(/[0-9]/, { message: 'Senha deve conter pelos menos um numero' })
        .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial'),
    roleId: z.uuid(),
    isActive: z.boolean().default(true),
    confirmPassword: z.string()
}).refine((data) => data.password !== data.confirmPassword, {
    message: "As senhas nao coincidem",
    path: ['confirmPassword']
})

export const paramUserSchema = z.object({
    id: z.uuid()
})

export type createUserSchema = z.infer<typeof createUserSchema>
export type paramsUserSchema = z.infer<typeof paramUserSchema>
