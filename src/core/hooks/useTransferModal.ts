import { useState } from "react";

export function useTransferModal() {
  const [transferModal, setTransferModal] = useState(false);
  const [transferData, setTransferData] = useState<any>();

  const closeTransferModal = () => setTransferModal(false);

  const onTransferPress = (data: any) => {
    if (data) {
      setTransferModal(true);
      setTransferData(data);
    }
  };

  return {
    transferModal,
    transferData,
    setTransferData,
    closeTransferModal,
    onTransferPress,
  };
}
