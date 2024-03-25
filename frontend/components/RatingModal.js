import React, {useEffect, useState} from "react";
import {Modal, View, ScrollView, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import {AirbnbRating, Rating} from "react-native-ratings";
import walletTheme from "../constants/Theme";
import backendGateway from "../api/backendGateway";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

const ReviewsModal = ({ isVisible, onClose, recipeId, setRecipeRating }) => {

    const [userRating, setUserRating] = useState(0)
    useEffect(() => {
        const getUserRated = async () => {
            const userId = await asyncStorage.getItem('userId')
            const {response, statusCode} = await backendGateway.rating.getUserRate(recipeId, userId)
            setUserRating(response.userRating)
        }
        getUserRated()
    }, [isVisible]);

    const handleRate = async (value) => {
        /*const userId = await asyncStorage.getItem('userId')
        const {response, statusCode} = await backendGateway.rating.rate(userId, recipeId, value)
        if(response !== undefined)
            setRecipeRating(response?response.recipeRating:0)
        onClose()*/
        setUserRating(value);
    };

    const handleRateButton = async () => {
        const userId = await asyncStorage.getItem("userId");
        const {response, statusCode} = await backendGateway.rating.rate(userId, recipeId, userRating)
        if(response !== undefined)
            setRecipeRating(response?response.recipeRating:0)
        onClose()
    };

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text
                  style={{ paddingBottom: 10, fontFamily: "open-sans-regular" }}
                  color={walletTheme.COLORS.TEXT}
                >
                  ¿Como evaluarias está receta?
                </Text>
                <AirbnbRating
                  count={5}
                  defaultRating={userRating}
                  selectedColor={walletTheme.COLORS.GRADIENT_START}
                  size={40}
                  showRating={false}
                  onFinishRating={handleRate}
                  style={{ paddingVertical: 10, width: 100 }}
                />
                <TouchableOpacity onPress={handleRateButton}>
                    <Text style={styles.closeButton}>Calificar</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        margin: 20,
        maxHeight: "80%",
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        marginTop: 10,
        color: "blue",
    },
});

export default ReviewsModal;
