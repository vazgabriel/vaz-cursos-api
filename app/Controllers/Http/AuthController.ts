import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import JWTService from 'App/Services/JWTService'
import UtilsService from 'App/Services/UtilsService'

export default class AuthController {
  public async register ({ request, response }: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    const user = await User.create(data)

    if (!user.$isPersisted) {
      return response.internalServerError(
        UtilsService.formatErrors(['Ocorreu um erro não esperado ao salvar usuário']),
      )
    }

    return this.responseAuth(user)
  }

  public async login ({ request, response }: HttpContextContract) {
    const data = await request.validate(LoginValidator)
    const user = await User.query()
      .preload('teacher')
      .where('email', data.email)
      .first()

    if (!user || !user.isActive || !(await user.validatePassword(data.password))) {
      return response.unauthorized(
        UtilsService.formatErrors(['Email ou senha incorretos']),
      )
    }

    return this.responseAuth(user)
  }

  public async renewToken ({ request }: HttpContextContract) {
    return this.responseAuth(request.user as User)
  }

  private async responseAuth (user: User) {
    return {
      user,
      token: await JWTService.sign({ id: user.id }),
    }
  }
}
