const { ethers } = require('ethers');

// Reemplaza con tu Project ID de Infura
const INFURA_PROJECT_ID = '939b9916d0e4476d8fc70c6f0d41dcc2';

const provider = new ethers.providers.InfuraProvider('sepolia', INFURA_PROJECT_ID);

// Clave privada de la cuenta principal en Sepolia (debe estar segura)
const mainWalletPrivateKey = '0x073f9669358e93dc3ee53702ff6f0c6bb401ff88c1b959e4c64e5d67e54afc31';

// Crear una wallet principal usando el provider de Sepolia
const mainWallet = new ethers.Wallet(mainWalletPrivateKey, provider);

class MetaMaskAccountCreator {
  static async createAccount() {
    const wallet = ethers.Wallet.createRandom();

    const address = wallet.address;
    const mnemonic = wallet.mnemonic.phrase;
    const privateKey = wallet.privateKey.replace('0x', '');

    return {
      address,
      mnemonic,
      privateKey,
    };
  }
}

const transferGasToAccount = async (accountAddress, amountInEth) => {
  try {
    // Crear una transacción para enviar fondos desde la wallet principal
    const tx = {
      to: accountAddress,
      value: ethers.utils.parseEther(amountInEth), // Cantidad en ETH a enviar
    };

    // Enviar la transacción
    const transactionResponse = await mainWallet.sendTransaction(tx);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);

    // Esperar a que la transacción sea confirmada
    await transactionResponse.wait();
    console.log(`Gas successfully transferred to account: ${accountAddress}`);
  } catch (error) {
    console.error(`Error transferring gas to account ${accountAddress}:`, error.message);
  }

  // Verificar el saldo después de transferir el gas
  try {
    const balance = await provider.getBalance(accountAddress);
    console.log(`Balance for account ${accountAddress}: ${balance.toString()} wei (${ethers.utils.formatEther(balance)} ETH)`);
  } catch (balanceError) {
    console.error(`Error fetching balance for account: ${accountAddress}`, balanceError.message);
  }
};

const estimateGasForOperations = async (numOperations) => {
  try {
    // Estimar el gas necesario para una transacción simple
    const gasPrice = await provider.getGasPrice();
    const gasLimit = ethers.BigNumber.from('21000'); // Gas limit para una transacción simple

    // Estimar el costo total de gas para el número de operaciones
    const totalGas = gasLimit.mul(gasPrice).mul(numOperations);

    // Convertir el costo total de gas a ETH
    const estimatedGasInEth = ethers.utils.formatEther(totalGas);
    console.log(`Estimated gas for ${numOperations} operations: ${estimatedGasInEth} ETH`);

    return estimatedGasInEth;
  } catch (error) {
    console.error(`Error estimating gas:`, error.message);
    throw error;
  }
};

module.exports = {
  MetaMaskAccountCreator,
  transferGasToAccount,
  estimateGasForOperations
};
