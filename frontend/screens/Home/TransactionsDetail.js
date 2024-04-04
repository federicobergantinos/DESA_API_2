import React, { useContext, useState, useEffect } from 'react'
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { Block, Icon } from 'galio-framework'
import styles from './HomeStyles'
import backendApi from '../../api/backendGateway'
import { walletTheme } from '../../constants'
import WalletContext from '../../navigation/WalletContext'

const MAX_ITEMS = 5

const RenderTransactionsDetail = ({ showBalance, navigation, refreshing }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [allItemsLoaded, setAllItemsLoaded] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const { user, selectedAccount } = useContext(WalletContext)

  const renderEmptyListMessage = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>Sin Transacciones</Text>
      </View>
    )
  }

  useEffect(() => {
    if (refreshing) {
      setCurrentPage(0)
      setData([])
      setAllItemsLoaded(false)
      setAttempts(0)
    }
  }, [refreshing, selectedAccount])

  useEffect(() => {
    const fetchTransactions = async () => {
      if (loading || allItemsLoaded || !selectedAccount || attempts >= 3) return

      setLoading(true)
      try {
        const accountNumber = selectedAccount.accountNumber
        if (!accountNumber) {
          throw new Error('Account ID is not available')
        }

        const response = await backendApi.transactionsGateway.getAll(
          currentPage,
          accountNumber
        )

        const transactions = response.response

        if (transactions.length > 0) {
          if (currentPage === 0) {
            setData(transactions)
          } else {
            setData((prevData) => [...prevData, ...transactions])
          }
          setAttempts(0)
        } else {
          setAllItemsLoaded(true)
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setAttempts((prevAttempts) => prevAttempts + 1)
        setTimeout(() => {
          setCurrentPage(currentPage)
        }, 1000 * attempts)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [currentPage, attempts, selectedAccount, refreshing])

  const renderTransaction = ({ item }) => {
    const isPositive = item.amount > 0
    const containerStyle = isPositive
      ? styles.iconContainerNegative
      : styles.iconContainer
    const iconColor = isPositive ? '#00C853' : '#C70039'
    const formattedAmount = parseFloat(item.amount).toFixed(2)
    const amountDisplay = showBalance
      ? `${formattedAmount} ${item.currency}`
      : '***'

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Transaction', { transactionId: item.id })
        }
      >
        <View style={styles.itemContainer}>
          <View style={containerStyle}>
            <Icon
              name="credit-card"
              family="Entypo"
              size={24}
              color={iconColor}
            />
          </View>
          <View style={styles.textDetailsContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.description}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>{amountDisplay}</Text>
            <Text style={styles.itemPaid}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const loadMoreItems = () => {
    if (!loading && !allItemsLoaded) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const renderFooter = () => {
    if (!modalVisible && data.length > MAX_ITEMS) {
      return (
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Ver más</Text>
        </TouchableOpacity>
      )
    }

    return loading ? <ActivityIndicator animating size="large" /> : null
  }

  const renderModalFooter = () => {
    return loading ? (
      <ActivityIndicator animating size="large" />
    ) : (
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.buttonText}>Cerrar</Text>
      </TouchableOpacity>
    )
  }

  return (
    <Block
      flex
      style={[
        styles.HomeCard,
        {
          marginTop: 20,
        },
      ]}
    >
      <View>
        <Text style={[styles.balanceText, { color: walletTheme.COLORS.BLACK }]}>
          Transacciones
        </Text>
      </View>
      <FlatList
        data={data.slice(0, MAX_ITEMS)}
        renderItem={({ item }) => renderTransaction({ item })}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactions}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyListMessage}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={data}
              renderItem={renderTransaction}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={renderModalFooter}
            />
          </View>
        </View>
      </Modal>
    </Block>
  )
}

export default RenderTransactionsDetail
