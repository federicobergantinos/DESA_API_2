import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, Dimensions, Share } from 'react-native'
import { Block, NavBar, theme } from 'galio-framework'
import { CommonActions, useNavigation } from '@react-navigation/native' // Importa useNavigation de '@react-navigation/native'

import Icon from './Icon'
import walletTheme from '../constants/Theme'
import WalletContext from '../navigation/WalletContext'
import AccountSelector from '../components/AccountSelector'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  const { transaction, setSelectedAccount } = useContext(WalletContext)

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

  const ProfileButton = ({ isWhite, style }) => {
    const navigation = useNavigation()
    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon
          family="Feather"
          size={20}
          name="user"
          color={walletTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
      </TouchableOpacity>
    )
  }

  const SettingsButton = ({ isWhite, style }) => {
    const navigation = useNavigation()
    return (
      <TouchableOpacity
        style={[styles.button, style]}
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
      style={[styles.button, style]}
      onPress={() => setIsAccountSelectorVisible(true)}
    >
      <Icon
        family="AntDesign"
        size={20}
        name="swap"
        color={walletTheme.COLORS[white ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
  )

  const renderLeft = () => {
    if (title === 'Transaccion') {
      return () => navigation.replace('Home')
    } else {
      return back
        ? () => navigation.dispatch(CommonActions.goBack())
        : () => navigation.navigate('Home')
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
            <ProfileButton key="profile-button" isWhite={white} />
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
        title={title !== 'Transaccion' ? title : ''}
        style={navbarStyles}
        transparent={transparent}
        right={renderRight()}
        rightStyle={{
          alignItems: 'center',
          marginRight: title == 'Home' ? 50 : 0,
        }}
        left={
          <Icon
            name={back ? 'chevron-left' : 'home'}
            family="Feather"
            size={25}
            onPress={renderLeft()}
            color={
              iconColor ||
              (white ? walletTheme.COLORS.WHITE : walletTheme.COLORS.ICON)
            }
            style={{ marginTop: 2 }}
          />
        }
        leftStyle={{ flex: 0.35 }}
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
})

export default Header
