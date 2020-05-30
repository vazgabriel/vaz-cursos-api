import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateUserValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(70),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public nameError = 'Por favor envie um nome entre 3 e 70 caracteres'

  public messages = {
    'name.required': this.nameError,
    'name.maxLength': this.nameError,
    'name.minLength': this.nameError,
  }
}
