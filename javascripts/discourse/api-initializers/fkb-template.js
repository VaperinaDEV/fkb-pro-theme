import { apiInitializer } from "discourse/lib/api";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";
import FkbTopicHeader from "../components/topic-list-item/fkb-topic-header";
import FkbTopicBody from "../components/topic-list-item/fkb-topic-body";
import FkbPanel from "../components/fkb-panel";

export default apiInitializer("1.8.0", (api) => {
  
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
    api.renderInOutlet("topic-list-before-link", FkbTopicHeader);
    api.renderInOutlet("topic-list-main-link-bottom", FkbTopicBody);
  }

  api.renderInOutlet("discovery-below", FkbPanel);
      
  // Keep discovery/topics customization in one place. This avoids multiple
  // modifyClass calls targeting the same core component.
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

        @action
        async showInserted(event) {
          event?.preventDefault();

          if (this.args.model.loadingBefore) {
            return;
          }

          document.querySelector(".list-controls")?.scrollIntoView();

          const { topicTrackingState } = this;

          try {
            const topicIds = [...topicTrackingState.newIncoming];
            await this.args.model.loadBefore(topicIds, true);
            topicTrackingState.clearIncoming(topicIds);
          } catch (e) {
            popupAjaxError(e);
          }
        }
      }
  );

});
