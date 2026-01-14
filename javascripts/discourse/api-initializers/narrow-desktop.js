import { apiInitializer } from "discourse/lib/api";
import NarrowDesktop from "discourse/lib/narrow-desktop";

export default apiInitializer("1.8.0", (api) => {
  NarrowDesktop.isNarrowDesktopView = (width) => {
    return width < 1000;
  }
});
