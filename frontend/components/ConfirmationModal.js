import React from "react";
import { Modal, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { walletTheme } from "../constants";
import backendGateway from "../api/backendGateway";
import { useNavigation } from "@react-navigation/native";

const ConfirmationModal = ({ recipeId, visible, setShowModal }) => {
  const navigation = useNavigation();
  const onClose = () => {
    setShowModal(false);
  };

  const onDelete = async () => {
    await backendGateway.transactionsGateway.deleteRecipe(recipeId);
    onClose();
    navigation.replace("Home");
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Text style={styles.modalTitle}>Eliminar</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro que deseas eliminar la receta?
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onDelete();
              }}
            >
              <Text style={[styles.buttonText, styles.yesText]}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={[styles.buttonText, styles.noText]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center", // Centrar los botones
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  yesText: {
    color: walletTheme.COLORS.MUTED,
  },
  noText: {
    color: walletTheme.COLORS.GRADIENT_START,
  },
});

export default ConfirmationModal;
