import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseStudents extends BaseSchema {
  protected tableName = 'course_students'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('course_id').notNullable()
      table.integer('user_id').notNullable()

      table.timestamp('created_at').notNullable()

      table.foreign('course_id').references('courses.id')
      table.foreign('user_id').references('users.id')

      table.unique(['course_id', 'user_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
