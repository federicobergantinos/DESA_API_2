import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { walletTheme } from "../constants";

const LoadingScreen = ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          size="large"
          color={walletTheme.COLORS.GRADIENT_START}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  spinnerContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
