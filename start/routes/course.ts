import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CoursesController.paginate')
  Route.get('/my', 'CoursesController.myCourses').middleware('auth')
  Route.get('/my/:id', 'CoursesController.myCourse').middleware('auth')
  Route.get('/:id', 'CoursesController.get')

  Route.post('/', 'CoursesController.create').middleware('auth')
  Route.post('/subscribe/:id', 'CoursesController.subscribe').middleware('auth')

  Route.patch('/publish/:id', 'CoursesController.publish').middleware('auth')
  Route.patch('/unpublish/:id', 'CoursesController.unpublish').middleware('auth')
  Route.put('/:id', 'CoursesController.update').middleware('auth')
  Route.delete('/:id', 'CoursesController.delete').middleware('auth')

  Route.group(() => {
    Route.get('/:courseId', 'CourseRatesController.paginate')
    Route.get('/my/:courseId', 'CourseRatesController.myRate').middleware('auth')
    Route.post('/:courseId', 'CourseRatesController.create').middleware('auth')
    Route.put('/:rateId', 'CourseRatesController.update').middleware('auth')
    Route.delete('/:rateId', 'CourseRatesController.delete').middleware('auth')
  }).prefix('/rate')
}).prefix('/course')
