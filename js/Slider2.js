import { getAbsoluteHeight, removeTransition } from './utility.js';

export class Slider {
  constructor() {
    this.slides = document.querySelectorAll('.slide'); 
    this.slider = document.querySelector('.slider');
    this.dotNav = document.querySelector('#dot-nav');
    this.dots;
    this.currentSlideIndex = 0;
    this.nextSlideIndex;

    this.init();
  }

  init() {
    const slideWidth = parseInt(window.getComputedStyle(this.slides[0]).getPropertyValue('width').slice(0,-2));
    let offSets = [(slideWidth + slideWidth), (-slideWidth - slideWidth)];
    const sliderArrows = document.querySelectorAll('.slider-arrow');

    this.setSliderHeight();

    // Draw dot nav
    for (let i = 0; i < this.slides.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('circle');
      dot.id = i;
      this.dotNav.appendChild(dot);
    }
    this.dots = document.querySelectorAll('.circle');
    this.updateDotNav();

    // sets all slides apart from the first to move out of the center position
    for (let i = 1; i < this.slides.length; ++i) {
      this.slides[i].style.position = 'absolute';
      this.slides[i].style.top = '0';
      this.slides[i].style.left = '0';
      removeTransition(this.slides[i], () => {
        this.slides[i].style.transform = 'translate(-850px,0)';
      });
    }

    // Add click events to the slider arrows
    sliderArrows.forEach((arrow, i) => {
      arrow.addEventListener('click', (e) => {
        const arrow = e.target.getAttribute('name');

        if (arrow === 'left-arrow') { // left decrement
          this.nextSlideIndex = (this.currentSlideIndex - 1) === -1 ? this.slides.length-1 : this.currentSlideIndex - 1;
        }
        else {  // right increment (increment and wrap)
          this.nextSlideIndex = (this.currentSlideIndex + 1) % (this.slides.length);
        }

        this.animateSlider(offSets[i]);
      });
    });

    // Add click events to the dot nav using event delegation
    this.dotNav.addEventListener('click', (e) => {
      const dot = e.target;
      if (dot.classList.contains('circle')) {
        let temp;
        (this.nextSlideIndex - dot.id > 0) ? temp = offSets[0] : temp = offSets[1];
        this.nextSlideIndex = dot.id;
        animateSlider(temp);
      }
    });
  }

  setSliderHeight() {
    let tallest = 0,
      tallestAbsolute;

    this.slides.forEach(slide => {
      if (slide.offsetHeight > tallest) {
        tallest = slide.offsetHeight;
        tallestAbsolute = getAbsoluteHeight(slide);
      }
    });
    console.log(tallest)
    console.log(tallestAbsolute)

    this.slides.forEach(slide => slide.style.height = tallest+'px');
    this.slider.style.height = tallestAbsolute+'px';
  }

  updateDotNav() {
    this.dots.forEach(dot => dot.style.background = '#A6ACAF');
    this.dots[this.currentSlideIndex].style.background = 'black';
  }

  animateSlider(offSet) {
    const currentSlide = this.slides[this.currentSlideIndex],
      nextSlide = this.slides[this.nextSlideIndex];

    const flipSign = (n) => n - (n * 2); 

    removeTransition(nextSlide, () => {
      nextSlide.style.transform = `translate(${flipSign(offSet)}px,0)`; 
    });

    // move previous slide to correct side (opposite of offset)
    currentSlide.style.transform = `translate(${offSet}px,0)`;
    // move next slide into middle
    nextSlide.style.transform = 'translate(0px,0)';
    // set slide no
    this.currentSlideIndex = this.nextSlideIndex;
    this.updateDotNav();
  }
}