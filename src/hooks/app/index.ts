import { AppContext, ModalOptions } from "@types";
import React from "react";

const AppContext = React.createContext<AppContext>({
  modalActions: [],
  modalContent: null,
  modalIsOpen: false,
  modalTitle: "",
  modalIsLoading: false,
  setModalIsLoading: (_: boolean) => {},
  openModal: (_: ModalOptions) => {},
  closeModal: () => {},
});
const AppProvider = AppContext.Provider;

export const useApp = () => React.useContext(AppContext);

export default AppProvider;
