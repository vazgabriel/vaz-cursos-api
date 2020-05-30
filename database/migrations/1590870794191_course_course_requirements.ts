import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseCourseRequirements extends BaseSchema {
  protected tableName = 'course_course_requirements'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('course_id').notNullable()
      table.integer('course_requirements_id').notNullable()

      table.foreign('course_id').references('courses.id')
      table.foreign('course_requirements_id').references('course_requirements.id')

      table.unique(['course_id', 'course_requirements_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
