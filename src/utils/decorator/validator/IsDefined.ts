import { NotFoundError } from '@/utils/error/NotFound'
import { isNull, isUndefined } from 'lodash'

export function IsDefined(value: any, message?: string) {
  return function (
    target: any,
    property_key: string,
    descriptor: PropertyDescriptor
  ) {
    /**phương thức gốc */
    const ORIGINAL_METHOD = descriptor.value

    // trang trí phương thức
    descriptor.value = function (...args: any[]) {
      // kiểm tra giá trị
      if (isUndefined(value) || isNull(value))
        throw new NotFoundError(message || property_key)

      // chạy phương thức gốc
      return ORIGINAL_METHOD.apply(this, args)
    }
  }
}

export function IsDefined2(
  instance: Object,
  property_key: string | symbol,
  param_index: number
) {
  const META_KEY = 'is_defined2'

  const PARAMS_INDEX: number[] =
    Reflect.getMetadata(META_KEY, instance, property_key) || []

  PARAMS_INDEX.push(param_index)

  Reflect.defineMetadata(META_KEY, PARAMS_INDEX, instance, property_key)
}

function getParamNames(target: any, methodName: string): string[] {
  const methodStr = target[methodName].toString()
  const paramPattern = /\(([^)]*)\)/
  const result = paramPattern.exec(methodStr)
  if (result && result[1]) {
    return result[1]
      .split(',')
      .map(param => param.trim())
      .filter(param => param.length > 0)
  }
  return []
}

export function ValidateParameters(
  instance: Object,
  property_key: string,
  descriptor: PropertyDescriptor
) {
  const ORIGINAL_METHOD = descriptor.value

  const NAME = getParamNames(instance, property_key)

  descriptor.value = function (...args: any[]) {
    const PARAMS_INDEX: number[] =
      Reflect.getMetadata('is_defined2', instance, property_key) || []

    for (const index of PARAMS_INDEX) {
      const PARAM = args[index]


     

     console.log('NAME', NAME)

      if (isUndefined(PARAM) || isNull(PARAM)) throw new NotFoundError('xxxxxx')
    }

    return ORIGINAL_METHOD.apply(this, args)
  }
}

// export function IsNumber() {
//   return function (
//     target: Object,
//     propertyKey: string | symbol,
//     parameterIndex: number
//   ) {
//     const existingParams: number[] =
//       Reflect.getMetadata(METADATA_KEY.IS_NUMBER, target, propertyKey) || []
//     existingParams.push(parameterIndex)
//     Reflect.defineMetadata(
//       METADATA_KEY.IS_NUMBER,
//       existingParams,
//       target,
//       propertyKey
//     )
//   }
// }
