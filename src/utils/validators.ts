type Error = boolean | string

export type Validator = (value: any) => Error

export const required =
  (error: Error = true): Validator =>
  (value) => {
    if (typeof value === 'string') {
      return value.length === 0 ? error : false
    }
    return value ? false : error
  }

export const composeValidators =
  (...validators: (Validator | undefined)[]) =>
  (value: any) =>
    validators.reduce((error: Error, validator) => {
      if (!validator) return error
      return error || validator(value)
    }, false)

export const mustBeEmail =
  (error: Error = true): Validator =>
  (value) => {
    const re =
      /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Z‌​a-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/i
    return !!value && (re.test(value.toLowerCase()) && value.length <= 320 ? false : error)
  }
