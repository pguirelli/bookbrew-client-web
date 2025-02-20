import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle style={{ background: '#1976d2', color: 'white', marginBottom: 15}}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onConfirm}
          style={{ backgroundColor: "green", color: "white" }}
          autoFocus
        >
          Sim
        </Button>
        <Button
          onClick={onCancel}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Não
        </Button>
      </DialogActions>
    </Dialog>
  );
};
