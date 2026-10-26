export function calculateAge(birthDate: string, asOf = new Date().toISOString().slice(0, 10)) {
  const birth = new Date(`${birthDate}T00:00:00`); const date = new Date(`${asOf}T00:00:00`);
  let months = date.getMonth() - birth.getMonth(); let years = date.getFullYear() - birth.getFullYear();
  if (date.getDate() < birth.getDate()) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  return { years, months };
}
export function getNutritionStatus(ageInMonths: number, weightKg: number): 'Gizi Baik' | 'Gizi Kurang' | 'Risiko Gizi Lebih' {
  const reference = Math.max(3.5, ageInMonths * 0.42 + 3.4);
  if (weightKg < reference * 0.78) return 'Gizi Kurang';
  if (weightKg > reference * 1.3) return 'Risiko Gizi Lebih';
  return 'Gizi Baik';
}
export function calculateDoseRange(medicine: 'Paracetamol' | 'Amoxicillin', weightKg: number) {
  const [min, max, label] = medicine === 'Paracetamol' ? [10, 15, 'per dosis'] : [20, 40, 'per hari'];
  return { minMg: min * weightKg, maxMg: max * weightKg, label };
}
export const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
export function nextQueueNumber(numbers: string[]) { const highest = numbers.reduce((max, item) => Math.max(max, Number(item.split('-')[1]) || 0), 0); return `A-${String(highest + 1).padStart(3, '0')}`; }
