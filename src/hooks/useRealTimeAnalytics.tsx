import { useState, useEffect, useCallback } from 'react';
import { enterpriseAnalyticsService } from '@/services/enterpriseAnalyticsService';

interface RealTimeAnalyticsHook {
  realTimeData: any;
  isConnected: boolean;
  lastUpdated: Date;
  startRealTime: () => void;
  stopRealTime: () => void;
  trackEvent: (eventData: any) => Promise<void>;
}

export const useRealTimeAnalytics = (tenantId: string): RealTimeAnalyticsHook => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const fetchRealTimeData = useCallback(async () => {
    if (!tenantId) return;

    try {
      const data = await enterpriseAnalyticsService.getRealTimeMetrics(tenantId);
      setRealTimeData(data);
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
      setIsConnected(false);
    }
  }, [tenantId]);

  const startRealTime = useCallback(() => {
    if (intervalId) return; // Already running

    // Initial fetch
    fetchRealTimeData();

    // Set up polling every 30 seconds
    const id = setInterval(fetchRealTimeData, 30000);
    setIntervalId(id);
    setIsConnected(true);
  }, [fetchRealTimeData, intervalId]);

  const stopRealTime = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsConnected(false);
  }, [intervalId]);

  const trackEvent = useCallback(async (eventData: any) => {
    if (!tenantId) return;

    try {
      await enterpriseAnalyticsService.trackEvent({
        tenant_id: tenantId,
        ...eventData
      });
      
      // Trigger immediate refresh of real-time data
      await fetchRealTimeData();
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, [tenantId, fetchRealTimeData]);

  // Auto-start real-time updates when tenantId is available
  useEffect(() => {
    if (tenantId) {
      startRealTime();
    }

    // Cleanup on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tenantId, startRealTime]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Enhanced real-time data with simulated updates for demo
  const enhancedRealTimeData = realTimeData ? {
    ...realTimeData,
    // Add some dynamic elements for demo purposes
    current_visitors: Math.max(1, realTimeData.current_visitors + Math.floor(Math.random() * 10 - 5)),
    real_time_events: [
      ...realTimeData.real_time_events.slice(0, 5),
      // Add a simulated recent event
      {
        id: Date.now().toString(),
        event_type: 'pageview',
        event_name: 'Page View',
        source_pillar: ['content', 'pr', 'seo'][Math.floor(Math.random() * 3)],
        event_timestamp: new Date().toISOString(),
        properties: {
          page_title: 'Analytics Dashboard'
        }
      }
    ]
  } : null;

  return {
    realTimeData: enhancedRealTimeData,
    isConnected,
    lastUpdated,
    startRealTime,
    stopRealTime,
    trackEvent
  };
};

// Custom hook for tracking specific analytics events
export const useAnalyticsTracking = (tenantId: string) => {
  const trackPageView = useCallback(async (pageData: {
    page_url: string;
    page_title?: string;
    source_pillar?: string;
    campaign_id?: string;
  }) => {
    if (!tenantId) return;

    try {
      await enterpriseAnalyticsService.trackPageView({
        tenant_id: tenantId,
        session_id: `session_${Date.now()}`, // In real app, this would be from session management
        ...pageData
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }, [tenantId]);

  const trackConversion = useCallback(async (conversionData: {
    conversion_type: string;
    conversion_value: number;
    source_pillar?: string;
    campaign_id?: string;
    properties?: any;
  }) => {
    if (!tenantId) return;

    try {
      await enterpriseAnalyticsService.trackConversion({
        tenant_id: tenantId,
        session_id: `session_${Date.now()}`, // In real app, this would be from session management
        ...conversionData
      });
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  }, [tenantId]);

  const trackCustomEvent = useCallback(async (eventData: {
    event_type: string;
    event_name: string;
    event_category?: string;
    source_pillar?: string;
    properties?: any;
    event_value?: number;
  }) => {
    if (!tenantId) return;

    try {
      await enterpriseAnalyticsService.trackEvent({
        tenant_id: tenantId,
        session_id: `session_${Date.now()}`, // In real app, this would be from session management
        ...eventData
      });
    } catch (error) {
      console.error('Failed to track custom event:', error);
    }
  }, [tenantId]);

  return {
    trackPageView,
    trackConversion,
    trackCustomEvent
  };
};