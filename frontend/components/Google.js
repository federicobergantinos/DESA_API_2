import { GoogleSignin } from '@react-native-google-signin/google-signin'
import backendApi from '../api/backendGateway'
import AsyncStorage from '@react-native-async-storage/async-storage'
import createLogger from './Logger'

const logger = createLogger('google.js')

GoogleSignin.configure({
  webClientId:
    '454272373471-5ojg0h21n0et134lvfjgokb9j0ovpsi8.apps.googleusercontent.com',
  androidClientId:
    '454272373471-0rikgi4sqndi5ge4gibbsccu690c4813.apps.googleusercontent.com',
  iosClientId: '',
  scopes: ['profile', 'email'],
})

const logOut = async () => {
  await clearAsyncStorage()
  await GoogleSignin.signOut()
}

const clearAsyncStorage = async () => {
  await AsyncStorage.clear()
}

const authService = {
  async saveCredentials({
    navigation,
    accessToken,
    refreshToken,
    userId,
    updateUserAndAccount,
  }) {
    try {
      await AsyncStorage.setItem('token', accessToken)
      await AsyncStorage.setItem('refresh', refreshToken)
      await AsyncStorage.setItem('userId', JSON.stringify(userId))
      // Ahora, hacemos el request para obtener los datos del usuario por ID
      //const statusCode = 200;
      const { response: userData, statusCode: userStatusCode } =
        await backendApi.usersGateway.getUser(userId)
        
      // Aseguramos que la solicitud fue exitosa
      if (userStatusCode === 200) {
        console.log("ENTERED 200");
        const { response: accountData, statusCode: accountStatusCode } =
          await backendApi.accountGateway.getAccountByUserId(1) //userId
        if (accountStatusCode === 200) {
          updateUserAndAccount(userData.user, accountData[0])
          navigation.replace('Home')
        } else {
          console.error('Error fetching account data: Status Code', statusCode)
        }
      } else {
        console.error('Error fetching user data: Status Code', statusCode)
      }
    } catch (error) {
      console.error('Error in saveCredentials:', error)
    }
  },
}

export { logOut, GoogleSignin, authService }
