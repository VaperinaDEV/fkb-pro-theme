import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "fkbpro",
  initialize() {
    withPluginApi("1.8.0", (api) => {

      api.registerValueTransformer("topic-list-columns", ({ value: columns }) => {
        if (!settings.disable_topic_list_modification) {
          columns.delete("posters");
          columns.delete("replies");
          columns.delete("views");
          columns.delete("activity");
        }
        return columns;
      });

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
