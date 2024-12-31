import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleProductSelection = (productId) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(productId)
        ? prevSelectedProducts.filter((id) => id !== productId)
        : [...prevSelectedProducts, productId]
    );
  };

  const handlePlaceOrder = () => {
    axios
      .post("http://localhost:5000/place-order", selectedProducts)
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  return (
    <div>
      <h1>Products</h1>
      <h4>Product Price weight</h4>
      <ul className="itemSet">
        {products.map((product) => (
          <li key={product.id} className="item">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={() => handleProductSelection(product.id)}
            />
            <div className="value">
              {product.name} - ${product.price} - {product.weight}g
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder}>Place order</button>

      {packages.length > 0 && (
        <div>
          <h2>Order Summary</h2>
          {packages.map((pkg, index) => (
            <div key={index}>
              <h3>Package {index + 1}</h3>
              <p>Items: {pkg.items.map((item) => item.name).join(", ")}</p>
              <p>Total weight: {pkg.totalWeight}g</p>
              <p>Total price: ${pkg.totalPrice}</p>
              <p>Courier price: ${pkg.courierPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
