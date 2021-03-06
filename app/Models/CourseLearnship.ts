import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CourseLearnship extends BaseModel {
  public static table = 'course_learnships'

  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column({ serializeAs: null })
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
