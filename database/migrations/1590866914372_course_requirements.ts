import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseRequirements extends BaseSchema {
  protected tableName = 'course_requirements'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('description', 50).unique().notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()

      table.timestamps(true)

      table.index('description')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
