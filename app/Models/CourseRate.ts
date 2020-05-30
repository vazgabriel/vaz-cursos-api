import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Course from './Course'

export default class CourseRate extends BaseModel {
  public static table = 'course_rates'

  @column({ isPrimary: true })
  public id: number

  @column()
  public rate: number // 0-5 (podendo ser 2.5)

  @column()
  public description: string

  @column({ serializeAs: null })
  public isActive: boolean

  @column()
  public courseId: number

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @column()
  public ratedById: number

  @belongsTo(() => User, { foreignKey: 'rated_by_id' })
  public ratedBy: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
