import { data } from './productdata.js';
let cart = [];

let updateHtml = '';

const cartContent = document.querySelector('.cart-content');
const emptyCartHtml = `
<div class="empty-cart">
    <img
      src="assets/images/illustration-empty-cart.svg"
      alt=""
      srcset=""
    />
    <p>Your added items will apear here</p>
  </div>`
const cartHeader = document.querySelector(".cart-header")

data.forEach((value) => {
  updateHtml += `
    <div class="product-container">
      <div class="img-container">
        <div class="product-thumbnail">
          <img src="${value.image.desktop}" alt="" class="product-img">
        </div>
        <div class="product-controls add-to-cart js-add-to-cart" data-product-id="${value.id}" data-product-image="${value.image.mobile}" data-product-category="${value.category}" data-product-name="${value.name}" data-product-price="${value.price}">
          <img src="assets/images/icon-add-to-cart.svg" alt="">
          <p class="text">Add to Cart</p>
        </div>
        <div class="product-controls quantity-control js-quantity-control-${value.category} quantity-control-id-${value.id}">
          <button class="control-btn js-minus-btn" data-id="${value.id}">-</button>
          <p class="product-quantity-${value.id}">1</p>
          <button class="control-btn js-plus-btn" data-id="${value.id}">+</button>
        </div>
      </div>
      <div class="product-title">
        <p>${value.category}</p>
        <h3>${value.name}</h3>
        <p class="product-price">$${(value.price).toFixed(2)}</p>
      </div>
    </div>`
});

document.querySelector('.js-product-grid').innerHTML = updateHtml;

const addToCartBtn = document.querySelectorAll('.js-add-to-cart');

addToCartBtn.forEach((value) => {
  const qualityControlbtn = document.querySelector(`.js-quantity-control-${value.dataset.productCategory}`);
  
  
  value.addEventListener('click', () => {
    qualityControlbtn.classList.add('display');
    value.classList.add('hidden');


    cart.push({
      id: value.dataset.productId,
      image: value.dataset.productImage,
      productName: value.dataset.productName,
      productPrice: Number(value.dataset.productPrice),
      productCategory: value.dataset.productCategory,
      quantity: 1
    })
    renderCart()
    displayNumberOfItemsInCart()
  })
});


function renderCart() {
  let cartHtml = ""
  let cartTotal = cart.reduce((acc, item) => {
    return acc + (item.quantity * item.productPrice)
  }, 0)
  
  if (cart.length === 0) {
    cartContent.innerHTML = emptyCartHtml
    document.querySelector(".cart-footer").style.display = "none"
  }else{
    document.querySelector(".cart-footer").style.display = "block"
    document.querySelector(".cart-total").textContent = `$${Number(cartTotal).toFixed(2)}`
    cart.map((item) => {
      cartHtml += `
        <div class="cart-item">
          <div>
            <h3>${item.productName}</h3>
            <div class="price-stuff">
              <span class="item-quantity">${item.quantity}x</span>
              <span class="item-price">@ $${Number(item.productPrice).toFixed(2)}</span>
              <span class="item-total">$${Number(item.quantity * item.productPrice).toFixed(2)}</span>
            </div>
          </div>
          <button class="remove-item-btn" data-id="${item.id}">
            <img src="/assets/images/icon-remove-item.svg"/>
          </button>
        </div>
      `
    })
    cartContent.innerHTML = cartHtml
    
    const removeItemBtns = document.querySelectorAll(".remove-item-btn")

    removeItemBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelector(`.product-quantity-${btn.dataset.id}`).textContent = 1
        document.querySelector(`.quantity-control-id-${btn.dataset.id}`).classList.remove("display")
        removeItemFromCart(btn.dataset.id)
        displayNumberOfItemsInCart()
        renderCart()
      })
    }) 
    
    function removeItemFromCart(id) {
      cart = cart.filter(item => item.id !== id)
    }
  }
}
renderCart()

function renderOrder() {
  const orderList = document.querySelector(".order-list")
  let orderHtml = ""
  let orderTotal = cart.reduce((acc, item) => {
    return acc + (item.quantity * item.productPrice)
  }, 0)
  
  cart.map((item) => {
    orderHtml += `
      <li class="order-list-item">
        <div class="order-details">
          <div class="order-image">
            <img src="${item.image}" alt="">
          </div>
          <div>
            <h3>${item.productName}</h3>
            <p><span>${item.quantity}x</span><span>$${Number(item.productPrice).toFixed(2)}</span></p>
          </div>
        </div>
        <p class="order-item-total">$${Number(item.quantity * item.productPrice).toFixed(2)}</p>
      </li>
    `
    
    orderList.innerHTML = orderHtml
    document.querySelectorAll(".cart-total").forEach((total) => {
      total.textContent = `$${Number(orderTotal).toFixed(2)}`
    })
  })
}

const minusBtns = document.querySelectorAll(".js-minus-btn")
const plusBtns = document.querySelectorAll(".js-plus-btn")

minusBtns.forEach((btn) => {  
  btn.addEventListener("click", () => {
    decrementProductInCart(btn.dataset.id)
    renderCart()
  })
})

plusBtns.forEach((btn) => {  
  btn.addEventListener("click", () => {
    incrementProductInCart(btn.dataset.id)
    renderCart()
  })
})

function incrementProductInCart(id) {
  const cartItem = cart.find(item => item.id === id)
  cartItem.quantity += 1
  showProductQuantityInCart(id)
  displayNumberOfItemsInCart()
}

function decrementProductInCart(id) {
  const cartItem = cart.find(item => item.id === id)
  if(cartItem.quantity === 1) {
    cart = cart.filter(item => item.id !== id)  
    document.querySelector(`.quantity-control-id-${id}`).classList.remove("display")
    if(cart.length == 0) {
      cartContent.innerHTML = emptyCartHtml
    }
  }else{
    cartItem.quantity -= 1
  }
  showProductQuantityInCart(id)
  displayNumberOfItemsInCart()
}

function showProductQuantityInCart(id) {
  const cartProduct = cart.find(item => item.id === id)
  if (cartProduct) {
    document.querySelector(`.product-quantity-${id}`).textContent = cartProduct.quantity
  }
}

function displayNumberOfItemsInCart() {
  let totalCartItem = cart.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)
  cartHeader.textContent = `Your Cart (${totalCartItem})`
}

const confirmOrderBtn = document.querySelector(".confirm-order-btn")
const confirmOrderPopup = document.querySelector(".confirm-order-popup")

confirmOrderBtn.addEventListener("click", () => {
  confirmOrderPopup.style.display = "grid"
  renderOrder()
})

const startNewOrderBtn = document.querySelector(".start-new-order-btn")

startNewOrderBtn.addEventListener("click", () => {
  window.location.reload(true);
})