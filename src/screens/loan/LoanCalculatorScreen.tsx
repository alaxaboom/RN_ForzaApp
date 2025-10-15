import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setLoanAmount, setLoanPeriod } from "../../store/loanSlice";

const LoanCalculatorScreen = () => {
  const dispatch = useAppDispatch();
  const loanForm = useAppSelector((state) => state.loan);

  const [loanAmountWidth, setLoanAmountWidth] = useState<number | null>(null);
  const [loanPeriodWidth, setLoanPeriodWidth] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const calculateMonthlyPayment = () => {
    const interestRate = 0.16678;
    const monthlyRate = interestRate / 12;
    const numPayments = loanForm.loanPeriod;
    const principal = loanForm.loanAmount;

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    return Math.round(monthlyPayment);
  };

  const getInterestAmount = () => {
    return Math.round((loanForm.loanAmount * 0.81) / loanForm.loanPeriod);
  };

  const getCommission = () => {
    return Math.round(loanForm.loanAmount * 0.08);
  };

  const getTotalReturn = () => {
    return Math.round(
      calculateMonthlyPayment() * loanForm.loanPeriod + getCommission()
    );
  };

  const handleLoanAmountLayout = (e: LayoutChangeEvent) => {
    setLoanAmountWidth(e.nativeEvent.layout.width);
  };

  const handleLoanPeriodLayout = (e: LayoutChangeEvent) => {
    setLoanPeriodWidth(e.nativeEvent.layout.width);
  };

  const handleLoanAmountPress = (e: any) => {
    if (loanAmountWidth === null) return;
    const touchX = e.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / loanAmountWidth));
    let value = 600 + percentage * (3000 - 600);
    value = Math.round(value / 100) * 100;
    value = Math.max(600, Math.min(3000, value));
    dispatch(setLoanAmount(value));
  };

  const handleLoanPeriodPress = (e: any) => {
    if (loanPeriodWidth === null) return;
    const touchX = e.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / loanPeriodWidth));
    let value = 3 + percentage * (15 - 3);
    value = Math.round(value);
    value = Math.max(3, Math.min(15, value));
    dispatch(setLoanPeriod(value));
  };

  const createSliderPanResponder = (
    min: number,
    max: number,
    step: number,
    setter: (value: number) => void,
    width: number | null
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (width === null) return;
        const position = gestureState.moveX - gestureState.x0 + gestureState.dx;
        const percentage = Math.max(0, Math.min(1, position / width));
        let value = min + percentage * (max - min);
        value = Math.round(value / step) * step;
        value = Math.max(min, Math.min(max, value));
        setter(value);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (width === null) return;
        const position = gestureState.moveX - gestureState.x0 + gestureState.dx;
        const percentage = Math.max(0, Math.min(1, position / width));
        let value = min + percentage * (max - min);
        value = Math.round(value / step) * step;
        value = Math.max(min, Math.min(max, value));
        setter(value);
      },
    });
  };

  const loanAmountPanResponder = createSliderPanResponder(
    600,
    3000,
    100,
    (value) => dispatch(setLoanAmount(value)),
    loanAmountWidth
  );

  const loanPeriodPanResponder = createSliderPanResponder(
    3,
    15,
    1,
    (value) => dispatch(setLoanPeriod(value)),
    loanPeriodWidth
  );

  const loanAmountPercentage = loanAmountWidth ? ((loanForm.loanAmount - 600) / (3000 - 600)) * 100 : 0;
  const loanPeriodPercentage = loanPeriodWidth ? ((loanForm.loanPeriod - 3) / (15 - 3)) * 100 : 0;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeaderRow}>
          <Text style={styles.sliderLabel}>Adjust loan amount</Text>
          <Text style={styles.sliderValue}>{loanForm.loanAmount} BAM</Text>
        </View>

        <View style={styles.sliderTrack}>
          <View style={styles.sliderTouchableArea}>
            <TouchableOpacity
              onLayout={handleLoanAmountLayout}
              style={styles.slider}
              onPress={handleLoanAmountPress}
              hitSlop={{ top: 12, bottom: 12, left: 0, right: 0 }}
              {...loanAmountPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderFill,
                  { width: `${loanAmountPercentage}%` },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${loanAmountPercentage}%` },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMin}>600 BAM</Text>
            <Text style={styles.sliderMax}>3000 BAM</Text>
          </View>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeaderRow}>
          <Text style={styles.sliderLabel}>Adjust the period</Text>
          <Text style={styles.sliderValue}>{loanForm.loanPeriod} months</Text>
        </View>

        <View style={styles.sliderTrack}>
          <View style={styles.sliderTouchableArea}>
            <TouchableOpacity
              onLayout={handleLoanPeriodLayout}
              style={styles.slider}
              onPress={handleLoanPeriodPress}
              hitSlop={{ top: 12, bottom: 12, left: 0, right: 0 }}
              {...loanPeriodPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderFill,
                  { width: `${loanPeriodPercentage}%` },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${loanPeriodPercentage}%` },
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMin}>3 months</Text>
            <Text style={styles.sliderMax}>15 months</Text>
          </View>
        </View>
      </View>

      <View style={styles.paymentSummaryContainer}>
        <View style={[styles.summaryBlock, styles.roundedTopLarge, styles.centeredBlock]}>
          <Text style={styles.summaryBlockLabel}>Monthly repayment</Text>
          <Text style={styles.summaryBlockValueLarge}>{calculateMonthlyPayment()} BAM</Text>
        </View>

        <View style={styles.summaryRowHalf}>
          <View style={[styles.summaryBlock, styles.halfWidthBlock]}>
            <Text style={styles.summaryBlockLabel}>Interest</Text>
            <Text style={styles.summaryBlockValueSmall}>{getInterestAmount()} BAM</Text>
          </View>
          <View style={[styles.summaryBlock, styles.halfWidthBlock]}>
            <Text style={styles.summaryBlockLabel}>Interest rate</Text>
            <Text style={styles.summaryBlockValueSmall}>166.78%</Text>
          </View>
        </View>

        <View style={styles.summaryRowHalf}>
          <View style={[styles.summaryBlock, styles.halfWidthBlock]}>
            <Text style={styles.summaryBlockLabel}>Commission</Text>
            <Text style={styles.summaryBlockValueSmall}>{getCommission()} BAM</Text>
          </View>
          <View style={[styles.summaryBlock, styles.halfWidthBlock]}>
            <Text style={styles.summaryBlockLabel}>First instalment due date</Text>
            <Text style={styles.summaryBlockValueSmall}>26 Aug, 2024</Text>
          </View>
        </View>

        <View style={[styles.summaryBlock, styles.roundedBottom, styles.leftAlignedBlock]}>
          <View style={styles.totalForRow}>
            <View>
              <Text style={styles.summaryBlockLabel}>Total for return</Text>
              <Text style={styles.summaryBlockValueSmall}>{getTotalReturn()} BAM</Text>
            </View>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#999"
            />
          </View>
        </View>
      </View>

      <View style={styles.infoSheetCheckboxRow}>
        <TouchableOpacity
          style={[styles.infoSheetCheckbox, isChecked && styles.infoSheetCheckboxActive]}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
        <Text style={styles.infoSheetCheckboxLabel}>
          I have read and accept the Information Sheet
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  sliderContainer: {
    marginBottom: 32,
  },
  sliderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: "#666",
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  sliderTrack: {
    marginBottom: 8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderMin: {
    fontSize: 12,
    color: "#999",
  },
  sliderMax: {
    fontSize: 12,
    color: "#999",
  },
  sliderTouchableArea: {
    height: 28,
    justifyContent: 'center',
  },
  slider: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    position: "relative",
  },
  sliderFill: {
    height: 4,
    backgroundColor: "#00C853",
    borderRadius: 2,
    position: "absolute",
    left: 0,
    top: 0,
  },
  sliderThumb: {
    position: "absolute",
    top: -8,
    width: 20,
    height: 20,
    backgroundColor: "#00C853",
    borderRadius: 10,
    marginLeft: -10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  paymentSummaryContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    marginBottom: 24,
    gap: 2,
  },
  summaryBlock: {
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  halfWidthBlock: {
    width: '50%',
  },
  summaryRowHalf: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 2,
  },
  summaryBlockLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryBlockValueLarge: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#333',
  },
  centeredBlock: {
    alignItems: 'center',
  },
  leftAlignedBlock: {
    alignItems: 'flex-start',
  },
  summaryBlockValueSmall: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  roundedTopLarge: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  roundedBottom: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  totalForRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoSheetCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  infoSheetCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoSheetCheckboxActive: {
    backgroundColor: "#00C853",
  },
  infoSheetCheckboxLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

import { StyleSheet } from "react-native";

export default LoanCalculatorScreen;