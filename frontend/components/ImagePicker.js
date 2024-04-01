import * as ImagePicker from 'expo-image-picker'

// Función para abrir la biblioteca de imágenes y seleccionar una imagen
export const openImagePickerAsync = async () => {
  let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permissionResult.granted) {
    alert('Se requiere permiso para acceder al carrete de la cámara.')
    return
  }

  let pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,
  })

  if (pickerResult.canceled) {
    return
  }

  // Accede a la imagen seleccionada a través del array "assets"
  if (pickerResult.assets && pickerResult.assets.length > 0) {
    const selectedAsset = pickerResult.assets[0]
    const imageUri = selectedAsset.uri
    const imageBase64 = selectedAsset.base64
    return { uri: imageUri, base64: imageBase64 }
  } else {
    // Manejar el caso de que no haya activos seleccionados o disponibles
    alert('No se pudo seleccionar la imagen.')
    return
  }
}
