import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Courses extends BaseSchema {
  protected tableName = 'courses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 70).notNullable()
      table.string('thumbnail_url', 255).notNullable()
      table.string('description', 1000).nullable()
      table.string('short_description', 150).nullable()
      table.integer('minutes').defaultTo(0).notNullable().comment('Se for 0 = não definido')
      table.boolean('is_active').defaultTo(true).notNullable()
      table.integer('user_id').notNullable().comment('Teacher ID')

      table.timestamps(true)

      table.foreign('user_id').references('users.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
