import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {
  const site = api.container.lookup("site:main");
  if (api.getCurrentUser() === null || !site.mobileView) {
    api.registerConnectorClass("before-create-topic-button", "vp-avatar", {
      shouldRender() {
        return false;
      }
    });

    api.registerConnectorClass("after-create-topic-button", "vp-stats", {
      shouldRender() {
        return false;
      }
    });
  }
});
