import Route from '@ioc:Adonis/Core/Route'
import './rate'
import './classes'
import './learnship'
import './requirements'

Route.group(() => {
  Route.get('/', 'CoursesController.paginate')
  Route.get('/my', 'CoursesController.myCourses').middleware('auth')
  Route.get('/my/:id', 'CoursesController.myCourse').middleware('auth')
  Route.get('/:id', 'CoursesController.get')

  Route.post('/', 'CoursesController.create').middleware('authTeacher')
  Route.post('/subscribe/:id', 'CoursesController.subscribe').middleware('auth')

  Route.patch('/publish/:id', 'CoursesController.publish').middleware('auth')
  Route.patch('/unpublish/:id', 'CoursesController.unpublish').middleware('auth')
  Route.put('/:id', 'CoursesController.update').middleware('auth')
  Route.delete('/:id', 'CoursesController.delete').middleware('auth')
}).prefix('/course')
