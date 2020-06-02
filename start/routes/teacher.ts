import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/request-teacher', 'TeachersController.requestTeacher').middleware('auth')
  Route.put('/', 'TeachersController.update').middleware('auth')
}).prefix('/teacher')
