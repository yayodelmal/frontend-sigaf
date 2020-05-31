import Section from './Section'

export default class Activity {
  constructor(
    id = '',
    description = '',
    section = new Section(),
    weighing = ''
  ) {
    this.id = id
    this.description = description
    this.section = section
    this.weighing = weighing
  }
}
