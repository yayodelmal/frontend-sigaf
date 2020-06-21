import Platform from './Platform'

export default class Category {
  constructor(
    id = '',
    description = '',
    idCategoryMoodle = '',
    platform = new Platform(),
    status = ''
  ) {
    this.id = id
    this.description = description
    this.idCategoryMoodle = idCategoryMoodle
    this.platform = platform
    this.status = status
  }
}
