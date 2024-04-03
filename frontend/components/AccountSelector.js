import React, { useState, useEffect } from 'react'
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useWallet } from '../navigation/WalletContext'
const { width, height } = Dimensions.get('screen')
import backendApi from '../api/backendGateway'

const AccountSelector = ({ isVisible, onClose, onSelectAccount }) => {
  const { user } = useWallet()
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { response, statusCode } =
          await backendApi.accountGateway.getAccountByUserId(user.id)
        if (statusCode === 200) {
          setAccounts(response)
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
      }
    }

    fetchAccounts()
  }, [user])

  if (!isVisible) return null

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.accountId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelectAccount(item)
                  onClose()
                }}
                style={styles.accountListItem}
              >
                <Text style={styles.accountListItemText}>
                  {item.accountNumber} ({item.accountType})
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    width: width * 0.8,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  accountListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  accountListItemText: {
    fontSize: 16,
  },
})

export default AccountSelector
