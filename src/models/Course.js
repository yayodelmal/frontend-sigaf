export default class Course {
  constructor(
    id = '',
    description = '',
    idCourseMoodle = '',
    category = null,
    status = ''
  ) {
    this.id = id
    this.description = description
    this.idCourseMoodle = idCourseMoodle
    this.category = category
    this.status = status
  }
}
