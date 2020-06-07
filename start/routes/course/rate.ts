import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:courseId', 'CourseRatesController.paginate')
  Route.get('/my/:courseId', 'CourseRatesController.myRate').middleware('auth')
  Route.post('/:courseId', 'CourseRatesController.create').middleware('auth')
  Route.put('/:rateId', 'CourseRatesController.update').middleware('auth')
  Route.delete('/:rateId', 'CourseRatesController.delete').middleware('auth')
}).prefix('/course-rate')
