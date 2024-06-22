import React, { useState, useEffect, useContext } from 'react'
import {
  FlatList,
  View,
  ImageBackground,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from 'react-native'
import { Block, Text } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import {
  RenderMainInformation,
  RenderTransactionsDetail,
  styles,
} from './Home/index.js'
import Icon from '../components/Icon'
import WalletContext from '../navigation/WalletContext'
import backendApi from '../api/backendGateway'

const Home = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { selectedAccount, user } = useContext(WalletContext)
  const [userTokens, setUserTokens] = useState(0)

  const toggleBalanceVisibility = () => setShowBalance(!showBalance)

  const onRefresh = () => {
    setRefreshing(true)
    fetchUserTokenBalance()
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  useEffect(() => {
    onRefresh()
  }, [selectedAccount])

  useEffect(() => {
    fetchUserTokenBalance()
  }, [user.id])

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

  const ActionButton = ({ icon, family, title, onPress }) => {
    return (
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
          <Icon
            family={family}
            size={20}
            name={icon}
            color={walletTheme.COLORS.WHITE}
          />
        </TouchableOpacity>
        <Text style={styles.actionText}>{title}</Text>
      </View>
    )
  }

  const handleOpenURL = async () => {
    const url = 'https://x.com/'
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      console.log(`Don't know how to open this URL: ${url}`)
    }
  }

  const renderButtons = () => {
    const isARSorUSD = ['ARS', 'USD'].includes(selectedAccount.accountCurrency)
    const buttonText = isARSorUSD ? 'Comprar' : 'Vender'
    const navigateTo = isARSorUSD ? 'BuyCrypto' : 'SellCrypto'

    return (
      <View style={styles.buttonsRow}>
        <ActionButton
          icon="arrow-down"
          family="Feather"
          title="Recibir"
          onPress={() => {
            navigation.navigate('AccountDetails')
          }}
        />
        <ActionButton
          icon="arrow-up"
          family="Feather"
          title="Transferir"
          onPress={() => {
            navigation.navigate('Transfer')
          }}
        />
        <ActionButton
          icon="attach-money"
          family="MaterialIcons"
          title={buttonText}
          onPress={() => {
            navigation.navigate(navigateTo)
          }}
        />
        <ActionButton
          icon="x-twitter"
          family="WalletExtra"
          title="Ingresa"
          onPress={handleOpenURL}
        />
      </View>
    )
  }

  const AccessBenefits = () => (
    <View style={styles.benefitsContainer}>
      <Text style={styles.benefitsTitle}>Accede a más beneficios</Text>
      <TouchableOpacity
        style={styles.benefitsButton}
        onPress={() => {
          navigation.navigate('Benefits')
        }}
      >
        <Text style={styles.benefitsButtonText}>Utilizar XCoin</Text>
      </TouchableOpacity>
    </View>
  )

  const TotalXWC = () => (
    <View style={styles.totalXWCContainer}>
      <View style={styles.totalXWCRow}>
        <Text style={styles.totalXWCTitle}>Tienes un total:</Text>
        <Text style={styles.totalXWCAmount}>{userTokens} XWC</Text>
      </View>
      <View style={styles.totalXWCButtons}>
        <TouchableOpacity
          style={styles.totalXWCButton}
          onPress={() => {
            navigation.navigate('Missions')
          }}
        >
          <Text style={styles.totalXWCButtonText}>Obtener más XWC</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.totalXWCButton}
          onPress={() => {
            navigation.navigate('MissionsStore')
          }}
        >
          <Text style={styles.totalXWCButtonText}>Canjear XWC</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const sections = [
    {
      key: 'mainInformation',
      render: () => (
        <RenderMainInformation
          showBalance={showBalance}
          toggleBalanceVisibility={toggleBalanceVisibility}
          refreshing={refreshing}
        />
      ),
    },
    { key: 'buttons', render: renderButtons },
    { key: 'accessBenefits', render: AccessBenefits },
    { key: 'totalXWC', render: TotalXWC },
    {
      key: 'transactionsDetail',
      render: () => (
        <RenderTransactionsDetail
          showBalance={showBalance}
          navigation={navigation}
          refreshing={refreshing}
        />
      ),
    },
  ]

  return (
    <Block flex style={styles.Home}>
      <Block flex>
        <ImageBackground
          source={Images.Background}
          imageStyle={styles.Background}
        >
          <FlatList
            data={sections}
            renderItem={({ item }) => {
              switch (item.key) {
                case 'mainInformation':
                  return (
                    <RenderMainInformation
                      showBalance={showBalance}
                      toggleBalanceVisibility={toggleBalanceVisibility}
                      refreshing={refreshing}
                    />
                  )
                case 'buttons':
                  return renderButtons()
                case 'accessBenefits':
                  return AccessBenefits()
                case 'totalXWC':
                  return TotalXWC()
                case 'transactionsDetail':
                  return (
                    <RenderTransactionsDetail
                      showBalance={showBalance}
                      navigation={navigation}
                      refreshing={refreshing}
                    />
                  )
                default:
                  return null
              }
            }}
            keyExtractor={(item) => item.key}
            ListHeaderComponent={<View style={{ height: 20 }} />}
            ListFooterComponent={<View style={{ height: 20 }} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </ImageBackground>
      </Block>
    </Block>
  )
}

export default Home
