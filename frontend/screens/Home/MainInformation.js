import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Block, Text } from 'galio-framework'
import { walletTheme } from '../../constants'
import Icon from '../../components/Icon'
import styles from './HomeStyles'
import backendApi from '../../api/backendGateway'
import WalletContext from '../../navigation/WalletContext'

const RenderMainInformation = ({
  showBalance,
  toggleBalanceVisibility,
  refreshing,
}) => {
  const [balance, setBalance] = useState(0)
  const [usdValue, setUsdValue] = useState(0)
  const { user, selectedAccount } = useContext(WalletContext)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { response: balanceResult, balanceStatusCode: statusCode } =
          await backendApi.transactionsGateway.balance(
            selectedAccount.accountNumber
          )
        const formattedBalance = parseFloat(balanceResult).toFixed(2)
        setBalance(formattedBalance)

        // Fetch USD value if the currency is XCN
        if (selectedAccount.accountCurrency === 'XCN') {
          const { response: usdResult } =
            await backendApi.exchangeRatesGateway.getExchangeRate('XCN')
          const usdValue = (
            parseFloat(formattedBalance) * parseFloat(usdResult.rate)
          ).toFixed(2)
          setUsdValue(usdValue)
        }
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }

    // Si refreshing es true, reinicia los estados relevantes antes de obtener los datos
    if (refreshing) {
      setBalance(0) // Reinicia el balance
      setUsdValue(0) // Reinicia el valor en USD
    }

    fetchBalance()
  }, [selectedAccount, refreshing]) // Añade refreshing al array de dependencias

  const lastFourDigits = selectedAccount.accountNumber
    ? selectedAccount.accountNumber.slice(-4)
    : '----'

  return (
    <Block flex style={styles.balanceContainer}>
      <Text style={styles.balanceText}>
        Balance | Cuenta: ...{lastFourDigits}
      </Text>
      <Text style={styles.amountText}>
        {showBalance
          ? `${balance} ${selectedAccount.accountCurrency}`
          : `*** ${selectedAccount.accountCurrency}`}
      </Text>
      {selectedAccount.accountCurrency === 'XCN' && (
        <Text style={styles.usdValueText}>
          ≈ {showBalance ? `${usdValue} USD` : '*** USD'}
        </Text>
      )}
      <TouchableOpacity
        onPress={toggleBalanceVisibility}
        style={styles.visibilityIcon}
      >
        <Icon
          name={showBalance ? 'eye' : 'eye-off'}
          family="Feather"
          size={20}
          color={walletTheme.COLORS.WHITE}
        />
      </TouchableOpacity>
    </Block>
  )
}

export default RenderMainInformation
