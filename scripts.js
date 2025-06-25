document.addEventListener("DOMContentLoaded", () => {
  // --- Variáveis e carrossel ---
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots-container");
  const totalDots = 5;
  let currentSlide = 0;
  let autoPlayInterval;
  let startX = 0;
  let endX = 0;
  const slideContainer = document.querySelector(".slides");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = (i === index) ? "block" : "none";
      // Esconde a legenda de todos os slides
      const caption = slide.querySelector('.caption');
      if (caption) caption.style.display = "none";
    });

    // Após exibir o slide, exibe a legenda apenas do slide atual
    const currentCaption = slides[index].querySelector('.caption');
    if (currentCaption) currentCaption.style.display = "block";

    updateDots(index);
    currentSlide = index;
  }

  function updateDots(startIndex) {
    dotsContainer.innerHTML = "";

    for (let i = startIndex; i < startIndex + totalDots && i < slides.length; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        showSlide(i);
        resetAutoPlay();
      });
      if (i === currentSlide) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    }
  }

  window.plusSlides = function (n) {
    const newIndex = (currentSlide + n + slides.length) % slides.length;
    showSlide(newIndex);

    const startIndex = Math.floor(newIndex / totalDots) * totalDots;
    updateDots(startIndex);
    resetAutoPlay();
  };

  function nextSlideAuto() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
    const startIndex = Math.floor(nextIndex / totalDots) * totalDots;
    updateDots(startIndex);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlideAuto, 5000); // Troca a cada 5 segundos
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // --- SWIPE TOUCH EVENTS ---
  if (slideContainer) {
    slideContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    slideContainer.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) { // Sensibilidade mínima para swipe
        if (diff > 0) {
          // Swipe para esquerda - próximo slide
          const newIndex = (currentSlide + 1) % slides.length;
          showSlide(newIndex);
        } else {
          // Swipe para direita - slide anterior
          const newIndex = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(newIndex);
        }
        resetAutoPlay();
      }
    });
  }
  // --- FIM SWIPE ---

  // Inicia carrossel
  updateDots(0);
  showSlide(currentSlide);
  startAutoPlay();

  // --- Banner de Cookies ---
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const rejectBtn = document.getElementById('reject-cookies');

  if (!localStorage.getItem('cookiesChoice')) {
    banner.style.display = 'block';
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesChoice', 'accepted');
    banner.style.display = 'none';
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesChoice', 'rejected');
    banner.style.display = 'none';
  });

  // --- Alternância de idiomas ---
  document.querySelectorAll(".pt").forEach(el => el.style.display = "");
  document.querySelectorAll(".en").forEach(el => el.style.display = "none");

  // --- Alternância de seções ao clicar nos botões ---
  document.querySelectorAll('.nav-botoes a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').replace('#', '');

      document.querySelectorAll('.sessao').forEach(sec => sec.classList.remove('active'));
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add('active');
    });
  });
});

// --- Função para reorganizar sessões no mobile ---
function rearrangeSectionsMobile() {
  const largura = window.innerWidth;
  const colunaEsquerda = document.querySelector('.coluna-esquerda');
  const portfolio = document.querySelector('#portfolio');
  const sobre = document.querySelector('#sobre');
  const contato = document.querySelector('#contato');

  if (largura <= 768 && colunaEsquerda && portfolio && sobre && contato) {
    // Se o portfolio ainda não estiver dentro da coluna-esquerda, move ele
    if (!colunaEsquerda.contains(portfolio)) {
      // Move o portfolio para depois do sobre, antes do contato
      colunaEsquerda.insertBefore(portfolio, contato);
    }
  } else {
    // Se for desktop, e o portfolio estiver dentro da coluna-esquerda, volta para a coluna-direita
    const colunaDireita = document.querySelector('.coluna-direita');
    if (colunaDireita && colunaEsquerda.contains(portfolio)) {
      colunaDireita.appendChild(portfolio);
    }
  }
}

// Eventos para reorganizar ao carregar e redimensionar
window.addEventListener('load', rearrangeSectionsMobile);
window.addEventListener('resize', rearrangeSectionsMobile);
