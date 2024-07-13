import { computed, reactive, watch } from "vue";

type auxObj = Record<string, unknown>

type PrimitiveValues = string | boolean | number | StringConstructor | BooleanConstructor | NumberConstructor
type PrimitiveParser<T> = T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean
  : T extends BooleanConstructor ? boolean
  : T extends StringConstructor ? string
  : T extends NumberConstructor ? number
  : never

interface FormValidatorBody<T extends auxObj> {
  value: T['value'] extends PrimitiveValues ? T['value'] : PrimitiveValues;
  validators: Array<(val: PrimitiveParser<T['value']>) => boolean | string>;
}

type FormBody <T extends auxObj, Y extends keyof T = keyof T>= {
  [key in Y]: T[key] extends auxObj
    ? FormValidatorBody<T[key]>
    : T[key] extends PrimitiveValues ? T[key] : PrimitiveValues
};

interface UseForm<T extends FormBody<K>, K extends auxObj, Y extends keyof T = keyof T> {
  touch: () => void
  submit: () => {
    [key in Y]: T[key] extends FormValidatorBody<infer U> ? PrimitiveParser<U['value']> : PrimitiveParser<T[key]>
  }
  controls: {
    [key in Y]: T[key] extends FormValidatorBody<infer U> ? PrimitiveParser<U['value']> : PrimitiveParser<T[key]>
  },
  errors: Record<Y, string>
  valid: boolean
}

export function useForm<T extends auxObj>(obj: FormBody<T>): UseForm<typeof obj, T> {
  const entries = Object.entries(obj);
  const toValidate = entries.reduce((acc, [key, val]) => {
    if (val.validators?.length) {
      acc.push(key)
    }
    return acc
  }, [] as string[])

  const initialValue = entries.reduce((acc, [key, payload]) => {
    const value = payload?.value ?? payload
    acc[key] = value;

    return acc;
  }, {} as Record<string, unknown>)

  const controls = reactive(initialValue);
  const errors = reactive(entries.reduce((acc, [key]) => {
    acc[key] = ''

    return acc
  }, {} as Record<string, string>));

  for (let key of toValidate) {
    watch(() => controls[key], (val) => {
      errors[key] = (<FormValidatorBody<T>>obj[key]).validators.reduce((errMsg, validator) => {
        // TODO: check this T[value] type
        const result = validator(val as T['value'])

        if (typeof result === 'string') {
          errMsg = result
        } else {
          errMsg = 'Error'
        }

        return errMsg
      }, '')
    })
  }

  const touch = () => {
    for (let key of toValidate) {
      errors[key] = (<FormValidatorBody<T>>obj[key]).validators.reduce((errMsg, validator) => {
        // TODO: check this T[value] type
        const result = validator(controls[key] as T['value'])

        if (typeof result === 'string') {
          errMsg = result
        } else {
          errMsg = 'Error'
        }

        return errMsg
      }, '')
    }
  }

  const valid = computed(() => Object.values(errors).every((errr) => !errr))

  const submit = () => {
    return entries.reduce((acc, [key]) => {
      acc[key] = controls[key as keyof typeof controls]

      return acc
    }, {} as Record<string, unknown>)
  }

  // TODO: improve as unknown should not be required
  return { touch, submit, controls, errors, valid } as unknown as UseForm<T>
}
