import { useEffect } from "react";

function useScrolly() {
  useEffect(() => {
    function initScrolly(): void {
      const options: IntersectionObserverInit = {
        rootMargin: "0px 0px 0px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            target.classList.add("is-active");
            if (target.dataset.norepeat !== undefined) {
              observer.unobserve(target);
            }
          } else {
            target.classList.remove("is-active");
          }
        });
      }, options);

      const items = document.querySelectorAll("[data-scrolly]");
      items.forEach((item) => observer.observe(item as HTMLElement));
    }

    initScrolly();
  }, []);
}

function Scrolly() {
  useScrolly();
  return null;
}

export default Scrolly;
