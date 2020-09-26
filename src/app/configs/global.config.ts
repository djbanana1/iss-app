import { HttpHeaders } from '@angular/common/http'
import { version } from '../../../package.json'

export const VERSION = version

export const InterceptorSkip = 'X-Skip-Interceptor'
export const InterceptorSkipHeader = new HttpHeaders({
  'X-Skip-Interceptor': '',
})
