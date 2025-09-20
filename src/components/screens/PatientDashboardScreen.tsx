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
  vossComparison: {
    baselineScore: number;
    followUpScore: number;
    scoreDifference: number;
    interpretation: string;
  };
}

interface PatientDashboardScreenProps {
  patientId: string;
  onBack: () => void;
}

// Mock patient data for Emily Rodriguez
const generateHeartRateData = () => {
  const data = [];
  const startDate = new Date('2024-01-13');
  const totalPoints = 10000;
  const pointsPerDay = totalPoints / 5;
  
  for (let day = 0; day < 5; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    for (let point = 0; point < pointsPerDay; point++) {
      // Generate realistic heart rate with daily variation
      const timeOfDay = point / pointsPerDay; // 0 to 1
      const baseHR = 75 + Math.sin(timeOfDay * Math.PI * 2) * 5; // Daily rhythm
      const noise = (Math.random() - 0.5) * 20; // Random variation
      const heartRate = Math.max(60, Math.min(140, baseHR + noise));
      
      const timestamp = new Date(currentDate);
      timestamp.setHours(Math.floor(timeOfDay * 24));
      timestamp.setMinutes(Math.floor((timeOfDay * 24 * 60) % 60));
      
      data.push({
        timestamp: timestamp.toISOString(),
        date: dateStr,
        heartRate: Math.round(heartRate),
        timeOfDay
      });
    }
  }
  
  return data;
};

const heartRateData = generateHeartRateData();

// Find one high heart rate episode per day
const generateEpisodes = () => {
  const episodes = [];
  const dates = ['2024-01-13', '2024-01-14', '2024-01-15', '2024-01-16', '2024-01-17'];
  
  const timeOfDayOptions = ['Morning', 'After lunch', 'Evening', 'Late afternoon', 'Early morning'];
  const activityOptions = ['Standing up quickly', 'Walking upstairs', 'After exercise', 'Sitting for long time', 'Getting out of bed'];
  const detailsOptions = [
    'Felt worse after standing for 10+ minutes',
    'Symptoms triggered by hot shower',
    'Occurred during stressful meeting',
    'Happened after skipping breakfast',
    'Symptoms worse in warm weather'
  ];
  
  dates.forEach((date, dayIndex) => {
    const dayData = heartRateData.filter(d => d.date === date);
    // Find the highest heart rate point of the day
    const highestPoint = dayData.reduce((max, current) => 
      current.heartRate > max.heartRate ? current : max
    );
    
    const symptoms = [
      ['Dizziness', 'Palpitations'],
      ['Lightheaded', 'Fatigue'],
      ['Dizziness', 'Brain Fog', 'Tremor'],
      ['Palpitations', 'Chest Pain'],
      ['Dizziness', 'Shortness of Breath']
    ];
    
    const episode = {
      id: `episode-${dayIndex + 1}`,
      date: date,
      time: new Date(highestPoint.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duration: `${15 + Math.floor(Math.random() * 20)} min`,
      symptoms: symptoms[dayIndex],
      severity: Math.min(10, Math.max(6, Math.floor(highestPoint.heartRate / 12))),
      timeOfDay: timeOfDayOptions[dayIndex],
      activityType: activityOptions[dayIndex],
      otherDetails: detailsOptions[dayIndex],
      heartRate: highestPoint.heartRate,
      timestamp: highestPoint.timestamp
    };
    
    episodes.push(episode);
  });
  
  return episodes;
};

const mockPatientData: PatientData = {
  id: '3',
  name: 'Emily Rodriguez',
  patientCode: 'ER2024003',
  averageHeartRate: Math.round(heartRateData.reduce((sum, d) => sum + d.heartRate, 0) / heartRateData.length),
  episodeCount: 5,
  heartRateRange: { min: 65, max: 125 },
  continuousHeartRateData: ['2024-01-13', '2024-01-14', '2024-01-15', '2024-01-16', '2024-01-17'].map(date => {
    const dayData = heartRateData.filter(d => d.date === date);
    return {
      date,
      averageHR: Math.round(dayData.reduce((sum, d) => sum + d.heartRate, 0) / dayData.length),
      minHR: Math.min(...dayData.map(d => d.heartRate)),
      maxHR: Math.max(...dayData.map(d => d.heartRate))
    };
  }),
  episodes: generateEpisodes(),
  vossComparison: {
    baselineScore: 42,
    followUpScore: 0, // No follow-up survey taken
    scoreDifference: 0,
    interpretation: 'Baseline VOSS score of 42/90 indicates moderate orthostatic symptom burden. No follow-up survey was completed.'
  }
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
        {/* Blank Graph Container */}
        <div className="relative h-80 bg-gray-50 rounded-lg border-2 border-gray-200">
          {/* Y-axis */}
          <div className="absolute left-4 top-4 bottom-16 flex flex-col justify-between">
            <span className="text-xs text-gray-600 font-medium">140</span>
            <span className="text-xs text-gray-600 font-medium">120</span>
            <span className="text-xs text-gray-600 font-medium">100</span>
            <span className="text-xs text-gray-600 font-medium">80</span>
            <span className="text-xs text-gray-600 font-medium">60</span>
          </div>
          
          {/* Y-axis label */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90">
            <span className="text-sm font-medium text-gray-700">BPM</span>
          </div>
          
          {/* X-axis */}
          <div className="absolute bottom-4 left-16 right-4 flex justify-between">
            <span className="text-xs text-gray-600 font-medium">Jan 13</span>
            <span className="text-xs text-gray-600 font-medium">Jan 14</span>
            <span className="text-xs text-gray-600 font-medium">Jan 15</span>
            <span className="text-xs text-gray-600 font-medium">Jan 16</span>
            <span className="text-xs text-gray-600 font-medium">Jan 17</span>
          </div>
          
          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-medium text-gray-700">Date</span>
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-16 right-4 top-4 bottom-16">
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div 
                key={`h-${i}`} 
                className="absolute w-full border-t border-gray-300" 
                style={{ top: `${i * 25}%` }}
              ></div>
            ))}
            {/* Vertical grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div 
                key={`v-${i}`} 
                className="absolute h-full border-l border-gray-300" 
                style={{ left: `${i * 25}%` }}
              ></div>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => setActiveView('voss')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <FileText className="w-5 h-5 mr-2" />
          VOSS Survey Results
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

  const renderVossResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">VOSS Survey Results</h3>
        <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-teal-600">
              {patient.vossComparison.baselineScore}
            </div>
            <div className="text-gray-600">VOSS Baseline Score</div>
            <div className="text-sm text-gray-500">
              (out of 90 maximum)
            </div>
          </div>

          {/* Score Visualization */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Symptom Burden Level:</h4>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-teal-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(patient.vossComparison.baselineScore / 90) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 - None</span>
              <span>45 - Moderate</span>
              <span>90 - Severe</span>
            </div>
          </div>

          {/* Severity Classification */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="font-medium text-teal-900 mb-2">Classification:</h4>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              patient.vossComparison.baselineScore >= 45 ? 'bg-red-100 text-red-800' :
              patient.vossComparison.baselineScore >= 25 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {patient.vossComparison.baselineScore >= 45 ? 'High Symptom Burden' :
               patient.vossComparison.baselineScore >= 25 ? 'Moderate Symptom Burden' :
               'Mild Symptom Burden'}
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Clinical Interpretation:</h4>
        <p className="text-sm text-blue-800">{patient.vossComparison.interpretation}</p>
      </div>

      {/* VOSS Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">About VOSS:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Vanderbilt Orthostatic Symptom Score measures symptom burden in POTS</li>
          <li>• Scores range from 0-90 (9 symptoms × 0-10 scale each)</li>
          <li>• Higher scores indicate greater subjective symptom severity</li>
          <li>• Provides baseline assessment of orthostatic symptoms</li>
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
        {activeView === 'voss' && renderVossResults()}
        {activeView === 'episodes' && renderEpisodeHistory()}
      </div>
    </div>
  );
}