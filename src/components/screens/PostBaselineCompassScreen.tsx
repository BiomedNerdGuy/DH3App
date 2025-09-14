import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CompassQuestion, CompassResponse } from '../../types';

interface PostBaselineCompassScreenProps {
  onComplete: (responses: CompassResponse[]) => void;
  onBack: () => void;
}

// Post-baseline COMPASS-31 questions as specified
const postBaselineQuestions: CompassQuestion[] = [
  {
    id: 'ortho_1',
    question: 'In the last year, have you at any time felt weak, dizzy or lightheaded, or had difficulty thinking after standing up from sitting or lying down?',
    category: 'orthostatic',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ]
  },
  {
    id: 'vaso_5',
    question: 'In the last year, have you at any time noticed changes in the colour of your skin, e.g. it became red, white or purplish?',
    category: 'vasomotor',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ]
  },
  {
    id: 'vaso_8',
    question: 'In the last 5 years, what changes (if any) have occurred in your body perspiration?',
    category: 'vasomotor',
    options: [
      { value: 0, label: 'I sweat much less than before' },
      { value: 1, label: 'I sweat somewhat less than before' },
      { value: 2, label: 'I haven\'t noticed any change' },
      { value: 3, label: 'I sweat somewhat more than before' },
      { value: 4, label: 'I sweat a lot more than before' }
    ]
  },
  {
    id: 'dry_9',
    question: 'Do your eyes feel excessively dry?',
    category: 'secretomotor',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ]
  },
  {
    id: 'dry_10',
    question: 'Does your mouth feel excessively dry?',
    category: 'secretomotor',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ]
  },
  {
    id: 'dry_11',
    question: 'For the symptom of dry eyes or dry mouth that you have had for the longest period of time, is this symptom:',
    category: 'secretomotor',
    options: [
      { value: 0, label: 'I have not had any of these symptoms' },
      { value: 1, label: 'Getting much worse' },
      { value: 2, label: 'Getting somewhat worse' },
      { value: 3, label: 'Remaining the same' },
      { value: 4, label: 'Getting somewhat better' },
      { value: 5, label: 'Getting much better' }
    ]
  },
  {
    id: 'gi_12',
    question: 'In the past year, have you noticed any changes in how quickly you get full when eating a meal?',
    category: 'gastrointestinal',
    options: [
      { value: 0, label: 'I haven\'t noticed any change' },
      { value: 1, label: 'I get full more quickly than before' },
      { value: 2, label: 'I get full less quickly than before' }
    ]
  },
  {
    id: 'gi_13',
    question: 'In the last year, have you felt excessively full or persistently full (bloated feeling) after meals?',
    category: 'gastrointestinal',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'gi_14',
    question: 'In the past year, have you vomited after a meal?',
    category: 'gastrointestinal',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'gi_15',
    question: 'In the past year, have you had a cramping or colicky abdominal pain?',
    category: 'gastrointestinal',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'gi_16',
    question: 'In the past year, have you had any episodes of diarrhoea?',
    category: 'gastrointestinal',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ]
  },
  {
    id: 'gi_20',
    question: 'In the past year, have you been constipated?',
    category: 'gastrointestinal',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ]
  },
  {
    id: 'bladder_24',
    question: 'In the last year, have you at any time lost bladder control?',
    category: 'bladder',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'bladder_25',
    question: 'In the last year, have you had difficulty passing urine?',
    category: 'bladder',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'bladder_26',
    question: 'In the past year, have you had trouble completely emptying your bladder?',
    category: 'bladder',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'pupil_27',
    question: 'In the last year, have you been bothered by bright light in your eyes when you were not wearing sunglasses or tinted glasses?',
    category: 'pupillomotor',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'pupil_29',
    question: 'In the last year, have you had any problems focusing your eyes?',
    category: 'pupillomotor',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Occasionally' },
      { value: 2, label: 'Frequently' },
      { value: 3, label: 'Constantly' }
    ]
  },
  {
    id: 'pupil_31',
    question: 'Is the most troublesome symptom with your eyes (i.e. sensitivity to bright light or trouble focusing):',
    category: 'pupillomotor',
    options: [
      { value: 0, label: 'I have not had these symptoms' },
      { value: 1, label: 'Getting much worse' },
      { value: 2, label: 'Getting somewhat worse' },
      { value: 3, label: 'Remaining the same' },
      { value: 4, label: 'Getting somewhat better' },
      { value: 5, label: 'Getting much better' }
    ]
  }
];

export function PostBaselineCompassScreen({ onComplete, onBack }: PostBaselineCompassScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<CompassResponse[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const currentQuestion = postBaselineQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === postBaselineQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / postBaselineQuestions.length) * 100;

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
            Follow-up Survey
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
                <p className="font-medium text-teal-900">Follow-up Assessment</p>
              </div>
              <p className="text-teal-800 text-sm">
                Now that you've completed your 5-day baseline testing, we'd like to assess your current symptoms. 
                This helps us understand how your symptoms may have changed.
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
                    <span className="font-medium text-sm">{option.label}</span>
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
          <p>This follow-up assessment helps track your symptom changes</p>
        </div>
      </div>
    </div>
  );
}