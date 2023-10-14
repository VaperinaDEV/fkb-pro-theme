import { withPluginApi } from "discourse/lib/plugin-api";
import { findRawTemplate } from "discourse-common/lib/raw-templates";
import { htmlSafe } from "@ember/template";

export default {
  name: "fkbpro",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      // Use same template on Desktop and MobileView
      api.modifyClass("component:topic-list-item", {
        pluginId: "fkb-template",

        renderTopicListItem() {
          const template = findRawTemplate("list/custom-topic-list-item");
          if (template) {
            this.set("topicListItemContents", htmlSafe(template(this)));
          }
        },
      });
      api.onPageChange((url, title) => {
        const fkbHidden = localStorage.getItem("fkb_panel_hidden") === "true";
        const fkbVisible = localStorage.getItem("fkb_panel_hidden") === "false";
        const isHidden = document.body.classList.contains("fkb-panel-hidden");
        
        if (fkbHidden && !isHidden) {
          document.body.classList.add("fkb-panel-hidden");
        } else if (fkbVisible && isHidden) {
          document.body.classList.remove("fkb-panel-hidden");
        }
      });
    });
  },
};
