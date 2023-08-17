import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Carousel,
  CarouselItem
} from 'reactstrap';

Carousel.propTypes = {
  ride: PropTypes.oneOf(['carousel']),
}
const items = [
    {
      src:require('../shared/assets/images/Carousel/1.png'),
      altText: 'Slide 1',
      caption: 'Slide 1'
    },
    {
      src: require('../shared/assets/images/Carousel/2.png'),
      altText: 'Slide 2',
      caption: 'Slide 2'
    },
    {
      src: require('../shared/assets/images/Carousel/3.png'),
      altText: 'Slide 3',
      caption: 'Slide 3'
    }
  ];

const Carousele = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

const slides = items.map((item, index) => {
    return (
      <CarouselItem
      className="custom-tag"
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key={index}
      >
        <img src={item.src} alt={item.altText} />
      </CarouselItem>
    );
  });

  return (
    <div className="fullSize">
      <style>
    {
      `.custom-tag {
        width: 100%;
        height: 100%;
          filter: opacity(50%);
        }
        .custom-tag img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(100%);
          }
        `
    }
  </style>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        {slides}
      </Carousel>
    </div>
  );
}

export default Carousele;