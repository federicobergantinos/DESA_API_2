import React, { useState, useEffect } from 'react'
import { FlatList, View, ImageBackground, TouchableOpacity } from 'react-native'
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
  const toggleBalanceVisibility = () => setShowBalance(!showBalance)

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
          title="Enviar"
          onPress={() => {
            /* Acción aquí */
          }}
        />
        <ActionButton
          icon="dollar-sign"
          family="Feather"
          title="Invertir"
          onPress={() => {
            /* Acción aquí */
          }}
        />
        <ActionButton
          icon="receipt"
          family="FontAwesome5"
          title="Impuestos"
          onPress={() => {
            /* Acción aquí */
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
      render: () => <RenderMainInformation />,
    },
    { key: 'buttons', render: renderButtons },
    {
      key: 'transactionsDetail',
      render: () => <RenderTransactionsDetail />,
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
                    />
                  )
                case 'buttons':
                  return renderButtons()
                case 'transactionsDetail':
                  return (
                    <RenderTransactionsDetail
                      showBalance={showBalance}
                      navigation={navigation}
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
          />
        </ImageBackground>
      </Block>
    </Block>
  )
}

export default Home
