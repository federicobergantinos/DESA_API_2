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
Account.hasMany(Transaction, { as: 'transactions', foreignKey: 'accountId' }) // Una cuenta puede tener varias transacciones
Transaction.belongsTo(Account, { as: 'account', foreignKey: 'accountId' }) // Una transacción pertenece a una cuenta
Transaction.hasMany(Media, { as: 'media', foreignKey: 'transactionId' }) // Una transacción puede tener varios medios asociados
User.hasMany(Contact, { as: 'contact', foreignKey: 'userId' }) // Un usuario puede tener varios contactos
Contact.belongsTo(User, { as: 'user', foreignKey: 'userId' }) // Un contacto pertenece a un usuario

module.exports = {
  User,
  Transaction,
  Media,
  Authorization,
  Account,
  Contact,
}
