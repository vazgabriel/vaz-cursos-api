import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CourseClassWatched extends BaseModel {
  public static table = 'course_class_watcheds'

  @column({ isPrimary: true })
  public courseClassId: number

  @column({ isPrimary: true })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
