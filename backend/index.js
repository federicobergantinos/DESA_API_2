require('dotenv').config()
const express = require('express')
const { dbConnection } = require('./configurations/database/config')

const app = express()
app.use(express.json())

dbConnection()
paths = {
  status: '/ping',
  loginV1: '/v1/auth',
  transactions: '/v1/transactions',
  users: '/v1/users',
  contacts: '/v1/contacts',
}

app.use(paths.status, require('./routes/healthCheck'))
app.use(paths.loginV1, require('./routes/auth'))
app.use(paths.transactions, require('./routes/transactions'))
app.use(paths.users, require('./routes/users'))
app.use(paths.contacts, require('./routes/contacts'))

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
