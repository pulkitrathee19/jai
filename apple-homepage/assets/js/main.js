/**
 * Apple Homepage Interactive Script
 * Handles Navigation, Modals, Color Switchers, Bag Drawer, and Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Global Navigation & Scroll State ---
  const globalNav = document.querySelector('.global-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      globalNav.classList.add('scrolled');
    } else {
      globalNav.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- 2. Mobile Menu Drawer Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile drawer when clicking a link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 3. Interactive Color Switcher (iPhone 16 Pro) ---
  const proColorDots = document.querySelectorAll('.hero-iphone-pro .color-dot');
  const proColorLabel = document.getElementById('pro-color-name');
  const proHeroGlow = document.querySelector('.hero-iphone-pro .hero-glow');
  const proHeroImg = document.getElementById('pro-hero-device');

  const proColorThemes = {
    desert: { name: 'Desert Titanium', glow: 'rgba(201, 176, 154, 0.28)' },
    natural: { name: 'Natural Titanium', glow: 'rgba(157, 150, 141, 0.28)' },
    white: { name: 'White Titanium', glow: 'rgba(227, 228, 229, 0.28)' },
    black: { name: 'Black Titanium', glow: 'rgba(75, 74, 73, 0.35)' }
  };

  proColorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      proColorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const colorKey = dot.dataset.color;
      if (proColorThemes[colorKey]) {
        proColorLabel.textContent = proColorThemes[colorKey].name;
        if (proHeroGlow) {
          proHeroGlow.style.background = `radial-gradient(circle, ${proColorThemes[colorKey].glow} 0%, rgba(0, 0, 0, 0) 70%)`;
        }
      }
    });
  });

  // --- 4. Interactive Color Switcher (iPhone 16 Standard) ---
  const stdColorDots = document.querySelectorAll('.hero-iphone-16 .color-dot');
  const stdColorLabel = document.getElementById('std-color-name');

  const stdColorThemes = {
    ultramarine: 'Ultramarine',
    teal: 'Teal',
    pink: 'Pink',
    white: 'White',
    black: 'Black'
  };

  stdColorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      stdColorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const colorKey = dot.dataset.color;
      if (stdColorThemes[colorKey]) {
        stdColorLabel.textContent = stdColorThemes[colorKey];
      }
    });
  });

  // --- 5. Shopping Bag State & Drawer Management ---
  const bagBtn = document.getElementById('nav-bag-btn');
  const bagDrawer = document.getElementById('bag-drawer');
  const bagCloseBtn = document.getElementById('bag-close-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const bagBadge = document.querySelector('.bag-badge');
  const bagItemsList = document.getElementById('bag-items-list');
  const bagSubtotalEl = document.getElementById('bag-subtotal-val');
  const emptyBagMsg = document.getElementById('empty-bag-msg');
  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  let shoppingBag = [
    {
      id: 1,
      title: 'iPhone 16 Pro 256GB',
      color: 'Desert Titanium',
      price: 1099,
      image: 'assets/images/iphone_18_pro_2x.png'
    }
  ];

  function showToast(message) {
    if (!toastNotice) return;
    toastText.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  function updateBagUI() {
    if (!bagBadge) return;
    const totalItems = shoppingBag.length;
    bagBadge.textContent = totalItems;
    
    // Animate badge
    bagBadge.classList.add('pop');
    setTimeout(() => bagBadge.classList.remove('pop'), 250);

    // Render drawer list
    if (totalItems === 0) {
      if (emptyBagMsg) emptyBagMsg.style.display = 'block';
      if (bagSubtotalEl) bagSubtotalEl.textContent = '$0.00';
      if (bagItemsList) {
        bagItemsList.innerHTML = '<div class="empty-bag-msg" id="empty-bag-msg">Your Bag is empty.</div>';
      }
      return;
    }

    if (emptyBagMsg) emptyBagMsg.style.display = 'none';

    let subtotal = 0;
    let html = '';

    shoppingBag.forEach((item, index) => {
      subtotal += item.price;
      html += `
        <div class="bag-item-card" data-index="${index}">
          <img src="${item.image}" alt="${item.title}" class="bag-item-img" />
          <div class="bag-item-details">
            <div class="bag-item-name">${item.title}</div>
            <div class="bag-item-spec">${item.color}</div>
            <div class="bag-item-price">$${item.price.toLocaleString()}</div>
          </div>
          <button class="bag-item-remove" onclick="removeBagItem(${index})" title="Remove item">Remove</button>
        </div>
      `;
    });

    if (bagItemsList) bagItemsList.innerHTML = html;
    if (bagSubtotalEl) bagSubtotalEl.textContent = `$${subtotal.toLocaleString()}.00`;
  }

  window.removeBagItem = function(index) {
    const removed = shoppingBag.splice(index, 1);
    updateBagUI();
    if (removed && removed[0]) {
      showToast(`Removed ${removed[0].title} from Bag`);
    }
  };

  function openBagDrawer() {
    bagDrawer.classList.add('open');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBagDrawer() {
    bagDrawer.classList.remove('open');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (bagBtn) bagBtn.addEventListener('click', openBagDrawer);
  if (bagCloseBtn) bagCloseBtn.addEventListener('click', closeBagDrawer);

  // --- 6. Quick Buy Configurator Modal ---
  const configModal = document.getElementById('config-modal');
  const configCloseBtn = document.getElementById('config-close-btn');
  const configTitle = document.getElementById('config-title');
  const configPrice = document.getElementById('config-price');
  const configImg = document.getElementById('config-img');
  const configStorageBtns = document.querySelectorAll('.storage-btn');
  const configAddBtn = document.getElementById('config-add-btn');

  let currentConfig = {
    title: 'iPhone 16 Pro',
    color: 'Desert Titanium',
    basePrice: 999,
    storageMultiplier: 0,
    image: 'assets/images/iphone_18_pro_2x.png'
  };

  // Products Database for Configurator
  const productsDB = {
    'iphone-16-pro': {
      title: 'iPhone 16 Pro',
      color: 'Desert Titanium',
      basePrice: 999,
      image: 'assets/images/iphone_18_pro_2x.png',
      storageOptions: [
        { label: '128GB', add: 0 },
        { label: '256GB', add: 100 },
        { label: '512GB', add: 300 },
        { label: '1TB', add: 500 }
      ]
    },
    'iphone-16': {
      title: 'iPhone 16',
      color: 'Ultramarine',
      basePrice: 799,
      image: 'assets/images/iphone_16_2x.png',
      storageOptions: [
        { label: '128GB', add: 0 },
        { label: '256GB', add: 100 },
        { label: '512GB', add: 300 },
        { label: '1TB', add: 500 }
      ]
    },
    'macbook-pro': {
      title: 'MacBook Pro 14"',
      color: 'Space Black',
      basePrice: 1599,
      image: 'assets/images/macbook_hero_2x.png',
      storageOptions: [
        { label: '512GB', add: 0 },
        { label: '1TB', add: 200 },
        { label: '2TB', add: 600 },
        { label: '4TB', add: 1200 }
      ]
    },
    'ipad-pro': {
      title: 'iPad Pro 11"',
      color: 'Space Black',
      basePrice: 999,
      image: 'assets/images/ipad_promo.jpg',
      storageOptions: [
        { label: '256GB', add: 0 },
        { label: '512GB', add: 200 },
        { label: '1TB', add: 600 },
        { label: '2TB', add: 1000 }
      ]
    },
    'watch-series-10': {
      title: 'Apple Watch Series 10',
      color: 'Jet Black Aluminum',
      basePrice: 399,
      image: 'assets/images/watch_promo.jpg',
      storageOptions: [
        { label: '42mm GPS', add: 0 },
        { label: '42mm Cell', add: 100 },
        { label: '46mm GPS', add: 30 },
        { label: '46mm Cell', add: 130 }
      ]
    },
    'vision-pro': {
      title: 'Apple Vision Pro',
      color: 'Solo Knit Band',
      basePrice: 3499,
      image: 'assets/images/vision_pro.png',
      storageOptions: [
        { label: '256GB', add: 0 },
        { label: '512GB', add: 200 },
        { label: '1TB', add: 400 },
        { label: '2TB', add: 800 }
      ]
    },
    'airpods-pro': {
      title: 'AirPods Pro (2nd Gen)',
      color: 'White',
      basePrice: 249,
      image: 'assets/images/airpods_promo.jpg',
      storageOptions: [
        { label: 'Standard Case', add: 0 },
        { label: 'MagSafe USB-C', add: 0 },
        { label: 'Custom Engraved', add: 0 },
        { label: 'AppleCare+ Bundle', add: 29 }
      ]
    }
  };

  function openConfigModal(productId) {
    const prod = productsDB[productId] || productsDB['iphone-16-pro'];
    currentConfig = {
      id: productId,
      title: prod.title,
      color: prod.color,
      basePrice: prod.basePrice,
      storageAdd: 0,
      storageLabel: prod.storageOptions[0].label,
      image: prod.image
    };

    configTitle.textContent = prod.title;
    configPrice.textContent = `From $${prod.basePrice.toLocaleString()}`;
    configImg.src = prod.image;
    configImg.alt = prod.title;

    // Update storage buttons labels
    configStorageBtns.forEach((btn, idx) => {
      const opt = prod.storageOptions[idx] || { label: 'Standard', add: 0 };
      btn.textContent = opt.label;
      btn.dataset.add = opt.add;
      btn.classList.toggle('active', idx === 0);
    });

    configModal.classList.add('open');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeConfigModal() {
    configModal.classList.remove('open');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Storage selection in Configurator
  configStorageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      configStorageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const addVal = parseInt(btn.dataset.add || '0', 10);
      currentConfig.storageAdd = addVal;
      currentConfig.storageLabel = btn.textContent;
      
      const updatedTotal = currentConfig.basePrice + addVal;
      configPrice.textContent = `$${updatedTotal.toLocaleString()}`;
    });
  });

  // Attach to all Buy buttons with data-product
  document.querySelectorAll('.btn-buy-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.dataset.product || 'iphone-16-pro';
      openConfigModal(productId);
    });
  });

  if (configCloseBtn) configCloseBtn.addEventListener('click', closeConfigModal);

  // Add configured item to Bag
  if (configAddBtn) {
    configAddBtn.addEventListener('click', () => {
      const finalPrice = currentConfig.basePrice + currentConfig.storageAdd;
      shoppingBag.push({
        id: Date.now(),
        title: `${currentConfig.title} ${currentConfig.storageLabel}`,
        color: currentConfig.color,
        price: finalPrice,
        image: currentConfig.image
      });

      closeConfigModal();
      updateBagUI();
      showToast(`Added ${currentConfig.title} to your Bag`);
      setTimeout(() => openBagDrawer(), 400);
    });
  }

  // Modal Overlay click to close modals
  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      closeConfigModal();
      closeBagDrawer();
    });
  }

  // Checkout button simulation
  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (shoppingBag.length === 0) {
        showToast('Your Bag is currently empty.');
        return;
      }
      showToast('Proceeding to Apple Secure Checkout...');
      setTimeout(() => {
        alert('Thank you for shopping! In a production deployment, this redirects to Apple Pay or your payment provider.');
      }, 500);
    });
  }

  // --- 7. Search Overlay ---
  const searchBtn = document.getElementById('nav-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = prompt('Search apple.com: (e.g. iPhone 16 Pro, MacBook Pro, iPad Pro, Apple Watch)', 'iPhone 16 Pro');
      if (query) {
        showToast(`Searching Apple for "${query}"...`);
        const targetSection = document.querySelector(`[data-search*="${query.toLowerCase()}"]`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // --- 8. Learn More Modal / Smooth Anchors ---
  document.querySelectorAll('.btn-learn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const el = document.querySelector(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      const prodName = btn.dataset.productName || 'Apple Device';
      showToast(`Displaying detailed specifications for ${prodName}`);
    });
  });

  // --- 9. Reveal Animations on Scroll ---
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.bento-card, .product-showcase-section, .tv-slide-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // Initialize Bag UI
  updateBagUI();
});
