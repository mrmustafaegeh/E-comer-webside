// src/lib/monitoring/performance.js
export class PerformanceMonitor {
  static metrics = new Map();

  static startTimer(name) {
    const timer = {
      start: performance.now(),
      name,
    };
    this.metrics.set(name, timer);
    return timer;
  }

  static endTimer(name) {
    const timer = this.metrics.get(name);
    if (!timer) return null;

    const duration = performance.now() - timer.start;

    // Log to analytics service
    this.logMetric(name, duration);

    this.metrics.delete(name);
    return duration;
  }

  static logMetric(name, value) {
    // Send to your monitoring service (Datadog, New Relic, etc.)
    if (process.env.NODE_ENV === "production") {
      fetch(process.env.METRICS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metric: `auth.${name}`,
          value,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        /* Silent fail */
      });
    }

    console.log(`[PERF] ${name}: ${value.toFixed(2)}ms`);
  }

  static async measureAuth() {
    const timer = this.startTimer("auth_total");

    // Measure each auth component
    const kindeTimer = this.startTimer("kinde_auth");
    // ... auth logic
    this.endTimer("kinde_auth");

    const cacheTimer = this.startTimer("cache_lookup");
    // ... cache logic
    this.endTimer("cache_lookup");

    const dbTimer = this.startTimer("database_query");
    // ... db logic
    this.endTimer("database_query");

    return this.endTimer("auth_total");
  }
}
