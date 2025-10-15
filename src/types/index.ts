export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  jmbg: string;
  email?: string;
  password: string; 
  createdAt: string;
}
export interface UserDetails extends User {
  avatar?: string;
  residentialAddress?: string;
}
export type Screen =
  | "home"
  | "loan"
  | "login"
  | "register"
  | "otp"
  | "password"
  | "biometrics"
  | "products"
  | "profile"
  | "callback"
  | "firstpage"
  | "howtopay"
  | "locations"
  | "contacts"
  | "resetpassword";
export interface LoanApplication {
  id: string;
  userId: string;
  brojAplikacije: string;
  status: "pending" | "approved" | "rejected" | "completed";
  selectedProduct: string;
  loanAmount: number;
  loanPeriod: number;
  applicationDate: string; 
  loanAmountValue: number; 
  monthlyPayment?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoanDetails {
  id: string;
  applicationId: string;
  userId: string;
  creationDate: string; 
  loanAmount: number;
  status: "active" | "paid" | "overdue";
  remainingAmount: number;
  nextPaymentDate?: string;
}

export type LoanStep =
  | "productcategories"
  | "calculator"
  | "registration"
  | "documents"
  | "confirmation";
  export interface LoanFormData {
    selectedProduct: string;
    loanAmount: number;
    loanPeriod: number;
    userData: {
      firstName: string;
      lastName: string;
      phone: string;
      jmbg: string;
    };
    currentStep: LoanStep;
  }

  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }
