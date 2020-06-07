import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Course from 'App/Models/Course'
import CourseRequirement from 'App/Models/CourseRequirement'

import UtilsService from 'App/Services/UtilsService'
import DescriptionValidator from 'App/Validators/DescriptionValidator'

export default class CourseRequirementsController {
  public async paginate ({ request }: HttpContextContract) {
    let { page, search } = request.only(['page', 'search'])

    page = parseInt(page, 10)
    search = (search || '').toUpperCase()

    if (!page || isNaN(page)) {
      page = 1
    }

    let baseQuery = CourseRequirement
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

    const existentRequirement = await CourseRequirement.findBy('description', description)
    if (existentRequirement) {
      return existentRequirement
    }

    const requirement = await CourseRequirement.create({ description })

    if (!requirement.$isPersisted) {
      return response.internalServerError(
        UtilsService.formatErrors(['Ocorreu um erro não esperado ao salvar o requerimento']),
      )
    }

    return requirement
  }

  public async removeFromCourse ({ request, params: { id, courseId }, response }: HttpContextContract) {
    const course = await Course.query()
      .where('id', courseId)
      .andWhere('user_id', request.user!.id)
      .firstOrFail()

    await CourseRequirement.findOrFail(id)
    await course.related('requirements').detach([id])

    return response.noContent(undefined)
  }
}
