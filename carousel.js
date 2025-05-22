  const carousel = document.getElementById('carousel');
  const totalSlides = carousel.children.length;
  let index = 0;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  document.getElementById('prev').addEventListener('click', () => {
    index = (index - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  document.getElementById('next').addEventListener('click', () => {
    index = (index + 1) % totalSlides;
    updateCarousel();
  });