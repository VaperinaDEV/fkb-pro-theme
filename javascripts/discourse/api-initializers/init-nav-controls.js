import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.8.13", (api) => {      
      const body = document.body;
      const hiddenNavClass = "nav-controls-hidden";
      const scrollMax = 0;
      let lastScrollTop = window.scrollY; // Initialize with current scroll position

      window.addEventListener('scroll', function() {
        const caps = api.container.lookup("service:capabilities");

        // Only execute logic if the viewport is small (sm)
        if (caps.viewport.sm) {
          const scrollTop = window.scrollY;

          if (scrollTop > lastScrollTop && scrollTop > scrollMax) {
            // Scrolling Down
            if (!body.classList.contains(hiddenNavClass)) {
              body.classList.add(hiddenNavClass);
            }
          } else if (scrollTop < lastScrollTop) {
            // Scrolling Up
            if (body.classList.contains(hiddenNavClass)) {
              body.classList.remove(hiddenNavClass);
            }
          }
          
          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        } else {
          // Ensure class is removed when NOT in sm viewport
          if (body.classList.contains(hiddenNavClass)) {
            body.classList.remove(hiddenNavClass);
          }
        }
      }, { passive: true });
    });
  },
};
