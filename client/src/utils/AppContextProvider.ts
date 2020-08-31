import React from "react";
import { User } from "firebase";

export interface IAppContext {
  user?: User;
}

export const AppContext = React.createContext({} as IAppContext);
