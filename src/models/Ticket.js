import CourseRegisteredUser from './CourseRegisteredUser'
import TypeTicket from './TypeTicket'
import StatusTicket from './StatusTicket'
import PriorityTicket from './PriorityTicket'
import MotiveTicket from './MotiveTicket'
import User from './User'

export default class Ticket {
  constructor(
    id = '',
    courseRegisteredUser = new CourseRegisteredUser(),
    typeTicket = new TypeTicket(),
    statusTicket = new StatusTicket(),
    prioriryTicket = new PriorityTicket(),
    motiveTicket = new MotiveTicket(),
    userCreate = new User(),
    operatorTicket = new User(),
    clossingDate = '',
    observation = ''
  ) {
    this.id = id
    this.courseRegisteredUser = courseRegisteredUser
    this.typeTicket = typeTicket
    this.statusTicket = statusTicket
    this.prioriryTicket = prioriryTicket
    this.motiveTicket = motiveTicket
    this.userCreate = userCreate
    this.operatorTicket = operatorTicket
    this.clossingDate = clossingDate
    this.observation = observation
  }
}
