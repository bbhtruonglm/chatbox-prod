import { NotFoundError } from '@/utils/error/NotFound'
import { isNull, isUndefined } from 'lodash'
import { VALIDATE_METADATA_KEYS } from './MetadataKeys'

/**decorator gắn meta cho param, để check param phải tồn tại dữ liệu */
export function IsDefined() {
  return function (
    instance: Object,
    property_key: string,
    param_index: number
  ) {
    // IsDefined.name
    /**lấy ra danh sách index của các param cần kiểm tra */
    const PARAMS_INDEX: number[] =
      Reflect.getMetadata(
        VALIDATE_METADATA_KEYS.IS_DEFINED,
        instance,
        property_key
      ) || []

    // thêm index của param cần kiểm tra vào danh sách
    PARAMS_INDEX.push(param_index)

    // cập nhật danh sách index của các param cần kiểm tra
    Reflect.defineMetadata(
      VALIDATE_METADATA_KEYS.IS_DEFINED,
      PARAMS_INDEX,
      instance,
      property_key
    )
  }
}

function getParamNames(target: any, methodName: string): string[] {
  const methodStr = target[methodName].toString()
  const paramPattern = /\(([^)]*)\)/
  const result = paramPattern.exec(methodStr)
  if (result && result[1]) {
    return result[1]
      .split(',')
      .map(param => param.split('=')[0].trim())
      .filter(param => param.length > 0)
  }
  return []
}

export function Validate() {
  return function (
    instance: Object,
    property_key: string,
    descriptor: PropertyDescriptor
  ) {

    const originalMethod = descriptor.value;

    // Lấy metadata về tham số
    const paramTypes = Reflect.getMetadata('design:paramtypes', instance, property_key);

    console.log('paramTypes', paramTypes);

    descriptor.value = function (...args: any[]) {
        const parameterDefaults = paramTypes.map((type: any, index: number) => {
            // Nếu không có args[index], sử dụng giá trị mặc định
            return args[index] !== undefined ? args[index] : `default for ${type.name}`;
        });

        console.log(`Method: ${property_key}`);
        console.log(`Parameters with defaults: `, parameterDefaults);

        return originalMethod.apply(this, parameterDefaults);
    };

    return descriptor;


    // const originalMethod = descriptor.value

    // descriptor.value = function (...args: any[]) {
    //   console.log(`Method: ${property_key}`)
    //   console.log(`Parameters: `, args)

    //   // Gọi method gốc với các tham số
    //   return originalMethod.apply(this, args)
    // }

    // return descriptor



    // /**phương thức gốc */
    // const ORIGINAL_METHOD = descriptor.value

    // /**lấy ra tên của các param của phương thức */
    // const PARAMS_NAME = getParamNames(instance, property_key)

    // // trang trí phương thức
    // descriptor.value = function (...args: any[]) {
    //   console.log('xxx', args)
    //   /**lấy ra danh sách index của các param cần kiểm tra */
    //   const PARAMS_INDEX: number[] =
    //     Reflect.getMetadata(
    //       VALIDATE_METADATA_KEYS.IS_DEFINED,
    //       instance,
    //       property_key
    //     ) || []

    //   // lặp qua các param cần kiểm tra
    //   for (const INDEX of PARAMS_INDEX) {
    //     /**lấy ra giá trị của param */
    //     const PARAM_VALUE = args[INDEX]
    //     /**lấy ra tên của param */
    //     const PARAM_NAME = PARAMS_NAME?.[INDEX]

    //     console.log(PARAM_NAME, PARAM_VALUE)

    //     if (isUndefined(PARAM_VALUE) || isNull(PARAM_VALUE))
    //       throw new NotFoundError(PARAM_NAME)
    //   }

    //   // chạy phương thức gốc
    //   return ORIGINAL_METHOD.apply(this, args)
    // }

    // // trả về phương thức đã trang trí
    // return descriptor
  }
}
