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
import backendApi from '../api/backendGateway'
import { v4 as uuidv4 } from 'uuid' // Asegúrate de instalar uuid: npm install uuid

const { width, height } = Dimensions.get('screen')

const Signup = ({ route }) => {
  const [isLoading, setIsLoading] = useState(false)

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

      data.pictureSelfie = selfieUrl.response
      data.pictureIdPassport = idPassportUrl.response

      const { response, statusCode } = await backendApi.authUser.authenticate({
        token: idToken,
        registerUser: true,
      })

      console.log(data)

      if (statusCode === 201) {
        await authService.saveCredentials({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.id,
          navigation: navigation,
          updateUserAndAccount: updateUserAndAccount,
        })
      }
      setIsLoading(false)
    } catch (error) {
      logger.error(error)
      await logOut()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Ignorar warnings específicos de las imágenes nulas
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
