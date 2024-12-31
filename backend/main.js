import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Data provided converted to json form
const products = [
  { id: 1, name: "Item 1", price: 10, weight: 200 },
  { id: 2, name: "Item 2", price: 100, weight: 20 },
  { id: 3, name: "Item 3", price: 30, weight: 300 },
  { id: 4, name: "Item 4", price: 20, weight: 500 },
  { id: 5, name: "Item 5", price: 30, weight: 250 },
  { id: 6, name: "Item 6", price: 40, weight: 10 },
  { id: 7, name: "Item 7", price: 200, weight: 10 },
  { id: 8, name: "Item 8", price: 120, weight: 500 },
  { id: 9, name: "Item 9", price: 130, weight: 790 },
  { id: 10, name: "Item 10", price: 20, weight: 100 },
  { id: 11, name: "Item 11", price: 10, weight: 340 },
  { id: 12, name: "Item 12", price: 4, weight: 800 },
  { id: 13, name: "Item 13", price: 5, weight: 200 },
  { id: 14, name: "Item 14", price: 240, weight: 20 },
  { id: 15, name: "Item 15", price: 123, weight: 700 },
  { id: 16, name: "Item 16", price: 245, weight: 10 },
  { id: 17, name: "Item 17", price: 230, weight: 20 },
  { id: 18, name: "Item 18", price: 110, weight: 200 },
  { id: 19, name: "Item 19", price: 45, weight: 200 },
  { id: 20, name: "Item 20", price: 67, weight: 20 },
  { id: 21, name: "Item 21", price: 88, weight: 300 },
  { id: 22, name: "Item 22", price: 10, weight: 500 },
  { id: 23, name: "Item 23", price: 17, weight: 250 },
  { id: 24, name: "Item 24", price: 19, weight: 10 },
  { id: 25, name: "Item 25", price: 89, weight: 10 },
  { id: 26, name: "Item 26", price: 45, weight: 500 },
  { id: 27, name: "Item 27", price: 99, weight: 790 },
  { id: 28, name: "Item 28", price: 125, weight: 100 },
  { id: 29, name: "Item 29", price: 198, weight: 340 },
  { id: 30, name: "Item 30", price: 220, weight: 800 },
  { id: 31, name: "Item 31", price: 249, weight: 200 },
  { id: 32, name: "Item 32", price: 230, weight: 20 },
  { id: 33, name: "Item 33", price: 190, weight: 700 },
  { id: 34, name: "Item 34", price: 45, weight: 10 },
  { id: 35, name: "Item 35", price: 12, weight: 20 },
  { id: 36, name: "Item 36", price: 5, weight: 200 },
  { id: 37, name: "Item 37", price: 2, weight: 200 },
  { id: 38, name: "Item 38", price: 90, weight: 20 },
  { id: 39, name: "Item 39", price: 12, weight: 300 },
  { id: 40, name: "Item 40", price: 167, weight: 500 },
  { id: 41, name: "Item 41", price: 12, weight: 250 },
  { id: 42, name: "Item 42", price: 8, weight: 10 },
  { id: 43, name: "Item 43", price: 2, weight: 10 },
  { id: 44, name: "Item 44", price: 9, weight: 500 },
  { id: 45, name: "Item 45", price: 210, weight: 790 },
  { id: 46, name: "Item 46", price: 167, weight: 100 },
  { id: 47, name: "Item 47", price: 23, weight: 340 },
  { id: 48, name: "Item 48", price: 190, weight: 800 },
  { id: 49, name: "Item 49", price: 199, weight: 200 },
  { id: 50, name: "Item 50", price: 12, weight: 20 },
];

app.get("/products", (req, res) => {
  res.json(products);
});

const calculateCourierPrice = (weight) => {
  if (weight <= 200) return 5;
  if (weight <= 500) return 10;
  if (weight <= 1000) return 15;
  if (weight <= 5000) return 20;
  return 25; // For weights above 5000g, add an additional tier
};

const splitPackages = (selectedProducts) => {
  selectedProducts.sort((a, b) => b.weight - a.weight);
  //sorts as descending order

  const packages = [];
  let currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };

  selectedProducts.forEach((product) => {
    if (
      currentPackage.totalPrice + product.price > 250 ||
      currentPackage.totalWeight + product.weight > 5000
    ) {
      packages.push(currentPackage);
      currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };
    }
    currentPackage.items.push(product);
    currentPackage.totalWeight += product.weight;
    currentPackage.totalPrice += product.price;
  });

  if (currentPackage.items.length > 0) {
    packages.push(currentPackage);
  }

  // Calculate courier prices based on weight
  packages.forEach((pkg) => {
    pkg.courierPrice = calculateCourierPrice(pkg.totalWeight);
  });

  return packages;
};

app.post("/place-order", (req, res) => {
  const selectedProductIds = req.body;
  const selectedProducts = products.filter((product) =>
    selectedProductIds.includes(product.id)
  );

  // Packaging logic with even weight distribution
  const packages = splitPackages(selectedProducts);

  res.json(packages);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
