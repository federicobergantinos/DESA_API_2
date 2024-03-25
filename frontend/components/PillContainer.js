import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PillContainer = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  text: {
    color: "#000000",
  },
});

export default PillContainer;
