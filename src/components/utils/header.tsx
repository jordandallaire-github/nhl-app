import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const HeaderComponent: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [, setHeaderHeight] = useState<number>(0);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const scrollLimit = 0.1;
  const location = useLocation();
  const navMobileInitialized = useRef(false);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const headerElement = document.querySelector('[data-component="Header"]');
    if (headerElement instanceof HTMLElement) {
      setElement(headerElement);
  
      const observer = new ResizeObserver((entries) => {
        const [entry] = entries;
        if (entry.target instanceof HTMLElement) {
          const newHeight = (entry.target as HTMLElement).offsetHeight;
          setHeaderHeight(newHeight);
          document.documentElement.style.setProperty("--height-header", `${newHeight}px`);
        }
      });
  
      observer.observe(headerElement);
  
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("nav-is-active");
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(document.scrollingElement?.scrollTop || 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!element) return;

    const scrollHeight = document.scrollingElement?.scrollHeight || 0;
    const isScrollingDown = scrollPosition >= lastScrollPosition.current;

    document.documentElement.classList.toggle(
      "header-is-hidden",
      scrollPosition > scrollHeight * scrollLimit && !element.hasAttribute("data-not-hiding")
    );
    document.documentElement.classList.toggle("is-scrolling-down", isScrollingDown);
    document.documentElement.classList.toggle("is-scrolling-up", !isScrollingDown);

    lastScrollPosition.current = scrollPosition;

  }, [scrollPosition, element]);

  useEffect(() => {
    if (!element || navMobileInitialized.current) return;

    const toggle = element.querySelector(".js-toggle");
    if (!toggle) return;

    const onToggleNav = () => {
      document.documentElement.classList.toggle("nav-is-active");
    };

    toggle.addEventListener("click", onToggleNav);
    navMobileInitialized.current = true;

    return () => {
      toggle.removeEventListener("click", onToggleNav);
    };
  }, [element]);

  return null;
};

export default HeaderComponent;
