import React from "react";
import { User } from "firebase";

export interface IAppContext {
  user: User | null;
  setUser: Function;
}

export const AppContext = React.createContext({
  user: null,
  setUser: () => {},
} as IAppContext);
