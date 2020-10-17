export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'key-secretissima',
  expiresIn: '3600'
};