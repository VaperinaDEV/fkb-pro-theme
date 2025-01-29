import { withPluginApi } from "discourse/lib/plugin-api";
import { findRawTemplate } from "discourse-common/lib/raw-templates";
import { htmlSafe } from "@ember/template";
import { RUNTIME_OPTIONS } from "discourse-common/lib/raw-handlebars-helpers";
import { schedule } from "@ember/runloop";

export default {
  name: "fkbpro",
  initialize() {
    withPluginApi("0.8.7", (api) => {

      api.modifyClass("component:discovery/topics", {
        pluginId: "new-new",
        get renderNewListHeaderControls() {
          return (
            this.showTopicsAndRepliesToggle &&
            !this.args.bulkSelectEnabled
          );
        }
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
