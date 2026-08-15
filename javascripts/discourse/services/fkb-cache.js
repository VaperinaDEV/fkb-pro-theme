import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

const CACHE_VERSION = "v2";
const CACHE_KEYS = ["userDetails", "userCardDetails"];
const CACHE_PREFIX = "fkb";

export default class FkbCacheService extends Service {
  @tracked userDetails = null;
  @tracked userCardDetails = null;

  _userId = null;

  get cacheTTL() {
    return (settings.fkb_panel_cache_ttl || 10) * 60000;
  }

  activateUser(userId) {
    const normalizedUserId = userId ? String(userId) : null;

    if (this._userId === normalizedUserId) {
      return;
    }

    this._userId = normalizedUserId;
    this.clearState();

    if (this._userId) {
      this.loadAll();
    }
  }

  get isActive() {
    return Boolean(this._userId);
  }

  _storageKey(key) {
    if (!this._userId || !CACHE_KEYS.includes(key)) {
      return null;
    }

    return `${CACHE_PREFIX}:${CACHE_VERSION}:user:${this._userId}:${key}`;
  }

  load(key) {
    const storageKey = this._storageKey(key);

    if (!storageKey) {
      return null;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      if (
        !parsed ||
        parsed.version !== CACHE_VERSION ||
        parsed.userId !== this._userId ||
        !parsed.timestamp ||
        Date.now() - parsed.timestamp > this.cacheTTL
      ) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return parsed.data;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }

  save(key, data) {
    const storageKey = this._storageKey(key);

    if (!storageKey) {
      return;
    }

    this[key] = data;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          version: CACHE_VERSION,
          userId: this._userId,
          timestamp: Date.now(),
          data,
        })
      );
    } catch {
      // localStorage may be unavailable or full. The reactive state remains usable.
    }
  }

  loadAll() {
    this.userDetails = this.load("userDetails");
    this.userCardDetails = this.load("userCardDetails");
  }

  checkExpiry() {
    if (!this._userId) {
      this.clearState();
      return;
    }

    this.userDetails = this.load("userDetails");
    this.userCardDetails = this.load("userCardDetails");
  }

  clearState() {
    this.userDetails = null;
    this.userCardDetails = null;
  }

  clear() {
    if (this._userId) {
      for (const key of CACHE_KEYS) {
        const storageKey = this._storageKey(key);
        if (storageKey) {
          localStorage.removeItem(storageKey);
        }
      }
    }

    this.clearState();
  }
}
