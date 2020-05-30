import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseClassWatcheds extends BaseSchema {
  protected tableName = 'course_class_watcheds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('course_class_id').notNullable()
      table.integer('user_id').notNullable()

      table.timestamp('created_at').notNullable()

      table.foreign('course_class_id').references('course_classes.id')
      table.foreign('user_id').references('users.id')

      table.unique(['course_class_id', 'user_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
