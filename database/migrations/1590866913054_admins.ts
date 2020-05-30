import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Admins extends BaseSchema {
  protected tableName = 'admins'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('email', 150).unique().notNullable()
      table.string('password', 255).notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()

      table.timestamps(true)

      table.index('email')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
