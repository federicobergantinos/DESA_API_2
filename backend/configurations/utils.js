function sendResponse(res, statusCode, data) {
  res.status(statusCode)
  res.setHeader('Content-Type', 'application/json')
  const responseBody = JSON.stringify({
    statusCode,
    data,
  })
  res.send(responseBody)
}

module.exports = {
  sendResponse,
}
