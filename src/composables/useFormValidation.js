import { ref, computed } from 'vue'
import { ZodError, ZodObject } from 'zod'

function formatearErroresZod(error) {
  const formatted = {}

  const issues = Array.isArray(error?.issues)
    ? error.issues
    : Array.isArray(error?.errors)
      ? error.errors
      : []

  for (const issue of issues) {
    const key = issue?.path && issue.path.length ? String(issue.path[0]) : null
    if (!key) continue
    if (!formatted[key]) formatted[key] = issue.message
  }

  return formatted
}

export function useFormValidation(schema) {
  const errors = ref({})
  const touchedFields = ref(new Set())

  const markAsTouched = (fieldName) => {
    touchedFields.value.add(fieldName)
  }

  const clearErrors = () => {
    errors.value = {}
    touchedFields.value.clear()
  }

  const clearError = (fieldName) => {
    const next = { ...errors.value }
    delete next[fieldName]
    errors.value = next
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  const getFieldError = (fieldName) => {
    return touchedFields.value.has(fieldName)
      ? errors.value[fieldName] || null
      : null
  }

  const validateAll = async (data) => {
    try {
      if (!schema) return true
      await schema.parseAsync(data)
      errors.value = {}
      return true
    } catch (e) {
      if (e instanceof ZodError) {
        errors.value = formatearErroresZod(e)
        return false
      }
      console.error('Error de validación:', e)
      return false
    }
  }

  const validateField = async (fieldName, data) => {
    try {
      if (!schema) return true

      const value = data[fieldName]

      if (schema instanceof ZodObject || schema?.shape) {
        const fieldSchema = schema.shape?.[fieldName]

        if (fieldSchema) {
          await fieldSchema.parseAsync(value)
          clearError(fieldName)
          return true
        }
      }

      await schema.parseAsync(data)
      clearError(fieldName)
      return true
    } catch (e) {
      if (e instanceof ZodError) {
        const formatted = formatearErroresZod(e)

        if (formatted[fieldName]) {
          errors.value = { ...errors.value, [fieldName]: formatted[fieldName] }
          return false
        } else {
          clearError(fieldName)
          return true
        }
      }
      console.error('Error de validación:', e)
      return false
    }
  }

  const validate = async (data, fieldName = null) => {
    if (!schema) return true
    if (fieldName) return await validateField(fieldName, data)
    return await validateAll(data)
  }

  return {
    errors,
    touchedFields,
    markAsTouched,
    getFieldError,
    clearErrors,
    clearError,
    hasErrors,
    validate,
    validateAll,
    validateField,
  }
}