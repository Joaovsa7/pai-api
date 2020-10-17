export interface UserExist {
  username: string
}

export interface RegisterDTO {
  username: string
  email: string
  password?: string
}