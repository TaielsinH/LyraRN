import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../../services/firebase";
import type { AuthContextValue, AuthProviderProps } from "../types";

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider montado");

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        console.log("Firebase user:", firebaseUser?.email ?? "sin usuario");
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.log("Error en onAuthStateChanged:", error);
        setUser(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
