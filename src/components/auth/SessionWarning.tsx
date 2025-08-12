// components/auth/SessionWarning.tsx
'use client';

import { useSessionWarning } from '../../hooks/useSessionWarning';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export function SessionWarning() {
          const { showWarning, timeLeft, extendSession } = useSessionWarning();

          if (!showWarning) return null;

          const minutes = Math.floor(timeLeft / 60000);
          const seconds = Math.floor((timeLeft % 60000) / 1000);

          return (
                    <div className="fixed top-4 right-4 z-50 max-w-sm">
                              <Alert variant="warning" className="p-4">
                                        <div className="flex items-start">
                                                  <div className="flex-1">
                                                            <h3 className="text-sm font-medium">Session Expiring Soon</h3>
                                                            <p className="text-sm mt-1">
                                                                      Your session will expire in {minutes}m {seconds}s
                                                            </p>
                                                  </div>
                                                  <Button
                                                            size="sm"
                                                            onClick={extendSession}
                                                            className="ml-3 flex-shrink-0"
                                                  >
                                                            Extend
                                                  </Button>
                                        </div>
                              </Alert>
                    </div>
          );
}