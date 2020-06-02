import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SaveRateValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    description: schema.string({ trim: true }, [
      rules.minLength(10),
      rules.maxLength(255),
    ]),
    rate: schema.number([
      rules.unsigned(),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public validationError = 'Por favor envie uma avaliação válida'

  public messages = {
    'description.required': this.validationError,
    'description.minLength': this.validationError,
    'description.maxLength': this.validationError,
    'rate.required': this.validationError,
    'rate.unsigned': this.validationError,
  }
}
