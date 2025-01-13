
import { ReactNode } from "react";
import { ConnectAccountModal } from "./connect-account-modal";

export function ModalProvider({ children }: { readonly children: ReactNode }) {
  return (
    <>
      {children}
      <ConnectAccountModal />
    </>
  );
}
