export interface ApiResponseModel<T> {
  data?: T,
  message?: string,
  error?: boolean
}
