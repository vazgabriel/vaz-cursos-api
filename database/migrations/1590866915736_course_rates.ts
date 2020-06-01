import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseRates extends BaseSchema {
  protected tableName = 'course_rates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('description', 255).notNullable()
      table.float('rate', 2, 1).notNullable().comment('3 | 4.5 | 0 | 3.5')
      table.boolean('is_active').defaultTo(true).notNullable()
      table.integer('rated_by_id').notNullable().comment('User ID')
      table.integer('course_id').notNullable()

      table.timestamps(true)

      table.foreign('course_id').references('courses.id')
      table.foreign('rated_by_id').references('users.id')

      table.unique(['course_id', 'rated_by_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
