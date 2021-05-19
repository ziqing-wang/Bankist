'use strict';

///////////////////////////////////////
// Modal window
const nav = document.querySelector('.nav');
const navList = document.querySelector('.nav__links');
const header = document.querySelector('.header')

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

const section1 = document.getElementById('features');
const allSections = document.querySelectorAll('.section');

const imgTargets = document.querySelectorAll('img[data-src]')


//////////////////////////////////////////////////////////

//------Menu fade animation ------//
const handleHover = function (e) {
  const link = e.target;
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  //const logo = link.closest('.nav').querySelector('img');

  siblings.forEach(el => {
    if (el !== link) {
      el.style.opacity = this
    }
  })
  // logo.style.opacity = this;
}
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


//Nav slider animation 
const navSlide = () => {
  const navBurger = document.querySelector('.nav__burger');

  navBurger.addEventListener('click', () => {
    if (navList.style.display === 'flex') {
      navList.style.display = 'none';
    } else {
      navList.style.display = 'flex';
    }
    navList.style.animation = 'navSlide 0.5s ease';
    navBurger.classList.toggle('toggle')
  })
}
navSlide()

//Set Menu sticky
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
    navList.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  } else {
    nav.classList.remove('sticky');
    navList.style.backgroundColor = '#f3f3f3'
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, //entries
  rootMargin: `-${navHeight}px`
})

headerObserver.observe(header);



//Reveal sections 
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden')

  //only observer one single time
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})

allSections.forEach(section => {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

//Lazy loading images 
const loadImg = function (entries, observer) {
  const [entry] = entries;
  const target = entry.target;

  if (!entry.isIntersecting) return;

  //replace the source atrribute with the data-src
  target.src = target.dataset.src;
  //show the img only after loading is finished
  target.addEventListener('load', () => {
    target.classList.remove('lazy-img')
  })
  observer.unobserve(target)
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => {
  imgObserver.observe(img)
})


//-----Open signin form model-----//
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//scrolling event
btnScroll.addEventListener('click', () => {
  //get current scroll value 
  const currentScrollY = window.pageYOffset;
  const currentScrollX = window.pageXOffset;
  //get section1's position
  const section1PositionTop = section1.getBoundingClientRect().top;
  const section1PositionLeft = section1.getBoundingClientRect().left;

  // scroll to section1
  window.scrollTo({
    left: currentScrollX + section1PositionLeft,
    top: currentScrollY + section1PositionTop
    //behavior: 'smooth'
  })
  //second way: advanced browser support only
  //section1.scrollIntoView({behavior: 'smooth'})
})

//tab component
tabsContainer.addEventListener('click', function (e) {
  //return the closest parent of the target event => will always be the tab button
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate tab content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

// -------- Slider Animation ------- //
const slider = () => {

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }

  //Active current dot
  const activateDot = (slide) => {
    const dots = document.querySelectorAll('.dots__dot');
    const curDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`);

    dots.forEach(dot => dot.classList.remove('dots__dot--active'));
    curDot.classList.add('dots__dot--active')
  }

  //Go to next / prev slide
  const goToSlide = (slide) => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i-slide)}%)`
    })
  }

  //Next slide
  const nextSlide = () => {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  //Previous slide
  const prevSlide = () => {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  //Initialize function
  const init = () => {
    //initialize slide's position: 0% 100% 200% 300%
    goToSlide(0);
    createDots();
    //Active the first dot
    activateDot(0);
  }
  init();

  //Event handels
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //keyboard 'ArrowRight' and 'ArrowLeft'
  document.addEventListener('keydown', (e) => {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  })
}

slider();
