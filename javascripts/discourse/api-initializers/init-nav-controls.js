import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.8.13", (api) => {      
      let scrollTop = window.scrollY;
      const body = document.body;
      const scrollMax = 0;
      let lastScrollTop = 0;
      const hiddenNavClass = "nav-controls-hidden";

      const add_class_on_scroll = () => body.classList.add(hiddenNavClass);
      const remove_class_on_scroll = () => body.classList.remove(hiddenNavClass);

      window.addEventListener('scroll', function() {
        const caps = api.container.lookup("service:capabilities");

        if (!caps.viewport.sm) {
          return;
        }
        scrollTop = window.scrollY;
        if (
          lastScrollTop < scrollTop &&
          scrollTop > scrollMax &&
          !body.classList.contains(hiddenNavClass)
        ) { 
          add_class_on_scroll();
        } else if (
          lastScrollTop > scrollTop &&
          body.classList.contains(hiddenNavClass)
        ) { 
          remove_class_on_scroll();
        }
        lastScrollTop = scrollTop;
      });
    });
  },
};
