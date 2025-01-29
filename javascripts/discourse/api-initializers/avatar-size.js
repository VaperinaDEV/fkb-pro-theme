import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  const site = api.container.lookup("site:main");
  
  // Change avatar size on desktop
  if (!site.mobileView) {
    api.changeWidgetSetting("post-avatar", "size", 60);
  }
});
