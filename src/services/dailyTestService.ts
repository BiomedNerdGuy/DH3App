import { supabase } from '../lib/supabase';
import { DailyTest, HeartRateReading, BPReading } from '../types';

export interface DailyTestRow {
  id: string;
  patient_id: string;
  test_date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function getDailyTestsByPatientId(patientId: string): Promise<DailyTest[]> {
  const { data: testsData, error: testsError } = await supabase
    .from('daily_tests')
    .select('*')
    .eq('patient_id', patientId)
    .order('test_date', { ascending: true });

  if (testsError) {
    console.error('Error fetching daily tests:', testsError);
    throw testsError;
  }

  const dailyTests: DailyTest[] = await Promise.all(
    testsData.map(async (test) => {
      const { data: hrData, error: hrError } = await supabase
        .from('heart_rate_readings')
        .select('*')
        .eq('daily_test_id', test.id)
        .order('timestamp', { ascending: true });

      if (hrError) {
        console.error('Error fetching heart rate readings:', hrError);
      }

      const { data: bpData, error: bpError } = await supabase
        .from('bp_readings')
        .select('*')
        .eq('daily_test_id', test.id)
        .order('timestamp', { ascending: true });

      if (bpError) {
        console.error('Error fetching BP readings:', bpError);
      }

      return {
        id: test.id,
        patientId: test.patient_id,
        date: test.test_date,
        completed: test.completed,
        heartRateReadings: hrData?.map(hr => ({
          timestamp: hr.timestamp,
          heartRate: hr.heart_rate,
          position: hr.position as 'lying' | 'sitting' | 'standing'
        })) || [],
        bpReadings: bpData?.map(bp => ({
          timestamp: bp.timestamp,
          systolic: bp.systolic,
          diastolic: bp.diastolic,
          position: bp.position as 'lying' | 'standing'
        })) || [],
        notes: test.notes
      };
    })
  );

  return dailyTests;
}

export async function createDailyTest(
  patientId: string,
  testDate: string,
  heartRateReadings: HeartRateReading[],
  bpReadings: BPReading[],
  notes?: string
): Promise<DailyTest> {
  const { data: testData, error: testError } = await supabase
    .from('daily_tests')
    .insert({
      patient_id: patientId,
      test_date: testDate,
      completed: true,
      notes
    })
    .select()
    .single();

  if (testError) {
    console.error('Error creating daily test:', testError);
    throw testError;
  }

  if (heartRateReadings.length > 0) {
    const { error: hrError } = await supabase
      .from('heart_rate_readings')
      .insert(
        heartRateReadings.map(hr => ({
          daily_test_id: testData.id,
          timestamp: hr.timestamp,
          heart_rate: hr.heartRate,
          position: hr.position
        }))
      );

    if (hrError) {
      console.error('Error inserting heart rate readings:', hrError);
      throw hrError;
    }
  }

  if (bpReadings.length > 0) {
    const { error: bpError } = await supabase
      .from('bp_readings')
      .insert(
        bpReadings.map(bp => ({
          daily_test_id: testData.id,
          timestamp: bp.timestamp,
          systolic: bp.systolic,
          diastolic: bp.diastolic,
          position: bp.position
        }))
      );

    if (bpError) {
      console.error('Error inserting BP readings:', bpError);
      throw bpError;
    }
  }

  return {
    id: testData.id,
    patientId: testData.patient_id,
    date: testData.test_date,
    completed: testData.completed,
    heartRateReadings,
    bpReadings,
    notes: testData.notes
  };
}

export async function getRecentDailyTests(patientId: string, limit: number = 5): Promise<DailyTest[]> {
  const { data: testsData, error: testsError } = await supabase
    .from('daily_tests')
    .select('*')
    .eq('patient_id', patientId)
    .order('test_date', { ascending: false })
    .limit(limit);

  if (testsError) {
    console.error('Error fetching recent daily tests:', testsError);
    throw testsError;
  }

  const dailyTests: DailyTest[] = await Promise.all(
    testsData.map(async (test) => {
      const { data: hrData } = await supabase
        .from('heart_rate_readings')
        .select('*')
        .eq('daily_test_id', test.id)
        .order('timestamp', { ascending: true });

      const { data: bpData } = await supabase
        .from('bp_readings')
        .select('*')
        .eq('daily_test_id', test.id)
        .order('timestamp', { ascending: true });

      return {
        id: test.id,
        patientId: test.patient_id,
        date: test.test_date,
        completed: test.completed,
        heartRateReadings: hrData?.map(hr => ({
          timestamp: hr.timestamp,
          heartRate: hr.heart_rate,
          position: hr.position as 'lying' | 'sitting' | 'standing'
        })) || [],
        bpReadings: bpData?.map(bp => ({
          timestamp: bp.timestamp,
          systolic: bp.systolic,
          diastolic: bp.diastolic,
          position: bp.position as 'lying' | 'standing'
        })) || [],
        notes: test.notes
      };
    })
  );

  return dailyTests;
}
