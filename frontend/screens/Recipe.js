import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Block, Text, Button, theme } from "galio-framework";
import walletTheme from "../constants/Theme";
import { iPhoneX, HeaderHeight } from "../constants/utils";
import { AirbnbRating } from "react-native-ratings";
import PillContainer from "../components/PillContainer";
import Icon from "../components/Icon";
import backendApi from "../api/backendGateway";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigation } from "@react-navigation/native";
import RecipeContext from "../navigation/RecipeContext";
import RatingModal from "../components/RatingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tagsTranslations = {
  RAPID_PREPARATION: "Preparación rápida",
  VEGETARIAN: "Vegetariano",
  VEGAN: "Vegano",
  GLUTEN_FREE: "Libre de gluten",
  IMMUNE_SYSTEM: "Sistema inmunológico",
  INTESTINAL_FLORA: "Flora intestinal",
  ANTI_INFLAMMATORY: "Antiinflamatorio",
  LOW_SODIUM: "Bajo en sodio",
  LOW_CARB: "Bajo en carbohidratos",
};

const { height, width } = Dimensions.get("window");

const getAsyncRecipe = async (recipeId) => {
  const userId = await AsyncStorage.getItem("userId");
  const { response, statusCode } =
    await backendApi.recipesGateway.getRecipeById(recipeId, userId);
  return response;
};
export default function Recipe(props) {
  const { route } = props;
  const navigation = useNavigation();
  const [isStepsAvailable, setIsStepsAvailable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const scrollX = new Animated.Value(0);
  const [loading, setLoading] = useState(true);
  const { recipe, setRecipe } = useContext(RecipeContext);
  const [recipeRating, setRecipeRating] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const fetchedRecipe = await getAsyncRecipe(route.params.recipeId);
        setRecipe(fetchedRecipe);
        setLoading(false);
        setRecipeRating(fetchedRecipe.rating);
      } catch (error) {
        console.error("Error al obtener la receta");
        navigation.replace("Home");
      }
    };
    fetchRecipe();
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const buttonStyle1 = isStepsAvailable
    ? styles.buttonSelected
    : styles.buttonUnselected;
  const buttonStyle2 = !isStepsAvailable
    ? styles.buttonSelected
    : styles.buttonUnselected;
  const textColor1 = isStepsAvailable ? "black" : "gray";
  const textColor2 = !isStepsAvailable ? "black" : "gray";

  const renderGallery = () => {
    const { navigation } = props;
    const recipeMedia = recipe.video
      ? [...recipe.media, recipe.video]
      : [...recipe.media];

    return (
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={0}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        <RatingModal
          isVisible={modalVisible}
          onClose={closeModal}
          recipeId={recipe.id}
          setRecipeRating={setRecipeRating}
        />
        {recipeMedia.map((image, index) => (
          <TouchableWithoutFeedback
            key={`recipe-image-${index}`}
            onPress={() =>
              navigation.navigate("Gallery", { images: recipeMedia, index })
            }
          >
            <Image
              resizeMode="cover"
              source={{ uri: image }}
              style={{ width, height: iPhoneX ? width + 32 : width }}
            />
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    );
  };
  const toggleStepsAvailability = () => {
    setIsStepsAvailable(!isStepsAvailable);
  };

  const renderProgress = () => {
    const recipeMedia = recipe.video
      ? [...recipe.media, recipe.video]
      : [...recipe.media];

    const position = Animated.divide(scrollX, width);

    return (
      <Block row>
        {recipeMedia.map((_, i) => {
          const opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });

          const dotWidth = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [8, 18, 8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dots, { opacity, width: dotWidth }]}
            />
          );
        })}
      </Block>
    );
  };

  if (loading) {
    return <LoadingScreen visible={loading} />;
  } else {
    return (
      <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
        <Block flex style={styles.recipe}>
          <Block flex style={{ position: "relative" }}>
            {renderGallery()}
            <Block center style={styles.dotsContainer}>
              {renderProgress()}
            </Block>
          </Block>
          <Block flex style={styles.options}>
            <Block
              style={{
                paddingHorizontal: theme.SIZES.BASE,
                paddingTop: theme.SIZES.BASE * 2,
              }}
            >
              <Text
                size={28}
                style={{ paddingBottom: 3, fontFamily: "open-sans-regular" }}
                color={walletTheme.COLORS.TEXT}
              >
                {recipe.title}
              </Text>
              <Text
                size={18}
                style={{ paddingBottom: 10, fontFamily: "open-sans-regular" }}
                color={walletTheme.COLORS.MUTED}
              >
                {recipe.description}
              </Text>
              <TouchableOpacity onPress={openModal}>
                <Block
                  flex
                  flexDirection="row"
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <AirbnbRating
                    count={5}
                    defaultRating={recipeRating}
                    isDisabled={true}
                    selectedColor={walletTheme.COLORS.GRADIENT_START}
                    size={20}
                    showRating={false}
                    style={{ paddingVertical: 10, width: 100 }}
                  />
                  <Text
                    size={15}
                    family="MaterialIcons"
                    name="edit"
                    color={walletTheme.COLORS.GRADIENT_START}
                    style={{paddingHorizontal: 15, paddingVertical: 10}}
                  >
                    Calificar
                  </Text>
                </Block>
              </TouchableOpacity>
              <Block
                flex
                flexDirection="row"
                flexWrap="wrap"
                style={{ paddingTop: 8, paddingBottom: 12, gap: 10 }}
              >
                {recipe.tags.map((tag, index) => (
                  <PillContainer key={index}>
                    {tagsTranslations[tag]}{" "}
                  </PillContainer>
                ))}
              </Block>
              <Block
                flex
                flexDirection="row"
                style={{ justifyContent: "flex-start" }}
              >
                <Block
                  flex
                  flexDirection="row"
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 5,
                  }}
                >
                  <Icon
                    family="MaterialIcons"
                    name="access-time"
                    size={30}
                    color={walletTheme.COLORS.MUTED}
                  />
                  <Text color={walletTheme.COLORS.MUTED}>
                    {recipe.preparationTime + ' Minutos'}
                  </Text>
                </Block>
                <Block
                  flex
                  flexDirection="row"
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 5,
                  }}
                >
                  <Icon
                    family="MaterialIcons"
                    name="people"
                    size={30}
                    color={walletTheme.COLORS.MUTED}
                  />
                  <Text color={walletTheme.COLORS.MUTED}>
                    {recipe.servingCount===1? recipe.servingCount + ' Persona' : recipe.servingCount + ' Personas'}
                  </Text>
                </Block>
              </Block>
              <Block style={{ paddingTop: theme.SIZES.BASE }}>
                <Block
                  flex
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: theme.COLORS.GREY,
                    paddingBottom: theme.SIZES.BASE,
                  }}
                >
                  <Block
                    flex
                    flexDirection="row"
                    style={{ padding: 0, margin: 0, gap: 0 }}
                  >
                    <Button
                      disabled={isStepsAvailable}
                      shadowless
                      borderless
                      style={[styles.buttonTab, buttonStyle1]}
                      onPress={toggleStepsAvailability}
                    >
                      <Text size={20} color={textColor1}>
                        Pasos
                      </Text>
                    </Button>
                    <Button
                      disabled={!isStepsAvailable}
                      shadowless
                      borderless
                      style={[styles.buttonTab, buttonStyle2]}
                      onPress={toggleStepsAvailability}
                    >
                      <Text size={20} color={textColor2}>
                        Ingredientes
                      </Text>
                    </Button>
                  </Block>
                  <Text
                    size={15}
                    style={{
                      paddingTop: 10,
                      paddingHorizontal: 10,
                      fontFamily: "open-sans-regular",
                    }}
                    color={walletTheme.COLORS.TEXT}
                  >
                    {isStepsAvailable
                      ? recipe.steps.map((step, index) => (
                          <Text key={index}>
                            {index + 1 + ". " + step}
                            {"\n"}
                          </Text>
                        ))
                      : recipe.ingredients.map((ingredient, index) => (
                          <Text key={index}>
                            {index + 1 + ". " + ingredient}
                            {"\n"}
                          </Text>
                        ))}
                  </Text>
                </Block>
                <Block
                  style={{ marginTop: 15, fontFamily: "open-sans-regular" }}
                >
                  <Text
                    size={15}
                    style={{
                      fontWeight: "bold",
                      paddingBottom: 5,
                      fontFamily: "open-sans-regular",
                    }}
                    color={walletTheme.COLORS.TEXT}
                  >
                    Calorias: {recipe.calories} Kcal
                  </Text>
                  <Text
                    size={15}
                    style={{
                      fontWeight: "bold",
                      paddingBottom: 5,
                      fontFamily: "open-sans-regular",
                    }}
                    color={walletTheme.COLORS.TEXT}
                  >
                    Proteinas: {recipe.proteins} gr
                  </Text>
                  <Text
                    size={15}
                    style={{
                      fontWeight: "bold",
                      paddingBottom: 5,
                      fontFamily: "open-sans-regular",
                    }}
                    color={walletTheme.COLORS.TEXT}
                  >
                    Grasas totales: {recipe.totalFats} gr
                  </Text>
                </Block>
              </Block>
              <Block
                flex
                flexDirection="row"
                style={{
                  paddingTop: 15,
                  paddingBottom: 5,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Image src={recipe.userImage} style={styles.avatar} />
                <Text
                  style={{ fontFamily: "open-sans-regular", height: 40 }}
                  size={14}
                  color={walletTheme.COLORS.TEXT}
                >
                  {recipe.username}
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  recipe: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  buttonSelected: {
    borderBottomWidth: 0,
    backgroundColor: "white",
  },
  buttonUnselected: {
    backgroundColor: theme.COLORS.GREY,
  },
  buttonTab: {
    width: "50%",
    padding: 0,
    margin: 0,
    backgroundColor: "white",
    elevation: 0,
    borderRadius: 0,
  },
  options: {
    position: "relative",
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 2,
    marginBottom: 0,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  dots: {
    height: theme.SIZES.BASE / 2,
    margin: theme.SIZES.BASE / 2,
    borderRadius: 4,
    backgroundColor: "white",
  },
  dotsContainer: {
    position: "absolute",
    bottom: theme.SIZES.BASE,
    left: 0,
    right: 0,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
    marginRight: 8,
  },
});
