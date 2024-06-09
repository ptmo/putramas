document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.swiper', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 3000, // 3 detik
        disableOnInteraction: false, // Jangan berhenti saat ada interaksi
      },
    });
  });
