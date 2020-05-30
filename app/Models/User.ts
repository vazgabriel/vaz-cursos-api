import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, hasOne, HasOne, beforeSave } from '@ioc:Adonis/Lucid/Orm'

import Teacher from './Teacher'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public profileImage?: string

  @hasOne(() => Teacher)
  public teacher: HasOne<typeof Teacher>

  @column({ serializeAs: null })
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async validatePassword (password: string) {
    return await Hash.verify(this.password, password)
  }
}
