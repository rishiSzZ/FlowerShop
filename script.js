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
  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var message = document.getElementById("message").value.trim();
  var isValid = true;
  // clear old error messages first
  document.getElementById("nameError").innerText = "";
  document.getElementById("emailError").innerText = "";
  document.getElementById("phoneError").innerText = "";
  document.getElementById("messageError").innerText = "";
  document.getElementById("formSuccess").innerText = "";
  if (name === "") {
    document.getElementById("nameError").innerText = "Please enter your name.";
    isValid = false;
  }
  // simple email check: something@something.something
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    document.getElementById("emailError").innerText = "Please enter your email.";
    isValid = false;
  } else if (!emailPattern.test(email)) {
    document.getElementById("emailError").innerText = "Please enter a valid email.";
    isValid = false;
  }
  // phone is optional, but if filled it should only contain numbers
  if (phone !== "" && isNaN(phone)) {
    document.getElementById("phoneError").innerText = "Phone number should contain digits only.";
    isValid = false;
  }
  if (message === "") {
    document.getElementById("messageError").innerText = "Please enter a message.";
    isValid = false;
  }
  if (isValid) {
    document.getElementById("formSuccess").innerText =
      "Thank you, " + name + "! Your message has been sent.";
    document.getElementById("contactForm").reset();
  }
  // stop the form from actually submitting since there is no backend
  return false;
}
// CART
function getCart(){
    let cart = localStorage.getItem("cart");
    if(cart==null)
        return [];
    return JSON.parse(cart);
}
function addToCart(name,price){
    let cart = getCart();
    cart.push({
        name:name,
        price:price,
        quantity:1
    });
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
    updateCartCount();
    alert(name+" added to cart!");
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
function displayCheckout(){
    let cart = getCart();
    let items = document.getElementById("checkoutItems");
    if(!items)
        return;
    let total = 0;
    items.innerHTML="";
    cart.forEach(function(product){
        total += product.price * product.quantity;
        items.innerHTML += `
        <div class="checkout-item">
            <p>${product.name}</p>
            <p>₹${product.price}</p>
        </div>
        `;
    });
    document.getElementById("checkoutTotal").innerHTML=total;
}
function placeOrder() {
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
    alert("🎉 Order Placed Successfully!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
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
