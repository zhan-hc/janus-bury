import qs from 'qs';
import Fingerprint2 from 'fingerprintjs2'
export function isObjectOverSizeLimit(
  object: object,
  limitInKB: number
): boolean {
  const serializedObject = JSON.stringify(object)
  const sizeInBytes = new TextEncoder().encode(serializedObject).length
  const sizeInKB = sizeInBytes / 1024
  return sizeInKB > limitInKB
}

/**
 * 对url加入参数
 * @param {String} url
 * @param {Object} query
 * @returns
 */
export const addQuery = (url: string, query = {}) => {
  const [path, search = ''] = url.split('?');
  const params = qs.parse(search);

  Object.assign(params, query);
  return `${path}${qs.stringify(params, {addQueryPrefix: true})}`;
};

/**
 * 获取浏览器指纹唯一id
 * @returns 
 */
export const getDeviceId = async (): Promise<string> => {
  return new Promise<string>((resolve) => {
    try {
      Fingerprint2.get({
        userAgent: true,
        screenResolution: true,
        language: true,
        colorDepth: true,
        timezone: true,
        sessionStorage: true
      }, function (components:any) {
        const values: string[] = components.map((component:any) => component.value) // 配置的值的数组
        const murmur: string = Fingerprint2.x64hash128(values.join(''), 31) // 生成浏览器指纹
        resolve(murmur)
      })
    } catch (e) {
      console.log('getSessionId error =>', e)
      resolve('')
    }
    
  })
}
