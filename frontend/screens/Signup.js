import React, { useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { logOut, authService } from '../components/Google'
import LoadingScreen from '../components/LoadingScreen'
import backendApi from '../api/backendGateway'
import { useWallet } from '../navigation/WalletContext'
import createLogger from '../components/Logger'
import CheckBox from '@react-native-community/checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const logger = createLogger('signup.js')
const { width, height } = Dimensions.get('screen')

const Signup = ({ route }) => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setSelectedAccount } = useWallet()
  const [address, setAddress] = useState('')
  const [isCheckingAccount, setIsCheckingAccount] = useState(true)

  const canConfirm = address !== '' // Aquí agregas las validaciones para otros campos si los hay.

  const updateUserAndAccount = (userData, accountData) => {
    setUser(userData)
    setSelectedAccount(accountData)
  }

  // Función para manejar el botón de confirmar
  const handleConfirm = async () => {
    if (!canConfirm) {
      alert('Por favor, completa todos los campos requeridos.')
      return
    }

    try {
      setIsLoading(true)
      const idToken = route.params.idToken

      const { response, statusCode } = await backendApi.authUser.authenticate({
        token: idToken,
        registerUser: true,
        accountInfo: {
          beneficiaryAddress: address,
          accountType: 'Checking',
        },
      })

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

  // Función para manejar el botón de cancelar
  const handleCancel = async () => {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Block flex style={styles.home}>
        <ImageBackground source={Images.Background} style={styles.background}>
          <View style={{ width: width, ...styles.scrollViewContent }}>
            <Card title="Dirección">
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GooglePlacesAutocomplete
                  placeholder={address == '' ? 'Ingresa tu dirección' : address}
                  onPress={(data, details = null) => {
                    console.log(data)
                    setAddress(data.description)
                  }}
                  query={{
                    key: 'AIzaSyAZD3DtG2EtBZrau7jzlCxvU2E7TuzGGXA',
                    language: 'es',
                  }}
                  styles={{
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                  }}
                  fetchDetails={true}
                  value={address}
                />
              </View>
            </Card>
            <Card title="Tipo de Cuenta">
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CheckBox value={isCheckingAccount} onValueChange={() => {}} />
                <Text style={styles.description}>Checking Account</Text>
              </View>
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
          </View>
        </ImageBackground>
      </Block>
    </KeyboardAvoidingView>
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
