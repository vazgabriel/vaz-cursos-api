import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.patch('/', 'UsersController.update').middleware('auth')
  Route.patch('/update-photo', 'UsersController.updatePhoto').middleware('auth')
  Route.patch('/update-password', 'UsersController.updatePassword').middleware('auth')
  Route.delete('/', 'UsersController.delete').middleware('auth')
}).prefix('/user')
