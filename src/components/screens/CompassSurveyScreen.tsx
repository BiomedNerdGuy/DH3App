import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CompassQuestion, CompassResponse } from '../../types';

interface CompassSurveyScreenProps {
  onComplete: (responses: CompassResponse[]) => void;
  onBack: () => void;
  isBaseline?: boolean;
}

// Sample COMPASS-31 questions (simplified for MVP)
const compassQuestions: CompassQuestion[] = [
  {
    id: 'q1',
    question: 'In the past month, how often have you felt dizzy when you stand up?',
    category: 'orthostatic',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Frequently' },
      { value: 4, label: 'Always' }
    ]
  },
  {
    id: 'q2',
    question: 'In the past month, how often have you felt lightheaded when standing?',
    category: 'orthostatic',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Frequently' },
      { value: 4, label: 'Always' }
    ]
  },
  {
    id: 'q3',
    question: 'In the past month, how often have you had heart palpitations?',
    category: 'cardiovascular',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Frequently' },
      { value: 4, label: 'Always' }
    ]
  },
  {
    id: 'q4',
    question: 'In the past month, how often have you felt unusually fatigued?',
    category: 'general',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Frequently' },
      { value: 4, label: 'Always' }
    ]
  },
  {
    id: 'q5',
    question: 'In the past month, how often have you had trouble concentrating?',
    category: 'cognitive',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Frequently' },
      { value: 4, label: 'Always' }
    ]
  }
];

export function CompassSurveyScreen({ onComplete, onBack, isBaseline = true }: CompassSurveyScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<CompassResponse[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const currentQuestion = compassQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === compassQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / compassQuestions.length) * 100;

  const handleAnswerSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleNext = () => {
    if (selectedValue === null) return;

    const newResponse: CompassResponse = {
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
      const previousResponse = responses.find(r => r.questionId === compassQuestions[currentQuestionIndex - 1].id);
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
            {isBaseline ? 'Baseline' : 'Follow-up'} Survey
          </h1>
        </div>

        <Card className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {compassQuestions.length}</span>
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
              <p className="text-teal-800 text-sm">
                We'll ask you about common symptoms related to POTS. This helps us understand your baseline symptoms.
              </p>
            </div>
          )}

          {/* Question */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                    selectedValue === option.value
                      ? 'border-teal-500 bg-teal-50 text-teal-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {selectedValue === option.value && (
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
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
              {isLastQuestion ? 'Complete Survey' : 'Next'}
              {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Your responses help personalize your care</p>
        </div>
      </div>
    </div>
  );
}