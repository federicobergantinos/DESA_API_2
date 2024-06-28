import React, { useState, useEffect } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import backendApi from '../api/backendGateway'
import { useWallet } from '../navigation/WalletContext'

const { width, height } = Dimensions.get('screen')

const MissionsStore = () => {
  const { user } = useWallet()
  const [userTokens, setUserTokens] = useState(0)
  const [xCoinAccount, setXCoinAccount] = useState(null)

  useEffect(() => {
    const fetchUserTokenBalance = async () => {
      try {
        const response = await backendApi.userTokensGateway.getUserTokenBalance(
          user.id
        )
        setUserTokens(response.response.balance)
      } catch (error) {
        console.error('Error fetching user token balance:', error)
      }
    }
    fetchUserTokenBalance()
  }, [user.id])

  useEffect(() => {
    const fetchXCNAccount = async () => {
      try {
        const userId = user.id
        const accountsResponse =
          await backendApi.accountGateway.getAccountByUserId(userId)

        const xCoinAccount = accountsResponse.response.find(
          (account) => account.accountCurrency === 'XCN'
        )
        setXCoinAccount(xCoinAccount)
      } catch (error) {
        console.error('Error fetching xcoin account:', error)
      }
    }
    fetchXCNAccount()
  }, [])

  const handleExchange = async (xwc, xcoin) => {
    if (userTokens < xwc) {
      Alert.alert(
        'Saldo insuficiente',
        'No tienes suficientes XWC para realizar esta transacción.'
      )
      return
    }

    Alert.alert(
      'Confirmar Transacción',
      `¿Estás seguro de que deseas intercambiar ${xwc} XWC por ${xcoin} XCN?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              const newTokens = userTokens - parseInt(xwc)
              await backendApi.userTokensGateway.updateUserTokens(
                user.id,
                newTokens
              )
              setUserTokens(newTokens)

              const transactionData = {
                accountNumberOrigin:
                  '0x8A0da10861c24A818B600F971a983432044bBcfd',
                accountNumberDestination: xCoinAccount.accountNumber,
                name: `Intercambiando ${xwc} XWC por ${xcoin} XCN`,
                description: `Intercambiando ${xwc} XWC por ${xcoin} XCN`,
                amountOrigin: xcoin,
                amountDestination: xcoin,
                currencyOrigin: 'XCoin',
                currencyDestination: 'XCoin',
                status: 'pending',
                date: new Date().toISOString(),
              }
              await backendApi.transactionsGateway.createTransaction(
                transactionData,
                'Transfer'
              )
              console.log(`Intercambiando ${xwc} XWC por ${xcoin} XCN`)
            } catch (error) {
              console.error('Error realizando el intercambio:', error)
            }
          },
        },
      ],
      { cancelable: false }
    )
  }

  const claimMission = async (missionId) => {
    try {
      await backendApi.missionsGateway.updateMission(missionId, {
        claimed: true,
      })
      Alert.alert('Misión reclamada', 'Has reclamado la misión exitosamente.')
    } catch (error) {
      console.error('Error al reclamar la misión:', error)
      Alert.alert(
        'Error',
        'No se pudo reclamar la misión. Por favor, intenta nuevamente.'
      )
    }
  }

  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  const MiddleText = ({ children }) => (
    <View style={styles.descriptionWrapper}>
      <Text style={styles.description}>{children}</Text>
    </View>
  )

  const ExchangeCard = ({ xwc, xcoin }) => (
    <TouchableOpacity
      style={styles.exchangeCardWrapper}
      onPress={() => handleExchange(xwc, xcoin)}
    >
      <Text style={styles.exchangeCardText}>{xwc + ' XWC'}</Text>
      <Text style={styles.exchangeCardText}>{'='}</Text>
      <Text style={styles.exchangeCardText}>{xcoin + ' XCN'}</Text>
    </TouchableOpacity>
  )

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Card title="XWC Totales" style={styles.cardBackgroundColor}>
            <Text style={styles.title}>{userTokens} XWC</Text>
          </Card>

          <MiddleText>
            Canjea tus XWC por XCN para tener en tu cuenta y acceder a
            beneficios increíbles
          </MiddleText>

          <Card title="Opciones">
            <View>
              <ExchangeCard xwc="200" xcoin="2" />
              <ExchangeCard xwc="400" xcoin="4" />
              <ExchangeCard xwc="600" xcoin="6" />
              <ExchangeCard xwc="800" xcoin="8" />
              <ExchangeCard xwc="1000" xcoin="10" />
              <ExchangeCard xwc="1200" xcoin="12" />
              <ExchangeCard xwc="1400" xcoin="14" />
            </View>
          </Card>
        </ScrollView>
      </ImageBackground>
    </Block>
  )
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    marginTop: 0,
  },
  background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  detailCard: {
    backgroundColor: walletTheme.COLORS.VIOLET,
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
    fontSize: 20,
    marginBottom: theme.SIZES.BASE / 2,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.WHITE,
  },
  description: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    textAlign: 'justify',
  },
  scrollViewContent: {
    paddingTop: 100,
    paddingBottom: 150,
  },
  cardBackgroundColor: {
    backgroundColor: '#000000',
  },
  centerCard: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCardCentered: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
    display: 'flex',
    alignItems: 'center',
    color: '#FFFFFF',
  },
  newCardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  descriptionWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 50,
    paddingRight: 50,
  },
  description: {
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  exchangeCardWrapper: {
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: '#5144A6',
  },
  exchangeCardsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingTop: 30,
    marginBottom: 200,
  },
  exchangeCardText: {
    fontSize: 18,
    color: '#5144A6',
    fontWeight: 'bold',
  },
})

export default MissionsStore
