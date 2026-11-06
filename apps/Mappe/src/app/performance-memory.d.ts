interface PerformanceMemory {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  }
  
  interface Performance {
    memory: PerformanceMemory;
  }
  