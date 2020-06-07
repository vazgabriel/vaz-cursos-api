import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Course from './Course'
import User from './User'

export default class CourseClass extends BaseModel {
  public static table = 'course_classes'

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public youtubeId: string // ID do video do youtube (https://www.youtube.com/watch?v=[6woiUEM6q-s])

  @column()
  public description: string

  @column()
  public order: number

  @column({ serializeAs: null })
  public isActive: boolean

  @column()
  public courseId: number

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @manyToMany(() => User, {
    pivotTable: 'course_class_watcheds',
    pivotForeignKey: 'course_class_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['created_at'],
  })
  public watchedBy: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
