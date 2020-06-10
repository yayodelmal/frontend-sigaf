import Ticket from './Ticket'
import User from './User'
import StatusDetailTicket from './StatusDetailTicket'

export default class DetailTicket {
  constructor(
    id = '',
    ticket = new Ticket(),
    userCreated = new User(),
    statusDeailTicket = new StatusDetailTicket(),
    comment = '',
    createdAt = ''
  ) {
    this.id = id
    this.ticket = ticket
    this.userCreated = userCreated
    this.statusDeailTicket = statusDeailTicket
    this.comment = comment
    this.createdAt = createdAt
  }
}
