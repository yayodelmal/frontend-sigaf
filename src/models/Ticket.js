import CourseRegisteredUser from './CourseRegisteredUser'
import TypeTicket from './TypeTicket'
import StatusTicket from './StatusTicket'
import SourceTicket from './SourceTicket'
import PriorityTicket from './PriorityTicket'
import MotiveTicket from './MotiveTicket'
import User from './User'
import StatusDetailTicket from './StatusDetailTicket'

export default class Ticket {
  constructor(
    id = '',
    courseRegisteredUser = new CourseRegisteredUser(),
    typeTicket = new TypeTicket(),
    statusTicket = new StatusTicket(),
    prioriryTicket = new PriorityTicket(),
    motiveTicket = new MotiveTicket(),
    sourceTicket = new SourceTicket(),
    userCreate = new User(),
    operatorTicket = new User(),
    clossingDate = '',
    ticketDetails = [new StatusDetailTicket()]
  ) {
    this.id = id
    this.courseRegisteredUser = courseRegisteredUser
    this.typeTicket = typeTicket
    this.statusTicket = statusTicket
    this.prioriryTicket = prioriryTicket
    this.motiveTicket = motiveTicket
    this.sourceTicket = sourceTicket
    this.userCreate = userCreate
    this.operatorTicket = operatorTicket
    this.clossingDate = clossingDate
    this.ticketDetails = ticketDetails
  }
}
