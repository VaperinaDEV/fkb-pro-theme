import { apiInitializer } from "discourse/lib/api";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default apiInitializer("1.8.0", (api) => {
  
  // Sticky New Topic Banner Category
  api.modifyClass(
    "controller:discovery/categories",
    (Superclass) =>
      class extends Superclass {
        @action
        async showInserted(event) {
          event?.preventDefault();
          const tracker = this.topicTrackingState;
        
          document.querySelector(".list-controls")?.scrollIntoView();

          try {
            // Move inserted into topics
            const topicIds = [...tracker.get("newIncoming")];
            if (!topicIds.length) {
              return;
            }
            await this.model.loadBefore(topicIds, true);
            tracker.resetTracking();
          } catch (e) {
            popupAjaxError(e);
          }
        }
      }
  );

  // Sticky New Topic Banner PM
  api.modifyClass(
    "controller:user-topics-list",
    (Superclass) =>
      class extends Superclass {      
        @action
        async showInserted(event) {
          event?.preventDefault();
          
          if (this.model.loadingBefore) {
            return;
          }
    
          document.querySelector(".user-navigation-primary")?.scrollIntoView();
          
          try {
            const topicIds = [...this.pmTopicTrackingState.newIncoming];
            if (!topicIds.length) {
              return;
            }
            await this.model.loadBefore(topicIds);
            this.pmTopicTrackingState.resetIncomingTracking(topicIds);
          } catch (e) {
            popupAjaxError(e);
          }
        }
      }
  );
});
