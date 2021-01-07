export default class Category {
  constructor(
    id = '',
    description = '',
    idCategoryMoodle = '',
    platform = null,
    status = ''
  ) {
    this.id = id
    this.description = description
    this.idCategoryMoodle = idCategoryMoodle
    this.platform = platform
    this.status = status
  }
}
