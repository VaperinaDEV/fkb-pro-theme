import { apiInitializer } from "discourse/lib/api";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default apiInitializer("1.8.0", (api) => {
  
  // Sticky New Topic Banner Latest
  api.modifyClass(
    "component:discovery/topics",
    (Superclass) =>
      class extends Superclass {
        @action
        async showInserted(event) {
          event?.preventDefault();
          
          if (this.args.model.loadingBefore) {
            return; // Already loading
          }
    
          const listControls = document.querySelector(".list-controls");
          listControls.scrollIntoView();
          
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

  // Sticky New Topic Banner Category
  api.modifyClass(
    "controller:discovery/categories",
    (Superclass) =>
      class extends Superclass {
        @action
        showInserted(event) {
          event?.preventDefault();
          const tracker = this.topicTrackingState;
        
          const listControls = document.querySelector(".list-controls");
          listControls.scrollIntoView();

          // Move inserted into topics
          this.model.loadBefore(tracker.get("newIncoming"), true);
          tracker.resetTracking();
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
    
          const userNavigation = document.querySelector(".user-navigation-primary");
          userNavigation.scrollIntoView();  
          
          try {
            const topicIds = [...this.pmTopicTrackingState.newIncoming];
            await this.model.loadBefore(topicIds);
            this.pmTopicTrackingState.resetIncomingTracking(topicIds);
          } catch (e) {
            popupAjaxError(e);
          }
        }
      }
  );
});
