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
