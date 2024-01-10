import { withPluginApi } from "discourse/lib/plugin-api";
import { findRawTemplate } from "discourse-common/lib/raw-templates";
import { htmlSafe } from "@ember/template";
import { schedule } from "@ember/runloop";

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
            this.set(
              "topicListItemContents", 
              htmlSafe(template(this))
            );
            schedule("afterRender", () => {
              if (this.isDestroyed || this.isDestroying) {
                return;
              }
              if (this.selected && this.selected.includes(this.topic)) {
                this.element.querySelector("input.bulk-select").checked = true;
                this.element.querySelector(".bulk-select.topic-list-data label").classList.add("selected");
              }             
              if (this._shouldFocusLastVisited()) {
                const title = this._titleElement();
                if (title) {
                  title.addEventListener("focus", this._onTitleFocus);
                  title.addEventListener("blur", this._onTitleBlur);
                }
              }
            });            
          }
        },
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

      api.modifyClass("component:topic-list", {
        pluginId: "toggle-bulk",

        click(e) {
          const onClick = (sel, callback) => {
            let target = e.target.closest(sel);

            if (target) {
              callback(target);
            }
          };
          this._super(...arguments);
          onClick("button.bulk-select", () => {
            document.body.classList.toggle("bulk-select-enabled");
          });
        },
      });

      api.onPageChange((url, title) => {
        const bodyHasBulkSelectClass = document.body.classList.contains("bulk-select-enabled");
        const currentUser = api.getCurrentUser();
        
        if ((url !== "/new" && 
            bodyHasBulkSelectClass && 
            currentUser && !currentUser.staff) && 
            (url !== "/unread" && 
            bodyHasBulkSelectClass && 
            currentUser && !currentUser.staff)) 
        {
          document.body.classList.add("bulk-still-active");
        } else {
          document.body.classList.remove("bulk-still-active");
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
