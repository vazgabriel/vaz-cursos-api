import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CourseLearnshipsController.paginate')
  Route.post('/', 'CourseLearnshipsController.create').middleware('authTeacher')
  Route.delete('/remove-course/:id/:courseId', 'CourseLearnshipsController.removeFromCourse').middleware('authTeacher')
}).prefix('/course-learnship')
