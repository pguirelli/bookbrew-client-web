import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { OrderDTO } from '../../types/order.types';

interface ShippingDialogProps {
  open: boolean;
  selectedOrder: OrderDTO | null;
  trackingCode: string;
  onClose: () => void;
  onTrackingCodeChange: (value: string) => void;
  onConfirmShipment: (orderId: number, status: string) => void;
}

export const ShippingDialog: React.FC<ShippingDialogProps> = ({
  open,
  selectedOrder,
  trackingCode,
  onClose,
  onTrackingCodeChange,
  onConfirmShipment,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enviar Pedido</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Código de Rastreio"
          fullWidth
          value={trackingCode}
          onChange={(e) => onTrackingCodeChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={() => selectedOrder?.id && onConfirmShipment(selectedOrder.id, "ENVIADO")} 
          variant="contained"
          disabled={!trackingCode || !selectedOrder}
        >
          Confirmar Envio
        </Button>
      </DialogActions>
    </Dialog>
  );
};