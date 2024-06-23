const Whitelist = require('../entities/whitelist')

const isEmailInWhitelist = async (email) => {
  const whitelistEntry = await Whitelist.findOne({ where: { email } })
  return !!whitelistEntry
}

module.exports = { isEmailInWhitelist }
