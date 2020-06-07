import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SaveCourseClassValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.minLength(8),
      rules.maxLength(70),
    ]),
    description: schema.string({ trim: true }, [
      rules.minLength(10),
      rules.maxLength(255),
    ]),
    youtubeId: schema.string({ trim: true }, [
      rules.maxLength(50),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public invalidBodyError = 'Por favor, envia uma aula válida'

  public messages = {
    'title.required': this.invalidBodyError,
    'title.minLength': this.invalidBodyError,
    'title.maxLength': this.invalidBodyError,
    'description.required': this.invalidBodyError,
    'description.minLength': this.invalidBodyError,
    'description.maxLength': this.invalidBodyError,
    'youtubeId.required': this.invalidBodyError,
    'youtubeId.maxLength': this.invalidBodyError,
  }
}
