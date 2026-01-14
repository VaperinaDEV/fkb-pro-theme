import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.11.1", (api) => {
      const body = document.body;
      const hiddenNavClass = "nav-controls-hidden";
      let lastScrollTop = 0;
      
      // Define scroll handler
      const onScroll = () => {
        const caps = api.container.lookup("service:capabilities");

        // Check specifically for 'sm' viewport (mobile)
        if (caps.viewport.sm) {
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

      window.addEventListener('scroll', onScroll, { passive: true });
    });
  },
};
