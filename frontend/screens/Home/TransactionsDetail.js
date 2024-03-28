import React, { useState, useEffect } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { Block, Icon } from "galio-framework";
import { Card } from "../../components";
import styles from "./HomeStyles";
import backendApi from "../../api/backendGateway";
import { walletTheme } from "../../constants";

// Asumiendo que "selectedTag" y "theme" están definidos correctamente en tu código
const selectedTag = "ALL"; // Define esto de acuerdo a tu lógica de aplicación
const theme = { SIZES: { BASE: 10 } }; // Asegúrate de tener este objeto definido o importado correctamente

const RenderTransactionsDetail = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (loading || allItemsLoaded || attempts >= 3) return;

      setLoading(true);
      try {
        const userId = 1;
        const response = await backendApi.recipesGateway.getAll(
          currentPage,
          userId
        );
        const transactions = response.response;
        if (transactions.length > 0) {
          setData((prevData) => [...prevData, ...transactions]);
          setAttempts(0); // Restablecer intentos si se obtienen datos
        } else {
          if (attempts < 2) {
            setAttempts(attempts + 1);
          } else {
            setAllItemsLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, attempts]);

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.iconContainer}>
          <Icon name="credit-card" family="Entypo" size={24} color="#C70039" />
        </View>
        <View style={styles.textDetailsContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>asd</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>109 USD</Text>
          <Text style={styles.itemPaid}>Pagado</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () =>
    loading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
    ) : null;

  const loadMoreItems = () => {
    if (!loading && !allItemsLoaded) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Block flex style={styles.HomeCard}>
      <View>
        <Text style={[styles.balanceText, { color: walletTheme.COLORS.BLACK }]}>
          Transacciones
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactions}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
      />
    </Block>
  );
};

export default RenderTransactionsDetail;
