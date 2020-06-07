import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CourseRequirementsController.paginate')
  Route.post('/', 'CourseRequirementsController.create').middleware('authTeacher')
  Route.delete('/remove-course/:id/:courseId', 'CourseRequirementsController.removeFromCourse').middleware('authTeacher')
}).prefix('/course-requirement')
