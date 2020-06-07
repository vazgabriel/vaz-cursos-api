import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CourseClassWatched from 'App/Models/CourseClassWatched'
import CourseClass from 'App/Models/CourseClass'
import Course from 'App/Models/Course'
import User from 'App/Models/User'

import JWTService from 'App/Services/JWTService'
import UtilsService from 'App/Services/UtilsService'
import SaveCourseClassValidator from 'App/Validators/SaveCourseClassValidator'

export default class CourseClassesController {
  public async paginate ({ request, params: { courseId } }: HttpContextContract) {
    let { page } = request.only(['page'])

    page = parseInt(page, 10)

    if (!page || isNaN(page)) {
      page = 1
    }

    const courses: any = (await CourseClass
      .query()
      .select('id', 'title', 'description', 'order')
      .where('is_active', true)
      .andWhere('course_id', courseId)
      .orderBy('order', 'asc')
      .paginate(page, 20)).toJSON()

    const user = await this.getUserFromHeader(request.header('Authorization', '') as string)

    if (user && courses.data.length) {
      const ids = courses.data.map(c => c.id)

      const rows = await CourseClassWatched.query()
        .select('cw.course_class_id')
        .from('course_class_watcheds as cw')
        .join('course_classes as c', 'c.id', 'cw.course_class_id')
        .where('cw.user_id', user.id)
        .andWhereIn('c.id', ids)
        .exec()

      courses.data = courses.data.map(e => {
        e = e.toJSON()
        e.watched = rows.find(r => r.courseClassId === e.id) !== undefined
        return e
      })
    }

    return courses
  }

  public async get ({ params: { classId } }: HttpContextContract) {
    return await CourseClass.query()
      .preload('course')
      .where('id', classId)
      .andWhere('is_active', true)
      .firstOrFail()
  }

  public async see ({ request: { user }, params: { classId }, response }: HttpContextContract) {
    return response.created(
      await CourseClassWatched.create({
        courseClassId: classId,
        userId: user!.id,
      })
    )
  }

  public async unsee ({ request: { user }, params: { classId }, response }: HttpContextContract) {
    await CourseClassWatched.query()
      .where('course_class_id', parseInt(classId, 10))
      .andWhere('user_id', user!.id)
      .delete()

    return response.noContent(undefined)
  }

  public async create ({ request, params: { courseId } }: HttpContextContract) {
    await Course.query()
      .where('id', courseId)
      .andWhere('user_id', request.user!.id)
      .firstOrFail()

    const { title, description, youtubeId } = await request.validate(SaveCourseClassValidator)

    const lastClass = await CourseClass
      .query()
      .where('course_id', courseId)
      .andWhere('is_active', true)
      .orderBy('order', 'desc')
      .first()

    const order = lastClass ? lastClass.order + 1 : 1
    const courseClass = await CourseClass.create({
      title,
      description,
      youtubeId,
      courseId,
      order,
    })

    return courseClass
  }

  public async update ({ request, params: { courseId, classId } }: HttpContextContract) {
    await Course.query()
      .where('id', courseId)
      .andWhere('user_id', request.user!.id)
      .firstOrFail()

    const data = await request.validate(SaveCourseClassValidator)

    const courseClass = await CourseClass.findOrFail(classId)
    courseClass.title = data.title
    courseClass.description = data.description
    courseClass.youtubeId = data.youtubeId

    await courseClass.save()

    return courseClass
  }

  public async reorder ({ request, params: { courseId, classId }, response }: HttpContextContract) {
    await Course.query()
      .where('id', courseId)
      .andWhere('user_id', request.user!.id)
      .firstOrFail()

    const courseClass = await CourseClass.findOrFail(classId)

    let { position } = request.only(['position'])
    position = parseInt(position, 10)

    if (position < 1 || position === courseClass.order) {
      return courseClass
    }

    const isGrowing = position > courseClass.order

    const firstComparison = isGrowing ? '<=' : '>='
    const secondComparison = isGrowing ? '>' : '<'

    const classes = await CourseClass.query()
      .where('course_id', courseId)
      .andWhere('order', firstComparison, position)
      .andWhere('order', secondComparison, courseClass.order)
      .andWhere('is_active', true).exec()

    if (classes.length === 0) {
      return response.unprocessableEntity(
        UtilsService.formatErrors(['Posição inválida'])
      )
    }

    await Database.transaction(async (trx) => {
      courseClass.useTransaction(trx)
      courseClass.order = position
      await courseClass.save()

      for (const each of classes) {
        each.useTransaction(trx)
        each.order = isGrowing ? each.order - 1 : each.order + 1
        await each.save()
      }
    })

    return response.noContent(undefined)
  }

  public async delete ({ request, params: { courseId, classId }, response }: HttpContextContract) {
    await Course.query()
      .where('id', courseId)
      .andWhere('user_id', request.user!.id)
      .firstOrFail()

    const courseClass = await CourseClass.findOrFail(classId)
    const classes = await CourseClass.query()
      .where('course_id', courseId)
      .andWhere('order', '>', courseClass.order)
      .andWhere('is_active', true)
      .exec()

    await Database.transaction(async (trx) => {
      courseClass.useTransaction(trx)
      courseClass.isActive = false
      courseClass.order = 0
      await courseClass.save()

      for (const each of classes) {
        each.useTransaction(trx)
        each.order--
        await each.save()
      }
    })

    return response.noContent(undefined)
  }

  private async getUserFromHeader (token: string): Promise<User | undefined> {
    if (token) {
      try {
        const decoded = await JWTService.verify(token)
        const user = await User.find(decoded.id)

        if (user && user.isActive) {
          return user
        }
      } catch (error) { }
    }

    return undefined
  }
}
