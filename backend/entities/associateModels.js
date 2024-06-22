const User = require('./user')
const Transaction = require('./transaction')
const Media = require('./media')
const Authorization = require('./auth')
const Account = require('./account')
const Contact = require('./contact')
const Mission = require('./mission')
const MetamaskAccount = require('./metamaskAccount')
const ExchangeRate = require('./exchangeRate')
const Benefit = require('./benefits')
const UserTokens = require('./userTokens')

// Relaciones
Authorization.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(Account, { as: 'account', foreignKey: 'userId' }) // Un usuario puede tener varias cuentas
Account.belongsTo(User, { as: 'user', foreignKey: 'userId' }) // Una cuenta pertenece a un usuario
User.hasMany(Contact, { as: 'contact', foreignKey: 'userId' }) // Un usuario puede tener varios contactos
Contact.belongsTo(User, { as: 'user', foreignKey: 'userId' }) // Un contacto pertenece a un usuario

User.hasMany(Mission, { as: 'missions', foreignKey: 'userId' }) // Un usuario puede tener varias misiones
Mission.belongsTo(User, { as: 'user', foreignKey: 'userId' }) // Una misión pertenece a un usuario

UserTokens.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(UserTokens, { as: 'tokens', foreignKey: 'userId' })

// Opcional, dependiendo de cómo quieras acceder a los datos relacionados
Transaction.belongsTo(Account, {
  foreignKey: 'accountNumberOrigin',
  targetKey: 'accountNumber',
})

Account.hasMany(Transaction, {
  foreignKey: 'accountNumberOrigin',
  sourceKey: 'accountNumber',
})

module.exports = {
  User,
  Transaction,
  Account,
  Contact,
  Mission,
  MetamaskAccount,
  ExchangeRate,
  Benefit,
  UserTokens,
}
