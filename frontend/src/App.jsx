import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Products />} />

        <Route path="/cart" element={<Cart />} />

	<Route path="/login" element={<Login />} />

	<Route path="/register" element={<Register />} />

        <Route path="/checkout" element={<Checkout />} />
        
	<Route path="/orders" element={<Orders />} />  

	<Route path="/orders/:id" element={<OrderDetails />}/>

	  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
