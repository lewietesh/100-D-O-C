// hooks/useSessionWarning.ts
import { useState, useEffect } from 'react';
import { AuthUtils } from '../lib/auth-utils';
import { SESSION_CONFIG } from '../lib/constants';
import { sessionManager } from '../lib/session-manager';

export function useSessionWarning() {
          const [showWarning, setShowWarning] = useState(false);
          const [timeLeft, setTimeLeft] = useState(0);

          useEffect(() => {
                    const checkSession = () => {
                              const isExpiring = AuthUtils.isSessionExpiringSoon();
                              setShowWarning(isExpiring);

                              if (isExpiring) {
                                        const sessionInfo = sessionManager.getSessionInfo();
                                        setTimeLeft(sessionInfo?.timeUntilTimeout || 0);
                              }
                    };

                    const interval = setInterval(checkSession, 10000); // Check every 10 seconds
                    checkSession(); // Initial check

                    return () => clearInterval(interval);
          }, []);

          const extendSession = () => {
                    sessionManager.refreshSession();
                    setShowWarning(false);
          };

          return {
                    showWarning,
                    timeLeft,
                    extendSession,
          };
}
