import React, { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native'
import { Block, Text, theme } from 'galio-framework'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../components/Icon'
import { Images, walletTheme } from '../constants'
import backendGateway from '../api/backendGateway'
import backendApi from '../api/backendGateway'
import WalletContext from '../navigation/WalletContext'
import LoadingScreen from '../components/LoadingScreen'
import { launchImageLibrary } from 'react-native-image-picker'
import RNFS from 'react-native-fs'

const { width, height } = Dimensions.get('window')

export function Settings() {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const { user, setUser } = useContext(WalletContext)
  const [imageUri, setImageUri] = useState(user.photoUrl)

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error)
      } else {
        const source = { uri: response.assets[0].uri }
        setImageUri(source.uri)

        // Convertir imagen a base64 y subirla
        RNFS.readFile(source.uri, 'base64')
          .then((base64Image) => {
            uploadImage(base64Image)
          })
          .catch((error) => {
            console.error('Error reading file: ', error)
          })
      }
    })
  }

  const uploadImage = async (base64Image) => {
    setIsLoading(true)
    try {
      const userId = await AsyncStorage.getItem('userId')
      if (!userId) throw new Error('Usuario no encontrado')

      const filename = `${userId}.jpg` // O cualquier lógica que prefieras
      const prefix = 'profile_pictures' // O cualquier prefijo que prefieras

      const response = await backendApi.usersGateway.uploadImage({
        image: base64Image,
        prefix,
        filename,
      })

      if (response.statusCode === 200) {
        try {
          const userId = await AsyncStorage.getItem('userId')
          if (!userId) throw new Error('Usuario no encontrado')
          const photoUrl = response.response.response // URL de la imagen subida
          const userData = {
            photoUrl: photoUrl,
          }

          const updateResponse = await backendApi.usersGateway.editProfile(
            userId,
            userData
          )
          if (updateResponse.statusCode === 200) {
            // Actualiza el estado de la imagen y del usuario
            setImageUri(photoUrl)
            setUser((prevUser) => ({ ...prevUser, photoUrl }))

            setIsLoading(false)
            alert('Imagen subida con éxito')
          } else {
            setIsLoading(false)
            console.error(
              'Error al actualizar la foto de perfil:',
              updateResponse
            )
            alert('Error al actualizar el perfil.')
          }
        } catch (error) {
          setIsLoading(false)
          console.error('Error al editar la foto de perfil:', error)
          alert('Error al editar la foto de perfil.')
        }
      } else {
        setIsLoading(false)
        console.error('Error al subir la imagen:', response)
        alert('Error al subir la imagen')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error al subir la imagen:', error)
      alert('Error al subir la imagen')
    }
  }

  const editProfile = async () => {
    setIsLoading(true)
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
        setUser((prevUser) => ({
          ...prevUser,
          name: nombre,
          surname: apellido,
        }))
        setIsLoading(false)
        alert('Perfil actualizado con éxito.')
      } else {
        setIsLoading(false)
        console.error('Error al actualizar el perfil:', updateResponse)
        alert('Error al actualizar el perfil.')
      }
    } catch (error) {
      setIsLoading(false)
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
      }
    }
    getUser()
  }, [])

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.container}>
            <View style={styles.profilePictureContainer}>
              <Image
                source={{ uri: user.photoUrl }} // Reemplaza con la URL de tu imagen de perfil
                style={styles.profilePicture}
              />
              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={selectImage}
              >
                <Icon
                  name="pencil"
                  family="EvilIcons"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNombre(text)}
                value={nombre}
                placeholder="Nombre"
                placeholderTextColor="#BFBFBF"
              />
              <TouchableOpacity style={styles.editIconInput}>
                <Icon
                  name="pencil"
                  family="EvilIcons"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setApellido(text)}
                value={apellido}
                placeholder="Apellido"
                placeholderTextColor="#BFBFBF"
              />
              <TouchableOpacity style={styles.editIconInput}>
                <Icon
                  name="pencil"
                  family="EvilIcons"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                editable={false}
                placeholder="Email"
                placeholderTextColor="#BFBFBF"
              />
            </View>
            <TouchableOpacity style={styles.vincularButton}>
              <Icon
                name="x-twitter"
                family="WalletExtra"
                size={24}
                color="black"
              />
              <Text style={styles.vincularText}>Vincular con X</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={editProfile} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
      <LoadingScreen visible={isLoading} />
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
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  scrollViewContent: {
    paddingTop: 100,
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
  },
  profileTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: walletTheme.COLORS.WHITE,
    borderRadius: 20,
    padding: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: width - 40,
  },
  inputLabel: {
    flex: 1,
    fontSize: 14,
    color: 'grey',
  },
  input: {
    flex: 4,
    paddingHorizontal: 10,
    color: 'black',
  },
  editIconInput: {
    padding: 5,
  },
  vincularButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    width: width - 40,
    justifyContent: 'center',
  },
  vincularText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#5a46b4',
    padding: 15,
    borderRadius: 10,
    width: width - 40,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default Settings
