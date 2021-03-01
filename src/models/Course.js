export default class Course {
  constructor(
    id = '',
    description = '',
    email = '',
    password = '',
    idCourseMoodle = '',
    category = null,
    status = ''
  ) {
    this.id = id
    this.description = description
    this.email = email
    this.password = password
    this.idCourseMoodle = idCourseMoodle
    this.category = category
    this.status = status
  }
}
