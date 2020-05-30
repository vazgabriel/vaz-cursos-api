import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseClasses extends BaseSchema {
  protected tableName = 'course_classes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title', 70).notNullable()
      table.string('youtube_id', 50).notNullable()
      table.string('description', 255).notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.integer('course_id').notNullable()

      table.timestamps(true)

      table.foreign('course_id').references('courses.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
