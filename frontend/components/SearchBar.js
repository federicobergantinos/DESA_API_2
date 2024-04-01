import { Keyboard, StyleSheet } from 'react-native'
import Icon from './Icon'
import { theme } from 'galio-framework'
import Input from './Input'
import React from 'react'
import walletTheme from '../constants/Theme'
import { useNavigation } from '@react-navigation/native'

export const SearchBar = () => {
  const navigation = useNavigation()
  return (
    <Input
      right
      color="black"
      style={styles.search}
      placeholder="Qué estás buscando?"
      placeholderTextColor={'#8898AA'}
      onFocus={() => {
        Keyboard.dismiss()
        navigation.navigate('Search')
      }}
      iconContent={
        <Icon
          size={16}
          color={theme.COLORS.MUTED}
          name="search-zoom-in"
          family="WalletExtra"
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: walletTheme.COLORS.BORDER,
  },
})
