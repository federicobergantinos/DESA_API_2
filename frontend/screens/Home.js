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

const Home = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { selectedAccount } = useContext(WalletContext)
  const toggleBalanceVisibility = () => setShowBalance(!showBalance)

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
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
    const isXCN = selectedAccount.accountCurrency === 'XCN'
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
          icon={isXCN ? 'attach-money' : 'attach-money'}
          family="MaterialIcons"
          title={isXCN ? 'Vender' : 'Comprar'}
          onPress={() => {
            navigation.navigate(isXCN ? 'SellCrypto' : 'BuyCrypto')
          }}
        />
        <ActionButton
          icon="twitter"
          family="AntDesign"
          title="Twitter"
          onPress={() => {
            handleOpenURL()
          }}
        />
      </View>
    )
  }

  const AccessBenefits = () => {
    return (
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
  }

  const TotalXWC = () => {
    return (
      <View style={styles.totalXWCContainer}>
        <View style={styles.totalXWCRow}>
          <Text style={styles.totalXWCTitle}>Tienes un total:</Text>
          <Text style={styles.totalXWCAmount}>400 XWC</Text>
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
  }

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
    ...(selectedAccount.accountCurrency === 'XCN'
      ? [
          { key: 'accessBenefits', render: AccessBenefits },
          { key: 'totalXWC', render: TotalXWC },
        ]
      : []),
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
