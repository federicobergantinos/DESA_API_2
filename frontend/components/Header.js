import React, { useContext, useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
  View,
  Share,
} from "react-native";
import { Block, NavBar, theme } from "galio-framework";
import { CommonActions, useNavigation } from "@react-navigation/native"; // Importa useNavigation de '@react-navigation/native'

import Icon from "./Icon";
import Input from "./Input";
import Tabs from "./Tabs";
import walletTheme from "../constants/Theme";
import RecipeContext from "../navigation/RecipeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import backendGateway from "../api/backendGateway";
import ConfirmationModal from "./ConfirmationModal";

const { height, width } = Dimensions.get("window");

const ProfileButton = ({ isWhite, style }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => navigation.navigate("Profile")}
    >
      <Icon
        family="Feather"
        size={20}
        name="user"
        color={walletTheme.COLORS[isWhite ? "WHITE" : "ICON"]}
      />
    </TouchableOpacity>
  );
};

const SettingsButton = ({ isWhite, style }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => navigation.navigate("Settings")}
    >
      <Icon
        family="Feather"
        size={20}
        name="settings"
        color={walletTheme.COLORS[isWhite ? "WHITE" : "ICON"]}
      />
    </TouchableOpacity>
  );
};

const getUserId = async () => {
  return await AsyncStorage.getItem("userId");
};

const Header = ({
  back,
  title,
  white,
  transparent,
  bgColor,
  iconColor,
  titleColor,
  search,
  tabs,
  tabIndex,
  ...props
}) => {
  const navigation = useNavigation();
  const { recipe } = useContext(RecipeContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      if (recipe !== null) {
        const userId = await getUserId();
        setCurrentUserId(userId);
        setIsOwner(userId.toString() === recipe.userId.toString());
      }
    };

    setIsFavorite(recipe ? recipe.isFavorite : false);
    checkOwner().then(renderRight());
  }, [recipe]);
  const handleFavorite = async () => {
    const likeOrDislike = async (like) => {
      try {
        setIsFavorite(like);
        const { statusCode } = like
          ? await backendGateway.users.like(currentUserId, recipe.id)
          : await backendGateway.users.dislike(currentUserId, recipe.id);
        if (statusCode !== 204) {
          setIsFavorite(!like);
        }
      } catch (error) {
        console.error("No se pudo agregar a favoritos");
        setIsFavorite(!like);
      }
    };

    if (isFavorite) {
      likeOrDislike(false);
    } else {
      likeOrDislike(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: "Compartir por",
        message: `${recipe.title}: ${recipe.description}`,
      });
    } catch (error) {
      console.error("Error al compartir:", error.message);
    }
  };

  const RenderDeleteButton = ({ recipeId }) => {
    if (!isOwner) return null;
    return (
      <TouchableOpacity style={{ paddingHorizontal: 5 }}>
        <ConfirmationModal
          recipeId={recipeId}
          visible={showModal}
          setShowModal={setShowModal}
        />
        <Icon
          family="MaterialIcons"
          name="delete"
          size={25}
          onPress={() => setShowModal(true)}
          color={walletTheme.COLORS.WHITE}
        />
      </TouchableOpacity>
    );
  };

  const RenderFavoriteButton = () => {
    return (
      <TouchableOpacity
        style={{ paddingHorizontal: 5 }}
        onPress={handleFavorite}
      >
        <Icon
          family="MaterialIcons"
          name={isFavorite ? "favorite" : "favorite-border"}
          size={25}
          color={walletTheme.COLORS.WHITE}
        />
      </TouchableOpacity>
    );
  };

  const RenderShareButton = () => {
    return (
      <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={handleShare}>
        <Icon
          family="MaterialIcons"
          name="share"
          size={25}
          color={walletTheme.COLORS.WHITE}
        />
      </TouchableOpacity>
    );
  };

  const renderLeft = () => {
    if (title === "Recipe") {
      // Si el título es "Recipe", navegar directamente al Home
      return () => navigation.replace("Home");
    } else {
      // Para cualquier otro caso, utilizar la acción goBack
      return back
        ? () => navigation.dispatch(CommonActions.goBack())
        : () => navigation.navigate("Home");
    }
  };

  const renderRight = () => {
    switch (title) {
      case "Recipe":
        if (isOwner) {
          return [
            <RenderShareButton key="share-button" />,
            <RenderFavoriteButton key="favorite-button" />,
            <RenderDeleteButton
              key="delete-recipe"
              recipeId={props.recipeId}
              isOwner={isOwner}
            />,
          ];
        } else {
          return [
            <RenderShareButton key="share-button" />,
            <RenderFavoriteButton key="favorite-button" />,
          ];
        }
      case "Home":
        return [
          <ProfileButton key="profile-title" isWhite={white} />,
          <SettingsButton key="settings-title" isWhite={white} />,
        ];
      case "Perfil":
      case "Search":
      case "Configuracion":
      default:
        return null;
    }
  };

  const noShadow = ["Search", "Perfil", "Home"].includes(title);
  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
  ];

  const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }];

  return (
    <Block style={headerStyles}>
      <NavBar
        back={false}
        title={title !== "Recipe" ? title : ""}
        style={navbarStyles}
        transparent={transparent}
        right={renderRight()}
        rightStyle={{ alignItems: "center", marginRight: isOwner ? 50 : 20 }}
        left={
          <Icon
            name={back ? "chevron-left" : "home"}
            family="Feather"
            size={25}
            onPress={renderLeft()}
            color={
              iconColor ||
              (white ? walletTheme.COLORS.WHITE : walletTheme.COLORS.ICON)
            }
            style={{ marginTop: 2 }}
          />
        }
        leftStyle={{ flex: 0.35 }}
        titleStyle={[
          styles.title,
          { color: walletTheme.COLORS[white ? "WHITE" : "HEADER"] },
          titleColor && { color: titleColor },
        ]}
        {...props}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: "relative",
  },
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: walletTheme.COLORS.BORDER,
  },
});

export default Header;
