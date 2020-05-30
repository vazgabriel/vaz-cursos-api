import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import JWTService from 'App/Services/JWTService'
import User from 'App/Models/User'

export default class AuthMiddleware {
  public async handle ({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const token = request.header('Authorization', '') as string

    try {
      const decoded = await JWTService.verify(token)
      const user = await User.find(decoded.id)

      if (!user || !user.isActive) {
        return response.forbidden({ message: 'Permissões insuficientes' })
      }

      request.user = user
    } catch (error) {
      return response.forbidden({ message: 'Permissões insuficientes' })
    }

    await next()
  }
}
