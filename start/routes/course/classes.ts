import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:courseId', 'CourseClassesController.paginate')
  Route.get('/detail/:classId', 'CourseClassesController.get')

  Route.patch('/see/:classId', 'CourseClassesController.see').middleware('auth')
  Route.patch('/unsee/:classId', 'CourseClassesController.unsee').middleware('auth')

  Route.patch('/reorder/:courseId/:classId', 'CourseClassesController.reorder').middleware('authTeacher')
  Route.post('/:courseId', 'CourseClassesController.create').middleware('authTeacher')
  Route.put('/:courseId/:classId', 'CourseClassesController.update').middleware('authTeacher')
  Route.delete('/:courseId/:classId', 'CourseClassesController.delete').middleware('authTeacher')
}).prefix('/course-class')
