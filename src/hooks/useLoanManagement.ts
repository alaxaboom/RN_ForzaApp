import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/store";
import {
  useCreateLoanApplicationMutation,
  useGetUserLoanApplicationsQuery,
  useGetUserLoanDetailsQuery,
  useUpdateLoanApplicationStatusMutation,
} from "../store/api";
import { resetLoanForm, prefillUserData } from "../store/loanSlice";
import { LoanApplication } from "../types";

export const useLoanManagement = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const loanForm = useAppSelector((state) => state.loan);

  const [createApplication, { isLoading: isCreating }] =
    useCreateLoanApplicationMutation();
  const [updateApplicationStatus] = useUpdateLoanApplicationStatusMutation();

  const {
    data: userApplications = [],
    isLoading: applicationsLoading,
    refetch: refetchApplications,
  } = useGetUserLoanApplicationsQuery(user?.id || "", {
    skip: !user?.id,
  });

  const {
    data: userLoans = [],
    isLoading: loansLoading,
    refetch: refetchLoans,
  } = useGetUserLoanDetailsQuery(user?.id || "", {
    skip: !user?.id,
  });

  const [error, setError] = useState<string | null>(null);

  const submitLoanApplication = async (userId?: string) => {
    try {
      setError(null);

      const effectiveUser = userId
        ? { id: userId }
        : user;

      if (!effectiveUser?.id) {
        throw new Error("Authorization required to submit application");
      }

      if (!loanForm.selectedProduct) {
        throw new Error("Please select a credit product");
      }

      if (
        !loanForm.userData.firstName ||
        !loanForm.userData.lastName ||
        !loanForm.userData.phone ||
        !loanForm.userData.jmbg
      ) {
        throw new Error("Please fill in all required fields");
      }

      const interestRate = 0.16678;
      const monthlyRate = interestRate / 12;
      const monthlyPayment = Math.round(
        (loanForm.loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, loanForm.loanPeriod))) /
          (Math.pow(1 + monthlyRate, loanForm.loanPeriod) - 1)
      );

      const applicationData: Omit<
        LoanApplication,
        "id" | "createdAt" | "updatedAt" | "brojAplikacije"
      > = {
        userId: effectiveUser.id,
        status: "pending",
        selectedProduct: loanForm.selectedProduct,
        loanAmount: loanForm.loanAmount,
        loanPeriod: loanForm.loanPeriod,
        applicationDate: new Date().toISOString(),
        loanAmountValue: loanForm.loanAmount,
        monthlyPayment,
      };

      const newApplication = await createApplication(applicationData).unwrap();

      dispatch(resetLoanForm());

      return { success: true, application: newApplication };
    } catch (err: any) {
      const errorMessage = err?.message || "Error submitting application";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const prefillFormWithUserData = () => {
    if (user) {
      dispatch(
        prefillUserData({
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          jmbg: user.jmbg,
        })
      );
    }
  };

  const getApplicationsStats = () => {
    const pending = userApplications.filter(
      (app) => app.status === "pending"
    ).length;
    const approved = userApplications.filter(
      (app) => app.status === "approved"
    ).length;
    const rejected = userApplications.filter(
      (app) => app.status === "rejected"
    ).length;
    const completed = userApplications.filter(
      (app) => app.status === "completed"
    ).length;

    return {
      total: userApplications.length,
      pending,
      approved,
      rejected,
      completed,
    };
  };

  const getLoansStats = () => {
    const active = userLoans.filter((loan) => loan.status === "active").length;
    const paid = userLoans.filter((loan) => loan.status === "paid").length;
    const overdue = userLoans.filter(
      (loan) => loan.status === "overdue"
    ).length;
    const totalDebt = userLoans
      .filter((loan) => loan.status === "active")
      .reduce((sum, loan) => sum + loan.remainingAmount, 0);

    return {
      total: userLoans.length,
      active,
      paid,
      overdue,
      totalDebt,
    };
  };

  const simulateStatusChange = async (
    applicationId: string,
    status: LoanApplication["status"]
  ) => {
    try {
      await updateApplicationStatus({ id: applicationId, status }).unwrap();
      await refetchApplications();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Status update error",
      };
    }
  };

  return {
    loanForm,
    userApplications,
    userLoans,
    applicationsStats: getApplicationsStats(),
    loansStats: getLoansStats(),
    isCreating,
    applicationsLoading,
    loansLoading,
    error,
    submitLoanApplication,
    prefillFormWithUserData,
    simulateStatusChange,
    refetchApplications,
    refetchLoans,
    clearError: () => setError(null),
  };
};