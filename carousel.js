Vue.component('carousel', {
  template: `
          <div>
            <div class="wrapper" :style="{height: windowHeight + 'px'}">
              <slot></slot>
            </div>
            <a class="left carousel-control" role="button" @click.prevent="navigatePrev()">
              <img src="images/06_left.png" alt="prev-img">
            </a>
            <a class="right carousel-control" role="button" @click.prevent="navigateNext()">
              <img src="images/05_right.png" alt="next-img">
            </a>
          </div>
        `,
  data() {
    return {
      slides: [],
      slideElms: [],
      currentSlide: 0,
      slideWidth: 0,
      transition: '.35s ease-out',
      autoPlayTimer: null,
      windowHeight: null
    }
  },
  methods: {
    incrementSlide() {
      this.currentSlide = this.currentlyOnLastSlide ? this.nextSlideIndex : 0
    },
    decrementSlide() {
      this.currentSlide = this.currentlyOnFirstSlide ?  this.lastSlideIndex : this.prevSlideIndex
    },
    slidesFirstPosition(slideIndex) {
      return (slideIndex === this.lastSlideIndex) ? -this.slideWidth : slideIndex * this.slideWidth
    },
    slideIsLeftOfWrapper(slideIndex) {
      return slideIndex === this.prevSlideIndex
    },
    positionSlideLeftOfWrapper() {
      return -1 * this.slideWidth
    },
    positionSlides(slideIndex) {
      if (this.slideIsLeftOfWrapper(slideIndex)) return this.positionSlideLeftOfWrapper()

      if (slideIndex === 0) return (this.slides.length - this.currentSlide) * this.slideWidth

      return (this.currentSlide > slideIndex) ?
        (this.currentSlide - slideIndex) * this.slideWidth :
        (slideIndex - this.currentSlide) * this.slideWidth
    },
    getSlidesLeftPosition(slideIndex) {
      return this.slidesAtStartingPosition ? this.slidesFirstPosition(slideIndex) : this.positionSlides(slideIndex)
    },
    navigateNext() {
      this.stopAutoPlay()
      this.next()
    },
    navigatePrev() {
      this.stopAutoPlay()
      this.prev()
    },
    next() {
      this.incrementSlide()
      this.slides.forEach((slide, slideIndex) => {
        if (slideIndex === this.currentSlide || slideIndex === this.prevSlideIndex) {
          slide.style.transition = this.transition
        } else {
          slide.style.transition = (this.currentSlide === 0 && slideIndex === this.lastSlideIndex) ? this.transition : null
        }
        slide.style.left = `${this.getSlidesLeftPosition(slideIndex)}px`
      })

    },
    prev() {
      this.decrementSlide()
      this.slides.forEach((slide, slideIndex) => {
        if (slideIndex === this.currentSlide || slideIndex === this.currentSlide + 1) {
          slide.style.transition = this.transition
        } else {
          slide.style.transition = (this.currentSlide === this.lastSlideIndex && slideIndex === 0) ? this.transition : null
        }
        slide.style.left = `${this.getSlidesLeftPosition(slideIndex)}px`
      })
    },
    autoStart() {
      this.autoPlayTimer = setInterval(() => {
        this.next()
      }, 3000)
    },
    stopAutoPlay() {
      if(this.autoPlayTimer) {
        clearTimeout(this.autoPlayTimer)
        this.autoPlayTimer = null
      }
    }
  },
  computed: {
    slidesAtStartingPosition() {
      return this.currentSlide === 0
    },
    lastSlideIndex() {
      return this.slides.length - 1
    },
    nextSlideIndex() {
      return this.currentSlide + 1
    },
    prevSlideIndex() {
      return this.currentSlide - 1
    },
    currentlyOnFirstSlide() {
      return this.currentSlide === 0
    },
    currentlyOnLastSlide() {
      return this.currentSlide !== this.lastSlideIndex
    }
  },
  mounted() {
    this.slideWidth = this.$el.offsetWidth
    this.windowHeight = window.innerHeight
    this.slides = this.$slots.default
      .filter(slot => slot.elm.nodeName !== '#text')
      .map(slot => slot.elm)

    this.slides.forEach((slide, index) => {
      let left = this.slidesFirstPosition(index)
      slide.style.left = `${left}px`
      slide.style.height = `${window.innerHeight}px`
    })

    window.addEventListener('resize', () => {
      this.slideWidth = window.innerWidth
      this.slides.forEach(slide => {
        // TODO need to throttle this
        slide.style.height = `${window.innerHeight}px`
        slide.style.width = `${window.innerWidth}px`
      })
    })

    this.autoStart()
  }
})
