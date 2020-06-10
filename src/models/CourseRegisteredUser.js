import Course from './Course'
import RegisteredUser from './RegisteredUser'
import Profile from './Profile'
import Classroom from './Classroom'
import FinalStatus from './FinalStatus'

export default class CourseRegisteredUser {
  constructor(
    id = '',
    course = new Course(),
    registeredUser = new RegisteredUser(),
    profile = new Profile(),
    classroom = new Classroom(),
    finalStatus = new FinalStatus(),
    finalQualification = '',
    finalQualificationMoodle = '',
    lastAccessRegisteredMoodle = ''
  ) {
    this.id = id
    this.course = course
    this.registeredUser = registeredUser
    this.profile = profile
    this.classroom = classroom
    this.finalStatus = finalStatus
    this.finalQualification = finalQualification
    this.finalQualificationMoodle = finalQualificationMoodle
    this.lastAccessRegisteredMoodle = lastAccessRegisteredMoodle
  }
}
