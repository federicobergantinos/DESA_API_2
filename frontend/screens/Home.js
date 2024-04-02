import React, { useState, useEffect } from 'react'
import {
  FlatList,
  View,
  ImageBackground,
  TouchableOpacity,
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

const Home = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
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

  const renderButtons = () => {
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
          icon="dollar-sign"
          family="Feather"
          title="Analytics"
          onPress={() => {
            navigation.navigate('Analytics')
          }}
        />
        <ActionButton
          icon="receipt"
          family="FontAwesome5"
          title="Otros"
          onPress={() => {
            navigation.navigate('Others')
          }}
        />
      </View>
    )
  }

  updateState = (newState) => {
    this.setState(newState)
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
