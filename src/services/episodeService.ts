import { supabase } from '../lib/supabase';
import { Episode, SymptomEntry } from '../types';

export async function getEpisodesByPatientId(patientId: string): Promise<Episode[]> {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('patient_id', patientId)
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }

  const episodes: Episode[] = await Promise.all(
    data.map(async (episode) => {
      const { data: hrData } = await supabase
        .from('episode_heart_rate_data')
        .select('*')
        .eq('episode_id', episode.id)
        .order('timestamp', { ascending: true });

      return {
        id: episode.id,
        startTime: episode.start_time,
        endTime: episode.end_time || undefined,
        symptoms: episode.symptoms || [],
        notes: episode.notes || undefined,
        audioNote: episode.audio_note || undefined,
        severity: episode.severity || undefined,
        heartRateData: hrData?.map(hr => ({
          timestamp: hr.timestamp,
          heartRate: hr.heart_rate,
          position: hr.position as 'lying' | 'sitting' | 'standing'
        })) || [],
        location: episode.latitude && episode.longitude ? {
          latitude: parseFloat(episode.latitude),
          longitude: parseFloat(episode.longitude),
          address: episode.address || undefined
        } : undefined
      };
    })
  );

  return episodes;
}

export async function createEpisode(
  patientId: string,
  startTime: string,
  symptoms: string[],
  severity?: number,
  notes?: string,
  location?: { latitude: number; longitude: number; address?: string }
): Promise<Episode> {
  const { data, error } = await supabase
    .from('episodes')
    .insert({
      patient_id: patientId,
      start_time: startTime,
      symptoms,
      severity,
      notes,
      latitude: location?.latitude,
      longitude: location?.longitude,
      address: location?.address
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating episode:', error);
    throw error;
  }

  return {
    id: data.id,
    startTime: data.start_time,
    symptoms: data.symptoms || [],
    severity: data.severity || undefined,
    notes: data.notes || undefined,
    heartRateData: [],
    location: location
  };
}

export async function updateEpisode(episodeId: string, updates: Partial<Episode>): Promise<void> {
  const dbUpdates: any = {
    updated_at: new Date().toISOString()
  };

  if (updates.endTime) dbUpdates.end_time = updates.endTime;
  if (updates.symptoms) dbUpdates.symptoms = updates.symptoms;
  if (updates.severity !== undefined) dbUpdates.severity = updates.severity;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.audioNote !== undefined) dbUpdates.audio_note = updates.audioNote;

  const { error } = await supabase
    .from('episodes')
    .update(dbUpdates)
    .eq('id', episodeId);

  if (error) {
    console.error('Error updating episode:', error);
    throw error;
  }
}

export async function getSymptomLogsByPatientId(patientId: string): Promise<SymptomEntry[]> {
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('patient_id', patientId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching symptom logs:', error);
    throw error;
  }

  return data.map(log => ({
    id: log.id,
    timestamp: log.timestamp,
    symptoms: log.symptoms || [],
    severity: log.severity,
    notes: log.notes || undefined,
    timeOfDay: log.time_of_day || undefined,
    activityType: log.activity_type || undefined,
    otherDetails: log.other_details || undefined,
    audioNote: log.audio_note || undefined,
    heartRate: log.heart_rate || undefined,
    location: log.latitude && log.longitude ? {
      latitude: parseFloat(log.latitude),
      longitude: parseFloat(log.longitude),
      address: log.address || undefined
    } : undefined,
    episodeId: log.episode_id || undefined
  }));
}

export async function createSymptomLog(
  patientId: string,
  symptoms: string[],
  severity: number,
  notes?: string,
  timeOfDay?: string,
  activityType?: string,
  otherDetails?: string,
  heartRate?: number,
  location?: { latitude: number; longitude: number; address?: string },
  episodeId?: string
): Promise<SymptomEntry> {
  const { data, error } = await supabase
    .from('symptom_logs')
    .insert({
      patient_id: patientId,
      episode_id: episodeId,
      symptoms,
      severity,
      notes,
      time_of_day: timeOfDay,
      activity_type: activityType,
      other_details: otherDetails,
      heart_rate: heartRate,
      latitude: location?.latitude,
      longitude: location?.longitude,
      address: location?.address
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating symptom log:', error);
    throw error;
  }

  return {
    id: data.id,
    timestamp: data.timestamp,
    symptoms: data.symptoms || [],
    severity: data.severity,
    notes: data.notes || undefined,
    timeOfDay: data.time_of_day || undefined,
    activityType: data.activity_type || undefined,
    otherDetails: data.other_details || undefined,
    heartRate: data.heart_rate || undefined,
    location: location,
    episodeId: data.episode_id || undefined
  };
}
