import React from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setSelectedProduct } from "../../store/loanSlice";

const { width } = Dimensions.get("window");

const ProductSelectionScreen = () => {
  const dispatch = useAppDispatch();
  const loanForm = useAppSelector((state) => state.loan);

  const products = [
    { key: "microloan", icon: "flash", title: "Non-purpose microloan" },
    { key: "pensioner", icon: "elderly", title: "Loan for pensioners" },
    { key: "installment", icon: "card", title: "Installment loan" },
    { key: "sonic", icon: "headset", title: "Sonic loan" },
    { key: "quick", icon: "rocket", title: "Quick loan" },
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.productGrid}>
        {products.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.productCard,
              loanForm.selectedProduct === item.key && styles.productCardSelected,
            ]}
            onPress={() => dispatch(setSelectedProduct(item.key as any))}
          >
            <View
              style={[
                styles.productIcon,
                loanForm.selectedProduct === item.key && styles.productIconSelected,
              ]}
            >
              {item.icon === "elderly" ? (
                <MaterialIcons
                  name="elderly"
                  size={24}
                  color={
                    loanForm.selectedProduct === item.key ? "#00C853" : "#999"
                  }
                />
              ) : (
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={
                    loanForm.selectedProduct === item.key ? "#00C853" : "#999"
                  }
                />
              )}
            </View>
            <Text
              style={styles.productTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 80) / 2,
    height: 140,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
  },
  productCardSelected: {
    borderColor: "#00C853",
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  productIconSelected: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#00C853",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
});

import { StyleSheet } from "react-native";

export default ProductSelectionScreen;