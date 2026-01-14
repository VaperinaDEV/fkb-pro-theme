import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { registerDestructor } from "@ember/destroyable";

export default class FkbCacheService extends Service {
  @tracked userDetails = null;
  @tracked userCardDetails = null;
  _timer = null;

  get cacheTTL() {
    return (settings.fkb_panel_cache_ttl || 10) * 60000;
  }

  constructor() {
    super(...arguments);
    this.loadAll();
    this.startAutoCleanup();
    
    registerDestructor(this, () => {
      if (this._timer) clearInterval(this._timer);
    });
  }

  startAutoCleanup() {
    // 30s check
    this._timer = setInterval(() => {
      this.checkExpiry();
    }, 30000);
  }

  checkExpiry() {
    ["userDetails", "userCardDetails"].forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Date.now() - parsed.timestamp > this.cacheTTL) {
            localStorage.removeItem(key);
            this[key] = null;
          } else if (!this[key]) {
            this[key] = parsed.data;
          }
        } catch (e) {
          this[key] = null;
        }
      } else if (this[key]) {
        this[key] = null;
      }
    });
  }

  load(key) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp > this.cacheTTL) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch { 
      return null; 
    }
  }

  save(key, data) {
    this[key] = data;
    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  }

  loadAll() {
    this.userDetails = this.load("userDetails");
    this.userCardDetails = this.load("userCardDetails");
  }
}
