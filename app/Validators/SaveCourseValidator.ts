import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SaveCourseValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(8),
      rules.maxLength(70),
    ]),
    description: schema.string({ trim: true }, [
      rules.minLength(30),
      rules.maxLength(1000),
    ]),
    shortDescription: schema.string({ trim: true }, [
      rules.minLength(30),
      rules.maxLength(150),
    ]),
    minutes: schema.number([
      rules.unsigned(),
    ]),
    requirements: schema.string({ trim: true }),
    learnship: schema.string({ trim: true }),
  })

  public cacheKey = this.ctx.routeKey

  public invalidBodyError = 'Por favor, envia um curso válido'

  public messages = {
    'name.required': this.invalidBodyError,
    'name.minLength': this.invalidBodyError,
    'name.maxLength': this.invalidBodyError,
    'description.required': this.invalidBodyError,
    'description.minLength': this.invalidBodyError,
    'description.maxLength': this.invalidBodyError,
    'shortDescription.required': this.invalidBodyError,
    'shortDescription.minLength': this.invalidBodyError,
    'shortDescription.maxLength': this.invalidBodyError,
    'minutes.required': this.invalidBodyError,
    'requirements.required': this.invalidBodyError,
    'learnship.required': this.invalidBodyError,
  }
}
