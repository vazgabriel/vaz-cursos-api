import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CourseStudent extends BaseModel {
  public static table = 'course_students'

  @column({ isPrimary: true })
  public courseId: number

  @column({ isPrimary: true })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
