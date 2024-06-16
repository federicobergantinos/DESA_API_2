const { ethers } = require('ethers');

class MetaMaskAccountCreator {
  static createAccount() {
    // Crear una billetera aleatoria
    const wallet = ethers.Wallet.createRandom();

    // Obtener la dirección de la billetera y la frase mnemónica
    const address = wallet.address;
    const mnemonic = wallet.mnemonic.phrase;
    const privateKey = wallet.privateKey;

    return {
      address,
      mnemonic,
      privateKey,
    };
  }
}

module.exports = MetaMaskAccountCreator;
