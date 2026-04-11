export const ORDER_LIFECYCLE = [
  {
    status: 'placed',
    label: 'Placed',
    description: 'We received your order and queued it for review.',
  },
  {
    status: 'confirmed',
    label: 'Confirmed',
    description: 'The restaurant accepted your order and started planning it.',
  },
  {
    status: 'preparing',
    label: 'Preparing',
    description: 'The kitchen is cooking your dishes now.',
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Your rider is on the way with your order.',
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Your order has arrived. Enjoy your meal.',
  },
] as const;

export type OrderLifecycleStatus = typeof ORDER_LIFECYCLE[number]['status'];
export type OrderStatus = OrderLifecycleStatus | 'cancelled';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const ORDER_STATUS_MESSAGES: Record<OrderStatus, string> = {
  placed: 'We have your order. The restaurant will confirm it shortly.',
  confirmed: 'Your order has been accepted and is moving into the kitchen flow.',
  preparing: 'Your dishes are actively being prepared right now.',
  out_for_delivery: 'Your order has left the restaurant and is on the way.',
  delivered: 'Your order has been delivered successfully.',
  cancelled: 'This order was cancelled. Please contact the restaurant if you need help.',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Card',
  upi: 'UPI',
  cod: 'Cash on Delivery',
};

export function isOrderStatus(value: string): value is OrderStatus {
  return value in ORDER_STATUS_LABELS;
}

export function formatOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? 'Placed';
}

export function getOrderStatusMessage(status: OrderStatus): string {
  return ORDER_STATUS_MESSAGES[status] ?? ORDER_STATUS_MESSAGES.placed;
}

export function getOrderStageIndex(status: OrderStatus): number {
  const index = ORDER_LIFECYCLE.findIndex(stage => stage.status === status);
  return index === -1 ? 0 : index;
}

export function formatPaymentMethod(method: string): string {
  return PAYMENT_METHOD_LABELS[method] ?? method.toUpperCase();
}
