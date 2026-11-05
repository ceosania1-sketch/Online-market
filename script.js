// AURA FASHION

let products = JSON.parse(localStorage.getItem("auraProducts")) || [
  {
    id: 1,
    title: "Elegant Black Dress",
    price: 3500,
    description: "Premium fashion collection",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800"
  },
  {
    id: 2,
    title: "Luxury Fashion Outfit",
    price: 4200,
    description: "Elegant everyday style",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
  }
];

let cart = [];

const ADMIN_PASSWORD = "1234";

// Change this to your WhatsApp number.
// Pakistan example: 923001234567
const WHATSAPP_NUMBER = "923001234567";

function saveProducts() {
  localStorage.setItem("auraProducts", JSON.stringify(products));
}

function displayProducts() {
  const container = document.getElementById("productList");

  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p class="price">Rs. ${product.price.toLocaleString("en-PK")}</p>
        <button onclick="addToCart(${product.id})">
          ADD TO CART
        </button>
      </div>
    `;
  });
}

function openAdmin() {
  document.getElementById("adminPanel").classList.remove("hidden");
}

function closeAdmin() {
  document.getElementById("adminPanel").classList.add("hidden");
}

function loginAdmin() {
  const password = document.getElementById("adminPassword").value;

  if (password === ADMIN_PASSWORD) {
    document.getElementById("loginArea").classList.add("hidden");
    document.getElementById("adminArea").classList.remove("hidden");
    displayAdminProducts();
  } else {
    alert("Incorrect password!");
  }
}

function logoutAdmin() {
  document.getElementById("adminArea").classList.add("hidden");
  document.getElementById("loginArea").classList.remove("hidden");
  document.getElementById("adminPassword").value = "";
}

function addProduct() {
  const title = document.getElementById("productTitle").value.trim();
  const price = Number(document.getElementById("productPrice").value);
  const description = document.getElementById("productDescription").value.trim();
  const file = document.getElementById("productImage").files[0];

  if (!title || !price || price <= 0 || !file) {
    alert("Please enter title, valid price and product picture.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select an image.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Image must be smaller than 2 MB.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const newProduct = {
      id: Date.now(),
      title: title,
      price: price,
      description: description,
      image: event.target.result
    };

    products.unshift(newProduct);

    try {
      saveProducts();
      displayProducts();
      displayAdminProducts();

      document.getElementById("productTitle").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productDescription").value = "";
      document.getElementById("productImage").value = "";

      alert("Product added successfully!");
    } catch (error) {
      products.shift();
      alert("Storage full. Try a smaller image.");
    }
  };

  reader.readAsDataURL(file);
}

function displayAdminProducts() {
  const area = document.getElementById("adminProducts");

  area.innerHTML = "";

  products.forEach(product => {
    area.innerHTML += `
      <div class="cart-row">
        <h3>${product.title}</h3>
        <p>Rs. ${product.price}</p>
        <button onclick="deleteProduct(${product.id})">
          DELETE
        </button>
        <button onclick="editProduct(${product.id})">
          EDIT
        </button>
      </div>
    `;
  });
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  products = products.filter(product => product.id !== id);

  saveProducts();
  displayProducts();
  displayAdminProducts();
}

function editProduct(id) {
  const product = products.find(item => item.id === id);

  const newTitle = prompt("New product title:", product.title);
  if (newTitle === null || !newTitle.trim()) return;

  const newPrice = prompt("New price:", product.price);
  if (newPrice === null) return;

  const price = Number(newPrice);

  if (!Number.isFinite(price) || price <= 0) {
    alert("Enter a valid price.");
    return;
  }

  product.title = newTitle.trim();
  product.price = price;

  saveProducts();
  displayProducts();
  displayAdminProducts();
}

function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }

  updateCartCount();
  alert("Added to your cart!");
}

function updateCartCount() {
  const count = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  document.getElementById("cartCount").textContent = count;
}

function openCart() {
  document.getElementById("cartPanel").classList.remove("hidden");
  displayCart();
}

function closeCart() {
  document.getElementById("cartPanel").classList.add("hidden");
}

function displayCart() {
  const container = document.getElementById("cartItems");

  container.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="cart-row">
        <h3>${item.title}</h3>
        <p>Rs. ${item.price} × ${item.quantity}</p>
        <button onclick="changeQuantity(${item.id}, -1)">−</button>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})">REMOVE</button>
      </div>
    `;
  });

  document.getElementById("cartTotal").textContent =
    "Total: Rs. " + total.toLocaleString("en-PK");
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  updateCartCount();
  displayCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  updateCartCount();
  displayCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in your name, phone and address.");
    return;
  }

  let message = "Hello AURA FASHION! I want to place an order.\n\n";

  message += "Customer: " + name + "\n";
  message += "Phone: " + phone + "\n";
  message += "Address: " + address + "\n\n";

  let total = 0;

  cart.forEach(item => {
    message += item.title + " × " + item.quantity +
      " = Rs. " + item.price * item.quantity + "\n";

    total += item.price * item.quantity;
  });

  message += "\nTotal: Rs. " + total;

  const url = "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
}

// Start website
displayProducts();
updateCartCount();
