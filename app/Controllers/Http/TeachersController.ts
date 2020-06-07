import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Teacher from 'App/Models/Teacher'
import UtilsService from 'App/Services/UtilsService'
import RequestTeacherValidator from 'App/Validators/RequestTeacherValidator'

export default class TeachersController {
  public async get ({ params: { teacherId }, response }: HttpContextContract) {
    const user = (await User.query()
      .select('id', 'name', 'email', 'profile_image')
      .preload('teacher', qt => qt.select('description'))
      .where('id', teacherId)
      .andWhere('is_active', true)
      .firstOrFail()).toJSON()

    if (!user.teacher) {
      response.notFound(undefined)
    }

    user.teacher.user_id = undefined

    const { rows } = await Database.rawQuery(`
      SELECT
        (
          SELECT AVG(cr.rate) as rate
            FROM course_rates as cr
            INNER JOIN courses as c ON c.id = cr.course_id
            WHERE cr.is_active = true AND c.user_id = :id
        ) as rate,
        (
          SELECT COUNT(cr.id) as reviews
            FROM course_rates as cr
            INNER JOIN courses as c ON c.id = cr.course_id
            WHERE cr.is_active = true AND c.user_id = :id
        ) as reviews,
        (
          SELECT COUNT(*) as students
            FROM course_students as cs
            INNER JOIN courses as c ON c.id = cs.course_id
            WHERE c.user_id = :id
        ) as students,
        (
          SELECT COUNT(id) as courses
            FROM courses
            WHERE user_id = :id
        ) as courses
    `, { id: user.id })

    const rate = parseFloat(rows[0].rate)
    user.teacher.rate = isNaN(rate) ? 0 : rate
    user.teacher.reviews = parseInt(rows[0].reviews, 10)
    user.teacher.students = parseInt(rows[0].students, 10)
    user.teacher.courses = parseInt(rows[0].courses, 10)

    return user
  }

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

  public async update ({ request }: HttpContextContract) {
    const teacher = request.user!.teacher

    const data = await request.validate(RequestTeacherValidator)
    teacher.description = data.description
    teacher.shortDescription = data.shortDescription
    await teacher.save()

    return teacher
  }
}
