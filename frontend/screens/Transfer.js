import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import Icon from '../components/Icon'
import Input from '../components/Input'
import CheckBox from '@react-native-community/checkbox'
const { width, height } = Dimensions.get('screen')

const Transfer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactAccountNumber, setContactAccountNumber] = useState('')
  const [contactAccountType, setContactAccountType] = useState('')
  const [isCheckingAccount, setIsCheckingAccount] = useState(true)

  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)

  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )
  const AmountInputCard = () => {
    const [localAmount, setLocalAmount] = useState('')

    // Manejador para actualizar el estado local mientras el usuario escribe
    const handleAmountChange = (text) => {
      setLocalAmount(text)
    }

    return (
      <Card title="Ingrese el monto">
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={localAmount}
            onChangeText={handleAmountChange}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={walletTheme.COLORS.VIOLET}
          />
          {/* Otros componentes aquí */}
        </View>
      </Card>
    )
  }

  const ContactsCard = () => {
    const [localSearch, setLocalSearch] = useState('')

    const handleSearchChange = (text) => {
      setLocalSearch(text)
    }

    return (
      <Card title="Contactos">
        <View style={styles.contactsContainer}>
          <Input
            right
            color="black"
            style={styles.search}
            value={localSearch}
            placeholder="Buscar contacto"
            placeholderTextColor={'#8898AA'}
            onChangeText={handleSearchChange}
            iconContent={
              <Icon
                size={16}
                color={theme.COLORS.MUTED}
                name="search-zoom-in"
                family="WalletExtra"
              />
            }
          />
          <TouchableOpacity onPress={showModal} style={styles.iconButton}>
            <Icon name="user-plus" family="Feather" size={20} />
          </TouchableOpacity>
        </View>
      </Card>
    )
  }

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="always"
        >
          {
            <>
              <AmountInputCard />
              <ContactsCard />
            </>
          }
        </ScrollView>
      </ImageBackground>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Input
              right
              color="black"
              placeholder="Nombre del contacto"
              iconContent={
                <Icon
                  size={16}
                  color={theme.COLORS.MUTED}
                  name="contacts"
                  family="AntDesign"
                />
              }
            />
            <Input
              right
              color="black"
              placeholder="Numero de cuenta"
              iconContent={
                <Icon
                  size={16}
                  color={theme.COLORS.MUTED}
                  name="infocirlceo"
                  family="AntDesign"
                />
              }
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox value={isCheckingAccount} onValueChange={() => {}} />
              <Text style={styles.description}>Checking Account</Text>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={hideModal}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonAdd]}
                onPress={() => {
                  console.log('Agregar contacto')
                  // Aquí agregarías la lógica para realmente agregar el contacto
                  hideModal()
                }}
              >
                <Text style={styles.modalButtonText}>Agregar Contacto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  detailCard: {
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
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: theme.SIZES.BASE / 2,
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
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: walletTheme.COLORS.VIOLET,
    flex: 1,
  },
  amountDecimal: {
    fontSize: 24,
    color: walletTheme.COLORS.VIOLET,
    paddingBottom: 5, // to align with the decimals input
  },
  decimalsInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: walletTheme.COLORS.VIOLET,
    width: 60, // fixed width for decimals
  },
  iconButton: { marginRight: 5 },
  decimalsInput: {
    fontSize: 20,
    color: walletTheme.COLORS.VIOLET,
  },
  contactsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    flex: 1, // Asegura que el input tome la mayoría del espacio disponible
    borderWidth: 1,
    borderRadius: 3,
    borderColor: walletTheme.COLORS.BORDER,
    marginRight: width * 0.25,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInput: {
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderRadius: 5,
  },
  buttonClose: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Asegúrate de que los botones se distribuyan a lo largo del modal
  },
  modalButton: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    justifyContent: 'center',
    marginTop: 10,
    width: '45%',
  },
  buttonClose: {
    backgroundColor: '#d1d1d1', // Un color diferente para el botón cancelar
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default Transfer
