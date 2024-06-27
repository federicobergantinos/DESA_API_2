// testMetaMaskAccountCreator.js
const {
  MetaMaskAccountCreator
} = require('./MetaMaskAccountCreator');

const testCreateAccount = async () => {
  try {
    const account = await MetaMaskAccountCreator.createAccount()
    console.log('Account created:', account)
  } catch (error) {
    console.error('Error creating account:', error)
  }
}

testCreateAccount()
