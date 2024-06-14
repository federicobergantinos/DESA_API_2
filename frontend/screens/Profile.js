import React, { useContext } from 'react'
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
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import backendGateway from '../api/backendGateway'
import WalletContext from '../navigation/WalletContext'
import Icon from 'react-native-vector-icons/FontAwesome' // Importa el ícono que necesitas

const { width, height } = Dimensions.get('screen')

const ConfiguracionGeneral = ({ navigation }) => {
  const { user } = useContext(WalletContext)

  // Creating separate cards for each detail
  const Card = ({ title, iconName, iconColor, onPress }) => (
    <TouchableOpacity style={styles.detailCard} onPress={onPress}>
      <Icon name={iconName} size={20} color={iconColor} />
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  )

  const logOut = async () => {
    await AsyncStorage.clear()
    await GoogleSignin.signOut()
    navigation.navigate('Login')
  }

  const deleteAccount = async () => {
    try {
      const userId = user.id
      const response = await backendGateway.usersGateway.deleteUser(userId)
      if (response.statusCode === 200) {
        await AsyncStorage.clear()
        await GoogleSignin.signOut()
        navigation.navigate('Login')
      } else {
        console.error('Failed to delete account:', response.response)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Card
            title="Ajustes de Cuenta"
            iconName="user-circle"
            iconColor={theme.COLORS.SECONDARY}
            onPress={() => navigation.navigate('Settings')}
          />
          <Card
            title="Ayuda"
            iconName="question-circle"
            iconColor={theme.COLORS.SECONDARY}
            onPress={() => navigation.navigate('FAQs')}
          />
          <Card
            title="Sign Out"
            iconName="sign-out"
            iconColor={theme.COLORS.WARNING}
            onPress={() => logOut()}
          />
          <Card
            title="Desactivate Account"
            iconName="trash"
            iconColor={theme.COLORS.PRIMARY}
            onPress={() => deleteAccount()}
          />
        </ScrollView>
      </ImageBackground>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: theme.SIZES.BASE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.PRIMARY,
  },
  backButton: {
    marginRight: theme.SIZES.BASE,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.WHITE,
  },
  scrollViewContent: {
    paddingTop: 100,
  },
})

export default ConfiguracionGeneral
