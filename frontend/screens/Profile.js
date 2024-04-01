import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native'
import { Block, Text, theme } from 'galio-framework'
import { Button, Header } from '../components'
import { Images, walletTheme } from '../constants'
import { HeaderHeight } from '../constants/utils'
import { openImagePickerAsync } from '../components/ImagePicker.js'
import { useNavigation } from '@react-navigation/native'
import backendApi from '../api/backendGateway'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../components/Icon'

const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

export default function Profile() {
  const navigation = useNavigation()
  const [userId, setUserId] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  const handleImagePicked = async () => {
    try {
      const newImage = await openImagePickerAsync()
      if (newImage) {
        try {
          const response = await backendApi.transactionsGateway.uploadImage({
            image: newImage.base64,
          })
          if (response.statusCode === 200) {
            const imageUrl = response.response.images
            // Actualizar el perfil del usuario en el backend
            const userData = { photoUrl: imageUrl }
            const updateResponse = await backendApi.usersGateway.editProfile(
              userId,
              userData
            )
            if (updateResponse.statusCode === 200) {
              // Actualizar el estado local y la UI
              setUserInfo({ ...userInfo, photoUrl: imageUrl })
              alert('Foto del perfil actualizada con éxito.')
            } else {
              console.error('Error al actualizar el perfil del usuario.')
              alert('No se pudo actualizar la foto del perfil.')
            }
          }
        } catch (error) {
          console.error('Error al subir la imagen:', error)
          alert('No se pudo subir la imagen.')
        }
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error)
      alert('No se pudo seleccionar la imagen.')
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId')
        const { response, statusCode } =
          await backendApi.usersGateway.getUser(storedUserId)
        setUserId(storedUserId) // Almacenar userId en el estado
        setUserInfo(response.user) // Almacenar userId en el estado
      } catch (error) {
        console.error('Error inicializando el perfil:', error)
      }
    }

    init()
  }, [])

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={Images.Background}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: '25%' }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                {userInfo && (
                  <Image
                    source={{ uri: userInfo.photoUrl }}
                    style={styles.avatar}
                  />
                )}
                <View style={styles.parent}>
                  <TouchableOpacity
                    style={styles.container}
                    onPress={handleImagePicked}
                  >
                    <Icon name="camera" family="Feather" size={20} />
                  </TouchableOpacity>
                  <Text> </Text>
                </View>
              </Block>
              <Block style={styles.info}>
                <Block middle style={styles.nameInfo}>
                  <Text
                    style={{ fontFamily: 'open-sans-regular' }}
                    size={24}
                    color="#32325D"
                  >
                    {userInfo
                      ? `${userInfo.name} ${userInfo.surname}`
                      : 'Cargando...'}
                  </Text>
                </Block>
                <Block
                  middle
                  row
                  space="evenly"
                  style={{ marginTop: 5, paddingBottom: 24 }}
                ></Block>
              </Block>
            </Block>
            <Block style={{ marginBottom: 25 }} />
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    flex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 1.5,
    top: height / 10,
  },
  parent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  profileCard: {
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 100,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    backgroundColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  avatarInterno: {
    width: 248,
    height: 248,
    borderRadius: 62,
    borderWidth: 0,
    top: 200,
  },

  nameInfo: {
    marginTop: 5,
  },
  divider: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  thumb: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 4,
    marginBottom: 4,
    marginRight: 4,
  },
  // Asegúrate de que el bloque que contiene las miniaturas tenga `flexWrap: 'wrap'`
  favoritesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Ajusta esto para cambiar la alineación si es necesario
    // Otros estilos que puedas necesitar para este contenedor
  },
  favoritesContainerModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: thumbMeasure,
    margin: theme.SIZES.BASE / 4,
    justifyContent: 'flex-end', // Ajusta esto para cambiar la alineación si es necesario
    // Otros estilos que puedas necesitar para este contenedor
  },
  container: {
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginTop: -30,
    marginLeft: 80,
    width: 40,
    height: 40,
  },
  containerInterno: {
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: 140,
    height: 45,
    top: 220,
  },
  editarPerfilPopup: {
    backgroundColor: '#000000aa',
    flex: 1,
  },
  editarPerfilPopupInterno: {
    backgroundColor: '000000aa',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
})
