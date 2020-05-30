import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'

export interface JWTPayload {
  id: number
}

const SECRET = Env.get('JWT_SECRET', '@') as string

export default class JWTService {
  public static sign (payload: JWTPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, SECRET, {
        expiresIn: '14d',
      }, (err, token) => {
        if (err) {
          return reject(err)
        }

        return resolve(token as string)
      })
    })
  }

  public static verify (token: string): Promise<JWTPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET, (err, decoded) => {
        if (err || !decoded) {
          return reject(err)
        }

        return resolve(decoded as JWTPayload)
      })
    })
  }
}
