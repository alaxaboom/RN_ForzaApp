import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView as RNSafeAreaView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../store/store";
import {
  useGetUserLoanApplicationsQuery,
  useGetUserLoanDetailsQuery,
} from "../store/api";
import BottomNavigation from "../utils/BottomNavigation";


type NavigationProps = {
  onNavigate: (
    screen: "home" | "loan" | "login" | "register" | "otp" | "password" | "biometrics" | "profile" | "products"
  ) => void;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, ' ');
};

const LoanCard = ({ loan }: { loan: any }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Credit {loan.id.slice(-1)}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{loan.status}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Created on</Text>
        <Text style={styles.value}>{formatDate(loan.creationDate)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Loan amount</Text>
        <Text style={styles.value}>{loan.loanAmount} BAM</Text>
      </View>
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const ApplicationCard = ({ application }: { application: any }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Application {application.brojAplikacije.split('LA')[1].slice(0, 2)}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{application.status}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date of application</Text>
        <Text style={styles.value}>{formatDate(application.applicationDate)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Loan amount</Text>
        <Text style={styles.value}>{application.loanAmountValue} BAM</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>First installment due date</Text>
        <Text style={styles.value}>{formatDate(application.applicationDate)}</Text>
      </View>
    </View>
  );
};

type ProductsListPageProps = NavigationProps & {
  initialTab?: "loans" | "applications";
};

const ProductsListPage: React.FC<ProductsListPageProps> = ({ onNavigate, initialTab = "loans" }) => {
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';

  const {
    data: userApplications = [],
    isLoading: applicationsLoading,
  } = useGetUserLoanApplicationsQuery(userId, {
    skip: !userId,
  });

  const {
    data: userLoans = [],
    isLoading: loansLoading,
  } = useGetUserLoanDetailsQuery(userId, {
    skip: !userId,
  });

  const [activeTab, setActiveTab] = useState<"loans" | "applications">(initialTab);

  const renderContent = () => {
    if (applicationsLoading || loansLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (activeTab === "loans") {
      if (userLoans.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No credits yet</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any credits yet. Press the button to choose a loan.
            </Text>
          </View>
        );
      }
      return (
        <ScrollView style={styles.listContainer}>
          {userLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </ScrollView>
      );
    }

    if (activeTab === "applications") {
      if (userApplications.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No applications yet</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any applications yet. Press the button to start.
            </Text>
          </View>
        );
      }
      return (
        <ScrollView style={styles.listContainer}>
          {userApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <RNSafeAreaView style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onNavigate("home")}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "loans" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("loans")}
            >
              <Text style={[
                styles.tabText,
                activeTab === "loans" && styles.activeTabText
              ]}>
                My credits
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "applications" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("applications")}
            >
              <Text style={[
                styles.tabText,
                activeTab === "applications" && styles.activeTabText
              ]}>
                My applications
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderContent()}
      </RNSafeAreaView>

      <BottomNavigation
        onNavigate={(screen, params) => {
          (onNavigate as any)(screen, params);
        }}
        currentScreen="products"
      />

      {((activeTab === "loans" && userLoans.length === 0) ||
        (activeTab === "applications" && userApplications.length === 0)) && (
        <View style={styles.getStartedContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => onNavigate("loan")}
          >
            <Text style={styles.getStartedButtonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 24,
    color: "#333",
    marginRight: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    padding: 4,
    flex: 1,
    marginLeft: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#00C853",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  detailsButton: {
    marginTop: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  getStartedContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  getStartedButton: {
    backgroundColor: "#00C853",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ProductsListPage;