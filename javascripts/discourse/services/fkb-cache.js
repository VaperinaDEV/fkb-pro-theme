import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class FkbCacheService extends Service {
  @tracked userDetails = null;
  @tracked userCardDetails = null;

  cacheTTL = (settings.fkb_panel_cache_ttl || 10) * 60000;

  constructor() {
    super(...arguments);
    this.loadAll();
  }

  load(key) {
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      if (!parsed.timestamp) return null;

      if (Date.now() - parsed.timestamp > this.cacheTTL) {
        sessionStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  }

  save(key, data) {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );

    // trigger same-tab listeners
    window.dispatchEvent(new Event("fkb-session-updated"));
  }

  loadAll() {
    this.userDetails = this.load("userDetails");
    this.userCardDetails = this.load("userCardDetails");
  }

  clear() {
    sessionStorage.removeItem("userDetails");
    sessionStorage.removeItem("userCardDetails");
    this.userDetails = null;
    this.userCardDetails = null;
  }
}
