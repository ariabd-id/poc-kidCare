import dayjs from 'dayjs';
import type { ClinicDatabase, Patient } from './types';
import { calculateAge, getNutritionStatus } from './clinic-utils';

const patients: Patient[] = [
  { id: 'p1', mrNumber: 'RM-2026-001', childName: 'Arka Pratama', gender: 'L', birthDate: '2024-08-12', bloodType: 'O', parentName: 'Dina Pratama', parentPhone: '0812-5550-1001', address: 'Jl. Melati 12, Jakarta', birthWeightGram: 3200, birthLengthCm: 49, birthHistory: 'Normal', allergies: 'Tidak ada' },
  { id: 'p2', mrNumber: 'RM-2026-002', childName: 'Nadhira Putri', gender: 'P', birthDate: '2023-04-21', bloodType: 'A', parentName: 'Rani Putri', parentPhone: '0813-5550-1002', address: 'Jl. Anggrek 8, Jakarta', birthWeightGram: 2980, birthLengthCm: 48, birthHistory: 'Caesar', allergies: 'Amoxicillin' },
  { id: 'p3', mrNumber: 'RM-2026-003', childName: 'Alesha Kirana', gender: 'P', birthDate: '2026-06-02', bloodType: 'B', parentName: 'Maya Kirana', parentPhone: '0814-5550-1003', address: 'Jl. Kenanga 21, Jakarta', birthWeightGram: 3050, birthLengthCm: 49, birthHistory: 'Normal', allergies: 'Protein susu sapi' },
  { id: 'p4', mrNumber: 'RM-2026-004', childName: 'Bima Mahendra', gender: 'L', birthDate: '2022-02-10', bloodType: 'O', parentName: 'Raka Mahendra', parentPhone: '0815-5550-1004', address: 'Jl. Flamboyan 4, Jakarta', birthWeightGram: 3400, birthLengthCm: 51, birthHistory: 'Normal', allergies: 'Tidak ada' },
  { id: 'p5', mrNumber: 'RM-2026-005', childName: 'Keisha Anindya', gender: 'P', birthDate: '2021-10-18', bloodType: 'AB', parentName: 'Sinta Anindya', parentPhone: '0816-5550-1005', address: 'Jl. Cempaka 17, Jakarta', birthWeightGram: 2700, birthLengthCm: 47, birthHistory: 'Prematur', allergies: 'Telur' },
];

export function makeDemoData(): ClinicDatabase {
  const today = dayjs().format('YYYY-MM-DD'); const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const growthRecords = patients.flatMap((patient, index) => [0, 1, 2].map((offset) => {
    const date = dayjs().subtract(2 - offset, 'month').format('YYYY-MM-DD'); const age = calculateAge(patient.birthDate, date); const ageMonths = age.years * 12 + age.months; const weightKg = Number((Math.max(4.8, ageMonths * .42 + 3.2) + index * .24 + offset * .15).toFixed(1));
    return { id: `g-${patient.id}-${offset}`, patientId: patient.id, date, ageInMonths: ageMonths, weightKg, heightCm: Number((52 + ageMonths * .72 + index).toFixed(1)), headCircumferenceCm: Number((35 + ageMonths * .18).toFixed(1)), nutritionStatus: getNutritionStatus(ageMonths, weightKg) };
  }));
  return {
    patients,
    appointments: [
      { id: 'a1', bookingCode: 'APT-2026-001', patientId: 'p1', appointmentDate: today, timeSlot: '09:00', serviceType: 'Imunisasi', doctorName: 'dr. Ratih Lestari, Sp.A', bookingSource: 'WhatsApp', status: 'TERJADWAL', notes: 'Vaksin PCV dosis lanjutan' },
      { id: 'a2', bookingCode: 'APT-2026-002', patientId: 'p2', appointmentDate: today, timeSlot: '10:30', serviceType: 'Poli Sakit', doctorName: 'dr. Ratih Lestari, Sp.A', bookingSource: 'Telepon', status: 'TERJADWAL', notes: 'Batuk pilek 3 hari' },
      { id: 'a3', bookingCode: 'APT-2026-003', patientId: 'p3', appointmentDate: today, timeSlot: '13:00', serviceType: 'Tumbuh Kembang', doctorName: 'dr. Ratih Lestari, Sp.A', bookingSource: 'Kontrol Dokter', status: 'CHECKED_IN', notes: 'Evaluasi kenaikan berat badan' },
      { id: 'a4', bookingCode: 'APT-2026-004', patientId: 'p5', appointmentDate: tomorrow, timeSlot: '09:30', serviceType: 'Imunisasi', doctorName: 'dr. Ratih Lestari, Sp.A', bookingSource: 'WhatsApp', status: 'TERJADWAL', notes: 'MR/MMR' },
    ],
    visits: [
      { id: 'v1', queueNumber: 'A-001', patientId: 'p4', visitDate: today, serviceType: 'Poli Sakit', doctorName: 'dr. Ratih Lestari, Sp.A', status: 'SIAP_DIPERIKSA', weightKg: 15.1, heightCm: 101, headCircumferenceCm: 50, temperatureC: 37.8, nutritionStatus: 'Gizi Baik', complaint: 'Demam sejak semalam', prescriptions: [] },
      { id: 'v2', queueNumber: 'A-002', patientId: 'p3', appointmentId: 'a3', visitDate: today, serviceType: 'Tumbuh Kembang', doctorName: 'dr. Ratih Lestari, Sp.A', status: 'TERDAFTAR', prescriptions: [] },
      { id: 'v3', queueNumber: 'A-003', patientId: 'p1', visitDate: today, serviceType: 'Imunisasi', doctorName: 'dr. Ratih Lestari, Sp.A', status: 'MENUNGGU_OBAT_BAYAR', weightKg: 11.2, heightCm: 83, headCircumferenceCm: 47, temperatureC: 36.7, nutritionStatus: 'Gizi Baik', complaint: 'Jadwal imunisasi', diagnosis: 'Kunjungan imunisasi', prescriptions: [{ id: 'rx1', medicineName: 'Vaksin Influenza', form: 'Vaksin', dosageInstruction: '1 dosis IM', price: 250000 }] },
      { id: 'v4', queueNumber: 'A-004', patientId: 'p5', visitDate: today, serviceType: 'Poli Sakit', doctorName: 'dr. Ratih Lestari, Sp.A', status: 'SELESAI', weightKg: 18.4, heightCm: 110, temperatureC: 36.8, nutritionStatus: 'Gizi Baik', complaint: 'Kontrol alergi', prescriptions: [] },
    ],
    growthRecords,
    immunizations: [{ id: 'i1', patientId: 'p1', vaccineName: 'BCG', dateGiven: '2024-09-20', batchNumber: 'BCG-2024-A11', doctorName: 'dr. Ratih Lestari, Sp.A' }, { id: 'i2', patientId: 'p3', vaccineName: 'Hepatitis B', dateGiven: '2026-06-02', batchNumber: 'HB-2026-K08', doctorName: 'dr. Ratih Lestari, Sp.A' }],
    invoices: [{ id: 'inv1', visitId: 'v3', patientId: 'p1', consultationFee: 250000, vaccineAndActionFee: 250000, medicineFee: 0, totalAmount: 500000, paymentStatus: 'BELUM_BAYAR' }, { id: 'inv2', visitId: 'v4', patientId: 'p5', consultationFee: 250000, vaccineAndActionFee: 0, medicineFee: 80000, totalAmount: 330000, paymentStatus: 'LUNAS', paymentMethod: 'QRIS' }],
  };
}
