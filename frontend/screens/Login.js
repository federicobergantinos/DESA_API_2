import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  View,
} from 'react-native'
import { Block, Text } from 'galio-framework'

import { Button } from '../components'
import { Images, walletTheme } from '../constants'
// import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { authService, GoogleSignin, logOut } from '../components/Google'
import backendApi from '../api/backendGateway'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import LoadingScreen from '../components/LoadingScreen'
import asyncStorage from '@react-native-async-storage/async-storage/src/AsyncStorage'
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

  const [isLoading, setIsLoading] = useState(isLoggedUser)

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

  const authenticate = async () => {
    try {
      setIsLoading(true)
      let userInfo = await GoogleSignin.signIn();
      
      const { idToken, user } = userInfo;
      user.surname = user.surname ? user.surname : '';

      console.log("IDTOKEN", idToken);
      const { response, statusCode } = await backendApi.authUser.authenticate({
        token: idToken,
      })

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
        navigation.replace('Signup', { idToken })
      }
      setIsLoading(false)
    } catch (error) {
      await logOut()
    }
  }

  const reAuthenticate = async () => {
    setIsLoading(true)
    const { response, statusCode } = await backendApi.authUser.authenticate({
      token: null,
    })

    if (statusCode === 200) {
      authService.saveCredentials({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userId: response.id,
        navigation: navigation,
        updateUserAndAccount: updateUserAndAccount,
      })
      setIsLoading(false)
      const item = await asyncStorage.getItem('token')
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
                            source={require('../assets/imgs/g_icon.png')}
                            style={{
                              height: 30,
                              width: 30,
                              marginTop: 2,
                              marginRight: 5,
                            }}
                          />
                          <Text style={styles.socialTextButtons}>
                            Continue with Google
                          </Text>
                        </Block>
                      </Button>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
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
    borderRadius: 20,
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
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40,
  },
})

export default Login
