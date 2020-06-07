import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Course from 'App/Models/Course'
import CourseLearnship from 'App/Models/CourseLearnship'

import UtilsService from 'App/Services/UtilsService'
import DescriptionValidator from 'App/Validators/DescriptionValidator'

export default class CourseLearnshipsController {
  public async paginate ({ request }: HttpContextContract) {
    let { page, search } = request.only(['page', 'search'])

    page = parseInt(page, 10)
    search = (search || '').toUpperCase()

    if (!page || isNaN(page)) {
      page = 1
    }

    let baseQuery = CourseLearnship
      .query()
      .select('id', 'description')
      .where('is_active', true)

    if (search) {
      baseQuery = baseQuery.andWhere('description', 'LIKE', `%${search}%`)
    }

    return await baseQuery
      .paginate(page, 8)
  }

  public async create ({ request, response }: HttpContextContract) {
    let { description } = await request.validate(DescriptionValidator)
    description = description.toUpperCase()

    const existentLearnship = await CourseLearnship.findBy('description', description)
    if (existentLearnship) {
      return existentLearnship
    }

    const learnship = await CourseLearnship.create({ description })

    if (!learnship.$isPersisted) {
      return response.internalServerError(
        UtilsService.formatErrors(['Ocorreu um erro não esperado ao salvar o aprendizado']),
      )
    }

    return learnship
  }

  public async removeFromCourse ({ request, params: { id, courseId }, response }: HttpContextContract) {
    const course = await Course.query()
      .where('id', courseId)
      .andWhere('user_id', request.user!.id)
      .firstOrFail()

    await CourseLearnship.findOrFail(id)
    await course.related('learnship').detach([id])

    return response.noContent(undefined)
  }
}
