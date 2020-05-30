import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class RegisterValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(70),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.maxLength(255),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(255),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public nameError = 'Por favor envie um nome entre 3 e 70 caracteres'
  public emailError = 'Por favor, envia um email válido'
  public emailUniqueError = 'Esse email já existe'
  public passwordError = 'Por favor envie uma senha entre 6 e 255 caracteres'

  public messages = {
    'name.required': this.nameError,
    'name.maxLength': this.nameError,
    'name.minLength': this.nameError,
    'email.required': this.emailError,
    'email.email': this.emailError,
    'email.maxLength': this.emailError,
    'email.unique': this.emailUniqueError,
    'password.required': this.passwordError,
    'password.minLength': this.passwordError,
    'password.maxLength': this.passwordError,
  }
}
