// AppStyles.js
import { StyleSheet, Dimensions } from "react-native";
import { theme } from "galio-framework";
import { walletTheme } from "../../constants/index.js";
const { width, height } = Dimensions.get("screen");

export default StyleSheet.create({
  Home: {
    marginTop: 0,
  },
  Background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  HomeCard: {
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 0,
    borderRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0, // Ajusta esto para eliminar el borde blanco si es causado por la sombra
    shadowOpacity: 0, // Establece la opacidad de la sombra a 0
    zIndex: 2,
  },
  image: {
    paddingHorizontal: 40,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  actionButtonContainer: {
    marginTop: 10,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: walletTheme.COLORS.VIOLET,
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  actionText: {
    color: "white",
    marginTop: 5,
  },
  tag: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 2,
  },
  tagText: {
    fontSize: 12,
    marginRight: 4,
  },
  input: {
    flex: 1,
    padding: 5,
    width: width * 0.61,
    height: 40,
  },
  addButton: {
    borderWidth: 1,
    borderColor: walletTheme.COLORS.INPUT,
    alignItems: "center",
    marginLeft: 5,
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: walletTheme.COLORS.WHITE,
    borderRadius: 5,
  },
  balanceContainer: {
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 0,
    borderRadius: 6,
    backgroundColor: walletTheme.COLORS.VIOLET, // O el color de fondo que desees
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    position: "relative",
  },
  balanceText: {
    color: "#fff",
    fontSize: 16,
  },
  amountText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  visibilityIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFCDD2",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerNegative: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C8E6C9", // Un verde claro para el fondo cuando es negativo
    justifyContent: "center",
    alignItems: "center",
  },
  textDetailsContainer: {
    flex: 1, // Take up all available space
    paddingHorizontal: 10, // Space between icon and text
  },
  textContainer: {
    flex: 1,
  },
  itemSubtitle: {
    color: "grey", // Light grey color for the subtitle
  },
  priceContainer: {
    alignItems: "flex-end", // Align price to the right
  },
  itemPrice: {
    fontWeight: "bold",
    fontSize: 16, // Larger font size for the price
  },
  itemPaid: {
    color: "grey", // Light grey color for the "Pagado" text
    fontSize: 12, // Smaller font size for the "Pagado" text
  },
  itemTitle: {
    // fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 30,
    backgroundColor: "white", // Fondo blanco para el modal
    borderRadius: 5,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginRight: 10,
  },
});
