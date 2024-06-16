import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { Block, Text } from 'galio-framework'
import { Button } from '../components'
import { Images, walletTheme } from '../constants'
import { authService, GoogleSignin, logOut } from '../components/Google'
import backendApi from '../api/backendGateway'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import LoadingScreen from '../components/LoadingScreen'
import { useWallet } from '../navigation/WalletContext'
import createLogger from '../components/Logger'

const logger = createLogger('login.js')
const { width, height } = Dimensions.get('screen')

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const Login = () => {
  const navigation = useNavigation()
  const { setUser, setSelectedAccount } = useWallet()
  const [isTesting, setIsTesting] = useState(false)
  const [emailPrefix, setEmailPrefix] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTestingButton, setShowTestingButton] = useState(false)

  const updateUserAndAccount = (userData, accountData) => {
    setUser(userData)
    setSelectedAccount(accountData)
  }

  const isLoggedUser = async () => {
    return (
      (await AsyncStorage.getItem('token')) !== null &&
      (await AsyncStorage.getItem('refresh')) !== null &&
      (await AsyncStorage.getItem('userId')) !== null
    )
  }

  useEffect(() => {
    const validateLoggedUser = async () => {
      const isLogged = await isLoggedUser()
      logger.info(isLogged)
      if (isLogged) {
        reAuthenticate()
      } else {
        setIsLoading(false)
      }
    }
    validateLoggedUser()
  }, [])

  const getTestEmail = (user, isTesting, emailPrefix) => {
    let email = user.email.toLowerCase()
    if (isTesting && emailPrefix) {
      const domain = email.split('@')[1]
      email = `${emailPrefix.toLowerCase()}@${domain}`
    }
    return email
  }

  const authenticate = async () => {
    try {
      setIsLoading(true)
      const userInfo = await GoogleSignin.signIn()
      const { idToken, user } = userInfo
      const email = getTestEmail(user, isTesting, emailPrefix)

      const authPayload = {
        token: idToken,
        email: email,
      }

      const { response, statusCode } =
        await backendApi.authUser.authenticate(authPayload)

      if (statusCode === 200) {
        await authService.saveCredentials({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.id,
          navigation: navigation,
          updateUserAndAccount: updateUserAndAccount,
        })
        setIsLoading(false)
      } else if (statusCode === 301) {
        navigation.navigate('Signup', { idToken, email })
      }
      setIsLoading(false)
    } catch (error) {
      await logOut()
      setIsLoading(false)
    }
  }

  const reAuthenticate = async () => {
    setIsLoading(true)
    const userInfo = await GoogleSignin.signInSilently()
    const { user } = userInfo

    const email = getTestEmail(user, isTesting, emailPrefix)
    const authPayload = {
      token: null,
      email: email,
    }

    const { response, statusCode } =
      await backendApi.authUser.authenticate(authPayload)

    if (statusCode === 200) {
      authService.saveCredentials({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userId: response.id,
        navigation: navigation,
        updateUserAndAccount: updateUserAndAccount,
      })
      setIsLoading(false)
    } else {
      try {
        if ((await asyncStorage.getItem('token')) !== null) {
          await refreshToken()
        } else await logOut()
      } catch (e) {
        await logOut()
      }
    }
  }

  const refreshToken = async () => {
    const { response, statusCode } = await backendApi.authUser.refresh(
      await AsyncStorage.getItem('refresh')
    )
    if (statusCode === 200) {
      const userId = await AsyncStorage.getItem('userId')
      await authService.saveCredentials({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userId: response.id,
        navigation: navigation,
        updateUserAndAccount: updateUserAndAccount,
      })
      setIsLoading(false)
    } else {
      await logOut()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <DismissKeyboard>
        <Block flex style={{ justifyContent: 'flex-end', marginTop: 'auto' }}>
          <StatusBar hidden />
          <ImageBackground
            source={Images.LoginBackground}
            style={{ width, height, zIndex: 1 }}
          >
            <Block
              style={{
                width,
                height: height * 0.8,
                justifyContent: 'flex-end',
                marginBottom: 20,
              }}
              middle
            >
              <Block style={styles.loginContainer}>
                <Block flex space="between">
                  <Block flex={1} middle style={styles.socialConnect}>
                    <Block flex={0.6} middle>
                      <Text color="#8898AA" size={16}>
                        Login & Sign Up
                      </Text>
                    </Block>
                    <Block flex={0.4} row style={{ marginBottom: 18 }}>
                      <Button
                        style={{ ...styles.socialButtons }}
                        onPress={authenticate}
                      >
                        <Block
                          row
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            source={require('../assets/imgs/x_icon.png')}
                            style={{
                              height: 17,
                              width: 17,
                              marginTop: 2,
                              marginRight: 5,
                            }}
                          />
                          <Text style={styles.socialTextButtons}>
                            Continue with X
                          </Text>
                        </Block>
                      </Button>
                    </Block>
                    {isTesting && (
                      <TextInput
                        style={styles.input}
                        placeholder="Enter email prefix"
                        value={emailPrefix}
                        onChangeText={setEmailPrefix}
                      />
                    )}
                  </Block>
                </Block>
              </Block>
            </Block>
            <TouchableOpacity
              style={styles.showTestingButton}
              onPress={() => {
                setShowTestingButton(!showTestingButton)
                setIsTesting(!isTesting)
              }}
            >
              <Icon
                name="tool"
                size={20}
                color={showTestingButton ? 'red' : 'green'}
              />
              <Text color={showTestingButton ? 'red' : 'green'}>
                {showTestingButton}
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </Block>
      </DismissKeyboard>
      <LoadingScreen visible={isLoading} />
    </View>
  )
}

const styles = StyleSheet.create({
  loginContainer: {
    width: width * 0.8,
    height: height * 0.2,
    backgroundColor: '#F4F5F7',
    borderRadius: 4,
    shadowColor: walletTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden',
  },
  socialConnect: {
    backgroundColor: walletTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(136, 152, 170, 0.3)',
  },
  socialButtons: {
    width: 200,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    shadowColor: walletTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    maxWidth: 400,
    transition: 'background-color .218s, border-color .218s, box-shadow .218s',
  },
  socialTextButtons: {
    color: '#1f1f1f',
    fontWeight: '800',
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
    alignSelf: 'center',
  },
  showTestingButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: walletTheme.COLORS.BLOCK,
    padding: 10,
    borderRadius: 20,
  },
})

export default Login
