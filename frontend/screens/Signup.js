import React, { useState } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { logOut, authService } from '../components/Google'
import LoadingScreen from '../components/LoadingScreen'
import backendApi from '../api/backendGateway'
import { useWallet } from '../navigation/WalletContext'
import createLogger from '../components/Logger'
import CheckBox from '@react-native-community/checkbox'

const logger = createLogger('signup.js')
const { width, height } = Dimensions.get('screen')

const Signup = ({ route }) => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setSelectedAccount } = useWallet()
  const [address, setAddress] = useState('')
  const [isCheckingAccount, setIsCheckingAccount] = useState(true)

  // Nuevos campos
  const [propiedades, setPropiedades] = useState('')
  const [ingresos, setIngresos] = useState('')
  const [empleo, setEmpleo] = useState('')
  const [tieneTesla, setTieneTesla] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const canConfirm =
    address !== '' && propiedades !== '' && ingresos !== '' && empleo !== '' // Validaciones adicionales

  const updateUserAndAccount = (userData, accountData) => {
    setUser(userData)
    setSelectedAccount(accountData)
  }

  const handleConfirm = async () => {
    if (!canConfirm) {
      alert('Por favor, completa todos los campos requeridos.')
      return
    }

    try {
      setIsLoading(true)
      const idToken = route.params.idToken

      const { response, statusCode } = await backendApi.authUser.authenticate({
        token: idToken,
        registerUser: true,
        accountInfo: {
          beneficiaryAddress: address,
          accountType: 'Checking',
          propiedades,
          ingresos,
          empleo,
          tieneTesla,
        },
      })

      if (statusCode === 201) {
        await authService.saveCredentials({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.id,
          navigation: navigation,
          updateUserAndAccount: updateUserAndAccount,
        })
      }
      setIsLoading(false)
    } catch (error) {
      logger.error(error)
      await logOut()
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    await logOut()
    setIsLoading(false)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  }

  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  const renderItem = ({ item }) => {
    return <Card title={item.title}>{item.component}</Card>
  }

  const data = [
    {
      title: 'Dirección',
      component: (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.inputText}>
            {address === '' ? 'Ingresa tu dirección' : address}
          </Text>
        </TouchableOpacity>
      ),
    },
    {
      title: 'Propiedades',
      component: (
        <Picker
          selectedValue={propiedades}
          onValueChange={(itemValue, itemIndex) => setPropiedades(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="1 a 2" value="1 a 2" />
          <Picker.Item label=">2" value=">2" />
        </Picker>
      ),
    },
    {
      title: 'Ingresos Mensuales',
      component: (
        <Picker
          selectedValue={ingresos}
          onValueChange={(itemValue, itemIndex) => setIngresos(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="<500 USD" value="<500" />
          <Picker.Item label="<1000 USD" value="<1000" />
          <Picker.Item label=">1000 USD" value=">1000" />
        </Picker>
      ),
    },
    {
      title: 'Situación Laboral',
      component: (
        <Picker
          selectedValue={empleo}
          onValueChange={(itemValue, itemIndex) => setEmpleo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Relación de Dependencia" value="dependencia" />
          <Picker.Item label="Monotributista" value="monotributista" />
          <Picker.Item label="Desempleado" value="desempleado" />
        </Picker>
      ),
    },
    {
      title: '¿Tiene algo de Tesla?',
      component: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox value={tieneTesla} onValueChange={setTieneTesla} />
          <Text style={styles.description}>Sí</Text>
        </View>
      ),
    },
  ]

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Block flex style={styles.home}>
        <ImageBackground source={Images.Background} style={styles.background}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.scrollViewContent}
          />
        </ImageBackground>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleCancel} style={styles.button}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirm} style={styles.button}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Block>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <GooglePlacesAutocomplete
            placeholder="Ingresa tu dirección"
            onPress={(data, details = null) => {
              console.log(data)
              setAddress(data.description)
              setIsModalVisible(false)
            }}
            query={{
              key: 'API_KEY',
              language: 'es',
            }}
            styles={{
              textInputContainer: styles.textInputContainer,
              textInput: styles.textInput,
              listView: styles.listView,
            }}
            fetchDetails={true}
            value={address}
          />
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  home: {
    // marginTop: 0,
  },
  background: {
    width: width,
    height: height * 1.2,
    marginTop: -70,
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
    paddingTop: 60,
    paddingBottom: 150,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  picker: {
    height: 50,
    width: width * 0.8,
  },
  listView: {
    position: 'absolute',
    top: 50,
    zIndex: 1000,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.COLORS.GREY,
    borderRadius: 5,
  },
  inputText: {
    fontSize: 16,
    color: theme.COLORS.BLACK,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  closeButton: {
    backgroundColor: walletTheme.COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
})

export default Signup
