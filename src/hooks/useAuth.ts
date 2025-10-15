import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { loginSuccess, logout, setLoading } from "../store/authSlice";
import {
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "../store/api";
import { User } from "../types";
import { store } from "../store/store";
import { appApi } from "../store/api";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAppSelector(
    (state) => state.auth
  );
  const [registerUser] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [error, setError] = useState<string | null>(null);
  const isLoading = isAuthLoading;

  const createUserOnly = async (userData: Omit<User, "id" | "createdAt">) => {
    try {
      setError(null);
      dispatch(setLoading(true));
      const newUser = await registerUser(userData).unwrap();
      const fullUser: User = {
        id: newUser.id,
        email: userData.email || "",
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        jmbg: userData.jmbg,
        createdAt: newUser.createdAt || new Date().toISOString(),
      };
      dispatch(setLoading(false));
      return { success: true, user: fullUser };
    } catch (err: any) {
      const errorMessage = err?.message || "Registration error";
      setError(errorMessage);
      dispatch(setLoading(false));
      return { success: false, error: errorMessage };
    }
  };

  const loginUser = (user: User) => {
    dispatch(loginSuccess(user));
    return { success: true, user };
  };

  const login = async (identifier: string, password: string) => {
    try {
      setError(null);
      dispatch(setLoading(true));

      const result = await store.dispatch(
        appApi.endpoints.getAllUsers.initiate()
      );
      const allUsers = result.data || [];
      const isEmail = identifier.includes("@");
      const cleanIdentifier = isEmail
        ? identifier.trim().toLowerCase()
        : identifier.replace(/\D/g, "");
      const foundUser = allUsers.find((user: User) => {
        const matchesPassword = user.password === password;
        if (isEmail) {
          return matchesPassword && user.email?.toLowerCase() === cleanIdentifier;
        } else {
          return matchesPassword && user.phone === cleanIdentifier;
        }
      });

      if (!foundUser) {
        throw new Error("Invalid credentials");
      }

      dispatch(loginSuccess(foundUser));
      dispatch(setLoading(false));
      return { success: true, user: foundUser };
    } catch (err: any) {
      const errorMessage = err?.message || "Authorization error";
      setError(errorMessage);
      dispatch(setLoading(false));
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    setError(null);
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    try {
      setError(null);

      if (!user?.id) {
        throw new Error("User not authorized");
      }

      const updatedUser = await updateUser({
        id: user.id,
        userData: updatedData,
      }).unwrap();

      dispatch(loginSuccess(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err: any) {
      const errorMessage = err?.message || "Profile update error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const canApplyForLoan = () => {
    return isAuthenticated && user !== null;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    createUserOnly,
    loginUser,
    login,
    logout: logoutUser,
    updateProfile,
    canApplyForLoan,
    clearError: () => setError(null),
  };
};