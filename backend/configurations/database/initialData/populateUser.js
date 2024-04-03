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
          accountType: 'Checking',
        },
        {
          beneficiaryName: 'Federico Bergantinos',
          beneficiaryAddress: 'Lima 123, Buenos Aires, Argentina',
          accountNumber: '000275237492',
          accountType: 'Saving',
        },
      ],
    },
    {
      name: 'Lucía',
      surname: 'Mendez',
      email: 'lucia.mendez@example.com',
      photoUrl: 'https://example.com/photos/lucia-mendez.jpg',
      accounts: [
        {
          beneficiaryName: 'Lucía Mendez',
          beneficiaryAddress:
            'Avenida Siempre Viva 742, Buenos Aires, Argentina',
          accountNumber: '000987654321',
          accountType: 'Savings',
        },
      ],
    },
    {
      name: 'Carlos',
      surname: 'Díaz',
      email: 'carlos.diaz@example.com',
      photoUrl: 'https://example.com/photos/carlos-diaz.jpg',
      accounts: [
        {
          beneficiaryName: 'Carlos Díaz',
          beneficiaryAddress: 'Calle Falsa 123, Córdoba, Argentina',
          accountNumber: '001234567890',
          accountType: 'Checking',
        },
      ],
    },
    {
      name: 'Mariana',
      surname: 'Lopez',
      email: 'mariana.lopez@example.com',
      photoUrl: 'https://example.com/photos/mariana-lopez.jpg',
      accounts: [
        {
          beneficiaryName: 'Mariana Lopez',
          beneficiaryAddress: 'Boulevard Los Olivos 908, Mendoza, Argentina',
          accountNumber: '002345678901',
          accountType: 'Savings',
        },
      ],
    },
    {
      name: 'Jorge',
      surname: 'Gonzalez',
      email: 'jorge.gonzalez@example.com',
      photoUrl: 'https://example.com/photos/jorge-gonzalez.jpg',
      accounts: [
        {
          beneficiaryName: 'Jorge Gonzalez',
          beneficiaryAddress: 'Pasaje Libertad 456, Rosario, Argentina',
          accountNumber: '003456789012',
          accountType: 'Checking',
        },
      ],
    },
    {
      name: 'Sofía',
      surname: 'Martinez',
      email: 'sofia.martinez@example.com',
      photoUrl: 'https://example.com/photos/sofia-martinez.jpg',
      accounts: [
        {
          beneficiaryName: 'Sofía Martinez',
          beneficiaryAddress: 'Ruta del Sol 789, Mar del Plata, Argentina',
          accountNumber: '004567890123',
          accountType: 'Savings',
        },
      ],
    },
  ]

  try {
    for (const userData of usersData) {
      const user = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
      })

      if (user && user[0]) {
        for (const accountData of userData.accounts) {
          await Account.create({ ...accountData, userId: user[0].id })
        }
      }
    }

    logger.info('Users and accounts have been populated.')
  } catch (error) {
    logger.error('Error populating users and accounts:', error)
  }
}

module.exports = populateUser
