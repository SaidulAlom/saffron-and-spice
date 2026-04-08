import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../constants';
import { ImageWithFallback } from './ImageWithFallback';
import CheckoutModal from './CheckoutModal';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { item: MenuItem; quantity: number }[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

export default function CartSidebar({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onClearCart }: CartSidebarProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const total = cartItems.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  const handleOrderSuccess = () => {
    onClearCart();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-subtle z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-saffron" size={24} />
                  <h2 className="text-2xl font-serif">Your Order</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors micro-button" aria-label="Close cart">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <p className="text-lg">Your cart is empty.<br />Start adding some royal flavors!</p>
                  </div>
                ) : (
                  cartItems.map(({ item, quantity }) => (
                    <div key={item.id} className="flex gap-4 group motion-card rounded-xl p-2 -m-2" data-tilt>
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg truncate">{item.name}</h3>
                        <p className="text-saffron font-medium">₹{item.price}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-subtle rounded-full px-2 py-1">
                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-saffron transition-colors micro-button" aria-label={`Decrease ${item.name} quantity`}>
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-saffron transition-colors micro-button" aria-label={`Increase ${item.name} quantity`}>
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => onRemove(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors micro-button" aria-label={`Remove ${item.name}`}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-subtle bg-card space-y-4">
                  <div className="flex items-center justify-between text-xl font-serif">
                    <span>Total Amount</span>
                    <span className="text-saffron">₹{total}</span>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-saffron hover:bg-saffron-dark text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-saffron/20 magnetic-button"
                    data-magnetic
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        total={total}
        onOrderSuccess={handleOrderSuccess}
      />
    </>
  );
}
