import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Block, Text } from 'galio-framework'
import { walletTheme } from '../../constants'
import Icon from '../../components/Icon'
import styles from './HomeStyles'
import backendApi from '../../api/backendGateway'
import WalletContext from '../../navigation/WalletContext'

const RenderMainInformation = () => {
  const [showBalance, setShowBalance] = useState(false)
  const [balance, setBalance] = useState(0)
  const { user } = useContext(WalletContext)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const account = await backendApi.accountGateway.getAccountByUserId(1)
        console.log(account)
        const balanceResult = await backendApi.transactionsGateway.balance(
          account.id
        )
        console.log(balanceResult)
        setBalance(balanceResult)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }

    fetchBalance()
  }, [1])

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  return (
    <Block flex style={styles.balanceContainer}>
      <Text style={styles.balanceText}>Balance</Text>
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
