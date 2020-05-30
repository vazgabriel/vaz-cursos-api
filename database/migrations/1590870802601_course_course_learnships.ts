import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseCourseLearnships extends BaseSchema {
  protected tableName = 'course_course_learnships'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('course_id').notNullable()
      table.integer('course_learnships_id').notNullable()

      table.foreign('course_id').references('courses.id')
      table.foreign('course_learnships_id').references('course_learnships.id')

      table.unique(['course_id', 'course_learnships_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
