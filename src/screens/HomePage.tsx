import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '../store/store';
import { useGetUserLoanApplicationsQuery } from '../store/api';
import { LoanApplication } from '../types';
import BottomNavigation from '../utils/BottomNavigation';
import { Screen } from '../types/index';

const { width } = Dimensions.get("window");

const products = [
  { key: "microloan", image: require('../../assets/products/microloan.png') },
  { key: "pensioner", image: require('../../assets/products/pensioner.png') },
  { key: "installment", image: require('../../assets/products/installment.png') },
  { key: "sonic", image: require('../../assets/products/sonic.png') },
  { key: "quick", image: require('../../assets/products/quick.png') },
];

type NavigationProps = {
  onNavigate: (screen: Screen, params?: any) => void;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, ' ');
};

const HomePage: React.FC<NavigationProps & { isAuthenticated: boolean }> = ({ onNavigate, isAuthenticated }) => {
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const { data: applications = [] } = useGetUserLoanApplicationsQuery(userId, {
    skip: !userId,
  });

  const approvedApplications: LoanApplication[] = applications.filter(
    app => app.status === "approved" || app.status === "completed"
  );

  const latestApplication = approvedApplications.length > 0 
    ? approvedApplications[approvedApplications.length - 1] 
    : null;

  const handleApplyForLoan = () => {
    onNavigate("loan");
  };

  const handleCallMeBack = () => {
    onNavigate("callback");
  };

  const handleApplicationsList = () => {
    onNavigate("products", { tab: "applications" });
  };

  const handleLoansList = () => {
    onNavigate("products", { tab: "loans" });
  };

  const handleProfile = () => {
    onNavigate("profile");
  };

  const userName = user?.firstName || "User";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userHeader}>
          <TouchableOpacity onPress={handleProfile} style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={40} color="#00C853" />
          </TouchableOpacity>
          <View style={styles.nameAndButtonContainer}>
            <TouchableOpacity onPress={handleProfile}>
              <Text style={styles.userName}>{userName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.showAllButton} onPress={handleLoansList}>
              <Text style={styles.showAllText}>Show All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {latestApplication ? (
          <View style={styles.loanCard}>
            <Text style={styles.loanCardLabel}>Monthly installment</Text>
            <Text style={styles.loanCardAmount}>
              {latestApplication.monthlyPayment 
                ? `${latestApplication.monthlyPayment.toFixed(2)} BAM` 
                : '—'}
            </Text>

            <View style={styles.loanDetailsRow}>
              <View style={styles.loanDetailItem}>
                <Text style={styles.detailLabel}>Payment Due</Text>
                <Text style={styles.detailValue}>
                  {latestApplication.applicationDate 
                    ? formatDate(latestApplication.applicationDate) 
                    : '—'}
                </Text>
              </View>
              <View style={styles.loanDetailItem}>
                <Text style={styles.detailLabel}>Period</Text>
                <Text style={styles.detailValue}>
                  {latestApplication.loanPeriod} months
                </Text>
              </View>
            </View>

            <View style={styles.loanDetailsRow}>
              <View style={styles.loanDetailItem}>
                <Text style={styles.detailLabel}>Loan amount</Text>
                <Text style={styles.detailValue}>
                  {latestApplication.loanAmountValue} BAM
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loanCardEmpty}>
            <View style={styles.loanCardHeaderEmpty}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#00C853" />
              <View style={styles.loanCardTextEmpty}>
                <Text style={styles.loanCardTitleEmpty}>You can get up to</Text>
                <Text style={styles.loanCardAmountEmpty}>600 BAM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.getStartedButtonEmpty} onPress={handleApplyForLoan}>
              <Text style={styles.getStartedButtonTextEmpty}>Get started</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleApplicationsList}
          >
            <View style={styles.iconContainerQuick}>
              <Ionicons name="document-text-outline" size={28} color="white" />
            </View>
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>My applications</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleCallMeBack}
          >
            <View style={styles.iconContainerQuick}>
              <Ionicons name="call-sharp" size={28} color="white" />
            </View>
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>Call me back</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.productsTitle}>Available products</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}
          >
            {products.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.productCard}
                onPress={() => onNavigate("loan", { product: item.key })}
              >
                <Image
                  source={item.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavigation
        onNavigate={onNavigate}
        currentScreen="home"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 80,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  avatarContainer: {
    marginRight: 12,
    marginTop: 4,
  },
  nameAndButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  showAllButton: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  showAllText: {
    color: "#00C853",
    fontSize: 18,
    fontWeight: "600",
  },
  loanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  loanCardLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  loanCardAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  loanDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  loanDetailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  detailsButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  loanCardEmpty: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  loanCardHeaderEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanCardTextEmpty: {
    marginLeft: 12,
  },
  loanCardTitleEmpty: {
    fontSize: 14,
    color: "#666",
  },
  loanCardAmountEmpty: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  getStartedButtonEmpty: {
    backgroundColor: "#00C853",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  getStartedButtonTextEmpty: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickActionButton: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: (width - 64) / 2,
    minHeight: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainerQuick: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  actionButtonTextContainer: {},
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  productsSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  productsTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  productsScroll: {
    paddingHorizontal: 4,
  },
  productCard: {
    width: 170,
    height: 220,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
});

export default HomePage;