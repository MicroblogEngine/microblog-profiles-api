import { registerOTel } from '@vercel/otel'
 
export function register() {
  registerOTel('microblog-profiles-api')
}