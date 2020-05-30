import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 70).notNullable()
      table.string('email', 150).unique().notNullable()
      table.string('password', 255).notNullable()
      table.string('profile_image', 255).nullable()
      table.boolean('is_active').defaultTo(true).notNullable()

      table.timestamps(true)

      table.index('email')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
