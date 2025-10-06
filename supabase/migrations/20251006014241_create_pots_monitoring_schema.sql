/*
  # POTS Health Monitoring System - Database Schema

  ## Overview
  This migration creates the complete database schema for the POTS (Postural Orthostatic Tachycardia Syndrome) 
  health monitoring application. It supports patient tracking, clinician management, daily tests, symptom logging,
  and comprehensive health data collection.

  ## Tables Created

  ### 1. `clinicians`
  Stores clinician account information and authentication data
  - `id` (uuid, primary key) - Unique clinician identifier
  - `email` (text, unique) - Clinician login email
  - `full_name` (text) - Clinician's full name
  - `clinician_code` (text, unique) - Unique code for patient association
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `patients`
  Stores patient demographic and enrollment information
  - `id` (uuid, primary key) - Unique patient identifier
  - `clinician_id` (uuid, foreign key) - Associated clinician
  - `first_name` (text) - Patient's first name
  - `last_name` (text) - Patient's last name
  - `date_of_birth` (date) - Patient's date of birth
  - `sex_assigned_at_birth` (text) - Biological sex
  - `reason_for_use` (text) - Reason for using the app
  - `reason_for_use_other` (text, nullable) - Custom reason if "other" selected
  - `patient_code` (text, unique) - Unique patient enrollment code
  - `onboarding_complete` (boolean) - Whether patient completed onboarding
  - `device_connected` (boolean) - Whether heart rate device is connected
  - `location_enabled` (boolean) - Whether location tracking is enabled
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `medications`
  Stores patient medications
  - `id` (uuid, primary key) - Unique medication record identifier
  - `patient_id` (uuid, foreign key) - Associated patient
  - `name` (text) - Medication name
  - `category` (text) - Medication category
  - `custom_name` (text, nullable) - Custom medication name if not in predefined list
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `support_partners`
  Stores support partner (care team) information
  - `id` (uuid, primary key) - Unique support partner identifier
  - `patient_id` (uuid, foreign key) - Associated patient
  - `name` (text) - Partner's full name
  - `email` (text) - Partner's email address
  - `relationship` (text) - Relationship to patient
  - `permissions` (text[]) - Array of granted permissions
  - `invite_status` (text) - Status: pending, accepted, declined
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. `voss_responses`
  Stores VOSS (Vanderbilt Orthostatic Symptom Score) survey responses
  - `id` (uuid, primary key) - Unique response identifier
  - `patient_id` (uuid, foreign key) - Associated patient
  - `question_id` (text) - Question identifier
  - `value` (integer) - Numeric response value
  - `text_value` (text, nullable) - Text response if applicable
  - `response_type` (text) - Type: baseline or followup
  - `created_at` (timestamptz) - Response timestamp

  ### 6. `daily_tests`
  Stores daily orthostatic test sessions
  - `id` (uuid, primary key) - Unique test identifier
  - `patient_id` (uuid, foreign key) - Associated patient
  - `test_date` (date) - Date of test
  - `completed` (boolean) - Whether test was completed
  - `notes` (text, nullable) - Optional test notes
  - `created_at` (timestamptz) - Test creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 7. `heart_rate_readings`
  Stores individual heart rate measurements during tests
  - `id` (uuid, primary key) - Unique reading identifier
  - `daily_test_id` (uuid, foreign key) - Associated test session
  - `timestamp` (timestamptz) - Reading timestamp
  - `heart_rate` (integer) - Heart rate in BPM
  - `position` (text) - Body position: lying, sitting, or standing

  ### 8. `bp_readings`
  Stores blood pressure measurements during tests
  - `id` (uuid, primary key) - Unique reading identifier
  - `daily_test_id` (uuid, foreign key) - Associated test session
  - `timestamp` (timestamptz) - Reading timestamp
  - `systolic` (integer) - Systolic blood pressure
  - `diastolic` (integer) - Diastolic blood pressure
  - `position` (text) - Body position: lying or standing

  ### 9. `episodes`
  Stores symptom episode tracking (extended symptom events)
  - `id` (uuid, primary key) - Unique episode identifier
  - `patient_id` (uuid, foreign key) - Associated patient
  - `start_time` (timestamptz) - Episode start time
  - `end_time` (timestamptz, nullable) - Episode end time (null if ongoing)
  - `symptoms` (text[]) - Array of symptoms experienced
  - `severity` (integer, nullable) - Overall severity rating (1-10)
  - `notes` (text, nullable) - Episode notes
  - `audio_note` (text, nullable) - Audio recording reference/URL
  - `latitude` (numeric, nullable) - Location latitude
  - `longitude` (numeric, nullable) - Location longitude
  - `address` (text, nullable) - Resolved address
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 10. `episode_heart_rate_data`
  Stores heart rate data during episodes
  - `id` (uuid, primary key) - Unique reading identifier
  - `episode_id` (uuid, foreign key) - Associated episode
  - `timestamp` (timestamptz) - Reading timestamp
  - `heart_rate` (integer) - Heart rate in BPM
  - `position` (text) - Body position: lying, sitting, or standing

  ### 11. `symptom_logs`
  Stores individual symptom log entries (quick logs, not full episodes)
  - `id` (uuid, primary key) - Unique log identifier
  - `patient_id` (uuid, foreign key) - Associated patient
  - `episode_id` (uuid, foreign key, nullable) - Associated episode if part of one
  - `timestamp` (timestamptz) - Log timestamp
  - `symptoms` (text[]) - Array of symptoms
  - `severity` (integer) - Severity rating (1-10)
  - `notes` (text, nullable) - Optional notes
  - `time_of_day` (text, nullable) - Time context (morning, afternoon, etc.)
  - `activity_type` (text, nullable) - Activity being performed
  - `other_details` (text, nullable) - Additional details
  - `audio_note` (text, nullable) - Audio recording reference/URL
  - `heart_rate` (integer, nullable) - Heart rate at time of symptom
  - `latitude` (numeric, nullable) - Location latitude
  - `longitude` (numeric, nullable) - Location longitude
  - `address` (text, nullable) - Resolved address

  ## Security

  All tables have Row Level Security (RLS) enabled with appropriate policies:
  - Clinicians can only access their own data and their patients' data
  - Patients can only access their own data
  - Support partners can view patient data based on permissions granted

  ## Indexes

  Performance indexes are created on:
  - Foreign key relationships
  - Frequently queried fields (patient_code, clinician_code, test_date)
  - Timestamp fields for time-based queries
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLINICIANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS clinicians (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  clinician_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clinicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view own data"
  ON clinicians FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Clinicians can update own data"
  ON clinicians FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- PATIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinician_id uuid REFERENCES clinicians(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  sex_assigned_at_birth text NOT NULL CHECK (sex_assigned_at_birth IN ('female', 'male', 'prefer-not-to-say')),
  reason_for_use text NOT NULL CHECK (reason_for_use IN ('doctor-referral', 'suspect-pots', 'other')),
  reason_for_use_other text,
  patient_code text UNIQUE NOT NULL,
  onboarding_complete boolean DEFAULT false,
  device_connected boolean DEFAULT false,
  location_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own data"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can update own data"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Clinicians can view their patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.id = patients.clinician_id
      AND clinicians.id = auth.uid()
    )
  );

-- Index for faster patient lookups
CREATE INDEX IF NOT EXISTS idx_patients_clinician_id ON patients(clinician_id);
CREATE INDEX IF NOT EXISTS idx_patients_patient_code ON patients(patient_code);

-- =====================================================
-- MEDICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('beta-blocker', 'midodrine', 'fludrocortisone', 'ssri-snri', 'other')),
  custom_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = medications.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can manage own medications"
  ON medications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = medications.patient_id
      AND patients.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = medications.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient medications"
  ON medications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE patients.id = medications.patient_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);

-- =====================================================
-- SUPPORT PARTNERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS support_partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  relationship text NOT NULL,
  permissions text[] DEFAULT '{}',
  invite_status text DEFAULT 'pending' CHECK (invite_status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE support_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can manage own support partners"
  ON support_partners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = support_partners.patient_id
      AND patients.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = support_partners.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_support_partners_patient_id ON support_partners(patient_id);

-- =====================================================
-- VOSS RESPONSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS voss_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  question_id text NOT NULL,
  value integer NOT NULL,
  text_value text,
  response_type text NOT NULL CHECK (response_type IN ('baseline', 'followup')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voss_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own VOSS responses"
  ON voss_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = voss_responses.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can insert own VOSS responses"
  ON voss_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = voss_responses.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient VOSS responses"
  ON voss_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE patients.id = voss_responses.patient_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_voss_responses_patient_id ON voss_responses(patient_id);
CREATE INDEX IF NOT EXISTS idx_voss_responses_type ON voss_responses(response_type);

-- =====================================================
-- DAILY TESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_tests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  test_date date NOT NULL,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own daily tests"
  ON daily_tests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = daily_tests.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can manage own daily tests"
  ON daily_tests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = daily_tests.patient_id
      AND patients.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = daily_tests.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient daily tests"
  ON daily_tests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE patients.id = daily_tests.patient_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_daily_tests_patient_id ON daily_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_daily_tests_date ON daily_tests(test_date);

-- =====================================================
-- HEART RATE READINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS heart_rate_readings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_test_id uuid REFERENCES daily_tests(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz NOT NULL,
  heart_rate integer NOT NULL,
  position text NOT NULL CHECK (position IN ('lying', 'sitting', 'standing'))
);

ALTER TABLE heart_rate_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own heart rate readings"
  ON heart_rate_readings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_tests
      JOIN patients ON patients.id = daily_tests.patient_id
      WHERE daily_tests.id = heart_rate_readings.daily_test_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can insert own heart rate readings"
  ON heart_rate_readings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_tests
      JOIN patients ON patients.id = daily_tests.patient_id
      WHERE daily_tests.id = heart_rate_readings.daily_test_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient heart rate readings"
  ON heart_rate_readings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_tests
      JOIN patients ON patients.id = daily_tests.patient_id
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE daily_tests.id = heart_rate_readings.daily_test_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_heart_rate_readings_test_id ON heart_rate_readings(daily_test_id);
CREATE INDEX IF NOT EXISTS idx_heart_rate_readings_timestamp ON heart_rate_readings(timestamp);

-- =====================================================
-- BP READINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bp_readings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_test_id uuid REFERENCES daily_tests(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz NOT NULL,
  systolic integer NOT NULL,
  diastolic integer NOT NULL,
  position text NOT NULL CHECK (position IN ('lying', 'standing'))
);

ALTER TABLE bp_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own BP readings"
  ON bp_readings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_tests
      JOIN patients ON patients.id = daily_tests.patient_id
      WHERE daily_tests.id = bp_readings.daily_test_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can insert own BP readings"
  ON bp_readings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_tests
      JOIN patients ON patients.id = daily_tests.patient_id
      WHERE daily_tests.id = bp_readings.daily_test_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient BP readings"
  ON bp_readings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_tests
      JOIN patients ON patients.id = daily_tests.patient_id
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE daily_tests.id = bp_readings.daily_test_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_bp_readings_test_id ON bp_readings(daily_test_id);

-- =====================================================
-- EPISODES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  symptoms text[] DEFAULT '{}',
  severity integer CHECK (severity >= 1 AND severity <= 10),
  notes text,
  audio_note text,
  latitude numeric,
  longitude numeric,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = episodes.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can manage own episodes"
  ON episodes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = episodes.patient_id
      AND patients.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = episodes.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE patients.id = episodes.patient_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_episodes_patient_id ON episodes(patient_id);
CREATE INDEX IF NOT EXISTS idx_episodes_start_time ON episodes(start_time);

-- =====================================================
-- EPISODE HEART RATE DATA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS episode_heart_rate_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz NOT NULL,
  heart_rate integer NOT NULL,
  position text NOT NULL CHECK (position IN ('lying', 'sitting', 'standing'))
);

ALTER TABLE episode_heart_rate_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own episode heart rate data"
  ON episode_heart_rate_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM episodes
      JOIN patients ON patients.id = episodes.patient_id
      WHERE episodes.id = episode_heart_rate_data.episode_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can insert own episode heart rate data"
  ON episode_heart_rate_data FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM episodes
      JOIN patients ON patients.id = episodes.patient_id
      WHERE episodes.id = episode_heart_rate_data.episode_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient episode heart rate data"
  ON episode_heart_rate_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM episodes
      JOIN patients ON patients.id = episodes.patient_id
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE episodes.id = episode_heart_rate_data.episode_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_episode_hr_episode_id ON episode_heart_rate_data(episode_id);

-- =====================================================
-- SYMPTOM LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS symptom_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  episode_id uuid REFERENCES episodes(id) ON DELETE SET NULL,
  timestamp timestamptz DEFAULT now(),
  symptoms text[] DEFAULT '{}',
  severity integer NOT NULL CHECK (severity >= 1 AND severity <= 10),
  notes text,
  time_of_day text,
  activity_type text,
  other_details text,
  audio_note text,
  heart_rate integer,
  latitude numeric,
  longitude numeric,
  address text
);

ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own symptom logs"
  ON symptom_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = symptom_logs.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Patients can manage own symptom logs"
  ON symptom_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = symptom_logs.patient_id
      AND patients.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = symptom_logs.patient_id
      AND patients.id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can view patient symptom logs"
  ON symptom_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      JOIN clinicians ON clinicians.id = patients.clinician_id
      WHERE patients.id = symptom_logs.patient_id
      AND clinicians.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_symptom_logs_patient_id ON symptom_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_timestamp ON symptom_logs(timestamp);