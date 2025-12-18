// Mobile nav toggle and small UI helpers
document.addEventListener('DOMContentLoaded', function(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  toggle.addEventListener('click', function(){
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
        if(window.innerWidth<=600){
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded','false');
        }
      }
    })
  })
});

// Header scroll state + active link highlight using IntersectionObserver
document.addEventListener('DOMContentLoaded', function(){
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = navLinks.map(l => document.querySelector(l.getAttribute('href')));

  // Track scroll to add shadow / compress header and hide/show on scroll direction
  let lastScroll = window.scrollY;
  let ticking = false;

  function handleScroll(){
    const scrollY = window.scrollY;
    const navEl = document.getElementById('nav');
    // if mobile nav open, keep header visible
    if(navEl && navEl.classList.contains('open')){
      header.classList.remove('hidden');
      lastScroll = scrollY;
      ticking = false;
      return;
    }

    if(scrollY > lastScroll && scrollY > 120){
      // scrolling down -> hide header
      header.classList.add('hidden');
    } else {
      // scrolling up -> show header
      header.classList.remove('hidden');
    }

    if(scrollY > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');

    lastScroll = scrollY;
    ticking = false;
  }

  // throttle with rAF
  window.addEventListener('scroll', function(){ if(!ticking){ window.requestAnimationFrame(handleScroll); ticking = true; } }, {passive:true});

  // initialize
  handleScroll();

  // IntersectionObserver to highlight nav links
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = navLinks.find(l => l.getAttribute('href') === `#${id}`);
      if(entry.isIntersecting && link){
        navLinks.forEach(n => n.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, {root:null,rootMargin:'-20% 0px -60% 0px',threshold:0});

  sections.forEach(s => { if(s) observer.observe(s); });

  // Close nav when clicking outside on mobile
  document.addEventListener('click', function(e){
    const navEl = document.getElementById('nav');
    const toggleEl = document.getElementById('nav-toggle');
    if(window.innerWidth <= 600 && navEl.classList.contains('open')){
      if(!navEl.contains(e.target) && !toggleEl.contains(e.target)){
        navEl.classList.remove('open');
        toggleEl.setAttribute('aria-expanded','false');
      }
    }
  });
});

// Dropdown toggle (mobile) + accessibility helpers
document.addEventListener('DOMContentLoaded', function(){
  const dropdownToggles = Array.from(document.querySelectorAll('.dropdown-toggle'));
  dropdownToggles.forEach(btn => {
    btn.addEventListener('click', function(e){
      // On mobile, open/close dropdown. On desktop this click still toggles but hover also works.
      const parent = btn.closest('.dropdown');
      const isOpen = parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      e.stopPropagation();
    });
  });

  // Close open dropdowns when clicking outside
  document.addEventListener('click', function(e){
    dropdownToggles.forEach(btn => {
      const parent = btn.closest('.dropdown');
      if(parent && parent.classList.contains('open')){
        if(!parent.contains(e.target) && !btn.contains(e.target)){
          parent.classList.remove('open');
          btn.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // Close dropdowns on Escape key
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      document.querySelectorAll('.dropdown.open').forEach(d => {
        d.classList.remove('open');
        const btn = d.querySelector('.dropdown-toggle');
        if(btn) btn.setAttribute('aria-expanded','false');
      });
    }
  });
});

// Product selection & detail panel
document.addEventListener('DOMContentLoaded', function(){
  const productCards = Array.from(document.querySelectorAll('.product-card'));
  const detailPane = document.getElementById('product-detail');
  if(!productCards.length || !detailPane) return;

  function showProduct(card){
    productCards.forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    const source = card.querySelector('.detail-source');
    if(source){
      // replace content of detail pane
      detailPane.innerHTML = source.innerHTML;
    }
    // ensure detail pane is visible on small screens
    if(window.innerWidth < 900){
      detailPane.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  productCards.forEach((card, idx) => {
    card.addEventListener('click', function(e){
      // avoid selecting when clicking an inner link (like the CTA)
      if(e.target.closest('a')) return;
      showProduct(card);
    });
    // allow keyboard selection
    card.setAttribute('tabindex','0');
    card.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' ') { showProduct(card); e.preventDefault(); } });
  });

  // initialize with first product selected
  showProduct(productCards[0]);
});