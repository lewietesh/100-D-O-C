// components/auth/SessionDebugger.tsx (for development)
'use client';

import { useState, useEffect } from 'react';
import { useSessionInfo } from '@/hooks/useAuth';
import { sessionManager } from '@/lib/session-manager';

export function SessionDebugger() {
          const [sessionInfo, setSessionInfo] = useState<any>(null);
          const [isVisible, setIsVisible] = useState(false);

          useEffect(() => {
                    // Only show in development
                    if (process.env.NODE_ENV !== 'development') return;

                    const updateSessionInfo = () => {
                              setSessionInfo(sessionManager.getSessionInfo());
                    };

                    updateSessionInfo();
                    const interval = setInterval(updateSessionInfo, 1000);

                    return () => clearInterval(interval);
          }, []);

          if (process.env.NODE_ENV !== 'development' || !sessionInfo) {
                    return null;
          }

          const formatTime = (milliseconds: number) => {
                    const minutes = Math.floor(milliseconds / 60000);
                    const seconds = Math.floor((milliseconds % 60000) / 1000);
                    return `${minutes}m ${seconds}s`;
          };

          return (
                    <div className="fixed bottom-4 right-4 z-50">
                              <button
                                        onClick={() => setIsVisible(!isVisible)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-mono"
                              >
                                        Session
                              </button>

                              {isVisible && (
                                        <div className="absolute bottom-8 right-0 bg-black text-white p-4 rounded-lg text-xs font-mono w-80 max-h-96 overflow-y-auto">
                                                  <div className="mb-2 font-bold">Session Debug Info</div>
                                                  <div className="space-y-1">
                                                            <div>Status: <span className={sessionInfo.isValid ? 'text-green-400' : 'text-red-400'}>
                                                                      {sessionInfo.isValid ? 'Valid' : 'Invalid'}
                                                            </span></div>
                                                            <div>Time until timeout: {formatTime(sessionInfo.timeUntilTimeout)}</div>
                                                            {sessionInfo.timeUntilExpiry > 0 && (
                                                                      <div>Time until token expiry: {formatTime(sessionInfo.timeUntilExpiry)}</div>
                                                            )}
                                                            <div>Last activity: {new Date(sessionInfo.lastActivity).toLocaleTimeString()}</div>
                                                            {sessionInfo.expiresAt && (
                                                                      <div>Token expires: {new Date(sessionInfo.expiresAt).toLocaleTimeString()}</div>
                                                            )}
                                                  </div>
                                                  <button
                                                            onClick={() => sessionManager.refreshSession()}
                                                            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                                  >
                                                            Refresh Session
                                                  </button>
                                        </div>
                              )}
                    </div>
          );
}
