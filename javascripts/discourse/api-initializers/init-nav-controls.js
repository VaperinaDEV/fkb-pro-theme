import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.11.1", (api) => {
      const html = document.documentElement;
      const body = document.body;
      const hiddenNavClass = "nav-controls-hidden";
      let lastScrollTop = 0;
      let frameId = null;

      // Run DOM work at most once per animation frame.
      const updateNavigation = () => {
        const isMobileView = html.classList.contains("mobile-view");

        if (isMobileView) {
          const scrollTop = window.scrollY;

          // Scroll Down -> Hide
          if (scrollTop > lastScrollTop && scrollTop > 0) {
            if (!body.classList.contains(hiddenNavClass)) {
              body.classList.add(hiddenNavClass);
            }
          } 
          // Scroll Up -> Show
          else if (scrollTop < lastScrollTop) {
            if (body.classList.contains(hiddenNavClass)) {
              body.classList.remove(hiddenNavClass);
            }
          }
          
          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        } else {
          // If NOT mobile (desktop), ensure navigation is visible
          if (body.classList.contains(hiddenNavClass)) {
            body.classList.remove(hiddenNavClass);
          }
        }
      };

      const onScroll = () => {
        if (frameId !== null) {
          return;
        }

        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          updateNavigation();
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
    });
  },
};
