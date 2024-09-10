import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReactNode } from "react";
import React from "react";

interface CarouselProps {
  centeredSlides?: boolean;
  loop?: boolean;
  autoplay?:
    | {
        pauseOnMouseEnter?: boolean;
        delay?: number;
      }
    | boolean;
  grabCursor?: boolean;
  navigation?: {
    nextEl?: string;
    prevEl?: string;
  };
  pagination?: {
    clickable?: boolean;
    type?: "bullets" | "fraction" | "progressbar" | "custom";
    el?: string;
  };
  children: ReactNode;
}

function Carousel({
  centeredSlides = false,
  loop = false,
  autoplay = false, 
  grabCursor = true,
  navigation = {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination = {
    clickable: true,
    type: "bullets",
    el: ".swiper-pagination",
  },
  children,
}: CarouselProps) {
  const modules = [Navigation, Pagination, ...(autoplay ? [Autoplay] : [])];
  const autoplaySettings =
    typeof autoplay === "object"
      ? autoplay
      : (autoplay ? { pauseOnMouseEnter: true, delay: 6000 } : false);

  return (
    <Swiper
      modules={modules}
      spaceBetween={20}
      slidesPerView={1}
      grabCursor={grabCursor}
      navigation={navigation}
      autoplay={autoplaySettings}
      pagination={pagination}
      centeredSlides={centeredSlides}
      loop={loop}
      breakpoints={{
        320: {
          spaceBetween: 10,
          slidesPerView: 1,
        },
        820: {
          spaceBetween: 10,
        },
        1020: {
          slidesPerView: 2,
        },
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.props['data-is-swiper-slide']) {
          return <SwiperSlide>{child}</SwiperSlide>;
        }
        return child;
      })}
    </Swiper>
  );
}

export default Carousel;
