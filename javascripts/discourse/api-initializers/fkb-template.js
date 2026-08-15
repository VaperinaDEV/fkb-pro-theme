import { apiInitializer } from "discourse/lib/api";
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
});
