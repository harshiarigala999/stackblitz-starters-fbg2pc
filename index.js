const express = require('express');
const { resolve } = require('path');

const cors = require('cors');

 const app = express();
app.use(cors());

let cart = [
    { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
    { productId: 2, name: 'Mobile', price: 20000, quantity: 2 }
];
app.post('/cart/add', (req, res) => {
  const { productId, name, price, quantity } = req.body;

  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
      existingItem.quantity += quantity;
  } else {
      cart.push({ productId, name, price, quantity });
  }

  res.json({ cartItems: cart });
});



// Endpoint to add a new item to the cart
app.get('/cart/add', (req, res) => {
  const productId = parseInt(req.query.productId);
  const name = req.query.name;
  const price = parseFloat(req.query.price);
  const quantity = parseInt(req.query.quantity);

  // Check if the product already exists in the cart
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
      // If the item exists, update the quantity
      existingItem.quantity += quantity;
  } else {
      // If the item doesn't exist, add it to the cart
      cart.push({ productId, name, price, quantity });
  }

  // Respond with the updated cart
  res.json({ cartItems: cart });
});

// Endpoint to edit the quantity of an existing item in the cart
app.get('/cart/edit', (req, res) => {
  const productId = parseInt(req.query.productId);
  const newQuantity = parseInt(req.query.quantity);

  // Find the item in the cart
  const item = cart.find(product => product.productId === productId);

  if (item) {
      item.quantity = newQuantity;
      res.json({ cartItems: cart });
  } else {
      res.status(404).json({ message: 'Product not found in cart' });
  }
});



// Function to delete an item from the cart by productId
function deleteCartItem(cart, productId) {
  return cart.filter(item => item.productId !== productId);
}

// Endpoint to delete an item from the cart
app.get('/cart/delete', (req, res) => {
  const productId = parseInt(req.query.productId);

  // Update the cart by filtering out the specified productId
  const updatedCart = deleteCartItem(cart, productId);

  // Check if deletion occurred by comparing lengths
  if (updatedCart.length < cart.length) {
      cart = updatedCart; // Update the original cart
      res.json({ cartItems: cart });
  } else {
      res.status(404).json({ message: 'Product not found in cart' });
  }
});


function getCartItems() {
  return cart; // Return the current state of the cart
}
app.get('/cart', (req, res) => {
  const currentCart = getCartItems(); // Fetch current cart items
  res.json({ cartItems: currentCart }); // Send the response
});

function calculateTotalQuantity() {
  let totalQuantity = 0;
  for (let item of cart) {
      totalQuantity += item.quantity; // Sum up the quantity of each item
  }
  return totalQuantity;
}

// Endpoint to calculate and return the total quantity of items in the cart
app.get('/cart/total-quantity', (req, res) => {
  const totalQuantity = calculateTotalQuantity(); // Get total quantity
  res.json({ totalQuantity }); // Send the response
});


function calculateTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0); // Sum the total price
}

// Endpoint to calculate and return the total price of items in the cart
app.get('/cart/total-price', (req, res) => {
  const totalPrice = calculateTotalPrice(); // Get total price
  res.json({ totalPrice }); // Send the response
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});