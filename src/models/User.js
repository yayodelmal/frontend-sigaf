export default class User {
  constructor(
    id = '',
    rut = '',
    name = '',
    phone = '',
    mobile = '',
    email = 'sa@sigaf.com',
    role = null,
    password = 'sigaf',
    isFirstLogin = '',
    role_id = ''
  ) {
    this.id = id
    this.rut = rut
    this.name = name
    this.phone = phone
    this.mobile = mobile
    this.email = email
    this.role = role
    this.password = password
    this.isFirstLogin = isFirstLogin
    this.role_id = role_id
  }
}
