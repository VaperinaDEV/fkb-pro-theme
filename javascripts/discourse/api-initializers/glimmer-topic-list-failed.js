import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {  
  const site = api.container.lookup("site:main");

  if (site.mobileView && !site.useGlimmerTopicList) {
    document.body.classList.add("glimmer-topic-list-failed");
  }
});
