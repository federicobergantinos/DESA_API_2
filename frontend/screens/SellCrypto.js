import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import backendApi from '../api/backendGateway'
import WalletContext from '../navigation/WalletContext'
import LoadingScreen from '../components/LoadingScreen'

const { width, height } = Dimensions.get('screen')

const SellCrypto = () => {
  const [amountReceived, setAmountReceived] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [amountSend, setAmountSend] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(1) // Default exchange rate

  const navigation = useNavigation()
  const { user } = useContext(WalletContext)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoading(true)
      try {
        const response =
          await backendApi.exchangeRatesGateway.getExchangeRate(currency)
        if (response.statusCode === 200) {
          const exchangeRate = response.response
          let exchangeRateCalculated = 0.0
          if (currency === 'ARS') {
            exchangeRateCalculated = exchangeRate.ARS / exchangeRate.XCN
          } else {
            exchangeRateCalculated = exchangeRate.XCN
          }
          setExchangeRate(exchangeRateCalculated)
          setIsLoading(false)
        } else {
          setIsLoading(false)
          console.error('Error fetching exchange rate:', response)
        }
      } catch (error) {
        setIsLoading(false)
        console.error('Error fetching exchange rate:', error)
      }
    }

    fetchExchangeRate()
  }, [currency])

  useEffect(() => {
    const receivedAmount = (amountSend * exchangeRate).toFixed(4)
    console.log(receivedAmount)
    setAmountReceived(receivedAmount)
  }, [exchangeRate])

  const handleAmountSendChange = (text) => {
    clearTimeout(typingTimeout)
    setAmountSend(text)
    setTypingTimeout(
      setTimeout(() => {
        const receivedAmount = (parseFloat(text) * exchangeRate).toFixed(4)
        setAmountReceived(receivedAmount)
      }, 500)
    )
  }

  const handleConfirm = async () => {
    // Validar que se haya ingresado una cantidad para enviar
    if (!amountSend) {
      Alert.alert('Error', 'Debe ingresar una cantidad para enviar.')
      return
    }
    setIsLoading(true)
    try {
      // Obtener las cuentas asociadas al userId
      const accountsResponse =
        await backendApi.accountGateway.getAccountByUserId(user.id)
      if (accountsResponse.statusCode !== 200) {
        setIsLoading(false)
        Alert.alert('Error', 'No se pudo obtener las cuentas del usuario.')
        return
      }

      // Buscar la cuenta de origen XCoin
      const originAccount = accountsResponse.response.find(
        (account) => account.accountType === 'XCoin'
      )
      if (!originAccount) {
        setIsLoading(false)
        Alert.alert('Error', `No se encontró una cuenta de XCoin.`)
        return
      }

      // Validar que el saldo sea suficiente
      const balanceResponse = await backendApi.transactionsGateway.balance(
        originAccount.accountNumber
      )
      const balance = parseFloat(balanceResponse.response)

      if (parseFloat(amountSend) > balance) {
        setIsLoading(false)
        Alert.alert('Error', 'Saldo insuficiente para realizar la venta.')
        return
      }

      // Buscar la cuenta de destino según la moneda seleccionada
      const destinationAccount = accountsResponse.response.find(
        (account) => account.accountCurrency === currency
      )
      if (!destinationAccount) {
        setIsLoading(false)
        Alert.alert('Error', `No se encontró una cuenta en ${currency}.`)
        return
      }

      // Crear el objeto de datos de la transacción
      const transactionData = {
        accountNumberOrigin: originAccount.accountNumber,
        accountNumberDestination: destinationAccount.accountNumber,
        name: 'Venta de Criptomonedas',
        description: `Venta de ${amountSend} XCoin.`,
        amountOrigin: parseFloat(amountSend),
        amountDestination: parseFloat(amountReceived),
        currencyOrigin: 'XCoin',
        currencyDestination: currency,
        status: 'pending',
        date: new Date().toISOString(),
      }

      // Enviar la solicitud para registrar la transacción
      const response =
        await backendApi.transactionsGateway.createTransaction(transactionData)

      if (response.statusCode === 200 || response.statusCode === 201) {
        setIsLoading(false)
        Alert.alert('Éxito', 'La transacción ha sido registrada exitosamente.')
        navigation.replace('Home')
      } else {
        setIsLoading(false)
        Alert.alert('Error', 'No se pudo registrar la transacción.')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error al registrar la transacción:', error)
      Alert.alert(
        'Error',
        'Ocurrió un error al intentar registrar la transacción.'
      )
    }
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
              Ingrese monto a vender en XCoin:{' '}
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
                {'≈ ' + parseFloat(amountReceived).toLocaleString()} {currency}
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

export default SellCrypto
