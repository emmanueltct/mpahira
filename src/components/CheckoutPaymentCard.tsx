import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import { useCart } from "@/hooks/userCarts";

export default function CheckoutPaymentCard({
  itemTotal,
  transportCost,
  serviceCost,
  generalTotal,
  telephone,
}) {
  const [selectedPayment, setSelectedPayment] = useState("momo");
  const { clientCheckout } = useCart();

  const handleCartItem = () => {
    if (!telephone) return; // Optional: guard clause

    const payload = {
      
        phone: telephone,
        amount:generalTotal,
      
    };

    clientCheckout.mutate(payload);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-4 text-white text-center">
        <h2 className="text-lg font-semibold">Payment Checkout</h2>
        <p className="text-sm opacity-90">Secure payment for your order</p>
      </div>

      {/* Order Summary */}
      <div className="p-5 space-y-3 border-b">
        <h3 className="font-semibold text-gray-800">Order Summary</h3>
        <SummaryRow label="Subtotal" value={itemTotal} />
        <SummaryRow label="Service Fee" value={serviceCost} />
        <SummaryRow label="Delivery Fee" value={transportCost} />
        <SummaryRow label="Total" value={generalTotal} bold />
      </div>

      {/* Payment Methods */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Choose Payment Method</h3>
        <PaymentOption
          label="Pay with MoMo"
          icon={<Smartphone className="text-amber-500" size={20} />}
          selected={selectedPayment === "momo"}
          onClick={() => setSelectedPayment("momo")}
        />
        <PaymentOption
          label="Pay with Card"
          icon={<CreditCard className="text-amber-500" size={20} />}
          selected={selectedPayment === "card"}
          onClick={() => setSelectedPayment("card")}
        />
      </div>

      {/* Pay Button */}
      <div className="p-5 border-t">
        <Button
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          disabled={clientCheckout.isPending}
          onClick={handleCartItem}
        >
          {clientCheckout.isPending ? "Processing..." : "Confirm & Pay" }
        </Button>
      </div>
    </div>
  );
}

/* Helper Components */
function SummaryRow({ label, value, bold = false }) {
  return (
    <div
      className={`flex justify-between text-sm ${
        bold ? "font-semibold text-gray-900" : "text-gray-600"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PaymentOption({ label, icon, selected, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition mb-2 ${
        selected ? "border-amber-500 bg-amber-50" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {selected && <CheckCircle2 className="text-green-500" size={20} />}
    </div>
  );
}
