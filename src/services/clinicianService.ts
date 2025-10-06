import { supabase } from '../lib/supabase';

export interface Clinician {
  id: string;
  email: string;
  fullName: string;
  clinicianCode: string;
  createdAt: string;
  updatedAt: string;
}

export async function getClinicianByCode(clinicianCode: string): Promise<Clinician | null> {
  const { data, error } = await supabase
    .from('clinicians')
    .select('*')
    .eq('clinician_code', clinicianCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching clinician by code:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    clinicianCode: data.clinician_code,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function getClinicianById(clinicianId: string): Promise<Clinician | null> {
  const { data, error } = await supabase
    .from('clinicians')
    .select('*')
    .eq('id', clinicianId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching clinician by id:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    clinicianCode: data.clinician_code,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function createClinician(
  email: string,
  fullName: string,
  clinicianCode: string
): Promise<Clinician> {
  const { data, error } = await supabase
    .from('clinicians')
    .insert({
      email,
      full_name: fullName,
      clinician_code: clinicianCode
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating clinician:', error);
    throw error;
  }

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    clinicianCode: data.clinician_code,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
