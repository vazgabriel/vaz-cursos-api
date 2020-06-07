import { v4 as uuid } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Course from 'App/Models/Course'
import CourseStudent from 'App/Models/CourseStudent'

import UtilsService from 'App/Services/UtilsService'
import SaveCourseValidator from 'App/Validators/SaveCourseValidator'

export default class CoursesController {
  public async paginate ({ request }: HttpContextContract) {
    let page = parseInt(request.only(['page']).page, 10)

    if (!page || isNaN(page)) {
      page = 1
    }

    return await Course
      .query()
      .select('id', 'name', 'short_description', 'thumbnail_url', 'user_id')
      .preload('teacher', q => q.select('name', 'profile_image'))
      .where('is_active', true)
      .andWhere('is_public', true)
      .paginate(page, 8)
  }

  public async myCourses ({ request }: HttpContextContract) {
    let page = parseInt(request.only(['page']).page, 10)

    if (!page || isNaN(page) || page < 1) {
      page = 1
    }

    const total = parseInt((
      await Course
        .query()
        .from('courses as c')
        .innerJoin('course_students as cs', 'cs.course_id', 'c.id')
        .where('cs.user_id', request.user!.id)
        .andWhere('c.is_active', true)
        .andWhere('c.is_public', true)
        .count('c.id', 'total')
    )[0].total, 10)

    const lastPage = Math.ceil(total / 8)

    const meta = {
      total,
      per_page: 8,
      current_page: page,
      last_page: lastPage,
      first_page: 1,
      first_page_url: total === 0 ? null : '/?page=1',
      last_page_url: total === 0 ? null : `/?page=${lastPage}`,
      next_page_url: page >= lastPage ? null : `/?page=${page + 1}`,
      previous_page_url: page === 1 ? null : `/?page=${page - 1}`,
    }

    const data = await Course
      .query()
      .select('c.id', 'c.name', 'c.short_description', 'c.thumbnail_url', 'c.user_id')
      .from('courses as c')
      .preload('teacher', q => q.select('name', 'profile_image'))
      .innerJoin('course_students as cs', 'cs.course_id', 'c.id')
      .where('cs.user_id', request.user!.id)
      .andWhere('c.is_active', true)
      .andWhere('c.is_public', true)
      .limit(8)
      .offset(8 * (page - 1))

    return {
      meta,
      data,
    }
  }

  public async subscribe ({ request, params: { id }, response }: HttpContextContract) {
    const course = await Course.findOrFail(id)

    if (course.userId === request.user!.id) {
      return response.unprocessableEntity(
        UtilsService.formatErrors(['Voce não pode se inscrever no próprio curso'])
      )
    }

    return response.created(
      await CourseStudent.create({
        courseId: id,
        userId: request.user!.id,
      })
    )
  }

  public async get ({ params: { id } }: HttpContextContract) {
    return this.getCourse(id)
  }

  public async myCourse ({ request: { user }, params: { id } }: HttpContextContract) {
    return this.getCourse(id, user)
  }

  private async getCourse (id: number, user?: User) {
    let baseQuery = Course.query()
      .select('id', 'name', 'thumbnail_url', 'description', 'minutes', 'user_id')
      .preload('requirements', q => q.select('description'))
      .preload('learnship', q => q.select('description'))
      .preload('teacher', q =>
        q.select('id', 'name', 'email', 'profile_image')
          .preload('teacher', qt => qt.select('short_description'))
      )
      .where('id', id)
      .andWhere('is_active', true)

    if (!user) {
      baseQuery = baseQuery.andWhere('is_public', true)
    } else {
      baseQuery = baseQuery.andWhere('user_id', user.id)
    }

    const course = (await baseQuery.firstOrFail()).toJSON()

    const { rows } = await Database.rawQuery(`
      SELECT
        (
          SELECT AVG(cr.rate) as rate
            FROM course_rates as cr
            WHERE cr.course_id = c.id AND cr.is_active = true
        ) as rate,
        (
          SELECT COUNT(cr.id) as total_reviews
            FROM course_rates as cr
            WHERE cr.course_id = c.id AND cr.is_active = true
        ) as total_reviews,
        (
          SELECT COUNT(cs.user_id) as students
            FROM course_students as cs
            WHERE cs.course_id = c.id
        ) as students
        FROM courses as c
        WHERE id = :id
    `, { id })

    const rate = parseFloat(rows[0].rate)

    course.rate = isNaN(rate) ? 0 : rate
    course.students = parseInt(rows[0].students, 10)
    course.totalReviews = parseInt(rows[0].total_reviews, 10)

    return course
  }

  // Authenticated
  public async create ({ request, response }: HttpContextContract) {
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

    let id = 0

    await Database.transaction(async (trx) => {
      const course = new Course()
      course.name = name
      course.description = description
      course.shortDescription = shortDescription
      course.minutes = minutes
      course.thumbnailUrl = thumbnailUrl
      course.userId = request.user!.id

      course.useTransaction(trx)
      await course.save()

      id = course.id

      let requirements = []
      let learnship = []

      if (data.requirements || data.learnship) {
        try {
          requirements = data.requirements ? JSON.parse(data.requirements) : []
          learnship = data.learnship ? JSON.parse(data.learnship) : []
        } catch (error) {}
      }

      if (requirements.length > 0) {
        await course.related('requirements').attach(requirements, trx)
      }

      if (learnship.length > 0) {
        await course.related('learnship').attach(learnship, trx)
      }
    })

    response.created(
      await Course
        .query()
        .preload('requirements')
        .preload('learnship')
        .where('id', id)
        .first()
    )
  }

  // Authenticated
  public async update ({ request, response, params }: HttpContextContract) {
    const course = await Course.query()
      .where('id', params.id)
      .andWhere('user_id', request.user!.id)
      .andWhere('is_active', true)
      .firstOrFail()

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

    await Database.transaction(async (trx) => {
      course.useTransaction(trx)

      if (requirements.length > 0) {
        await course.related('requirements').attach(requirements, trx)
      }

      if (learnship.length > 0) {
        await course.related('learnship').attach(learnship, trx)
      }

      await course.save()
    })

    await course.preload('requirements')
    await course.preload('learnship')

    return course
  }

  public async publish ({ request: { user }, params: { id } }: HttpContextContract) {
    return this.changePublic(user!, id, true)
  }

  public async unpublish ({ request: { user }, params: { id } }: HttpContextContract) {
    return this.changePublic(user!, id, false)
  }

  private async changePublic (user: User, id: number, toPublic: boolean) {
    const course = await Course.query()
      .where('id', id)
      .andWhere('user_id', user.id)
      .andWhere('is_active', true)
      .andWhere('is_public', !toPublic)
      .firstOrFail()

    course.isPublic = toPublic
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
      .andWhere('is_active', true)
      .firstOrFail()

    course.isActive = false
    await course.save()

    return response.noContent(undefined) // 204
  }
}
