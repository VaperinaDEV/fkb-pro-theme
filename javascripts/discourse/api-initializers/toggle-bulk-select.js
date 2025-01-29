import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "toggle-bulk",
  initialize() {
    withPluginApi("1.33.0", (api) => {
      
      api.registerValueTransformer("topic-list-item-class", ({ value }) => {
        if (document.body.classList.contains("bulk-select-enabled")) {
          value.push("bulk-select-active");
        }
        return value;
      });

      document.addEventListener("click", (e) => {
        if (e.target.closest("button.bulk-select")) {
          document.body.classList.toggle("bulk-select-enabled");
          api.appEvents.trigger("page:changed");
        }
      });
    });
  },
};
