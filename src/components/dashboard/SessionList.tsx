// src/components/dashboard/SessionList.tsx
import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, Clock, X } from 'lucide-react';

interface Session {
  id: string;
  device: string;
  location: string;
  ip_address: string;
  last_activity: string;
  is_current: boolean;
  device_type: 'desktop' | 'mobile' | 'tablet';
}

export const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSessions: Session[] = [
        {
          id: '1',
          device: 'Chrome on Windows',
          location: 'Nairobi, Kenya',
          ip_address: '192.168.1.1',
          last_activity: '2025-08-14T10:30:00Z',
          is_current: true,
          device_type: 'desktop',
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'Mombasa, Kenya',
          ip_address: '192.168.1.2',
          last_activity: '2025-08-13T15:20:00Z',
          is_current: false,
          device_type: 'mobile',
        },
      ];
      setSessions(mockSessions);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    // Mock API call - replace with actual implementation
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
      
      {sessions.map((session) => (
        <div key={session.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-gray-600">
                {getDeviceIcon(session.device_type)}
              </div>
              
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900">{session.device}</h4>
                  {session.is_current && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{session.location}</span>
                  <span className="mx-2">•</span>
                  <span>{session.ip_address}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Last active: {new Date(session.last_activity).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {!session.is_current && (
              <button
                onClick={() => terminateSession(session.id)}
                className="flex items-center px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Terminate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
