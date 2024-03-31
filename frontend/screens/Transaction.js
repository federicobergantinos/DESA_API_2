import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { theme, Block } from "galio-framework";
import { Images, walletTheme } from "../constants";
import { useRoute } from "@react-navigation/native";
import backendApi from "../api/backendGateway";
import moment from "moment";
import Clipboard from "@react-native-community/clipboard";
import Icon from "../components/Icon";
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
            transactionId
          );
        setTransaction(response.response);
      } catch (error) {
        console.error("Error al cargar detalles de la transacción:", error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  // Creating separate cards for each detail
  const TransactionDetailCard = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );

  // Function to format date
  const formatDate = (dateString) => {
    return moment(dateString).format("D [de] MMMM [de] YYYY");
  };

  // Function to determine amount text color
  const getAmountTextColor = (amount) => {
    return amount >= 0 ? "green" : "red";
  };

  const copyToClipboard = () => {
    Clipboard.setString(`${transactionId}`);
  };

  const renderStatus = (status) => {
    const icon =
      status === "Paid" ? (
        <Icon
          name="check-circle"
          size={20}
          color="green"
          style={{ marginRight: 5, marginTop: 7 }}
        />
      ) : (
        <Icon
          name="times-circle"
          size={20}
          color="red"
          style={{ marginRight: 5, marginTop: 7 }}
        />
      );
    const textStatus = status === "Paid" ? "Pagado" : "Cancelado";

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon}
        <Text style={styles.status}>{textStatus}</Text>
      </View>
    );
  };

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          {transaction && (
            <>
              {/* Transaction Details */}
              <TransactionDetailCard title="Detalles">
                <Text style={styles.title}>{transaction.name}</Text>
                <Text style={styles.description}>
                  {transaction.description}
                </Text>
              </TransactionDetailCard>

              {/* Amount */}
              <TransactionDetailCard title="Monto">
                <Text
                  style={[
                    styles.amount,
                    { color: getAmountTextColor(transaction.amount) },
                  ]}
                >
                  {transaction.amount} {transaction.currency}
                </Text>
              </TransactionDetailCard>

              {/* Status and Date */}
              <TransactionDetailCard title="Estado">
                {renderStatus(transaction.status)}
                <Text style={styles.date}>{formatDate(transaction.date)}</Text>
              </TransactionDetailCard>

              {/* Transaction ID */}
              <View style={styles.detailCard}>
                <Text style={styles.cardTitle}>ID de Transacción</Text>
                <View style={styles.transactionIdContainer}>
                  <Text style={styles.transactionId}>{transactionId}</Text>
                  <TouchableOpacity onPress={copyToClipboard}>
                    <Icon name="clipboard" family="Feather" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    marginTop: 0,
  },
  background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  detailCard: {
    backgroundColor: theme.COLORS.WHITE,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: theme.SIZES.BASE / 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.COLORS.PRIMARY,
  },
  status: {
    fontSize: 14,
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
    textAlign: "justify",
  },
  scrollViewContent: {
    paddingTop: 100,
  },
  copyButton: {
    marginTop: 10,
    backgroundColor: theme.COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  copyButtonText: {
    color: "#FFF",
    textAlign: "center",
  },
  transactionIdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10, // Adjust padding as needed
  },
  transactionId: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
  },
});

export default Transaction;
