import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { theme, Block } from "galio-framework";
import { Images, walletTheme } from "../constants";
import { useRoute } from "@react-navigation/native";
import backendApi from "../api/backendGateway";
const { width, height } = Dimensions.get("screen");

const Transaction = () => {
  const route = useRoute();
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      console.log("Cargando detalles de la transacción", transactionId);
      try {
        const response =
          await backendApi.transactionsGateway.getTransactionById(
            transactionId,
            transactionId
          ); // Asegúrate de que esta llamada coincida con la definición de tu API
        console.warn("Detalles de la transacción cargados:", response);
        setTransaction(response.response);
      } catch (error) {
        console.error("Error al cargar detalles de la transacción:", error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  return (
    <Block flex style={styles.Home}>
      <Block flex>
        <ImageBackground
          source={Images.Background}
          imageStyle={styles.Background}
        >
          <ScrollView showsVerticalScrollIndicator={false} style={{ width }}>
            <Block flex style={styles.card}>
              <View>
                <Text>Detalles de la Transacción ID: {transactionId}</Text>
                {transaction && (
                  <>
                    <Text style={styles.title}>{transaction.name}</Text>
                    <Text style={styles.amount}>
                      {transaction.amount} {transaction.currency}
                    </Text>
                    <Text style={styles.status}>{transaction.status}</Text>
                    <Text style={styles.date}>{transaction.date}</Text>
                    <Text style={styles.description}>
                      {transaction.description}
                    </Text>
                  </>
                )}
              </View>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  Home: {
    marginTop: 0,
  },
  Background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.SIZES.BASE,
  },
  card: {
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 0,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: theme.SIZES.BASE,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.COLORS.PRIMARY,
  },
  status: {
    fontSize: 14,
    color: "green",
    marginTop: theme.SIZES.BASE / 2,
  },
  date: {
    fontSize: 14,
    color: theme.COLORS.MUTED,
    marginTop: theme.SIZES.BASE / 2,
  },
  description: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    marginTop: theme.SIZES.BASE,
    textAlign: "justify",
  },
});

export default Transaction;
