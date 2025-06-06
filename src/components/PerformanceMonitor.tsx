
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when specifically enabled
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('pravado-performance-monitor') === 'true';
    setIsVisible(shouldShow);

    if (!shouldShow) return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      setMetrics({
        loadTime: Math.round(navigation.loadEventEnd - navigation.startTime),
        renderTime: Math.round(navigation.domContentLoadedEventEnd - navigation.startTime),
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        networkLatency: Math.round(navigation.responseStart - navigation.requestStart)
      });
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => window.removeEventListener('load', measurePerformance);
  }, []);

  if (!isVisible || !metrics) return null;

  const getPerformanceStatus = (metric: string, value: number) => {
    const thresholds = {
      loadTime: { good: 2000, fair: 4000 },
      renderTime: { good: 1000, fair: 2000 },
      memoryUsage: { good: 50, fair: 100 },
      networkLatency: { good: 100, fair: 300 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.fair) return 'fair';
    return 'poor';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>Performance Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="text-xs">Load Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono">{metrics.loadTime}ms</span>
              <Badge 
                variant={getPerformanceStatus('loadTime', metrics.loadTime) === 'good' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {getPerformanceStatus('loadTime', metrics.loadTime)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-green-600" />
              <span className="text-xs">Render Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono">{metrics.renderTime}ms</span>
              <Badge 
                variant={getPerformanceStatus('renderTime', metrics.renderTime) === 'good' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {getPerformanceStatus('renderTime', metrics.renderTime)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span className="text-xs">Memory</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono">{metrics.memoryUsage}MB</span>
              <Badge 
                variant={getPerformanceStatus('memoryUsage', metrics.memoryUsage) === 'good' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {getPerformanceStatus('memoryUsage', metrics.memoryUsage)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-3 h-3 text-blue-600" />
              <span className="text-xs">Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono">{metrics.networkLatency}ms</span>
              <Badge 
                variant={getPerformanceStatus('networkLatency', metrics.networkLatency) === 'good' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {getPerformanceStatus('networkLatency', metrics.networkLatency)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
