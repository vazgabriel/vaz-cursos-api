import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:teacherId', 'TeachersController.get')
  Route.post('/request-teacher', 'TeachersController.requestTeacher').middleware('auth')
  Route.put('/', 'TeachersController.update').middleware('authTeacher')
}).prefix('/teacher')
