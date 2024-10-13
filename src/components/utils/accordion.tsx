import { useEffect, useRef, ReactNode } from "react";

interface AccordionProps {
  notClosing?: boolean;
  children: ReactNode;
}

function useAccordion({
  notClosing = false,
}: Omit<AccordionProps, "children">) {
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = accordionRef.current;
    if (!element) return;

    const accordions = element.querySelectorAll<HTMLElement>(".js-header");
    const container = element.querySelector<HTMLElement>(".accordion__container");

    function toggleAccordion(event: Event): void {
      const target = event.currentTarget as HTMLElement;
      const isActive = target.classList.contains("is-active");

      if (!notClosing) {
        accordions.forEach((accordion) =>
          accordion.classList.remove("is-active")
        );
        container?.classList.remove("is-active");
      }

      if (!isActive || notClosing) {
        target.classList.toggle("is-active");
        container?.classList.toggle("is-active");
      }
    }

    function autoOpen(): void {
      accordions.forEach((accordion) => {
        const autoOpen = accordion.hasAttribute("data-auto-open");
        if (autoOpen) {
          element?.setAttribute("data-not-closing", "");
          accordion.classList.add("is-active");
        }
      });
    }

    autoOpen();

    accordions.forEach((accordion) => {
      accordion.addEventListener("click", toggleAccordion);
    });

    return () => {
      accordions.forEach((accordion) => {
        accordion.removeEventListener("click", toggleAccordion);
      });
    };
  }, [notClosing]);

  return accordionRef;
}

function Accordion({ notClosing = false, children }: AccordionProps) {
  const accordionRef = useAccordion({ notClosing });

  return <div className="accordion" ref={accordionRef}>{children}</div>;
}

export default Accordion;
