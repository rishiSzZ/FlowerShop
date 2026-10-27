//  Ferns & Petals - JS 
//Navbar toggle 
function toggleMenu() {
  var links = document.getElementById("navLinks");
  links.classList.toggle("show");
}
//   Image Slider (used on index.html) 
var slideIndex = 0;
function showSlide(index) {
  var slides = document.getElementsByClassName("slide");
  if (slides.length === 0) {
    return; // no slider on this page
  }
  if (index >= slides.length) {
    slideIndex = 0;
  }
  if (index < 0) {
    slideIndex = slides.length - 1;
  }
  for (var i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  slides[slideIndex].classList.add("active");
}
function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}
function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}
// auto change slide every 4 seconds
setInterval(function () {
  var slides = document.getElementsByClassName("slide");
  if (slides.length > 0) {
    nextSlide();
  }
}, 4000);
//  Search Bar (products.html)
function searchProducts() {
  var input = document.getElementById("searchInput");
  var filter = input.value.toLowerCase();
  var cards = document.getElementsByClassName("product-card");
  for (var i = 0; i < cards.length; i++) {
    var name = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
    if (name.indexOf(filter) > -1) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}
//  Favorites 
// Add a product name to the favorites list saved in local storage
function addFavorite(productName) {
  var favorites = getFavorites();
  // avoid duplicate entries
  if (favorites.indexOf(productName) === -1) {
    favorites.push(productName);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  alert(productName + " added to favorites!");
  }
  else
  {
    alert(productName + " is already in your favorites!");
  }
  displayFavorites();
}
// Get favorites array from local storage (returns empty array if none saved yet)
function getFavorites() {
  var stored = localStorage.getItem("favorites");
  if (stored === null) {
    return [];
  }
  return JSON.parse(stored);
}
// Remove one favorite by name
function removeFavorite(productName) {
  var favorites = getFavorites();
  var updated = [];
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i] !== productName) {
      updated.push(favorites[i]);
    }
  }
  localStorage.setItem("favorites", JSON.stringify(updated));
  displayFavorites();
}
// Clear all favorites
function clearFavorites() {
  localStorage.removeItem("favorites");
  displayFavorites();
}
// Show the favorites list on the page
function displayFavorites() {
  var list = document.getElementById("favoritesList");
  if (!list) {
    return; // no favorites list on this page
  }
  var favorites = getFavorites();
  list.innerHTML = "";
  if (favorites.length === 0) {
    list.innerHTML = "<li>No favorites added yet.</li>";
    return;
  }
  for (var i = 0; i < favorites.length; i++) {
    var li = document.createElement("li");
    li.innerHTML =
      favorites[i] +
      ' <button onclick="removeFavorite(\'' + favorites[i] + '\')">Remove</button>';
    list.appendChild(li);
  }
}
// run once the page loads, so favorites show up if we are on products.html
window.onload = function () {
  displayFavorites();
  updateCartCount();
  displayCart();
  displayCheckout();
};
//  Contact Form Validation (contact.html)
function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("messageError").textContent = "";
    document.getElementById("formSuccess").textContent = "";

    let valid = true;

    if (name === "") {
        document.getElementById("nameError").textContent =
            "Please enter your name.";
        valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        document.getElementById("emailError").textContent =
            "Please enter your email.";
        valid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent =
            "Please enter a valid email address.";
        valid = false;
    }

    if (phone !== "" && !/^\d+$/.test(phone)) {
        document.getElementById("phoneError").textContent =
            "Phone must contain digits only.";
        valid = false;
    }

    if (message === "") {
        document.getElementById("messageError").textContent =
            "Please enter your message.";
        valid = false;
    }

    return valid;
}
// CART
function getCart(){
    let cart = localStorage.getItem("cart");
    if(cart==null)
        return [];
    return JSON.parse(cart);
}
function addToCart(productId, name, price) {
    let cart = getCart();

    // Check whether this product is already in the cart
    let existingProduct = cart.find(function(item) {
        return Number(item.id) === Number(productId);
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id: Number(productId),
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    displayCart();
    displayCheckout();

    alert(name + " added to cart!");
}
function updateCartCount(){
    let count = getCart().length;
    let cartCount =
    document.getElementById("cartCount");
    if(cartCount){
        cartCount.innerHTML =
        "("+count+")";
    }
}
function checkout() {
    let cart = getCart();
    if (cart.length === 0) {
        alert("🛒 Your cart is empty. Please add a product before proceeding to checkout.");
        return;
    }
    window.location.href = "checkout.html";
}
function removeCartItem(index){
    let cart = getCart();
    cart.splice(index,1);
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
    updateCartCount();
    displayCart();
}
function displayCart(){
    let cart = getCart();
    let cartItems =
    document.getElementById("cartItems");
    if(!cartItems)
        return;
    let total = 0;
    cartItems.innerHTML="";
    cart.forEach(function(item,index){
        total += item.price * item.quantity;
        cartItems.innerHTML += `
        <div class="cart-card">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <p>Qty : ${item.quantity}</p>
        <button onclick="removeCartItem(${index})">
        Remove
        </button>
        </div>
        `;
    });
    document.getElementById("totalPrice")
    .innerHTML = total;
}
function displayCheckout() {
    let cart = getCart();
    let items = document.getElementById("checkoutItems");

    if (!items) {
        return;
    }

    let total = 0;
    items.innerHTML = "";

    cart.forEach(function(product) {
        let subtotal = Number(product.price) * Number(product.quantity);
        total += subtotal;

        items.innerHTML += `
            <div class="checkout-item">
                <p>${product.name} × ${product.quantity}</p>
                <p>₹${subtotal.toFixed(2)}</p>
            </div>
        `;
    });

    document.getElementById("checkoutTotal").textContent =
        total.toFixed(2);
}
async function placeOrder() {
    let form = document.getElementById("checkoutForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Make sure every cart item has a database ID
    if (cart.some(item => !item.id || !Number.isInteger(Number(item.id)))) {
        alert("Your cart contains outdated items. Please clear your cart and add the products again.");
        return;
    }

    let paymentOption = document.querySelector(
        'input[name="payment"]:checked'
    );

    let orderData = {
        customer_name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        pincode: document.getElementById("pincode").value.trim(),
        payment_method: paymentOption ? paymentOption.value : "",
        items: cart.map(function(item) {
            return {
                product_id: Number(item.id),
                quantity: Number(item.quantity)
            };
        })
    };

    let button = document.querySelector(
        '.checkout-right button[onclick="placeOrder()"]'
    );

    if (button) {
        button.disabled = true;
        button.textContent = "Placing Order...";
    }

    try {
        let response = await fetch("php/place_order.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        let result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Unable to place order.");
        }

        alert(
            "Order placed successfully!\n" +
            "Order ID: " + result.order_id +
            "\nTotal: ₹" + Number(result.total_amount).toFixed(2)
        );

        localStorage.removeItem("cart");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Order error:", error);
        alert(error.message || "Unable to place your order. Please try again.");
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = "Place Order";
        }
    }
}
function changeCity(){
    let city = document.getElementById("citySelect").value;
    localStorage.setItem("city", city);
}
window.addEventListener("load", function(){
    let savedCity = localStorage.getItem("city");
    if(savedCity){
        document.getElementById("citySelect").value = savedCity;
    }
});

async function loadProducts() {
    const productsGrid = document.getElementById("productsGrid");

    // Stop if this page doesn't contain the products grid
    if (!productsGrid) {
        return;
    }

    try {
        const response = await fetch("php/products.php");

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();

        productsGrid.innerHTML = "";

        if (!Array.isArray(products) || products.length === 0) {
            productsGrid.innerHTML = "<p>No products available.</p>";
            return;
        }

        products.forEach(function(product) {
            const card = document.createElement("div");
            card.className = "product-card";

            // Product image
            const image = document.createElement("img");
            image.src = product.image || "";
            image.alt = product.name || "Flower product";

            // Product name
            const name = document.createElement("h3");
            name.textContent = product.name;

            // Product price
            const price = document.createElement("p");
            price.className = "price";
            price.textContent = "Rs. " + Number(product.price).toFixed(2);

            // Add to Favorites button
            const favoriteButton = document.createElement("button");
            favoriteButton.textContent = "Add to Favorites";

            favoriteButton.addEventListener("click", function() {
                addFavorite(product.name);
            });

            // Add to Cart button
            const cartButton = document.createElement("button");
            cartButton.textContent = "Add to Cart";

            cartButton.addEventListener("click", function() {
                addToCart(
                    Number(product.id),
                    product.name,
                    Number(product.price)
                );
            });

            // Add everything to the product card
            card.append(
                image,
                name,
                price,
                favoriteButton,
                cartButton
            );

            productsGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading products:", error);

        productsGrid.innerHTML =
            "<p>Unable to load products. Please try again later.</p>";
    }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", loadProducts);
async function submitContactForm(event) {
    event.preventDefault();

    // Validate the form first
    if (!validateForm()) {
        return false;
    }

    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    const successMessage = document.getElementById("formSuccess");
    successMessage.textContent = "Sending message...";

    try {
        const response = await fetch("php/contact.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to send message.");
        }

        successMessage.textContent = result.message;
        document.getElementById("contactForm").reset();

    } catch (error) {
        console.error("Contact form error:", error);

        successMessage.textContent =
            "Unable to send your message. Please try again.";
    }
    return false;
}
window.submitContactForm = submitContactForm;
