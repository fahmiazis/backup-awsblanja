module.exports = {
  response: (message, additionalData, status = true) => {
    return response.send({
      success,
      message: message || 'success',
      ...additionalData
    })
  }
}
