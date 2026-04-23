import { useState } from "react";
import axios from "axios";

export default function Order() {
  const [cart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const submitOrder = async () => {
    await axios.post("http://localhost:5000/api/orders", {
      customer,
      items: cart
    });

    alert("Order success!");
  };

  return (
    <div className="order-page">

      {/* CART */}
      <div className="cart">
        <h3>🛒 Cart</h3>
        <p>Total: {total}</p>
      </div>

      {/* CHECKOUT */}
      <div className="checkout">
        <h3>Checkout</h3>

        <input
          placeholder="Name"
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        />

        <input
          placeholder="Phone"
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        />

        <button onClick={submitOrder}>
          Place Order
        </button>
      </div>

    </div>
  );
}