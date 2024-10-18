import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReactNode } from "react";
import React from "react";

interface CarouselProps {
  centeredSlides?: boolean;
  loop?: boolean;
  setWrapperSize?: boolean;
  noSwiping?: boolean;
  freeMode?: boolean;
  noSwipingClass?: string;
  autoHeight?: boolean;
  autoplay?:
    | {
        pauseOnMouseEnter?: boolean;
        delay?: number;
      }
    | boolean;
  grabCursor?: boolean;
  navigation?: {
    nextEl: string;
    prevEl: string;
    lockClass?: string;
  };
  pagination?: {
    clickable?: boolean;
    type: "bullets" | "fraction" | "progressbar" | "custom";
    el: string;
    bulletActiveClass?: string;
    bulletClass?: string;
    bulletElement?: string;
  };
  breakpoint?: Record<number, {
    spaceBetween?: number;
    slidesPerView?: number | "auto";
  }>;
  children: ReactNode;
}

function Carousel({
  freeMode = false,
  centeredSlides = false,
  setWrapperSize = false,
  loop = false,
  autoplay = false, 
  noSwiping = false,
  autoHeight = false,
  noSwipingClass = "swiper-no-swiping",
  grabCursor = true,
  navigation = {
    nextEl: "",
    prevEl: "",
    lockClass: "",
  },
  pagination = {
    clickable: true,
    type: "bullets",
    el: ".swiper-pagination",
    bulletActiveClass: "swiper-pagination-bullet-active",
    bulletClass: "swiper-pagination-bullet",
    bulletElement: "span"
  },
  breakpoint = {
    320: {
      spaceBetween: 1,
      slidesPerView: 10,
    },
    820: {
      spaceBetween: 20,
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
  children,
}: CarouselProps) {
  const modules = [Navigation, FreeMode ,Pagination, ...(autoplay ? [Autoplay] : [])];
  const autoplaySettings =
    typeof autoplay === "object"
      ? autoplay
      : (autoplay ? { pauseOnMouseEnter: true, delay: 1000 } : false);

  return (
    <Swiper
      modules={modules}
      spaceBetween={20}
      slidesPerView={1}
      grabCursor={grabCursor}
      navigation={navigation}
      autoplay={autoplaySettings}
      pagination={pagination}
      noSwiping = {noSwiping}
      noSwipingClass={noSwipingClass}
      centeredSlides={centeredSlides}
      autoHeight={autoHeight}
      loop={loop}
      breakpoints={breakpoint}
      setWrapperSize={setWrapperSize}
      freeMode={freeMode}
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
