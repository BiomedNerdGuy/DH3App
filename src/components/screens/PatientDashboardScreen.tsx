import React, { useState } from 'react';
import { ArrowLeft, Heart, Activity, TrendingUp, FileText, Clock, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PatientData {
  id: string;
  name: string;
  patientCode: string;
  averageHeartRate: number;
  episodeCount: number;
  heartRateRange: { min: number; max: number };
  continuousHeartRateData: {
    date: string;
    averageHR: number;
    minHR: number;
    maxHR: number;
  }[];
  episodes: {
    id: string;
    date: string;
    time: string;
    duration: string;
    symptoms: string[];
    severity: number;
    notes?: string;
    heartRate?: number;
  }[];
  compassResults: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}

interface PatientDashboardScreenProps {
  patientId: string;
  onBack: () => void;
}

// Mock patient data for Emily Rodriguez
const mockPatientData: PatientData = {
  id: '3',
  name: 'Emily Rodriguez',
  patientCode: 'ER2024003',
  averageHeartRate: 78,
  episodeCount: 12,
  heartRateRange: { min: 65, max: 125 },
  continuousHeartRateData: [
    { date: '2024-01-14', averageHR: 82, minHR: 65, maxHR: 115 },
    { date: '2024-01-15', averageHR: 79, minHR: 68, maxHR: 108 },
    { date: '2024-01-16', averageHR: 76, minHR: 62, maxHR: 102 },
    { date: '2024-01-17', averageHR: 85, minHR: 70, maxHR: 125 },
    { date: '2024-01-18', averageHR: 78, minHR: 66, maxHR: 107 }
  ],
  episodes: [
    {
      id: '1',
      date: '2024-01-14',
      time: '09:30 AM',
      duration: '25 min',
      symptoms: ['Dizziness', 'Palpitations', 'Fatigue'],
      severity: 7,
      notes: 'Occurred after standing up from bed. Had to sit down immediately.',
      heartRate: 115
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '02:15 PM',
      duration: '18 min',
      symptoms: ['Lightheaded', 'Nausea'],
      severity: 5,
      notes: 'During grocery shopping. Felt better after sitting in car.',
      heartRate: 108
    },
    {
      id: '3',
      date: '2024-01-15',
      time: '11:45 AM',
      duration: '32 min',
      symptoms: ['Dizziness', 'Brain Fog', 'Tremor'],
      severity: 8,
      notes: 'Worst episode this week. Had to lie down for 30 minutes.',
      heartRate: 125
    },
    {
      id: '4',
      date: '2024-01-16',
      time: '08:20 AM',
      duration: '12 min',
      symptoms: ['Palpitations', 'Chest Pain'],
      severity: 6,
      heartRate: 112
    },
    {
      id: '5',
      date: '2024-01-17',
      time: '03:45 PM',
      duration: '28 min',
      symptoms: ['Dizziness', 'Fatigue', 'Shortness of Breath'],
      severity: 7,
      notes: 'Triggered by standing for extended period during work meeting.',
      heartRate: 118
    }
  ],
  compassResults: [
    { category: 'Orthostatic Intolerance', score: 28, maxScore: 40 },
    { category: 'Vasomotor', score: 12, maxScore: 20 },
    { category: 'Secretomotor', score: 8, maxScore: 15 },
    { category: 'Gastrointestinal', score: 15, maxScore: 25 },
    { category: 'Bladder', score: 3, maxScore: 10 },
    { category: 'Pupillomotor', score: 6, maxScore: 15 }
  ]
};

export function PatientDashboardScreen({ patientId, onBack }: PatientDashboardScreenProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'compass' | 'episodes'>('dashboard');
  const patient = mockPatientData; // In real app, would fetch by patientId

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-teal-600" />
            <h3 className="font-medium text-gray-900">Average Heart Rate</h3>
          </div>
          <div className="text-2xl font-bold text-teal-600">{patient.averageHeartRate} BPM</div>
          <div className="text-sm text-gray-600">5-day monitoring period</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-gray-900">Episodes Logged</h3>
          </div>
          <div className="text-2xl font-bold text-red-600">{patient.episodeCount}</div>
          <div className="text-sm text-gray-600">During monitoring period</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Heart Rate Range</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {patient.heartRateRange.min}-{patient.heartRateRange.max}
          </div>
          <div className="text-sm text-gray-600">During sit/stand tests</div>
        </Card>
      </div>

      {/* Heart Rate & Episode Graph */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate & Episode Timing</h3>
        
        {/* Graph Container */}
        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
            <span>140</span>
            <span>120</span>
            <span>100</span>
            <span>80</span>
            <span>60</span>
          </div>
          
          {/* Graph area */}
          <div className="ml-8 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="absolute w-full border-t border-gray-200" style={{ top: `${i * 25}%` }}></div>
              ))}
            </div>
            
            {/* Data points and lines */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Continuous HR line */}
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="3"
                points="0,45 25,65 50,75 75,30 100,55"
              />
              
              {/* Episode markers */}
              <circle cx="0%" cy="45%" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <circle cx="0%" cy="65%" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <circle cx="25%" cy="65%" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <circle cx="50%" cy="75%" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <circle cx="75%" cy="30%" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500 transform translate-y-6">
              {patient.continuousHeartRateData.map(data => (
                <span key={data.date}>{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-teal-600"></div>
            <span>Continuous HR</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Episodes</span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => setActiveView('compass')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <FileText className="w-5 h-5 mr-2" />
          COMPASS-31 Results
        </Button>
        
        <Button 
          onClick={() => setActiveView('episodes')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <Clock className="w-5 h-5 mr-2" />
          Episode History
        </Button>
      </div>
    </div>
  );

  const renderCompassResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">COMPASS-31 Survey Results</h3>
        <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-teal-600">
              {patient.compassResults.reduce((sum, cat) => sum + cat.score, 0)}
            </div>
            <div className="text-gray-600">Total COMPASS-31 Score</div>
            <div className="text-sm text-gray-500">
              (out of {patient.compassResults.reduce((sum, cat) => sum + cat.maxScore, 0)} maximum)
            </div>
          </div>

          {patient.compassResults.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{category.category}</span>
                <span className="text-sm text-gray-600">{category.score}/{category.maxScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Clinical Interpretation:</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• High orthostatic intolerance score suggests significant POTS symptoms</li>
          <li>• Moderate gastrointestinal involvement noted</li>
          <li>• Vasomotor symptoms present but mild</li>
          <li>• Overall score indicates moderate autonomic dysfunction</li>
        </ul>
      </div>
    </div>
  );

  const renderEpisodeHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Episode History</h3>
        <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-4">
        {patient.episodes.map((episode) => (
          <Card key={episode.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {new Date(episode.date).toLocaleDateString()}
                  </span>
                  <span className="text-gray-600">at {episode.time}</span>
                </div>
                <div className="text-sm text-gray-500">Duration: {episode.duration}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Severity:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  episode.severity >= 7 ? 'bg-red-100 text-red-800' :
                  episode.severity >= 4 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {episode.severity}/10
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Symptoms:</h4>
                <div className="flex flex-wrap gap-2">
                  {episode.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {episode.heartRate && (
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700">Heart Rate: {episode.heartRate} BPM</span>
                </div>
              )}

              {episode.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Patient Notes:</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {episode.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">Patient Code: {patient.patientCode}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Study Complete
            </div>
          </div>
        </div>

        {/* Content */}
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'compass' && renderCompassResults()}
        {activeView === 'episodes' && renderEpisodeHistory()}
      </div>
    </div>
  );
}