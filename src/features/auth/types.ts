import type { ReactNode } from "react";
import type { User } from "firebase/auth";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

export type AuthProviderProps = {
  children: ReactNode;
};
