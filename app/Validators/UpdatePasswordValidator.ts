import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdatePasswordValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    oldPassword: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(255),
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(255),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public oldPasswordError = 'A senha antiga deve ter entre 6 e 255 caracteres'
  public passwordError = 'A senha nova deve ter entre 6 e 255 caracteres'

  public messages = {
    'oldPassword.required': this.oldPasswordError,
    'oldPassword.minLength': this.oldPasswordError,
    'oldPassword.maxLength': this.oldPasswordError,
    'password.required': this.passwordError,
    'password.minLength': this.passwordError,
    'password.maxLength': this.passwordError,
  }
}
