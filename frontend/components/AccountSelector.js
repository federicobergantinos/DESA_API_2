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
          <Text style={styles.modalTitle}>Selecciona tu billetera</Text>
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
                  Billetera de {item.accountType} ({item.accountCurrency})
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4F3C75',
  },
  accountListItem: {
    backgroundColor: '#4F3C75',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  accountListItemText: {
    color: 'white',
    fontSize: 16,
  },
})

export default AccountSelector
