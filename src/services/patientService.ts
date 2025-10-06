import { supabase } from '../lib/supabase';
import { Patient } from '../types';

export interface PatientRow {
  id: string;
  clinician_id: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex_assigned_at_birth: 'female' | 'male' | 'prefer-not-to-say';
  reason_for_use: 'doctor-referral' | 'suspect-pots' | 'other';
  reason_for_use_other?: string;
  patient_code: string;
  onboarding_complete: boolean;
  device_connected: boolean;
  location_enabled: boolean;
  created_at: string;
  updated_at: string;
}

function mapPatientRowToPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    sexAssignedAtBirth: row.sex_assigned_at_birth,
    reasonForUse: row.reason_for_use,
    reasonForUseOther: row.reason_for_use_other,
    patientCode: row.patient_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getAllPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }

  return data.map(mapPatientRowToPatient);
}

export async function getPatientById(patientId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }

  return data ? mapPatientRowToPatient(data) : null;
}

export async function getPatientByCode(patientCode: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('patient_code', patientCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching patient by code:', error);
    throw error;
  }

  return data ? mapPatientRowToPatient(data) : null;
}

export async function getPatientsByClinicianId(clinicianId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('clinician_id', clinicianId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching patients by clinician:', error);
    throw error;
  }

  return data.map(mapPatientRowToPatient);
}

export async function createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('patients')
    .insert({
      first_name: patient.firstName,
      last_name: patient.lastName,
      date_of_birth: patient.dateOfBirth,
      sex_assigned_at_birth: patient.sexAssignedAtBirth,
      reason_for_use: patient.reasonForUse,
      reason_for_use_other: patient.reasonForUseOther,
      patient_code: patient.patientCode,
      onboarding_complete: false,
      device_connected: false,
      location_enabled: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating patient:', error);
    throw error;
  }

  return mapPatientRowToPatient(data);
}

export async function updatePatient(patientId: string, updates: Partial<Patient>) {
  const dbUpdates: any = {
    updated_at: new Date().toISOString()
  };

  if (updates.firstName) dbUpdates.first_name = updates.firstName;
  if (updates.lastName) dbUpdates.last_name = updates.lastName;
  if (updates.dateOfBirth) dbUpdates.date_of_birth = updates.dateOfBirth;
  if (updates.sexAssignedAtBirth) dbUpdates.sex_assigned_at_birth = updates.sexAssignedAtBirth;
  if (updates.reasonForUse) dbUpdates.reason_for_use = updates.reasonForUse;
  if (updates.reasonForUseOther !== undefined) dbUpdates.reason_for_use_other = updates.reasonForUseOther;

  const { data, error } = await supabase
    .from('patients')
    .update(dbUpdates)
    .eq('id', patientId)
    .select()
    .single();

  if (error) {
    console.error('Error updating patient:', error);
    throw error;
  }

  return mapPatientRowToPatient(data);
}
