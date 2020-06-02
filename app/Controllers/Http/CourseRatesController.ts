import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CourseRate from 'App/Models/CourseRate'
import CourseStudent from 'App/Models/CourseStudent'
import UtilsService from 'App/Services/UtilsService'
import SaveRateValidator from 'App/Validators/SaveRateValidator'

export default class CourseRatesController {
  public async paginate ({ request, params: { courseId } }: HttpContextContract) {
    let page = parseInt(request.only(['page']).page, 10)

    if (!page || isNaN(page)) {
      page = 1
    }

    return await CourseRate
      .query()
      .select('id', 'description', 'rate', 'rated_by_id', 'created_at')
      .preload('ratedBy', q => q.select('id', 'name', 'profile_image'))
      .where('course_id', courseId)
      .andWhere('is_active', true)
      .paginate(page, 8)
  }

  public async myRate ({ request: { user }, params: { courseId } }: HttpContextContract) {
    return await CourseRate.query()
      .select('id', 'description', 'rate', 'rated_by_id', 'created_at')
      .preload('ratedBy', q => q.select('id', 'name', 'profile_image'))
      .where('course_id', courseId)
      .andWhere('rated_by_id', user!.id)
      .andWhere('is_active', true)
      .firstOrFail()
  }

  public async create ({ request, params: { courseId }, response }: HttpContextContract) {
    await CourseStudent.query()
      .where('course_id', courseId)
      .andWhere('user_id', request.user!.id)
      .firstOrFail()

    const existRate = await CourseRate.query()
      .where('course_id', courseId)
      .andWhere('rated_by_id', request.user!.id)
      .andWhere('is_active', true)
      .first()

    if (existRate) {
      return response.unprocessableEntity(
        UtilsService.formatErrors(['Voce já avaliou esse Curso, tente editar sua avaliação']),
      )
    }

    const data = await request.validate(SaveRateValidator)

    if (data.rate > 5) {
      return response.unprocessableEntity(
        UtilsService.formatErrors(['O Rate máximo é 5']),
      )
    }

    const courseRate = await CourseRate.create({
      ...data,
      courseId,
      ratedById: request.user!.id,
    })

    if (!courseRate.$isPersisted) {
      return response.internalServerError(
        UtilsService.formatErrors(['Ocorreu um erro não esperado ao salvar a avaliação']),
      )
    }

    await courseRate.preload('ratedBy', q => q.select('id', 'name', 'profile_image'))
    return this.formatCourseRate(courseRate)
  }

  public async update ({ request, params: { rateId }, response }: HttpContextContract) {
    const courseRate = await CourseRate.query()
      .where('id', rateId)
      .andWhere('rated_by_id', request.user!.id)
      .andWhere('is_active', true)
      .firstOrFail()

    const data = await request.validate(SaveRateValidator)

    if (data.rate > 5) {
      return response.unprocessableEntity(
        UtilsService.formatErrors(['O Rate máximo é 5']),
      )
    }

    courseRate.description = data.description
    courseRate.rate = data.rate
    await courseRate.save()

    await courseRate.preload('ratedBy', q => q.select('id', 'name', 'profile_image'))
    return this.formatCourseRate(courseRate)
  }

  public async delete ({ request: { user }, params: { rateId }, response }: HttpContextContract) {
    const courseRate = await CourseRate.query()
      .where('id', rateId)
      .andWhere('rated_by_id', user!.id)
      .andWhere('is_active', true)
      .firstOrFail()

    courseRate.isActive = false
    await courseRate.save()

    return response.noContent(undefined)
  }

  private formatCourseRate ({ id, description, rate, ratedById, createdAt, ratedBy }: CourseRate) {
    return {
      id,
      description,
      rate,
      rated_by_id: ratedById,
      created_at: createdAt,
      ratedBy,
    }
  }
}
