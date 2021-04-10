export const Snackbar = {
  SUCCESS: {
    type: 'success',
    message: 'Operación realizada con éxito.'
  },
  ERROR: {
    type: 'error',
    message: 'Ha ocurrido un error.'
  },
  INFO: 'info',
  WARNING: {
    type: 'warning'
  }
}

export const Message = {
  SUCCESS: 'Operación realizada con éxito.',
  ERROR: 'Ha ocurrido un error. Contacte al administrador'
}

export function groupBy(objectArray, property) {
  return objectArray.reduce(function(accumulator, object) {
    let key = object[property]
    if (!accumulator[key]) {
      accumulator[key] = []
    }
    accumulator[key].push(object)
    return accumulator
  }, {})
}

export const currentDate = new Date()
  .toLocaleString('es-ES', { timeZone: 'America/Santiago' })
  .substr(0, 9)

export const setTimer = ms => new Promise(res => setTimeout(res, ms))

export const mapUser = (user, sections) => {
  if (user.activity_course_users.length !== 0) {
    let state = 'ACTIVO'
    let progress = 0
    const activities = user.activity_course_users
      .map(activity => {
        if (activity) {
          if (
            activity.activity.section.description === 'Renuncia' &&
            activity.status_moodle === 'Finalizado'
          ) {
            state = 'Renunciado'.toUpperCase()
          }

          if (
            activity.activity.section.description === 'Renuncia' &&
            activity.status_moodle === 'En curso'
          ) {
            state = 'Renuncia en curso'.toUpperCase()
          }

          let checkQualificationMoodle = ['', '-']
          if (
            !checkQualificationMoodle.includes(activity.qualification_moodle) &&
            activity.activity.weighing !== 0
          ) {
            progress++
          }

          return {
            qualificationMoodle: activity.qualification_moodle,
            statusMoodle: activity.status_moodle,
            description: activity.activity.description,
            idActivityMoodle: activity.activity.id_activity_moodle,
            idSection: activity.activity.section_id,
            section: activity.activity.section.description,
            type: activity.activity.type,
            weighing: activity.activity.weighing
          }
        } else {
          return activity
        }
      })
      .filter(activity => {
        if (activity) {
          return activity.section !== 'Formativa'
        }
      })

    const totalProgress = sections
      .filter(section => {
        const filterSection = [
          'Formativa',
          'Renuncia',
          'Pre Test A',
          'Pre Test B',
          'Post Test A',
          'Post Test B',
          'Encuesta'
        ]
        return !filterSection.includes(section.description)
      })
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.numberActivities,
        0
      )

    const accumulativeProgress = Number.parseFloat(
      (progress / totalProgress) * 100
    ).toFixed(0)
    user['state'] = state
    user['progress'] = accumulativeProgress
    user['activities'] = groupBy(activities, 'idSection')
  } else {
    user['state'] = 'Sin actividades sincronizadas'
    user['progress'] = 0
    user['activities'] = []
  }
  user[
    'fullname'
  ] = `${user.registered_user.name} ${user.registered_user.last_name} ${user.registered_user.mother_last_name}`

  user['rut'] = `${user.registered_user.rut}`
  user['mobile'] = `${user.registered_user.mobile}`
  user['email'] = `${user.registered_user.email}`
  user['classroom'] = `${user.classroom.description}`
  return user
}
