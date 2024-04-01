import React, { useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { logOut, GoogleSignin } from '../components/Google'
import LoadingScreen from '../components/LoadingScreen'

const { width, height } = Dimensions.get('screen')

const Signup = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(null)

  const authenticate = async () => {
    try {
      setIsLoading(true)
      const userInfo = await GoogleSignin.signIn()
      const { idToken, user } = userInfo

      const { response, statusCode } = await backendApi.authUser.authenticate({
        token: idToken,
      })

      if (statusCode === 201) {
        await saveCredentials(
          response.accessToken,
          response.refreshToken,
          response.id
        )
      } else if (statusCode === 301) {
        navigation.replace('Signup')
      }
      setIsLoading(false)
    } catch (error) {
      await logOut()
      setIsLoading(false)
    }
  }

  // Función para manejar el botón de confirmar
  const handleConfirm = () => {
    // Realizar el request a authentication con los datos del registro
    // Llevar al usuario a la pantalla Home si el registro es exitoso
    setIsLoading(true)
  }

  // Función para manejar el botón de cancelar
  const handleCancel = async () => {
    // Llevar al usuario a la pantalla de Login sin poder volver atrás
    await logOut()
    setIsLoading(false)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  }

  // Crear un componente para cada detalle
  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Registro1 */}
          <Card title="Registro1">
            <Text style={styles.title}>Registro1</Text>
            <Text style={styles.description}>Registro1</Text>
          </Card>

          {/* Registro2 */}
          <Card title="Registro2">
            <Text style={styles.title}>Registro2</Text>
            <Text style={styles.description}>Registro2</Text>
          </Card>
          {/* Botones de confirmar y cancelar */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleCancel} style={styles.button}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
      <LoadingScreen visible={isLoading} />
    </Block>
  )
}

const styles = StyleSheet.create({
  home: {
    marginTop: 0,
  },
  background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  detailCard: {
    backgroundColor: theme.COLORS.WHITE,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: theme.SIZES.BASE / 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    textAlign: 'justify',
  },
  scrollViewContent: {
    paddingTop: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: walletTheme.COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: walletTheme.COLORS.BLACK,
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Signup
