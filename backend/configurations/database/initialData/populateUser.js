const { User, Account } = require('../../../entities/associateModels')
const createLogger = require('../../Logger')
const logger = createLogger(__filename)

const populateUser = async () => {
  const usersData = [
    {
      name: 'Federico',
      surname: 'Bergantinos',
      email: 'febergantinos@gmail.com',
      photoUrl:
        'https://fotos.perfil.com/2024/02/15/trim/1140/641/yeti-de-bruta-cocina-1755883.jpg',
      accounts: [
        {
          beneficiaryName: 'Federico Bergantinos',
          beneficiaryAddress: 'Lima 123, Buenos Aires, Argentina',
          accountNumber: '000123456789',
          accountType: 'Pesos',
          accountCurrency: 'ARS',
          accountStatus: 'validated',
        },
        {
          beneficiaryName: 'Federico Bergantinos',
          beneficiaryAddress: 'Lima 123, Buenos Aires, Argentina',
          accountNumber: '000275237492',
          accountType: 'Dolares',
          accountCurrency: 'USD',
          accountStatus: 'validated',
        },
        {
          beneficiaryName: 'Federico Bergantinos',
          beneficiaryAddress: 'Lima 123, Buenos Aires, Argentina',
          accountNumber: '000223458436',
          accountType: 'XCoin',
          accountCurrency: 'XCN',
          accountStatus: 'validated',
        },
      ],
    },
  ]

  try {
    for (const userData of usersData) {
      const { name, surname, email, photoUrl } = userData

      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: { name, surname, photoUrl },
      })

      if (user && created) {
        for (const accountData of userData.accounts) {
          await Account.create({ ...accountData, userId: user.id })
        }
      }
    }

    logger.info('Users and accounts have been populated.')
  } catch (error) {
    console.error('Error populating users and accounts:', error)
  }
}

module.exports = populateUser
