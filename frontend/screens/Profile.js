import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Button, Header } from "../components";
import { Images, walletTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { openImagePickerAsync } from "../components/ImagePicker.js";
import { useNavigation } from "@react-navigation/native";
import backendApi from "../api/backendGateway";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

export default function Profile() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recipesCount, setRecipesCount] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [modalContent, setModalContent] = useState({ type: "", items: [] });
  const [isModalVisible, setModalVisible] = useState(false);

  const handleImagePicked = async () => {
    try {
      const newImage = await openImagePickerAsync();
      if (newImage) {
        try {
          const response = await backendApi.transactionsGateway.uploadImage({
            image: newImage.base64,
          });
          if (response.statusCode === 200) {
            const imageUrl = response.response.images;
            // Actualizar el perfil del usuario en el backend
            const userData = { photoUrl: imageUrl };
            const updateResponse = await backendApi.users.editProfile(
              userId,
              userData
            );
            if (updateResponse.statusCode === 200) {
              // Actualizar el estado local y la UI
              setUserInfo({ ...userInfo, photoUrl: imageUrl });
              alert("Foto del perfil actualizada con éxito.");
            } else {
              console.error("Error al actualizar el perfil del usuario.");
              alert("No se pudo actualizar la foto del perfil.");
            }
          }
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          alert("No se pudo subir la imagen.");
        }
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      alert("No se pudo seleccionar la imagen.");
    }
  };

  const handleOpenModal = (type) => {
    setModalContent({
      type: type,
      items: type === "recipes" ? recipes : favorites,
    });
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderModalContent = () => {
    return (
      <Block
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          // marginHorizontal: -theme.SIZES.BASE,
          width: width * 0.86,
        }}
      >
        {modalContent.items.map((item) => {
          // Determinar la fuente de la imagen basada en el tipo de contenido
          let imageSource;
          if (modalContent.type === "recipes") {
            imageSource = { uri: item.media }; // Asumiendo que 'media' es una URL en el caso de recetas
          } else if (modalContent.type === "favorites") {
            imageSource = { uri: item.media[0].data }; // Asumiendo que 'media' es un array y queremos la URL del primer objeto para favoritos
          }

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.favoritesContainerModal}
              onPress={() => navigateToRecipe(item.id)} // Ajusta esta función si es necesario para favoritos
            >
              <Image
                source={imageSource}
                style={styles.thumb}
                resizeMode="cover"
              />
            </TouchableOpacity>
          );
        })}
      </Block>
    );
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Obtener el userId una sola vez
        const storedUserId = await AsyncStorage.getItem("userId");
        const { response, statusCode } =
          await backendApi.users.getUser(storedUserId);
        setUserId(storedUserId); // Almacenar userId en el estado
        setUserInfo(response.user); // Almacenar userId en el estado

        // Llamadas a la API pueden ser movidas aquí si dependen de userId
        // Asegúrate de verificar que userId no sea null antes de hacer las llamadas
      } catch (error) {
        console.error("Error inicializando el perfil:", error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return; // Asegurar que userId esté disponible
      try {
        const response = await backendApi.users.favorites(userId);
        setFavorites(response.response.favorites);
        setFavoritesCount(response.response.favorites.length);
      } catch (error) {
        console.error("Error al obtener los favoritos", error);
      }
    };

    const fetchRecipes = async () => {
      if (!userId) return; // Asegurar que userId esté disponible
      try {
        const { response: recipes } =
          await backendApi.transactionsGateway.getAll(0, undefined, userId);
        setRecipes(recipes);
        setRecipesCount(recipes.length);
      } catch (error) {
        console.error("Error al obtener las recetas", error);
      }
    };

    if (userId) {
      fetchFavorites();
      fetchRecipes();
    }
  }, [userId]);

  const navigateToRecipe = (recipeId) => {
    navigation.navigate("Recipe", {
      recipeId: recipeId,
    });
  };

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={Images.Background}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: "25%" }}
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
                    <Text>Adjuntar Imagen</Text>
                  </TouchableOpacity>
                  <Text> </Text>
                </View>
              </Block>
              <Block style={styles.info}>
                <Block middle style={styles.nameInfo}>
                  <Text
                    style={{ fontFamily: "open-sans-regular" }}
                    size={24}
                    color="#32325D"
                  >
                    {userInfo
                      ? `${userInfo.name} ${userInfo.surname}`
                      : "Cargando..."}
                  </Text>
                </Block>
                <Block
                  middle
                  row
                  space="evenly"
                  style={{ marginTop: 5, paddingBottom: 24 }}
                ></Block>
              </Block>
              <Block flex>
                <Modal
                  isVisible={isModalVisible}
                  onBackdropPress={handleCloseModal}
                >
                  <View style={styles.modalContent}>
                    <ScrollView showsHorizontalScrollIndicator={false}>
                      {renderModalContent()}
                    </ScrollView>
                  </View>
                </Modal>
              </Block>
            </Block>
            <Block style={{ marginBottom: 25 }} />
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    flex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 1.5,
    top: height / 10,
  },
  parent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  profileCard: {
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 100,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    backgroundColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
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
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Ajusta esto para cambiar la alineación si es necesario
    // Otros estilos que puedas necesitar para este contenedor
  },
  favoritesContainerModal: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: thumbMeasure,
    margin: theme.SIZES.BASE / 4,
    justifyContent: "flex-end", // Ajusta esto para cambiar la alineación si es necesario
    // Otros estilos que puedas necesitar para este contenedor
  },
  container: {
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: 120,
    height: 45,
  },
  containerInterno: {
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: 140,
    height: 45,
    top: 220,
  },
  editarPerfilPopup: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  editarPerfilPopupInterno: {
    backgroundColor: "000000aa",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    width: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
