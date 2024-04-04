import React, { useContext, useRef, useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Modal,
  Alert,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import Icon from '../components/Icon'
import Input from '../components/Input'
import CheckBox from '@react-native-community/checkbox'
import { useNavigation } from '@react-navigation/native'
import backendApi from '../api/backendGateway'
import { useWallet } from '../navigation/WalletContext'

const { width, height } = Dimensions.get('screen')

const Transfer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactAccountNumber, setContactAccountNumber] = useState('')
  const [contactAccountType, setContactAccountType] = useState('Checking')
  const [isCheckingAccount, setIsCheckingAccount] = useState(true)
  const [contacts, setContacts] = useState([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const searchInputRef = useRef(null)
  const [localSearch, setLocalSearch] = useState('')
  const { user, selectedAccount } = useWallet()
  const [editingContact, setEditingContact] = useState(null)
  const [shouldFocus, setShouldFocus] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [localAmount, setLocalAmount] = useState('')

  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)
  const navigation = useNavigation()

  useEffect(() => {
    // Inicializar la búsqueda cuando el componente se monta
    fetchContacts(localSearch)
  }, []) // Dependencias vacías para ejecutar solo en el montaje

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContacts(localSearch) // Llama a tu función de búsqueda aquí
    }, 500) // Retardo de 500 ms

    return () => clearTimeout(delayDebounceFn)
  }, [localSearch, fetchContacts]) // Dependencias para re-ejecutar cuando estos valores cambien

  useEffect(() => {
    if (editingContact) {
      setContactName(editingContact.name)
      setContactAccountNumber(editingContact.accountNumber)
      // Asegúrate de establecer cualquier otro estado necesario para la edición aquí
    } else {
      // Resetea los estados a valores predeterminados si no estás en modo de edición
      setContactName('')
      setContactAccountNumber('')
      // Resetea cualquier otro estado necesario aquí
    }
  }, [editingContact])

  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  const fetchContacts = async (searchTerm = '') => {
    setIsLoadingContacts(true)
    try {
      const response = await backendApi.contactsGateway.searchContacts(
        searchTerm,
        0,
        10,
        user.id
      )
      if (response.statusCode === 200) {
        setContacts(response.response.contact)
      } else {
        console.error('Error fetching contacts:', response)
        alert('Error al obtener los contactos.')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      alert('Error al obtener los contactos.')
    } finally {
      setIsLoadingContacts(false)
    }
  }

  const AmountInputCard = () => {
    // Manejador para actualizar el estado local mientras el usuario escribe
    const handleAmountChange = (text) => {
      setShouldFocus(true)
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

  const handleAddContact = async () => {
    // Validación de campos vacíos
    if (
      !contactName.trim() ||
      !contactAccountNumber.trim() ||
      !contactAccountType.trim()
    ) {
      alert('Por favor, completa todos los campos.')
      return
    }

    const contactData = {
      name: contactName,
      accountNumber: contactAccountNumber,
      accountType: contactAccountType,
      userId: user.id,
    }

    try {
      const response =
        await backendApi.contactsGateway.createContact(contactData)
      if (response.statusCode === 200 || response.statusCode === 201) {
        alert('Contacto agregado con éxito.')
        fetchContacts()
        hideModal()
      } else {
        alert('Hubo un problema al agregar el contacto.')
      }
    } catch (error) {
      console.error('Error al agregar el contacto:', error)
      alert('Error al tratar de agregar el contacto.')
    }
  }

  const ContactCard = ({ contact, onEdit, onDelete }) => {
    const selectContact = (contact) => {
      setSelectedContact(contact)
      setLocalSearch('')
    }
    const initial = contact.name[0].toUpperCase()

    return (
      <TouchableOpacity onPress={() => selectContact(contact)}>
        <View style={styles.contactCard}>
          <View style={styles.initialCircle}>
            <Text style={styles.initialText}>{initial}</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactInfo}>{contact.accountType}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => onEdit(contact)}
              style={{ marginRight: 10 }}
            >
              <Icon name="edit" family="Feather" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(contact.id)}>
              <Icon name="trash" family="Feather" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const handleDeleteContact = async (contactId) => {
    // Mostrar un alerta de confirmación antes de proceder a eliminar
    Alert.alert(
      'Eliminar contacto',
      '¿Estás seguro de que deseas eliminar este contacto?',
      [
        // Botón de cancelar
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        // Botón de confirmar, que llama a la función de eliminar
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const response =
                await backendApi.contactsGateway.deleteContact(contactId)
              if (response.statusCode === 204) {
                Alert.alert(
                  'Eliminado',
                  'El contacto ha sido eliminado correctamente.'
                )
                // Aquí deberías también actualizar tu estado para reflejar que el contacto fue eliminado,
                // tal vez removiéndolo de la lista de contactos mostrada.
                fetchContacts() // Recargar la lista de contactos para reflejar la eliminación.
              } else {
                // Manejo de algún código de estado inesperado.
                Alert.alert('Error', 'No se pudo eliminar el contacto.')
              }
            } catch (error) {
              console.error('Error al eliminar el contacto:', error)
              Alert.alert(
                'Error',
                'Ocurrió un error al intentar eliminar el contacto.'
              )
            }
          },
        },
      ]
    )
  }

  const handleEditContact = async (contact) => {
    showModal() // Muestra el modal para editar

    // Realiza la solicitud para obtener los detalles del contacto por ID
    try {
      const { response, statusCode } =
        await backendApi.contactsGateway.getContactById(contact.id, user.id)
      if (statusCode === 200) {
        setEditingContact(response)
      } else {
        console.error('Error al obtener los detalles del contacto:', response)
        Alert.alert(
          'Error',
          'No se pudieron obtener los detalles del contacto.'
        )
      }
    } catch (error) {
      console.error('Error al obtener los detalles del contacto:', error)
      Alert.alert(
        'Error',
        'Ocurrió un error al intentar obtener los detalles del contacto.'
      )
    }
  }

  const handleEditContactFinal = async () => {
    if (!contactName || !contactAccountNumber || !contactAccountType) {
      Alert.alert('Error', 'Por favor, completa todos los campos.')
      return
    }

    // Prepara los datos del contacto a actualizar
    const updatedContactData = {
      name: contactName,
      accountNumber: contactAccountNumber,
      accountType: contactAccountType,
      userId: user.id,
    }

    try {
      const response = await backendApi.contactsGateway.updateContact(
        editingContact.id,
        updatedContactData
      )
      if (response.statusCode === 200) {
        Alert.alert('Éxito', 'Contacto actualizado correctamente.')
        fetchContacts() // Recargar la lista de contactos para reflejar los cambios
        hideModal() // Cierra el modal de edición
      } else {
        Alert.alert('Error', 'No se pudo actualizar el contacto.')
      }
    } catch (error) {
      console.error('Error al actualizar el contacto:', error)
      Alert.alert(
        'Error',
        'Ocurrió un error al intentar actualizar el contacto.'
      )
    }
  }

  const handleAddContactButton = async () => {
    showModal()
    setEditingContact(false)
  }

  const ContactsCard = () => {
    const handleSearchChange = (text) => {
      setShouldFocus(true)
      setLocalSearch(text)
    }
    const dataToShow = selectedContact
      ? [selectedContact] // Solo muestra el contacto seleccionado
      : contacts.slice(0, 4)

    return (
      <Card title="Contactos">
        {!selectedContact && (
          <View style={styles.contactsContainer}>
            <Input
              right
              color="black"
              autoFocus={shouldFocus}
              style={styles.search}
              value={localSearch}
              placeholder="Buscar contacto"
              placeholderTextColor={'#8898AA'}
              onChangeText={handleSearchChange}
              ref={searchInputRef}
              iconContent={
                <Icon
                  size={16}
                  color={theme.COLORS.MUTED}
                  name="search-zoom-in"
                  family="WalletExtra"
                />
              }
            />
            <TouchableOpacity
              onPress={handleAddContactButton}
              style={styles.iconButton}
            >
              <Icon name="user-plus" family="Feather" size={20} />
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={dataToShow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          )}
        />
        {selectedContact && (
          <TouchableOpacity
            onPress={() => setSelectedContact(null)}
            style={styles.deselectButtonStyle}
          >
            <Text style={styles.deselectButtonText}>Buscar otro contacto</Text>
          </TouchableOpacity>
        )}
      </Card>
    )
  }

  const handleConfirm = async () => {
    // Asegurar que un contacto ha sido seleccionado y el monto ha sido ingresado
    if (!selectedContact || !localAmount) {
      Alert.alert(
        'Error',
        'Debes seleccionar un contacto y especificar un monto.'
      )
      return
    }

    // Construir el objeto de datos de la transacción
    console.log(selectedContact)
    const transactionData = {
      accountNumber: selectedContact.accountNumber,
      name: 'Transferencia',
      description: 'Transferencia',
      amount: -Math.abs(parseFloat(localAmount)),
      currency: 'USD',
      status: 'Paid',
      date: new Date().toISOString(),
    }

    try {
      const response =
        await backendApi.transactionsGateway.createTransaction(transactionData)
      if (response.statusCode === 200 || response.statusCode === 201) {
        Alert.alert('Éxito', 'La transferencia ha sido realizada exitosamente.')
        // Limpieza o acciones post-transacción
        setLocalAmount('')
        setSelectedContact(null)
        navigation.replace('Home')
      } else {
        // Manejo de otros códigos de estado HTTP
        Alert.alert('Error', 'No se pudo realizar la transferencia.')
      }
    } catch (error) {
      console.error('Error al crear la transacción:', error)
      Alert.alert(
        'Error',
        'Ocurrió un error al intentar realizar la transferencia.'
      )
    }
  }

  const handleCancel = () => {
    // Limpia los estados o navega a otra pantalla
    setSelectedContact(null)
    setLocalAmount('')
    navigation.replace('Home')
  }

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <View style={{ width: width, ...styles.scrollViewContent }}>
          {
            <>
              <AmountInputCard />
              <ContactsCard />

              {/* Botones */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCancel} style={styles.button}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                  <Text style={styles.buttonText}>Transferir</Text>
                </TouchableOpacity>
              </View>
            </>
          }
        </View>
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
              value={contactName}
              onChangeText={setContactName}
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
              value={contactAccountNumber}
              onChangeText={setContactAccountNumber}
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
                  if (editingContact) {
                    // Lógica para editar contacto
                    handleEditContactFinal()
                  } else {
                    // Lógica para agregar nuevo contacto
                    handleAddContact()
                  }
                }}
              >
                <Text style={styles.modalButtonText}>
                  {editingContact ? 'Editar' : 'Agregar'}
                </Text>
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
  buttonClose: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    elevation: 2,
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 5,
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: 'white',
    fontSize: 20,
  },
  contactDetails: {
    flex: 1,
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
  },
  contactInfo: {
    fontSize: 14,
    color: theme.COLORS.MUTED,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deselectButtonStyle: {
    backgroundColor: walletTheme.COLORS.VIOLET, // o cualquier color que prefieras
    padding: 10,
    borderRadius: 5,
    marginTop: 10, // Ajusta el margen según necesites
    alignItems: 'center', // Centra el texto en el botón
  },
  deselectButtonText: {
    color: 'white', // Color del texto
    fontWeight: 'bold', // Negrita para el texto
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: walletTheme.COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: walletTheme.COLORS.BLACK,
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Transfer
