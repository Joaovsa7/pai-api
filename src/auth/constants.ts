export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'key-secretissima',
  expiresIn: process.env.JWT_EXPIRES ?? '15d'
};