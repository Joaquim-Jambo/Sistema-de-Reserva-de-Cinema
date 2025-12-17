import { z } from "zod"

export const createUserSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string()
        .min(8, { message: "Senha deve ter no mínimo 8 caracteres" })
        .regex(/[a-z]/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
        .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
        .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
        .regex(/[^A-Za-z0-9]/, { message: 'Senha deve conter pelo menos um caractere especial' }),
    roleId: z.string().uuid({ message: 'ID de cargo inválido' }),
    isActive: z.boolean().default(true),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ['confirmPassword']
})

export const paramUserSchema = z.object({
    id: z.uuid()
})

export type createUserSchema = z.infer<typeof createUserSchema>
export type paramsUserSchema = z.infer<typeof paramUserSchema>
