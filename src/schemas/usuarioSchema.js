import { z } from 'zod'

const correo = z
  .string()
  .min(1, 'El correo es obligatorio')
  .email('Ingresa un correo válido')
  .max(150, 'Máximo 150 caracteres')

const nombre = z
  .string()
  .trim()
  .min(1, 'El nombre es obligatorio')
  .max(100, 'Máximo 100 caracteres')

const contrasenia = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')

export const loginSchema = z.object({
  correo,
  contrasenia: z.string().min(1, 'La contraseña es obligatoria'),
})

export const registroSchema = z.object({
  nombre,
  correo,
  contrasenia,
})

export const editarUsuarioSchema = z.object({
  nombre,
  correo,
  contrasenia: z.union([z.literal(''), contrasenia]),
})
