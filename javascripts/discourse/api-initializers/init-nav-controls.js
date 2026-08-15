import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  const html = document.documentElement;
  const body = document.body;
  const hiddenNavClass = "nav-controls-hidden";
  let lastScrollTop = window.scrollY || 0;
  let frameId = null;

  const updateNavigation = () => {
    frameId = null;

    const isMobileView = html.classList.contains("mobile-view");

    if (!isMobileView) {
      body.classList.remove(hiddenNavClass);
      return;
    }

    const scrollTop = window.scrollY || 0;

    if (scrollTop > lastScrollTop && scrollTop > 0) {
      body.classList.add(hiddenNavClass);
    } else if (scrollTop < lastScrollTop || scrollTop <= 0) {
      body.classList.remove(hiddenNavClass);
    }

    lastScrollTop = Math.max(0, scrollTop);
  };

  const onScroll = () => {
    if (frameId !== null) {
      return;
    }

    frameId = window.requestAnimationFrame(updateNavigation);
  };

  api.onAppEvent("page:changed", () => {
    lastScrollTop = window.scrollY || 0;
    body.classList.remove(hiddenNavClass);
  });

  window.addEventListener("scroll", onScroll, { passive: true });
});
