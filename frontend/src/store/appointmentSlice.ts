import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  notes: string;
  doctorId: number | null;
  doctorName: string;
  status: string;
}

interface AppointmentState {
  appointments: Appointment[];
}

const initialState: AppointmentState = {
  appointments: [],
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
  },
});

export const { addAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
