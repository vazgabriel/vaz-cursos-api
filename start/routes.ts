/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/renew-token', 'AuthController.renewToken').middleware('auth')
}).prefix('/auth')

Route.group(() => {
  Route.post('/request-teacher', 'TeachersController.requestTeacher').middleware('auth')
  Route.put('/', 'TeachersController.update').middleware('auth')
}).prefix('/teacher')

Route.group(() => {
  Route.patch('/', 'UsersController.update').middleware('auth')
  Route.patch('/update-photo', 'UsersController.updatePhoto').middleware('auth')
  Route.patch('/update-password', 'UsersController.updatePassword').middleware('auth')
  Route.delete('/', 'UsersController.delete').middleware('auth')
}).prefix('/user')

Route.group(() => {
  Route.get('/paginate', 'CoursesController.paginate')
  Route.get('/my', 'CoursesController.myCourses').middleware('auth')
  Route.get('/:id', 'CoursesController.get')

  Route.post('/', 'CoursesController.create').middleware('auth')

  Route.put('/:id', 'CoursesController.update').middleware('auth')
  Route.delete('/:id', 'CoursesController.delete').middleware('auth')
}).prefix('/course')
