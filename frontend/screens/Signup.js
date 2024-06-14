import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  LogBox,
} from 'react-native'
import LoadingScreen from '../components/LoadingScreen'
import { BiometricDataComponent } from 'react-native-biometric-data'
import { Block } from 'galio-framework'
import { Images } from '../constants'
import { authService, logOut } from '../components/Google'
import backendApi from '../api/backendGateway'
import { useWallet } from '../navigation/WalletContext'

const { width, height } = Dimensions.get('screen')

const Signup = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setSelectedAccount } = useWallet()

  const updateUserAndAccount = (userData, accountData) => {
    console.log('Actualizando usuario y cuenta:', userData, accountData)
    setUser(userData)
    setSelectedAccount(accountData)
  }

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      const idToken = route.params.idToken

      const prefix = `rekognition`
      const selfieUrl = await backendApi.usersGateway.uploadImage({
        image: data.pictureSelfie,
        prefix,
        filename: 'selfie.jpeg',
      })
      const idPassportUrl = await backendApi.usersGateway.uploadImage({
        image: data.pictureIdPassport,
        prefix,
        filename: 'id_passport.jpeg',
      })

      data.pictureSelfie = selfieUrl.response.response
      data.pictureIdPassport = idPassportUrl.response.response

      const authPayload = {
        token: idToken,
        registerUser: true,
        additionalData: data,
      }

      const { response, statusCode } =
        await backendApi.authUser.authenticate(authPayload)

      console.log('Datos de la autenticación:', response, statusCode)

      if (statusCode === 201) {
        console.log('Usuario autenticado, guardando credenciales...')
        await authService.saveCredentials({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.id,
          navigation: navigation,
          updateUserAndAccount: updateUserAndAccount,
        })
        console.log('Credenciales guardadas.')
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error durante el manejo de la sumisión:', error)
      await logOut()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    LogBox.ignoreLogs(['ReactImageView: Image source "null" doesn\'t exist'])
  }, [])

  return (
    <Block flex style={styles.container}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <BiometricDataComponent onSubmit={handleSubmit} />
          </ScrollView>
        </View>
      </ImageBackground>
      <LoadingScreen visible={isLoading} />
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: width,
    height: height,
  },
  card: {
    marginTop: 75,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    height: height * 0.8,
    overflow: 'hidden',
  },
  scrollContainer: {
    flexGrow: 1,
    top: -20,
  },
})

export default Signup
