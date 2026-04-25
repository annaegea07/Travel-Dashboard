let swiper = new Swiper('.swiper', {
  loop: true,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

function updateSlider(cityId) {
  const wrapper = document.querySelector('.swiper-wrapper');
  wrapper.innerHTML = "";

  const images = paisos[cityId].imgSlider;

  images.forEach(item => {
    wrapper.innerHTML += `
      <div class="slider-item swiper-slide">
        <div class="slider-link">
          <img src="${item.img}" class="slider-img">
          <p class="badge">${item.nomP}</p>
          <a class="slider-title" href="${item.link}" target="_blank">${item.title}</a>
          <button class="slider-button">
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  });

  swiper.update();
  swiper.slideTo(0);
}
