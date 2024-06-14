// backend/configurations/database/initialData/populateMetamaskAccounts.js
const MetamaskAccount = require('../../../entities/metamaskAccount')
const createLogger = require('../../Logger')
const logger = createLogger(__filename)

const populateMetamaskAccounts = async () => {
  const accountsData = [
    {
      accountNumber: '0xbCF5801F122E7645F39bDd38Ce9253e208b7f0a8',
      used: false,
    },
    {
      accountNumber: '0x3C1e682E3C559FB1BFBA6EABd0FaDc3DB77D84aE',
      used: false,
    },
    {
      accountNumber: '0x2441a9f225f0f1f08BD0AE6231ffd5757564eCAe',
      used: false,
    },
    {
      accountNumber: '0x42C50F27a5467E38a1988e3D593E103c9d07E262',
      used: false,
    },
    {
      accountNumber: '0x62CB81FC37Eb7975919F2bd474095e80E56d8670',
      used: false,
    },
    {
      accountNumber: '0xEB6e87AEB4b05D16794775e57c8114d873c9B8e0',
      used: false,
    },
    {
      accountNumber: '0xe4cf6767eEa1AFd7Ea59358213799f561336FbfE',
      used: false,
    },
    {
      accountNumber: '0xC3C722C81ee8e61ed8591a49197C4AB603ff7aA5',
      used: false,
    },
    {
      accountNumber: '0x97f71e7818186b4D977B89cB4fFD6C927dC378e3',
      used: false,
    },
    {
      accountNumber: '0x2752a430B1aDD6789d4179D69A51B39Cc81DCf2d',
      used: false,
    },
  ]

  try {
    for (const accountData of accountsData) {
      await MetamaskAccount.create(accountData)
    }

    logger.info('Metamask accounts have been populated.')
  } catch (error) {
    console.error('Error populating Metamask accounts:', error)
  }
}

module.exports = populateMetamaskAccounts
