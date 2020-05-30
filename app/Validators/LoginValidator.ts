import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class LoginValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(255),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public emailError = 'Por favor, envia um email válido'
  public passwordError = 'Por favor envie uma senha entre 6 e 255 caracteres'

  public messages = {
    'email.required': this.emailError,
    'email.email': this.emailError,
    'email.maxLength': this.emailError,
    'password.required': this.passwordError,
    'password.minLength': this.passwordError,
    'password.maxLength': this.passwordError,
  }
}
