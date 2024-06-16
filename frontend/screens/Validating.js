import React, { useEffect, useState, useContext, useRef } from 'react'
import {
  View,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Text,
  Image,
} from 'react-native'
import { Block } from 'galio-framework'
import { useNavigation } from '@react-navigation/native'
import { LinearProgress } from 'react-native-elements'
import { Images, walletTheme } from '../constants'
import backendApi from '../api/backendGateway'
import WalletContext from '../navigation/WalletContext'

const { width, height } = Dimensions.get('screen')

const UserValidationScreen = () => {
  const [isValidating, setIsValidating] = useState(true)
  const { user } = useContext(WalletContext)
  const [message, setMessage] = useState('Estamos validando tu identidad')
  const navigation = useNavigation()
  const statusInterval = useRef(null) // Use useRef to store the interval

  const checkUserStatus = async () => {
    try {
      const userId = user ? user.id : null
      if (!userId) throw new Error('Usuario no encontrado')
      const response = await backendApi.usersGateway.getUser(userId)
      if (response.statusCode === 200) {
        const { userStatus } = response.response.user
        if (userStatus === 'validated') {
          setIsValidating(false)
          setMessage('¡Identidad validada con éxito!')
          clearInterval(statusInterval.current)
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            }) // O la pantalla que desees navegar
          }, 2000) // Esperar 2 segundos antes de navegar
        }
      } else {
        console.error('Error al verificar el estado del usuario:', response)
      }
    } catch (error) {
      console.error('Error al verificar el estado del usuario:', error)
    }
  }

  useEffect(() => {
    if (user && user.userStatus === 'validated') {
      navigation.replace('Home')
    } else {
      checkUserStatus() // Verificar al montar el componente
      statusInterval.current = setInterval(checkUserStatus, 15000) // Verificar cada 15 segundos
      return () => clearInterval(statusInterval.current) // Limpiar el intervalo al desmontar el componente
    }
  }, [])

  const renderProfileImage = () => {
    if (user && user.photoUrl) {
      return (
        <Image source={{ uri: user.photoUrl }} style={styles.profileImage} />
      )
    } else if (user) {
      const initials = `${user.name.charAt(0)}${user.surname.charAt(0)}`
      return (
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
      )
    }
    return null
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.Background} style={styles.image}>
        <Block flex style={styles.text}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.profileContainer}>
            {renderProfileImage()}
            {isValidating && (
              <LinearProgress
                color="white"
                style={styles.linearProgress}
                trackColor="rgba(255, 255, 255, 0.2)"
              />
            )}
          </View>
        </Block>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 28,
    marginBottom: 20,
    padding: 10,
    color: walletTheme.COLORS.WHITE,
    textAlign: 'center',
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: walletTheme.COLORS.WHITE,
  },
  initialsContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: walletTheme.COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: walletTheme.COLORS.MUTED,
  },
  initialsText: {
    fontSize: 36,
    color: walletTheme.COLORS.WHITE,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: { width, height: height * 1.05, zIndex: 1 },
  linearProgress: {
    marginTop: 20,
    width: '30%',
    height: 4,
  },
})

export default UserValidationScreen
