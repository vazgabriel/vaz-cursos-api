import { v4 as uuid } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Course from 'App/Models/Course'
import UtilsService from 'App/Services/UtilsService'
import SaveCourseValidator from 'App/Validators/SaveCourseValidator'

/*
Read (paginacao)/Read By Id/Create/Update/Delete
*/

export default class CoursesController {
  public async paginate ({ request }: HttpContextContract) {

  }

  public async get ({ params: { id } }: HttpContextContract) {
    return await Course.query()
      .select('id', 'name', 'thumbnail_url', 'description', 'minutes', 'user_id')
      .preload('requirements', q => q.select('description'))
      .preload('learnship', q => q.select('description'))
      .preload('teacher', q =>
        q.select('id', 'name', 'email', 'profile_image')
          .preload('teacher', qt => qt.select('short_description'))
      )
      .where('id', id)
      .first()
  }

  /**
   * @TODO Criar com transaction
   */
  // Authenticated
  public async create ({ request, response }: HttpContextContract) {
    await request.user!.preload('teacher')

    if (!request.user!.teacher) {
      return response.forbidden(
        UtilsService.formatErrors(['Voce não é um professor'])
      )
    }

    const data = await request.validate(SaveCourseValidator)

    if (data.minutes < 0 || data.minutes > 99999) {
      return response.unprocessableEntity(
        UtilsService.formatErrors(['Os minutos devem ser entre 0 e 99999'])
      )
    }

    const thumbnail = request.file('thumbnail', {
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!thumbnail || thumbnail.hasErrors) {
      return thumbnail?.hasErrors ? thumbnail?.errors : UtilsService.formatErrors(
        ['Por favor, envia um curso válido']
      )
    }

    const path = Application.makePath('..', 'uploads', 'thumbnails')
    const fileName = `${uuid()}.${thumbnail.extname}`

    await thumbnail.move(path, {
      name: fileName,
    })

    const thumbnailUrl = `${Env.get('BASE_URL') as string}/thumbnails/${fileName}`

    const { name, description, shortDescription, minutes } = data

    const course = await Course.create({
      name,
      description,
      shortDescription,
      minutes,
      thumbnailUrl,
      userId: request.user!.id,
    })

    let requirements = []
    let learnship = []

    if (data.requirements || data.learnship) {
      try {
        requirements = data.requirements ? JSON.parse(data.requirements) : []
        learnship = data.learnship ? JSON.parse(data.learnship) : []
      } catch (error) {}
    }

    if (requirements.length > 0) {
      await course.related('requirements').attach(requirements)
      await course.preload('requirements')
    }

    if (learnship.length > 0) {
      await course.related('learnship').attach(learnship)
      await course.preload('learnship')
    }

    return response.created(course)
  }

  /**
   * @TODO Criar com transaction
   */
  // Authenticated
  public async update ({ request, response, params }: HttpContextContract) {
    const course = await Course.query()
      .where('id', params.id)
      .andWhere('user_id', request.user!.id)
      .first()

    if (!course || !course.isActive) {
      return response.notFound(
        UtilsService.formatErrors(['Curso não encontrado'])
      )
    }

    const data = await request.validate(SaveCourseValidator)

    if (data.minutes < 0 || data.minutes > 99999) {
      return response.unprocessableEntity(
        UtilsService.formatErrors(['Os minutos devem ser entre 0 e 99999'])
      )
    }

    const thumbnail = request.file('thumbnail', {
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (thumbnail && thumbnail.hasErrors) {
      return thumbnail?.hasErrors ? thumbnail?.errors : UtilsService.formatErrors(
        ['Por favor, envia um curso válido']
      )
    }

    let thumbnailUrl = ''
    if (thumbnail) {
      const path = Application.makePath('..', 'uploads', 'thumbnails')
      const fileName = `${uuid()}.${thumbnail.extname}`

      await thumbnail.move(path, {
        name: fileName,
      })

      thumbnailUrl = `${Env.get('BASE_URL') as string}/thumbnails/${fileName}`
    }

    course.name = data.name
    course.description = data.description
    course.shortDescription = data.shortDescription
    course.minutes = data.minutes

    if (thumbnailUrl !== '') {
      course.thumbnailUrl = thumbnailUrl
    }

    let requirements = []
    let learnship = []

    if (data.requirements || data.learnship) {
      try {
        requirements = data.requirements ? JSON.parse(data.requirements) : []
        learnship = data.learnship ? JSON.parse(data.learnship) : []
      } catch (error) {}
    }

    if (requirements.length > 0) {
      await course.related('requirements').attach(requirements)
    }

    if (learnship.length > 0) {
      await course.related('learnship').attach(learnship)
    }

    await course.save()

    await course.preload('requirements')
    await course.preload('learnship')

    return course
  }

  // Authenticated
  public async delete ({ request, response, params }: HttpContextContract) {
    const course = await Course.query()
      .where('id', params.id)
      .andWhere('user_id', request.user!.id)
      .first()

    if (!course || !course.isActive) {
      return response.notFound(
        UtilsService.formatErrors(['Curso não encontrado'])
      )
    }

    course.isActive = false
    await course.save()

    return response.noContent(undefined) // 204
  }
}
