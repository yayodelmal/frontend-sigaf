import Category from './Category'

export default class Course {
  constructor(
    id = '',
    description = '',
    idCourseMoodle = '',
    category = new Category(),
    status = ''
  ) {
    this.id = id
    this.description = description
    this.idCourseMoodle = idCourseMoodle
    this.category = category
    this.status = status
  }
}
