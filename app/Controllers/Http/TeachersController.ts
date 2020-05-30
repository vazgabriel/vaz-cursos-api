import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Teacher from 'App/Models/Teacher'
import UtilsService from 'App/Services/UtilsService'
import RequestTeacherValidator from 'App/Validators/RequestTeacherValidator'

export default class TeachersController {
  public async requestTeacher ({ request, response }: HttpContextContract) {
    const user = request.user as User

    const existentTeacher = await Teacher.findBy('user_id', user.id)
    if (existentTeacher) {
      return response.forbidden(
        UtilsService.formatErrors(['Voce já é um professor'])
      )
    }

    const data = await request.validate(RequestTeacherValidator)
    const teacher = await Teacher.create({ ...data, userId: user.id })

    return teacher
  }

  public async update ({ request, response }: HttpContextContract) {
    const user = request.user as User

    const teacher = await Teacher.findBy('user_id', user.id)
    if (!teacher) {
      return response.forbidden(
        UtilsService.formatErrors(['Voce não é um professor'])
      )
    }

    const data = await request.validate(RequestTeacherValidator)
    teacher.description = data.description
    teacher.shortDescription = data.shortDescription
    await teacher.save()

    return teacher
  }
}
