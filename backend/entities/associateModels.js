const User = require('./user')
const Transaction = require('./transaction')
const Media = require('./media')
const Authorization = require('./auth')
const Account = require('./account')
const Contact = require('./contact')

// Relaciones
Authorization.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(Account, { as: 'account', foreignKey: 'userId' }) // Un usuario puede tener varias cuentas
Account.belongsTo(User, { as: 'user', foreignKey: 'userId' }) // Una cuenta pertenece a un usuario
Transaction.hasMany(Media, { as: 'media', foreignKey: 'transactionId' }) // Una transacción puede tener varios medios asociados
User.hasMany(Contact, { as: 'contact', foreignKey: 'userId' }) // Un usuario puede tener varios contactos
Contact.belongsTo(User, { as: 'user', foreignKey: 'userId' }) // Un contacto pertenece a un usuario

// Opcional, dependiendo de cómo quieras acceder a los datos relacionados
Transaction.belongsTo(Account, {
  foreignKey: 'accountNumber',
  targetKey: 'accountNumber',
Account.hasMany(Transaction, {
  foreignKey: 'accountNumber',
  sourceKey: 'accountNumber',
})

module.exports = {
  User,
  Transaction,
  Account,
  Contact,
}
