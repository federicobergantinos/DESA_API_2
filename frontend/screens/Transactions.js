import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Block, Text } from "galio-framework";
import { Images, walletTheme } from "../constants";
import backendApi from "../api/backendGateway";
import Button from "../components/Button";
import {
  RenderMainInformation,
  RenderTransactionsDetail,
  styles,
} from "./Home/index.js";
import Icon from "../components/Icon";

const Transactions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const ActionButton = ({ icon, family, title, onPress }) => {
    return (
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
          <Icon
            family={family}
            size={20}
            name={icon}
            color={walletTheme.COLORS.WHITE}
          />
        </TouchableOpacity>
        <Text style={styles.actionText}>{title}</Text>
      </View>
    );
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonsRow}>
        <ActionButton
          icon="arrow-down"
          family="Feather"
          title="Recibir"
          onPress={() => {
            /* Acción aquí */
          }}
        />
        <ActionButton
          icon="arrow-up"
          family="Feather"
          title="Enviar"
          onPress={() => {
            /* Acción aquí */
          }}
        />
        <ActionButton
          icon="dollar-sign"
          family="Feather"
          title="Invertir"
          onPress={() => {
            /* Acción aquí */
          }}
        />
        <ActionButton
          icon="receipt"
          family="FontAwesome5"
          title="Impuestos"
          onPress={() => {
            /* Acción aquí */
          }}
        />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return item.render();
  };

  updateState = (newState) => {
    this.setState(newState);
  };

  const sections = [
    {
      key: "mainInformation",
      render: () => <RenderMainInformation />,
    },
    { key: "buttons", render: renderButtons },
    {
      key: "transactionsDetail",
      render: () => <RenderTransactionsDetail />,
    },
  ];

  return (
    <Block flex style={styles.Home}>
      <Block flex>
        <ImageBackground
          source={Images.Background}
          imageStyle={styles.Background}
        >
          <FlatList
            data={sections}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            ListHeaderComponent={<View style={{ height: 20 }} />}
            ListFooterComponent={<View style={{ height: 20 }} />}
            showsVerticalScrollIndicator={false}
          />
        </ImageBackground>
      </Block>
    </Block>
  );
};

export default Transactions;
