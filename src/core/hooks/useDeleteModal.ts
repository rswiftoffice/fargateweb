import { useState } from "react";

export function useDeleteModal() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | string | undefined>();

  const closeDeleteModal = () => setDeleteModal(false);

  const onDeletePress = (id: number) => {
    setDeleteModal(true);
    setSelectedId(id);
  };

  return {
    deleteModal,
    selectedId,
    setSelectedId,
    closeDeleteModal,
    onDeletePress,
  };
}
