export type VisitStatus = 'TERDAFTAR' | 'SIAP_DIPERIKSA' | 'SEDANG_DIPERIKSA' | 'MENUNGGU_OBAT_BAYAR' | 'SELESAI' | 'DIBATALKAN';
export type AppointmentStatus = 'TERJADWAL' | 'CHECKED_IN' | 'SELESAI' | 'BATAL';
export type ServiceType = 'Poli Sakit' | 'Imunisasi' | 'Tumbuh Kembang';

export interface Patient { id: string; mrNumber: string; childName: string; gender: 'L' | 'P'; birthDate: string; bloodType: string; parentName: string; parentPhone: string; address: string; birthWeightGram: number; birthLengthCm: number; birthHistory: 'Normal' | 'Caesar' | 'Prematur'; allergies: string; }
export interface Appointment { id: string; bookingCode: string; patientId: string; appointmentDate: string; timeSlot: string; serviceType: ServiceType; doctorName: string; bookingSource: 'WhatsApp' | 'Telepon' | 'Aplikasi/Web' | 'Kontrol Dokter'; status: AppointmentStatus; notes: string; }
export interface GrowthRecord { id: string; patientId: string; date: string; ageInMonths: number; weightKg: number; heightCm: number; headCircumferenceCm: number; nutritionStatus: 'Gizi Baik' | 'Gizi Kurang' | 'Risiko Gizi Lebih'; }
export interface ImmunizationRecord { id: string; patientId: string; vaccineName: string; dateGiven: string; batchNumber: string; doctorName: string; notes?: string; }
export interface PrescriptionItem { id: string; medicineName: string; form: 'Sirup' | 'Puyer' | 'Drop' | 'Vaksin'; dosageInstruction: string; price: number; }
export interface Visit { id: string; queueNumber: string; patientId: string; appointmentId?: string; visitDate: string; serviceType: ServiceType; doctorName: string; status: VisitStatus; weightKg?: number; heightCm?: number; headCircumferenceCm?: number; temperatureC?: number; nutritionStatus?: GrowthRecord['nutritionStatus']; complaint?: string; physicalExam?: string; diagnosis?: string; treatmentNotes?: string; prescriptions: PrescriptionItem[]; }
export interface Invoice { id: string; visitId: string; patientId: string; consultationFee: number; vaccineAndActionFee: number; medicineFee: number; totalAmount: number; paymentStatus: 'BELUM_BAYAR' | 'LUNAS'; paymentMethod?: 'Tunai' | 'QRIS' | 'Debit' | 'Asuransi'; }
export interface ClinicDatabase { patients: Patient[]; appointments: Appointment[]; visits: Visit[]; growthRecords: GrowthRecord[]; immunizations: ImmunizationRecord[]; invoices: Invoice[]; }
