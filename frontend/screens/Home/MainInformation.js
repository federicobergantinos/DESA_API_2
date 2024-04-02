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
  const { user, selectedAccount } = useContext(WalletContext)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { response: balanceResult, balanceStatusCode: statusCode } =
          await backendApi.transactionsGateway.balance(
            selectedAccount.accountId
          )
        setBalance(balanceResult)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }

    // Si refreshing es true, reinicia los estados relevantes antes de obtener los datos
    if (refreshing) {
      setBalance(0) // Reinicia el balance
    }

    fetchBalance()
  }, [selectedAccount, refreshing]) // Añade refreshing al array de dependencias

  return (
    <Block flex style={styles.balanceContainer}>
      <Text style={styles.balanceText}>
        Balance | Cta: {selectedAccount.accountNumber}
      </Text>
      <Text style={styles.amountText}>
        {showBalance ? `${balance} USD` : '***'}
      </Text>
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
