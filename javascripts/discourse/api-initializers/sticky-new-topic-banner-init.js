import { withPluginApi } from "discourse/lib/plugin-api";
import { action } from "@ember/object";

export default {
  name: "sticky-new-topic-banner",
  initialize() {
    withPluginApi("0.8.7", (api) => {
    
      // Sticky New Topic Banner Latest
      api.modifyClass("component:discovery/topics", {
        pluginId: "sticky-new-topics-banner",
        @action
        showInserted(event) {
          event?.preventDefault();
          const tracker = this.topicTrackingState;

          const listControls = document.querySelector(".list-controls");
          listControls.scrollIntoView();
        
          // Move inserted into topics
          this.args.model.loadBefore(tracker.get("newIncoming"), true);
          tracker.resetTracking();
        }
      });
      
      // Sticky New Topic Banner Category
      api.modifyClass("controller:discovery/categories", {
        pluginId: "sticky-new-topics-banner",
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
      }); 
    });
  },
};
