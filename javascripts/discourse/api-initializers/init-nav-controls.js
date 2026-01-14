import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      const caps = api.container.lookup("service:capabilities");
      const body = document.body;
      const hiddenNavClass = "nav-controls-hidden";
      const scrollMax = 0;
      let lastScrollTop = 0;

      window.addEventListener('scroll', () => {
        if (!caps.viewport.sm) {
          if (body.classList.contains(hiddenNavClass)) {
            body.classList.remove(hiddenNavClass);
          }
          return;
        }

        const scrollTop = window.scrollY;

        if (
          lastScrollTop < scrollTop &&
          scrollTop > scrollMax &&
          !body.classList.contains(hiddenNavClass)
        ) {
          body.classList.add(hiddenNavClass);
        } else if (
          lastScrollTop > scrollTop &&
          body.classList.contains(hiddenNavClass)
        ) {
          body.classList.remove(hiddenNavClass);
        }
        
        lastScrollTop = scrollTop;
      }, { passive: true });
    });
  },
};
