import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class DescriptionValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    description: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(50),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public descriptionError = 'Por favor envie uma descrição entre 3 e 50 caracteres'

  public messages = {
    'description.required': this.descriptionError,
    'description.minLength': this.descriptionError,
    'description.maxLength': this.descriptionError,
  }
}
