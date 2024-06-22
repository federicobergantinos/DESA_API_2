import React, { useState, useEffect } from 'react'
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import backendApi from '../api/backendGateway'
import { useWallet } from '../navigation/WalletContext'
import LoadingScreen from '../components/LoadingScreen'

const { width, height } = Dimensions.get('screen')

const Benefits = () => {
  const [balance, setBalance] = useState(0)
  const [benefits, setBenefits] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [xCoinAccount, setXCoinAccount] = useState(null)
  const { user } = useWallet()
  const [openSections, setOpenSections] = useState({})

  useEffect(() => {
    const fetchBalanceAndBenefits = async () => {
      try {
        const userId = user.id
        const accountsResponse =
          await backendApi.accountGateway.getAccountByUserId(userId)

        const xCoinAccount = accountsResponse.response.find(
          (account) => account.accountCurrency === 'XCN'
        )

        if (xCoinAccount) {
          setXCoinAccount(xCoinAccount)
          const balanceResponse = await backendApi.transactionsGateway.balance(
            xCoinAccount.accountNumber
          )
          setBalance(balanceResponse.response)
        }

        const benefitsResponse =
          await backendApi.benefitsGateway.getAllBenefits()
        const benefitsByCategory = benefitsResponse.response.reduce(
          (acc, benefit) => {
            acc[benefit.title] = acc[benefit.title] || []
            acc[benefit.title].push(benefit)
            return acc
          },
          {}
        )
        setBenefits(benefitsByCategory)
      } catch (error) {
        console.error('Error fetching balance and benefits:', error)
      }
    }

    fetchBalanceAndBenefits()
  }, [user.id])

  const toggleSection = (title) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }))
  }

  const handlePurchase = async (benefit) => {
    setIsLoading(true)
    if (xCoinAccount && balance >= benefit.price) {
      try {
        const transactionData = {
          accountNumberOrigin: xCoinAccount.accountNumber,
          accountNumberDestination:
            '0xbCF5801F122E7645F39bDd38Ce9253e208b7f0a8',
          name: `Compra de ${benefit.title}`,
          description: `Compra de ${benefit.title}`,
          amountOrigin: benefit.price,
          amountDestination: benefit.price,
          currencyOrigin: 'XCoin',
          currencyDestination: 'XCoin',
          status: 'pending',
          date: new Date().toISOString(),
        }
        await backendApi.transactionsGateway.createTransaction(transactionData)
        setBalance(balance - benefit.price)
        alert(`Has comprado ${benefit.title}`)

        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error('Error al realizar la compra:', error)
        alert('Error al realizar la compra')
      }
    } else {
      setIsLoading(false)
      alert('Saldo insuficiente')
    }
  }

  const BalanceCard = ({ title, children }) => (
    <View style={styles.detailCardBalance}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

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

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Card>
            <Text style={styles.balanceText}>XCoin totales</Text>
            <Text style={styles.balanceAmount}>{balance.toFixed(2)} XCoin</Text>
          </Card>
          <MiddleText>
            <Text style={styles.subtitle}>
              ¡Utiliza tu XCoin para obtener beneficios increíbles!
            </Text>
          </MiddleText>
          <BalanceCard title="Servicios">
            {Object.keys(benefits).map((title) => (
              <View key={title}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleSection(title)}
                >
                  <Text style={styles.dropdownText}>{title}</Text>
                  <Icon
                    name={openSections[title] ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                {openSections[title] && (
                  <View style={styles.dropdownContent}>
                    {benefits[title].map((benefit) => (
                      <TouchableOpacity
                        key={benefit.id}
                        style={styles.optionButton}
                        onPress={() => handlePurchase(benefit)}
                      >
                        <Text style={styles.optionText}>
                          {benefit.price} XCoin → {benefit.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </BalanceCard>
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
  detailCardBalance: {
    backgroundColor: walletTheme.COLORS.WHITE,
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
  detailCard: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    textAlign: 'justify',
  },
  scrollViewContent: {
    paddingTop: 100,
    paddingBottom: 200,
  },
  balanceText: {
    color: '#F2F2F2',
    fontSize: 18,
    marginTop: -30,
  },
  balanceAmount: {
    color: '#F2F2F2',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: theme.SIZES.BASE / 2,
  },
  button: {
    backgroundColor: '#5D4EBF',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F2F2F2',
    fontSize: 18,
  },
  subtitle: {
    color: '#F2F2F2',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  dropdownButton: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dropdownText: {
    color: '#F2F2F2',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  dropdownContent: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: walletTheme.COLORS.WHITE,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  optionText: {
    color: walletTheme.COLORS.VIOLET,
    fontSize: 16,
    textAlign: 'center',
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
})

export default Benefits
