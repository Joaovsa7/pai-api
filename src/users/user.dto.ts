export interface UserExist {
  username: string
  email?: string
}

export interface RegisterDTO {
  username: string
  email: string
  password?: string
  id?: number
}