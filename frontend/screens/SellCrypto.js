import React, { useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'

const { width, height } = Dimensions.get('screen')

const BuyCrypto = () => {
  const [amountReceived, setAmountReceived] = useState(0)
  const [amountSend, setAmountSend] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigation = useNavigation()

  const conversionRates = {
    USD: 1, // Simulated conversion rate for USD
    ARS: 100, // Simulated conversion rate for ARS, you should replace with actual logic
  }

  const handleAmountSendChange = (text) => {
    clearTimeout(typingTimeout)
    setAmountSend(text)
    setTypingTimeout(
      setTimeout(() => {
        const receivedAmount =
          (parseFloat(text) * conversionRates[currency]) /
          conversionRates[currency]
        setAmountReceived(receivedAmount)
      }, 500)
    )
  }

  const handleConfirm = () => {
    console.log(amountSend) // Amount to be sent
    console.log(amountReceived) // Amount to be received
    navigation.replace('Home')
  }

  const handleCancel = () => {
    navigation.replace('Home')
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const selectCurrency = (selectedCurrency) => {
    setCurrency(selectedCurrency)
    setIsDropdownOpen(false)
  }

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.detailCard}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={toggleDropdown}
            >
              <Text style={styles.dropdownButtonText}>
                Seleccione Moneda: {currency}
              </Text>
            </TouchableOpacity>
            {isDropdownOpen && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectCurrency('USD')}
                >
                  <Text style={styles.dropdownItemText}>USD</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectCurrency('ARS')}
                >
                  <Text style={styles.dropdownItemText}>ARS</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>
              Ingrese monto a comprar en {currency}:{' '}
            </Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.amountInput}
                value={amountSend}
                onChangeText={handleAmountSendChange}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={walletTheme.COLORS.VIOLET}
              />
            </View>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>Cantidad Recibida</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amountInput}>
                {'≈ ' + amountReceived + ' ' + currency}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.buttonCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.buttonContinue}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
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
  currencySwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theme.SIZES.BASE,
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: walletTheme.COLORS.VIOLET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 16,
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 16,
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
  scrollViewContent: {
    paddingTop: 100,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  amountInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: walletTheme.COLORS.VIOLET,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonContinue: {
    backgroundColor: '#8D67E7',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonCancel: {
    backgroundColor: '#8D67E7',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default BuyCrypto
