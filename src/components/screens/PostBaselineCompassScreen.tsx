import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { VossQuestion, VossResponse } from '../../types';

interface PostBaselineCompassScreenProps {
  onComplete: (responses: VossResponse[]) => void;
  onBack: () => void;
}

// Post-baseline VOSS questions (same as baseline)
const postBaselineQuestions: VossQuestion[] = [
  {
    id: 'q1',
    question: 'Mental clouding ("brain fog")',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q2',
    question: 'Blurred vision',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q3',
    question: 'Shortness of breath',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q4',
    question: 'Rapid heartbeat / palpitations',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q5',
    question: 'Tremulousness (shakiness)',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q6',
    question: 'Chest discomfort',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q7',
    question: 'Headache',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q8',
    question: 'Light-headedness / dizziness',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  },
  {
    id: 'q9',
    question: 'Nausea',
    category: 'voss',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Worst imaginable' }
    ]
  }
];

export function PostBaselineCompassScreen({ onComplete, onBack }: PostBaselineCompassScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<VossResponse[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const currentQuestion = postBaselineQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === postBaselineQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / postBaselineQuestions.length) * 100;

  const handleAnswerSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleNext = () => {
    if (selectedValue === null) return;

    const newResponse: VossResponse = {
      questionId: currentQuestion.id,
      value: selectedValue,
      timestamp: new Date().toISOString()
    };

    const updatedResponses = [
      ...responses.filter(r => r.questionId !== currentQuestion.id),
      newResponse
    ];
    setResponses(updatedResponses);

    if (isLastQuestion) {
      onComplete(updatedResponses);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedValue(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Load previous response if it exists
      const previousResponse = responses.find(r => r.questionId === postBaselineQuestions[currentQuestionIndex - 1].id);
      setSelectedValue(previousResponse?.value ?? null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            Follow-up VOSS Survey
          </h1>
        </div>

        <Card className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {postBaselineQuestions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Intro text (only on first question) */}
          {currentQuestionIndex === 0 && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <p className="font-medium text-teal-900">Follow-up VOSS Assessment</p>
              </div>
              <p className="text-teal-800 text-sm">
                Now that you've completed your 5-day baseline testing, please rate your current orthostatic symptoms again. 
                This helps us understand how your symptom burden may have changed.
              </p>
            </div>
          )}

          {/* Question */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
            <p className="text-sm text-gray-600">Rate from 0 (none) to 10 (worst imaginable)</p>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`p-3 text-center border-2 rounded-lg transition-colors ${
                    selectedValue === option.value
                      ? 'border-teal-500 bg-teal-50 text-teal-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-sm">{option.label}</span>
                  {selectedValue === option.value && (
                    <CheckCircle className="w-4 h-4 text-teal-600 mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedValue === null}
            >
              {isLastQuestion ? 'Complete VOSS Survey' : 'Next'}
              {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>This follow-up VOSS assessment helps track changes in your symptom burden</p>
        </div>
      </div>
    </div>
  );
}