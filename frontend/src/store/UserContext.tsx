import React, { createContext, useReducer, useEffect, ReactNode } from "react";

// Types pour l'état utilisateur
interface UserState {
  firstName: string
  lastName: string
  token: string
  email:string
  role: string
  id: number
}

// Actions du reducer
type Action =
  | { type: "SET_USER"; payload: Partial<UserState> }
  | { type: "LOGOUT" };

// Contexte avec le state et dispatch
interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<Action>;
}

const localStorageKey = "userData";

const initialState: UserState = {
  firstName: "",
  lastName: "",
  email:"",
  role: "",
  token: "",
  id: 0,
};

// Lecture des données depuis localStorage
const loadFromStorage = (): UserState => {
  try {
    const data = localStorage.getItem(localStorageKey);
    return data ? JSON.parse(data) : initialState;
  } catch {
    return initialState;
  }
};

// Reducer utilisateur
const userReducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

// Création du contexte
export const UserContext = createContext<UserContextType>({
  state: initialState,
  dispatch: () => null,
});

// Provider utilisateur
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState, loadFromStorage);

  useEffect(() => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (!state.token && parsed.token) {
        dispatch({ type: "SET_USER", payload: parsed });
      }
    }
  }, []); // [] pour ne le faire qu'au montage

  // Sauvegarde du contexte à chaque changement
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};


