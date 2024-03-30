import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Block, Icon } from "galio-framework";
import { Card } from "../../components";
import styles from "./HomeStyles";
import backendApi from "../../api/backendGateway";
import { walletTheme } from "../../constants";

const MAX_ITEMS = 5;

const RenderTransactionsDetail = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (loading || allItemsLoaded || attempts >= 3) return;

      setLoading(true);
      try {
        const userId = 1;
        const response = await backendApi.transactionsGateway.getAll(
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
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.description}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>
            {item.amount} {item.currency}
          </Text>
          <Text style={styles.itemPaid}>{item.status}</Text>
        </View>
      </View>
    );
  };

  const loadMoreItems = () => {
    if (!loading && !allItemsLoaded) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const renderFooter = () => {
    if (data.length > MAX_ITEMS) {
      return (
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Ver más</Text>
        </TouchableOpacity>
      );
    }

    return loading ? <ActivityIndicator animating size="large" /> : null;
  };

  return (
    <Block flex style={styles.HomeCard}>
      <View>
        <Text style={[styles.balanceText, { color: walletTheme.COLORS.BLACK }]}>
          Transacciones
        </Text>
      </View>
      <FlatList
        data={data.slice(0, MAX_ITEMS)}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactions}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={data} // Mostrar todas las transacciones en el modal
              renderItem={renderTransaction}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Block>
  );
};

export default RenderTransactionsDetail;
