import { v4 as uuid } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import UtilsService from 'App/Services/UtilsService'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import UpdatePasswordValidator from 'App/Validators/UpdatePasswordValidator'

export default class UsersController {
  public async update ({ request }: HttpContextContract) {
    const user = request.user as User

    const data = await request.validate(UpdateUserValidator)
    user.name = data.name
    await user.save()

    return user
  }

  public async updatePhoto ({ request }: HttpContextContract) {
    const user = request.user as User

    const avatar = request.file('avatar', {
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!avatar || avatar.hasErrors) {
      return avatar?.hasErrors ? avatar?.errors : UtilsService.formatErrors(
        ['Por favor envie um avatar']
      )
    }

    const path = Application.makePath('..', 'uploads', 'profile')
    const name = `${uuid()}.${avatar.extname}`

    await avatar.move(path, {
      name,
    })

    user.profileImage = `${Env.get('BASE_URL') as string}/profile/${name}`
    await user.save()

    return user
  }

  public async updatePassword ({ request, response }: HttpContextContract) {
    const user = request.user as User

    const data = await request.validate(UpdatePasswordValidator)

    if (!(await user.validatePassword(data.oldPassword))) {
      return response.unauthorized(
        UtilsService.formatErrors(['A senha antiga não é válida'])
      )
    }

    user.password = data.password
    await user.save()

    return response.noContent(undefined)
  }

  public async delete ({ request }: HttpContextContract) {
    const user = request.user as User
    user.isActive = false
    await user.save()

    return user
  }
}
