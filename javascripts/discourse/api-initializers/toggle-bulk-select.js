import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "toggle-bulk",
  initialize() {
    withPluginApi("1.33.0", (api) => {

      api.registerValueTransformer("toggle-bulk-click", ({ value, context }) => {
        const onClick = (sel, callback) => {
          let target = context.event?.target.closest(sel);
          if (target) {
            callback(target);
          }
        };

        if (typeof value === "function") {
          value(context.event);
        }

        onClick("button.bulk-select", () => {
          document.body.classList.toggle("bulk-select-enabled");
        });

        return value;
      });
    });
  }
};
