import { Modal } from "../ui/Modal/Modal";
import { Button } from "../ui/Button/Button";

interface DeleteConfirmationModalProps {
  open: boolean;
  userName: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal = ({
  open,
  userName,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal open={open} title="Delete User" onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p>
          Are you sure you want to delete <strong>{userName}</strong>?
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>

          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
