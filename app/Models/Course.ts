import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import CourseRate from './CourseRate'
import CourseClass from './CourseClass'
import CourseLearnship from './CourseLearnship'
import CourseRequirement from './CourseRequirement'

export default class Course extends BaseModel {
  public static table = 'courses'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public thumbnailUrl: string

  @column()
  public description: string

  @column()
  public shortDescription: string

  @column()
  public minutes: number

  @column({ serializeAs: null })
  public isActive: boolean

  @column({ serializeAs: null })
  public isPublic: boolean

  @column()
  public userId: number

  @belongsTo(() => User)
  public teacher: BelongsTo<typeof User>

  @manyToMany(() => CourseRequirement, {
    pivotTable: 'course_course_requirements',
    pivotForeignKey: 'course_id',
    pivotRelatedForeignKey: 'course_requirements_id',
  })
  public requirements: ManyToMany<typeof CourseRequirement>

  @manyToMany(() => CourseLearnship, {
    pivotTable: 'course_course_learnships',
    pivotForeignKey: 'course_id',
    pivotRelatedForeignKey: 'course_learnships_id',
  })
  public learnship: ManyToMany<typeof CourseLearnship>

  @hasMany(() => CourseRate)
  public reviews: HasMany<typeof CourseRate>

  @hasMany(() => CourseClass)
  public classes: HasMany<typeof CourseClass>

  /*
  double rate
  int students
  int totalReviews
  */

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
