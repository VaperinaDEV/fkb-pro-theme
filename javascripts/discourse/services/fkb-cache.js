import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class FkbCacheService extends Service {
  @tracked userDetails = null;
  @tracked userCardDetails = null;

  get cacheTTL() {
    return (settings.fkb_panel_cache_ttl || 10) * 60000;
  }

  constructor() {
    super(...arguments);
    this.loadAll();
  }

  checkExpiry() {
    ["userDetails", "userCardDetails"].forEach(key => {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp > this.cacheTTL) {
          sessionStorage.removeItem(key);
          this[key] = null;
        }
      }
    });
  }

  load(key) {
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      
      if (Date.now() - parsed.timestamp > this.cacheTTL) {
        return null;
      }
      return parsed.data;
    } catch { return null; }
  }

  save(key, data) {
    this[key] = data;
    sessionStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  }

  loadAll() {
    this.userDetails = this.load("userDetails");
    this.userCardDetails = this.load("userCardDetails");
  }
}
