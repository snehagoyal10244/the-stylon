/* ═══════════════════════════════════════════════════════
   THE STYLON — Main JavaScript
   ═══════════════════════════════════════════════════════ */

// ─── Product Data ───
const PRODUCTS = [
  { id: 1, name: "Crimson Oversized Hoodie", category: "streetwear", price: 89.99, tag: "hot", img: "images/product_hoodie.png", desc: "Ultra-soft oversized hoodie in crimson. Fleece-lined, drop shoulders, premium heavyweight cotton." },
  { id: 2, name: "Indigo Denim Jacket", category: "oversized", price: 129.99, tag: "new", img: "images/product_jacket.png", desc: "Vintage-wash denim jacket with an oversized fit. Distressed details, brass buttons, lined interior." },
  { id: 3, name: "Abstract Street Tee", category: "casual", price: 49.99, tag: "new", img: "images/product_tshirt.png", desc: "Limited edition graphic tee with AI-generated abstract art. 100% organic cotton, relaxed fit." },
  { id: 4, name: "Tactical Cargo Pants", category: "streetwear", price: 99.99, tag: "", img: "images/product_cargo.png", desc: "Military-inspired cargo pants with multiple utility pockets. Tapered fit, adjustable waist." },
  { id: 5, name: "Velocity Sneakers", category: "minimal", price: 159.99, tag: "hot", img: "images/product_sneakers.png", desc: "Futuristic chunky sneakers with red and blue accents. React foam sole, breathable mesh upper." },
  { id: 6, name: "Scarlet Party Dress", category: "party", price: 149.99, tag: "new", img: "images/product_dress.png", desc: "Elegant scarlet party dress with a modern silhouette. Satin finish, adjustable straps." },
  { id: 7, name: "Midnight Bomber Jacket", category: "oversized", price: 139.99, tag: "", img: "images/product_jacket.png", desc: "Oversized bomber jacket in midnight blue. Quilted lining, ribbed cuffs, bold zip detail." },
  { id: 8, name: "Neon Drip Hoodie", category: "streetwear", price: 94.99, tag: "hot", img: "images/product_hoodie.png", desc: "Neon-accented hoodie with reflective logo. Kangaroo pocket, double-layered hood." },
  { id: 9, name: "Essential Minimal Tee", category: "minimal", price: 39.99, tag: "", img: "images/product_tshirt.png", desc: "Clean, minimal tee in premium Pima cotton. No logos, just vibes. Available in 12 colors." },
  { id: 10, name: "Gala Night Dress", category: "party", price: 179.99, tag: "new", img: "images/product_dress.png", desc: "Floor-length gala dress with subtle shimmer. Open back, cinched waist, flowing silhouette." },
  { id: 11, name: "Urban Runner Sneakers", category: "casual", price: 119.99, tag: "", img: "images/product_sneakers.png", desc: "Everyday casual sneakers with cloud-step cushioning. Slip-resistant, lightweight design." },
  { id: 12, name: "Raw Edge Cargo Joggers", category: "casual", price: 79.99, tag: "hot", img: "images/product_cargo.png", desc: "Relaxed cargo joggers with raw-edge hems. Elastic waist, deep pockets, tapered leg." },
];

// ─── State ───
let cart = [];
let currentFilter = 'all';
let currentTestimonial = 0;
let testimonialInterval;

// ═══════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

// ═══════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ═══════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('stylon-theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('stylon-theme');
if (savedTheme) setTheme(savedTheme);

// ═══════════════════════════════════════════════════════
// PRODUCTS RENDERING
// ═══════════════════════════════════════════════════════
const productsGrid = document.getElementById('productsGrid');

function renderProducts(filter = 'all') {
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  productsGrid.innerHTML = '';

  filtered.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = `product-card reveal reveal-delay-${(i % 4) + 1}`;
    card.dataset.id = product.id;
    card.innerHTML = `
      <div class="product-card-img">
        ${product.tag ? `<span class="product-tag ${product.tag}">${product.tag.toUpperCase()}</span>` : ''}
        <img src="${product.img}" alt="${product.name}" loading="lazy" />
        <div class="product-card-overlay">
          <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
        </div>
      </div>
      <div class="product-card-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="product-card-bottom">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="add-cart-btn" data-id="${product.id}" aria-label="Add to cart">+</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // Re-observe new elements for scroll reveal
  observeElements();
  // Bind events
  bindProductEvents();
}

// ─── Filter buttons ───
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderProducts(currentFilter);
  });
});

// ─── Product event bindings ───
function bindProductEvents() {
  // Add to cart
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      addToCart(id);
      btn.textContent = '✓';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = '+';
        btn.classList.remove('added');
      }, 1500);
    });
  });

  // Quick view
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickView(parseInt(btn.dataset.id));
    });
  });
}

// ═══════════════════════════════════════════════════════
// CART FUNCTIONALITY
// ═══════════════════════════════════════════════════════
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const cartEmptyEl = document.getElementById('cartEmpty');

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  cartCountEl.textContent = totalItems;
  cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
      </div>`;
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.img}" alt="${item.name}" /></div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}${item.qty > 1 ? ` (×${item.qty})` : ''}</span>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove">✕</button>
    </div>
  `).join('');

  // Bind remove buttons
  cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });
}

// ═══════════════════════════════════════════════════════
// QUICK VIEW MODAL
// ═══════════════════════════════════════════════════════
const quickViewModal = document.getElementById('quickViewModal');

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modalImg').querySelector('img').src = product.img;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalCategory').textContent = product.category;
  document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('modalDesc').textContent = product.desc;
  document.getElementById('modalAddCart').onclick = () => {
    addToCart(product.id);
    quickViewModal.classList.remove('active');
  };

  quickViewModal.classList.add('active');
}

document.getElementById('modalClose').addEventListener('click', () => {
  quickViewModal.classList.remove('active');
});

quickViewModal.addEventListener('click', (e) => {
  if (e.target === quickViewModal) quickViewModal.classList.remove('active');
});

// ═══════════════════════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════════════════════
const toastEl = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

function showToast(message) {
  toastMsg.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// ═══════════════════════════════════════════════════════
// AI TRY-ON SIMULATION
// ═══════════════════════════════════════════════════════
const tryonUpload = document.getElementById('tryonUpload');
const tryonBefore = document.getElementById('tryonBefore');
const tryonAfter = document.getElementById('tryonAfter');
const tryOutfitBtn = document.getElementById('tryOutfitBtn');
const tryonPreview = document.getElementById('tryonPreview');
let uploadedImage = null;

tryonUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedImage = ev.target.result;
    tryonBefore.innerHTML = `
      <span class="tryon-label">Before</span>
      <img src="${uploadedImage}" alt="Your photo" style="width:100%;height:100%;object-fit:cover;" />
    `;
    tryOutfitBtn.disabled = false;
    tryOutfitBtn.textContent = 'Try This Outfit';
  };
  reader.readAsDataURL(file);
});

tryOutfitBtn.addEventListener('click', () => {
  if (!uploadedImage) return;

  // Simulate AI processing
  tryOutfitBtn.disabled = true;
  tryOutfitBtn.textContent = 'Processing...';
  tryonPreview.classList.add('scanning');

  setTimeout(() => {
    tryonPreview.classList.remove('scanning');

    // Create a simulated "try-on" result
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Overlay clothing effect (tint simulation)
      ctx.globalCompositeOperation = 'overlay';
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(230, 57, 70, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0.25)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add fashion-filter effect
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(255, 77, 109, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'source-over';

      // Add "AI Enhanced" text overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
      ctx.font = 'bold 14px Outfit, sans-serif';
      ctx.fillStyle = '#00D4FF';
      ctx.textAlign = 'center';
      ctx.fillText('✨ AI STYLED BY THE STYLON', canvas.width / 2, canvas.height - 20);

      const resultUrl = canvas.toDataURL();
      tryonAfter.innerHTML = `
        <span class="tryon-label">After — AI Styled</span>
        <img src="${resultUrl}" alt="AI Try-on result" style="width:100%;height:100%;object-fit:cover;" />
      `;
      tryOutfitBtn.disabled = false;
      tryOutfitBtn.textContent = 'Try Another Outfit';
    };
    img.src = uploadedImage;
  }, 2000);
});

// ═══════════════════════════════════════════════════════
// TESTIMONIALS SLIDER
// ═══════════════════════════════════════════════════════
const testimonialsTrack = document.getElementById('testimonialsTrack');
const testimonialsNav = document.getElementById('testimonialsNav');
const totalTestimonials = document.querySelectorAll('.testimonial-card').length;

function goToTestimonial(index) {
  currentTestimonial = index;
  testimonialsTrack.style.transform = `translateX(-${index * 100}%)`;
  testimonialsNav.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}

testimonialsNav.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    goToTestimonial(parseInt(btn.dataset.slide));
    resetTestimonialInterval();
  });
});

function autoSlideTestimonials() {
  testimonialInterval = setInterval(() => {
    goToTestimonial((currentTestimonial + 1) % totalTestimonials);
  }, 5000);
}

function resetTestimonialInterval() {
  clearInterval(testimonialInterval);
  autoSlideTestimonials();
}

autoSlideTestimonials();

// ═══════════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

function observeElements() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
}

// ═══════════════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════════════
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  showToast(`Subscribed with ${input.value}! Welcome to the fam 🔥`);
  input.value = '';
});

// ═══════════════════════════════════════════════════════
// CHECKOUT
// ═══════════════════════════════════════════════════════
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  showToast('Checkout coming soon! Thanks for shopping 🙌');
});

// ═══════════════════════════════════════════════════════
// CHATBOT WIDGET TOGGLE
// ═══════════════════════════════════════════════════════
const chatWidget = document.getElementById('chatWidget');
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatCloseWidget = document.getElementById('chatCloseWidget');

function toggleChat() {
  chatWidget.classList.toggle('active');
  chatToggleBtn.classList.toggle('active');
}

chatToggleBtn.addEventListener('click', toggleChat);
chatCloseWidget.addEventListener('click', toggleChat);

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
renderProducts();
observeElements();
