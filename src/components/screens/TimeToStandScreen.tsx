import React, { useState, useEffect } from 'react';
import { CheckCircle, Heart, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface TimeToStandScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function TimeToStandScreen({ onComplete, onCancel }: TimeToStandScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Auto-start the timer when component mounts
    setIsActive(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((180 - timeRemaining) / 180) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Cancel Button */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onCancel} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <X className="w-4 h-4 mr-1" />
            Cancel Test
          </Button>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Stand Up</h2>
            <p className="text-gray-600">
              Please stand up now and remain standing. Try to stay still and breathe normally.
            </p>
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-teal-600">
              {formatTime(timeRemaining)}
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#0d9488"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-medium text-teal-900 mb-2">While standing:</h3>
            <ul className="space-y-1 text-sm text-teal-800">
              <li>• Keep your feet shoulder-width apart</li>
              <li>• Stand as still as possible</li>
              <li>• Breathe normally and stay relaxed</li>
              <li>• Your heart rate is being monitored</li>
            </ul>
          </div>

          {/* Warning for feeling unwell */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Feel dizzy or unwell?</strong> Sit down immediately and end the test. Your safety comes first.
            </p>
          </div>

          {timeRemaining === 0 ? (
            <Button onClick={onComplete} size="lg" className="w-full">
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Test
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Please remain standing...
              </p>
            </div>
          )}
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Step 2 of 2 • Recording standing heart rate</p>
        </div>
      </div>
    </div>
  );
}