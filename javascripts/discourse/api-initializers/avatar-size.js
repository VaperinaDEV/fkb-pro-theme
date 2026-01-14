import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  const caps = api.container.lookup("service:capabilities");
  api.registerValueTransformer("post-avatar-size", () => {
    return caps.viewport.sm ? 60 : 48;
  });
});
