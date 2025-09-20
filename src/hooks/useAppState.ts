import { useState, useCallback } from 'react';
import { AppState, Patient, Medication, SupportPartner, VossResponse } from '../types';

const initialState: AppState = {
  currentScreen: 'launch',
  isClinicianMode: false,
  selectedPatientId: undefined,
  onboardingComplete: false,
  deviceConnected: false,
  dailyTests: [],
  currentDay: 1,
  totalBaselineDays: 5,
  currentTestStep: 'intro',
  medications: [],
  vossFollowUp: undefined,
  locationEnabled: false,
  episodes: [],
  symptoms: [],
  reportGenerated: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loginUser = useCallback(() => {
    updateState({ 
      onboardingComplete: true, 
      currentScreen: 'home',
      // Simulate returning user with some existing data
      currentDay: 3, // Example: user is on day 3
      dailyTests: [
        {
          id: '1',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: true,
          heartRateReadings: [],
          notes: 'Day 1 baseline test completed'
        },
        {
          id: '2', 
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: true,
          heartRateReadings: [],
          notes: 'Day 2 baseline test completed'
        }
      ]
    });
  }, [updateState]);

  const setCurrentScreen = useCallback((screen: string) => {
    updateState({ currentScreen: screen });
  }, [updateState]);

  const loginClinician = useCallback((code: string) => {
    updateState({ 
      isClinicianMode: true,
      clinicianCode: code,
      currentScreen: 'clinician-home'
    });
  }, [updateState]);

  const addPatientToClinician = useCallback((patientCode: string) => {
    // TODO: Add patient to clinician's patient list
    console.log('Adding patient with code:', patientCode);
    updateState({ currentScreen: 'clinician-home' });
  }, [updateState]);

  const setPatient = useCallback((patient: Patient) => {
    updateState({ patient });
  }, [updateState]);

  const setMedications = useCallback((medications: Medication[]) => {
    updateState({ medications });
        undefined

  const setSupportPartner = useCallback((supportPartner: SupportPartner) => {
    updateState({ supportPartner });
  }, [updateState]);

  const setVossBaseline = useCallback((responses: VossResponse[]) => {
    updateState({ vossBaseline: responses });
  }, [updateState]);

    updateState({ vossFollowUp: responses });
  }, [updateState]);

  const setLocationEnabled = useCallback((enabled: boolean) => {
    updateState({ locationEnabled: enabled });
  }, [updateState]);

  const setDeviceConnected = useCallback((connected: boolean) => {
    updateState({ deviceConnected: connected });
  }, [updateState]);

  const completeOnboarding = useCallback(() => {
    updateState({ onboardingComplete: true, currentScreen: 'home' });
  }, [updateState]);

  const startDailyTest = useCallback(() => {
    updateState({ currentScreen: 'intro-to-test', currentTestStep: 'intro' });
  }, [updateState]);

  const nextTestStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.currentTestStep === 'intro' ? 'sit-lie' : 
                      prev.currentTestStep === 'sit-lie' ? 'stand' : 'complete';
      
      const nextScreen = nextStep === 'sit-lie' ? 'sit-lie-down' :
                        nextStep === 'stand' ? 'time-to-stand' :
                        'daily-test-complete';
      
      return {
        ...prev,
        currentTestStep: nextStep,
        currentScreen: nextScreen
      };
    });
  }, []);

  const completeDailyTest = useCallback(() => {
    setState(prev => {
      const newDailyTest: DailyTest = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        completed: true,
        heartRateReadings: [], // Placeholder - would be populated with real data
        notes: `Day ${prev.currentDay} baseline test completed`
      };

      const updatedDailyTests = [...prev.dailyTests, newDailyTest];
      const nextDay = prev.currentDay + 1;
      
      if (nextDay > prev.totalBaselineDays) {
        // All 5 days complete
        return {
          ...prev,
          dailyTests: updatedDailyTests,
          currentScreen: 'five-day-complete',
          currentTestStep: 'intro'
        };
      } else {
        // More days remaining
        return {
          ...prev,
          dailyTests: updatedDailyTests,
          currentDay: nextDay,
          currentScreen: 'home',
          currentTestStep: 'intro'
        };
      }
    });
  }, []);

  const goToHomeScreen = useCallback(() => {
    updateState({ currentScreen: 'home' });
  }, [updateState]);

  const cancelDailyTest = useCallback(() => {
    updateState({ 
      currentScreen: 'home',
      currentTestStep: 'intro'
    });
  }, [updateState]);

  const logSymptom = useCallback((symptomData: any) => {
    const newSymptom = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      symptoms: symptomData.symptoms,
      severity: symptomData.severity,
      notes: symptomData.notes,
      heartRate: symptomData.heartRate,
      location: symptomData.location
    };

    setState(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, newSymptom],
      currentScreen: 'home'
    }));
  }, []);

  const startEpisode = useCallback((symptomData: any) => {
    const newEpisode = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      symptoms: symptomData.symptoms,
      severity: symptomData.severity,
      notes: symptomData.notes,
      heartRateData: [],
      location: symptomData.location
    };

    updateState({ 
      currentEpisode: newEpisode,
      currentScreen: 'active-episode'
    });
  }, [updateState]);

  const updateEpisode = useCallback((updates: any) => {
    setState(prev => ({
      ...prev,
      currentEpisode: prev.currentEpisode ? {
        ...prev.currentEpisode,
        ...updates
      } : undefined
    }));
  }, []);

  const endEpisode = useCallback((finalNotes?: string) => {
    setState(prev => {
      if (!prev.currentEpisode) return prev;

      const completedEpisode = {
        ...prev.currentEpisode,
        endTime: new Date().toISOString(),
        notes: finalNotes || prev.currentEpisode.notes
      };

      return {
        ...prev,
        episodes: [...prev.episodes, completedEpisode],
        currentEpisode: undefined,
        currentScreen: 'episode-complete'
      };
    });
  }, []);

  const goToSymptomLog = useCallback(() => {
    updateState({ currentScreen: 'symptom-log' });
  }, [updateState]);

  const generateReport = useCallback(() => {
    updateState({ currentScreen: 'report-generation' });
  }, [updateState]);

  const setReportReady = useCallback(() => {
    updateState({ 
      currentScreen: 'report-ready',
      reportGenerated: true 
    });
  }, [updateState]);

  const viewReport = useCallback(() => {
    updateState({ currentScreen: 'report-view' });
  }, [updateState]);

  const downloadReport = useCallback(() => {
    // TODO: Implement PDF download
    console.log('Download report functionality not implemented yet');
  }, []);

  const emailReport = useCallback(() => {
    // TODO: Implement email functionality
    console.log('Email report functionality not implemented yet');
  }, []);

  const shareReport = useCallback(() => {
    // TODO: Implement provider sharing

  return {
    state,
    updateState,
    setCurrentScreen,
    loginClinician,
    addPatientToClinician,
    loginUser,
    setPatient,
    setMedications,
    setSupportPartner,
    setVossBaseline,
    setLocationEnabled,
    setDeviceConnected,
    completeOnboarding,
    startDailyTest,
    nextTestStep,
    completeDailyTest,
    goToHomeScreen,
    cancelDailyTest,
    logSymptom,
    startEpisode,
    updateEpisode,
    endEpisode,
    goToSymptomLog,
    generateReport,
    setReportReady,
    viewReport,
    downloadReport,
    emailReport,
    shareReport,
  };
}