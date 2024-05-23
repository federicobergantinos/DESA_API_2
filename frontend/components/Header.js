import React, { useContext, useState } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Text,
  Image,
  View,
} from 'react-native'
import { Block, NavBar, theme } from 'galio-framework'
import { CommonActions, useNavigation } from '@react-navigation/native'

import Icon from './Icon'
import walletTheme from '../constants/Theme'
import WalletContext from '../navigation/WalletContext'
import AccountSelector from '../components/AccountSelector'

const { height, width } = Dimensions.get('window')

const Header = ({
  back,
  title,
  white,
  transparent,
  bgColor,
  iconColor,
  titleColor,
  search,
  tabs,
  tabIndex,
  ...props
}) => {
  const navigation = useNavigation()
  const [isAccountSelectorVisible, setIsAccountSelectorVisible] =
    useState(false)
  const { transaction, setSelectedAccount, user } = useContext(WalletContext)

  const handleShare = async () => {
    if (transaction) {
      const message = `
        Detalles de la Transacción:
        - Nombre: ${transaction.name}
        - Descripción: ${transaction.description}
        - Monto: ${transaction.amount} ${transaction.currency}
        - Estado: ${transaction.status === 'Paid' ? 'Pagado' : 'Cancelado'}
        - Fecha: ${transaction.date}
      `

      try {
        await Share.share({
          message,
        })
      } catch (error) {
        console.error('Error al compartir:', error.message)
      }
    } else {
      console.log('Detalles de la transacción no disponibles.')
    }
  }

  const RenderShareButton = () => {
    return (
      <TouchableOpacity style={[styles.button]} onPress={handleShare}>
        <Icon
          family="AntDesign"
          name="sharealt"
          size={25}
          color={walletTheme.COLORS.WHITE}
        />
      </TouchableOpacity>
    )
  }

  const SettingsButton = ({ isWhite, style }) => {
    const navigation = useNavigation()
    return (
      <TouchableOpacity
        style={[styles.settingsButton, style]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon
          family="Feather"
          size={20}
          name="settings"
          color={walletTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
      </TouchableOpacity>
    )
  }

  const SwitchAccountButton = ({ style }) => (
    <TouchableOpacity
      style={[styles.switchButton, style]}
      onPress={() => setIsAccountSelectorVisible(true)}
    >
      <Text style={styles.switchButtonText}>Billeteras</Text>
    </TouchableOpacity>
  )

  const renderLeft = () => {
    if (title === 'Home') {
      return (
        <View style={styles.leftContainer}>
          {renderUserProfile()}
          <Text style={styles.titleText}>{'Hola ' + user.name + '!'}</Text>
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={renderLeftAction}>
          <Icon
            name={back ? 'chevron-left' : 'home'}
            family="Feather"
            size={25}
            color={
              iconColor ||
              (white ? walletTheme.COLORS.WHITE : walletTheme.COLORS.ICON)
            }
            style={{ marginTop: 2 }}
          />
        </TouchableOpacity>
      )
    }
  }

  const renderLeftAction = () => {
    if (title === 'Transaccion') {
      navigation.replace('Home')
    } else {
      back
        ? navigation.dispatch(CommonActions.goBack())
        : navigation.navigate('Home')
    }
  }

  const renderUserProfile = () => {
    if (user.photoUrl) {
      return (
        <Image source={{ uri: user.photoUrl }} style={styles.profileImage} />
      )
    } else {
      const initial = user.name.charAt(0).toUpperCase()
      return (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profilePlaceholderText}>{initial}</Text>
        </View>
      )
    }
  }

  const renderRight = () => {
    let components = [] // Arreglo para almacenar los componentes del lado derecho

    if (title === 'Transaccion' && transaction) {
      // Añade el botón de compartir solo en la página de Transacción cuando hay una transacción
      components.push(<RenderShareButton key="share-button" />)
    } else {
      switch (title) {
        case 'Home':
          // Añade los botones de perfil y configuración solo en la página de Inicio
          components.push(
            <SwitchAccountButton key="account-switch-button" isWhite={white} />
          )
          components.push(
            <SettingsButton key="settings-button" isWhite={white} />
          )
          break
        // Puedes agregar más casos si necesitas botones específicos en otras páginas
        default:
          // Aquí puedes añadir botones que aparecen por defecto en todas las páginas que no sean 'Home' o 'Transaccion'
          break
      }
    }

    return components
  }

  const determineTitle = () => {
    if (title === 'Home') {
      return ''
    } else if (title === 'Transaccion') {
      return ''
    } else {
      return title
    }
  }

  const noShadow = ['Search', 'Perfil', 'Home'].includes(title)

  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: 'rgba(0, 0, 0, 0)' } : null,
  ]

  const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }]

  return (
    <Block style={headerStyles}>
      <NavBar
        back={false}
        title={determineTitle()}
        style={navbarStyles}
        transparent={transparent}
        right={renderRight()}
        left={renderLeft()}
        leftStyle={{ flex: 0 }}
        rightStyle={{ flex: 0 }}
        titleStyle={[
          styles.title,
          { color: walletTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
          titleColor && { color: titleColor },
        ]}
        {...props}
      />
      {isAccountSelectorVisible && (
        <AccountSelector
          isVisible={isAccountSelectorVisible}
          onClose={() => setIsAccountSelectorVisible(false)}
          onSelectAccount={setSelectedAccount}
        />
      )}
    </Block>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  switchButton: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 20,
    paddingVertical: 8,
    marginRight: 10,
    paddingHorizontal: 16,
  },
  switchButtonText: {
    color: walletTheme.COLORS.WHITE,
    fontSize: 14,
    width: 60,
  },
  settingsButton: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: walletTheme.COLORS.BORDER,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: walletTheme.COLORS.VIOLET,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profilePlaceholderText: {
    color: walletTheme.COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: walletTheme.COLORS.WHITE,
  },
})

export default Header
