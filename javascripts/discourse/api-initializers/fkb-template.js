import { apiInitializer } from "discourse/lib/api";
import { findRawTemplate } from "discourse/lib/raw-templates";
import { schedule } from "@ember/runloop";
import { htmlSafe } from "@ember/template";
import TliTopSection from "../components/topic-list-item/tli-top-section";
import TliMiddleSection from "../components/topic-list-item/tli-middle-section";

export default apiInitializer("1.8.0", (api) => {
  const site = api.container.lookup("site:main");

  if (site.useGlimmerTopicList) {
    if (!settings.disable_topic_list_modification) {
      api.registerValueTransformer("topic-list-item-mobile-layout", () => false);
    }
  
    api.registerValueTransformer("topic-list-columns", ({ value: columns }) => {
      if (!settings.disable_topic_list_modification) {
        columns.delete("posters");
        columns.delete("replies");
        columns.delete("views");
        columns.delete("activity");
      }
      
      return columns;
    });
  
    if (!settings.disable_topic_list_modification) {
      api.renderInOutlet("topic-list-before-link", TliTopSection);
      api.renderInOutlet("topic-list-main-link-bottom", TliMiddleSection);
    }
  } else {
    // Use same template on Desktop and MobileView
    api.modifyClass(
      "component:topic-list-item",
      (Superclass) =>
        class extends Superclass {

        renderTopicListItem() {
          const topicListModification = settings.disable_topic_list_modification;
          const customTemplate = findRawTemplate("list/custom-topic-list-item");
          const defaultTemplate = findRawTemplate("list/topic-list-item");
            
          function templateChooser() {
            return topicListModification ? defaultTemplate : customTemplate;
          }
  
          const template = templateChooser();
              
          if (template) {
            this.set(
              "topicListItemContents",
              htmlSafe(template(this, RUNTIME_OPTIONS))
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
        }
    );
  }

  api.modifyClass(
    "component:discovery/topics",
    (Superclass) =>
      class extends Superclass { 
        get renderNewListHeaderControls() {
          return (
            this.showTopicsAndRepliesToggle &&
            !this.args.bulkSelectEnabled
          );
        }
      }
  );
      
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
