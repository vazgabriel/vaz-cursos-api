import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/renew-token', 'AuthController.renewToken').middleware('auth')
}).prefix('/auth')
