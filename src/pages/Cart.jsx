import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { cart, loading, removePetFromCart, clearUserCart, processCheckout, isProcessing, isOffline } = useCart();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, item) => total + (item.price || 0), 0);

  const handleRemove = async (petId) => {
    await removePetFromCart(petId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearUserCart();
    }
  };

  const handleCheckout = async () => {
    await processCheckout();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isOffline && (
        <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3">
          You are in offline mode. Cart changes are saved locally and will sync when the server is reachable.
        </div>
      )}
      <button
        onClick={() => navigate('/pets')}
        className="mb-6 inline-flex items-center text-orange-500 hover:text-orange-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Continue Shopping
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
              <button
                onClick={() => navigate('/pets')}
                className="mt-4 text-orange-500 hover:text-orange-600"
              >
                Browse Pets
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(pet => (
                <div
                  key={pet.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <img
                    src={pet.imageUrl || 'https://via.placeholder.com/100x100?text=Pet'}
                    alt={pet.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                    <p className="text-sm text-gray-600">
                      {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.gender}
                    </p>
                    <p className="text-green-600 font-semibold mt-1">${pet.price}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(pet.id)}
                    disabled={isProcessing}
                    className={`p-2 ${isProcessing ? 'text-red-300 cursor-wait' : 'text-red-500 hover:text-red-600'}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  disabled={isProcessing}
                  className={`text-sm ${isProcessing ? 'text-red-300 cursor-wait' : 'text-red-500 hover:text-red-600'}`}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="lg:w-80">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing Fee</span>
                  <span>$0</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full text-white py-2 px-4 rounded-md transition-colors ${isProcessing ? 'bg-orange-300 cursor-wait' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 