import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class RequestTeacherValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    description: schema.string({ trim: true }, [
      rules.minLength(50),
      rules.maxLength(1000),
    ]),
    shortDescription: schema.string({ trim: true }, [
      rules.maxLength(150),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public descriptionError = 'Por favor envie uma descrição entre 50 e 1000 caracteres'
  public shortDescriptionError = 'Por favor envie uma descrição curta de no máximo 150 caracteres'

  public messages = {
    'description.required': this.descriptionError,
    'description.minLength': this.descriptionError,
    'description.maxLength': this.descriptionError,
    'shortDescription.required': this.shortDescriptionError,
    'shortDescription.maxLength': this.shortDescriptionError,
  }
}
