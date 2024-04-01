import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
} from 'react-native'
import { Block, Text, theme } from 'galio-framework'
import { Switch } from '../components'
import walletTheme from '../constants/Theme'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import backendGateway from '../api/backendGateway'
import backendApi from '../api/backendGateway'

const { width } = Dimensions.get('window')

export default function Settings() {
  const navigation = useNavigation()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const logOut = async () => {
    await AsyncStorage.clear()
    await GoogleSignin.signOut()
    navigation.navigate('Login')
  }

  const deleteAccount = async () => {
    await AsyncStorage.clear()
    await backendGateway.authUser.deleteCredential()
    navigation.navigate('Login')
  }

  const editProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId')
      if (!userId) throw new Error('Usuario no encontrado')

      const userData = {
        name: nombre,
        surname: apellido,
      }

      const updateResponse = await backendApi.usersGateway.editProfile(
        userId,
        userData
      )
      if (updateResponse.statusCode === 200) {
        alert('Perfil actualizado con éxito.')
      } else {
        console.error('Error al actualizar el perfil:', updateResponse)
        alert('Error al actualizar el perfil.')
      }
    } catch (error) {
      console.error('Error al editar el perfil:', error)
      alert('Error al editar el perfil.')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId')
        const { response, statusCode } =
          await backendGateway.usersGateway.getUser(userId)
        if (statusCode === 200) {
          setNombre(response.user.name)
          setApellido(response.user.surname)
          setEmail(response.user.email)
        }
      } catch (error) {
        console.error('Error al obtener usuario', error)
        // Handle error or navigation if needed
      }
    }
    getUser()
  }, [])

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'deleteAccount':
        return (
          <TouchableOpacity onPress={deleteAccount}>
            <View style={styles.deleteButton}>
              <Text style={{ color: 'red' }}>Eliminar Cuenta</Text>
            </View>
          </TouchableOpacity>
        )
      case 'nameInput':
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text
              style={{ fontFamily: 'open-sans-regular' }}
              size={14}
              color="#525F7F"
            >
              {item.title}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setNombre(text)}
              value={nombre}
              placeholder={item.title}
              placeholderTextColor="#BFBFBF"
            />
          </Block>
        )
      case 'lastNameInput':
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text
              style={{ fontFamily: 'open-sans-regular' }}
              size={14}
              color="#525F7F"
            >
              {item.title}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setApellido(text)}
              value={apellido}
              placeholder={item.title}
              placeholderTextColor="#BFBFBF"
            />
          </Block>
        )
      case 'mailInput':
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text
              style={{ fontFamily: 'open-sans-regular' }}
              size={14}
              color="#525F7F"
            >
              {item.title}
            </Text>
            <TextInput
              style={[styles.inputContainer, { color: '#BFBFBF' }]}
              value={email}
              editable={false}
            />
          </Block>
        )
      case 'actionRow':
        return (
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={editProfile} style={{ marginRight: 10 }}>
              <View style={styles.editProfile}>
                <Text style={{ color: 'white' }}>Guardar Cambios</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={logOut}>
              <View style={styles.logoutButton}>
                <Text style={{ color: 'grey' }}>Cerrar sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      default:
        break
    }
  }

  const recommended = [
    { title: 'Nombre', id: 'nombre', type: 'nameInput' },
    { title: 'Apellido', id: 'apellido', type: 'lastNameInput' },
    { title: 'Mail', id: 'mail', type: 'mailInput' },
    // { title: "Guardar Cambios", id: "editProfile", type: "editProfile" },
    { title: 'Cerrar Sesión', id: 'sesion', type: 'actionRow' },
  ]

  const payment = [
    { title: 'Eliminar Cuenta', id: 'delete', type: 'deleteAccount' },
  ]

  return (
    <View style={styles.container}>
      <Block center style={styles.title}>
        <Text
          style={{ fontFamily: 'open-sans', paddingBottom: 5 }}
          size={theme.SIZES.BASE}
          color={walletTheme.COLORS.TEXT}
        >
          Configuración Recomendada
        </Text>
      </Block>
      <FlatList
        data={recommended}
        keyExtractor={(item, index) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
      <Block center style={styles.title}>
        <Text
          style={{
            fontFamily: 'open-sans-bold',
            paddingBottom: 10,
            color: 'red',
          }}
          size={theme.SIZES.BASE}
          color={walletTheme.COLORS.TEXT}
        >
          Danger Zone
        </Text>
      </Block>
      <FlatList
        data={payment}
        keyExtractor={(item, index) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: width - theme.SIZES.BASE * 2,
    alignSelf: 'center',
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
  },
  input: {
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    width: width * 0.65,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: 'gray',
  },
  inputContainer: {
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: 'gray',
    width: width * 0.65,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: 'gray',
  },
  logoutButton: {
    paddingHorizontal: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'grey',
    height: 30,
    marginLeft: 10,
  },
  deleteButton: {
    paddingHorizontal: 10,
    width: 150, // O puedes usar 'width: '80%' para que el botón tenga un ancho relativo al contenedor
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'red',
    alignSelf: 'center', // Asegura que el botón esté centrado dentro de su contenedor
    height: 30,
  },
  editProfile: {
    paddingHorizontal: 10,
    height: 30,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#5a46b4',
    borderColor: '#5a46b4',
  },
  actionRow: {
    flexDirection: 'row', // Alinea los elementos en fila
    justifyContent: 'center', // Centra los elementos en el eje principal
    alignItems: 'center', // Centra los elementos en el eje cruzado
    marginTop: 10,
    marginBottom: 10,
  },
})
