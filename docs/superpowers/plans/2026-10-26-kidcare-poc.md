# KidCare Clinic PoC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a presentation-ready, browser-only pediatric clinic workspace that completes booking through payment.

**Architecture:** Next.js App Router renders one mounted client workspace. A `ClinicProvider` owns seeded clinic data and all localStorage-backed mutations. Feature panels use provider actions and share focused modal/drawer components for workflow handoffs.

**Tech Stack:** Next.js, React, TypeScript, Ant Design, `@ant-design/icons`, `dayjs`, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-26-kidcare-poc-design.md`

## Global Constraints

- Use browser key `kidcare_poc_db_v1`; access it only after client mount.
- Use Ant Design plus `@ant-design/icons` and `dayjs`.
- Seed five fictional children, scheduled appointments, queue entries, growth records, vaccine records, and invoices.
- Do not make diagnosis or dosage output look like clinical advice; label PoC calculations for clinician verification.
- Role switcher simulates access only; it is not security.
- Primary actions must work, validate required input, and persist after refresh.
- Support desktop and 390px mobile layout with keyboard-visible focus states.
- This folder has no Git repository. Do not run commit commands.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `package.json` | App scripts and dependencies |
| `app/layout.tsx` | Metadata, fonts, Ant Design registry/provider setup |
| `app/page.tsx` | Client entry point and workspace shell |
| `app/globals.css` | Design tokens, responsive layout, focus styles |
| `lib/types.ts` | Clinic domain types |
| `lib/clinic-utils.ts` | Pure age, nutrition, dosage, money, and queue helpers |
| `lib/demo-data.ts` | Repeatable fictional database seed |
| `lib/clinic-store.tsx` | Context, persistence lifecycle, and domain commands |
| `components/clinic-shell.tsx` | Header, responsive navigation, role gating, routed feature body |
| `components/dashboard.tsx` | Daily metrics and operational lists |
| `components/appointments.tsx` | Booking table and appointment form |
| `components/queue-triage.tsx` | Queue list, walk-in creation, triage form |
| `components/patients.tsx` | Child profile list and patient registration |
| `components/doctor-workspace.tsx` | SOAP, dose assistant, prescription, control, and vaccine workflow |
| `components/kms-immunization.tsx` | Growth history/chart and immunization tracker |
| `components/cashier.tsx` | Invoice handling and payment completion |
| `tests/clinic-utils.test.ts` | Pure calculation tests |
| `tests/clinic-store.test.tsx` | Persistence and domain transition tests |

### Task 1: Bootstrap Next.js and design system

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm test` and root app render.

- [ ] **Step 1: Create package configuration**

```json
{
  "scripts": { "dev": "next dev", "build": "next build", "test": "vitest run" },
  "dependencies": { "@ant-design/icons": "latest", "antd": "latest", "dayjs": "latest", "next": "latest", "react": "latest", "react-dom": "latest" },
  "devDependencies": { "@testing-library/react": "latest", "@types/node": "latest", "@types/react": "latest", "typescript": "latest", "vitest": "latest" }
}
```

- [ ] **Step 2: Implement root layout and CSS tokens**

```css
:root { --ink: #24332b; --paper: #fffaf0; --mint: #2b9f7a; --coral: #d96750; }
*:focus-visible { outline: 3px solid #f2b15d; outline-offset: 3px; }
```

- [ ] **Step 3: Add Ant Design `ConfigProvider` with `colorPrimary: '#2B9F7A'` and create client root page**

- [ ] **Step 4: Run build**

Run: `rtk npm run build`

Expected: successful production build.

### Task 2: Create domain types, helpers, and tests

**Files:**
- Create: `lib/types.ts`, `lib/clinic-utils.ts`, `tests/clinic-utils.test.ts`

**Interfaces:**
- Produces: `calculateAge`, `getNutritionStatus`, `calculateDoseRange`, `formatRupiah`, `nextQueueNumber`.
- Consumes: none.

- [ ] **Step 1: Write failing helper tests**

```ts
expect(calculateAge('2024-06-01', '2026-10-26')).toEqual({ years: 2, months: 4 });
expect(calculateDoseRange('Paracetamol', 12)).toEqual({ minMg: 120, maxMg: 180, label: 'per dosis' });
expect(nextQueueNumber(['A-001', 'A-009'])).toBe('A-010');
```

- [ ] **Step 2: Run test and confirm failure**

Run: `rtk npm test -- tests/clinic-utils.test.ts`

Expected: failure because module does not exist.

- [ ] **Step 3: Define PRD interfaces and implement pure helpers**

```ts
export function calculateDoseRange(medicine: 'Paracetamol' | 'Amoxicillin', weightKg: number) {
  const [min, max, label] = medicine === 'Paracetamol' ? [10, 15, 'per dosis'] : [20, 40, 'per hari'];
  return { minMg: min * weightKg, maxMg: max * weightKg, label };
}
```

- [ ] **Step 4: Run tests**

Run: `rtk npm test -- tests/clinic-utils.test.ts`

Expected: all helper assertions pass.

### Task 3: Seed database and localStorage clinic provider

**Files:**
- Create: `lib/demo-data.ts`, `lib/clinic-store.tsx`, `tests/clinic-store.test.tsx`

**Interfaces:**
- Consumes: `ClinicDatabase`, helper functions.
- Produces: `ClinicProvider`, `useClinic`, `resetDemoData`, `createAppointment`, `checkInAppointment`, `createWalkIn`, `saveTriage`, `saveExamination`, `settleInvoice`, `addPatient`.

- [ ] **Step 1: Write failing state transition tests**

```tsx
expect(result.current.db.patients).toHaveLength(5);
act(() => result.current.checkInAppointment('apt-1'));
expect(result.current.db.appointments[0].status).toBe('CHECKED_IN');
expect(result.current.db.visits.at(-1)?.status).toBe('TERDAFTAR');
```

- [ ] **Step 2: Run state test and confirm failure**

Run: `rtk npm test -- tests/clinic-store.test.tsx`

Expected: failure because provider module does not exist.

- [ ] **Step 3: Add deterministic five-child seed database**

Include 4 appointments across today/tomorrow, 4 visits with distinct statuses, three growth records per child, IDAI vaccine history, and invoices.

- [ ] **Step 4: Implement mounted persistence lifecycle and domain commands**

```tsx
useEffect(() => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  setDb(raw ? JSON.parse(raw) : makeDemoData());
  setMounted(true);
}, []);
useEffect(() => { if (mounted && db) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }, [db, mounted]);
```

- [ ] **Step 5: Run state tests**

Run: `rtk npm test -- tests/clinic-store.test.tsx`

Expected: seed, check-in, triage, examination, payment, and reset transitions pass.

### Task 4: Build shell, role switcher, and dashboard

**Files:**
- Create: `components/clinic-shell.tsx`, `components/dashboard.tsx`
- Modify: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `useClinic`.
- Produces: selected feature state and role-filtered menu.

- [ ] **Step 1: Build app shell with seven required menus and header actions**

Use `Layout`, `Menu`, `Select`, `Button`, and responsive `Drawer`. Header must show role selector, appointment shortcut, and reset button.

- [ ] **Step 2: Build dashboard metrics and live action tables**

Use four `Statistic` cards and tables for today appointments and active visits. The dashboard check-in button calls `checkInAppointment`.

- [ ] **Step 3: Add responsive CSS**

```css
@media (max-width: 720px) { .clinic-sider { display: none; } .clinic-content { padding: 16px; } .metric-grid { grid-template-columns: 1fr 1fr; } }
```

- [ ] **Step 4: Run build and inspect dashboard in browser at desktop and 390px**

Run: `rtk npm run build`

Expected: no compile error; all controls can be focused and mobile has no horizontal overflow.

### Task 5: Implement appointment booking and patient registration

**Files:**
- Create: `components/appointments.tsx`, `components/patients.tsx`
- Modify: `components/clinic-shell.tsx`

**Interfaces:**
- Consumes: `createAppointment`, `checkInAppointment`, `addPatient`, patient data.
- Produces: schedule booking and child profile views.

- [ ] **Step 1: Create appointment table with date/status filters and one-click check-in**

Disable check-in unless `status === 'TERJADWAL'`; show success feedback after the provider command finishes.

- [ ] **Step 2: Add booking modal form with required fields**

```tsx
<Form onFinish={values => createAppointment({ ...values, appointmentDate: values.appointmentDate.format('YYYY-MM-DD') })}>
  <Form.Item name="patientId" rules={[{ required: true }]}><Select /></Form.Item>
  <Form.Item name="timeSlot" rules={[{ required: true }]}><Select options={slots} /></Form.Item>
</Form>
```

- [ ] **Step 3: Add patient search/profile and registration modal**

Registration requires child identity, birth date, guardian contact, birth measurements, birth history, and allergies. Generate MR number in provider.

- [ ] **Step 4: Run build and test booking/check-in manually**

Run: `rtk npm run build`

Expected: new booking survives refresh; one click generates a visit exactly once.

### Task 6: Implement queue, walk-in, and triage

**Files:**
- Create: `components/queue-triage.tsx`
- Modify: `components/clinic-shell.tsx`

**Interfaces:**
- Consumes: `createWalkIn`, `saveTriage`, `getNutritionStatus`.
- Produces: triage-complete `SIAP_DIPERIKSA` visit.

- [ ] **Step 1: Build queue table with status tags and patient context**

- [ ] **Step 2: Add walk-in modal**

Require patient, service, and doctor. Generate queue ticket through provider.

- [ ] **Step 3: Add triage drawer with live nutrition calculation**

```tsx
const status = getNutritionStatus(ageInMonths, Number(weightKg));
await form.validateFields();
saveTriage(visit.id, { weightKg, heightCm, headCircumferenceCm, temperatureC, complaint, nutritionStatus: status });
```

- [ ] **Step 4: Run build and manually verify status change**

Run: `rtk npm run build`

Expected: triage turns `TERDAFTAR` into `SIAP_DIPERIKSA` and stores measurements.

### Task 7: Implement doctor EMR, dose reference, growth, vaccine, and follow-up

**Files:**
- Create: `components/doctor-workspace.tsx`
- Modify: `components/clinic-shell.tsx`, `lib/clinic-store.tsx`

**Interfaces:**
- Consumes: `saveExamination`, `calculateDoseRange`, patient growth and vaccine data.
- Produces: invoice-ready visit, optional follow-up appointment, growth/vaccine record.

- [ ] **Step 1: Create doctor drawer with SOAP, Growth, and Immunization tabs**

- [ ] **Step 2: Add weight-based dose reference panel**

For Paracetamol and Amoxicillin show calculated mg range; label “Referensi PoC, verifikasi dokter sebelum pemberian”. Cetirizine shows age/weight reference warning.

- [ ] **Step 3: Add dynamic prescription rows and optional control booking**

```tsx
const prescription = { id: crypto.randomUUID(), medicineName, form, dosageInstruction, price: Number(price) };
```

- [ ] **Step 4: Save examination atomically**

Save required diagnosis, SOAP notes, prescriptions, optional vaccine, optional next appointment, growth measurement, invoice, and new visit status in one provider command.

- [ ] **Step 5: Run build and manually complete examination**

Run: `rtk npm run build`

Expected: visit moves to `MENUNGGU_OBAT_BAYAR`; invoice appears; records persist after refresh.

### Task 8: Implement KMS/immunization and cashier

**Files:**
- Create: `components/kms-immunization.tsx`, `components/cashier.tsx`
- Modify: `components/clinic-shell.tsx`

**Interfaces:**
- Consumes: clinic data, `settleInvoice`, `formatRupiah`.
- Produces: complete payment workflow.

- [ ] **Step 1: Build KMS patient selector, growth table, and responsive progress visualization**

Use Ant Design `Progress` and history table. Do not imply medical percentile accuracy; show recorded values and PoC nutrition labels.

- [ ] **Step 2: Build vaccine checklist/history**

Show mandatory IDAI names: Hepatitis B, BCG, Polio, DPT-HB-Hib, PCV, Rotavirus, Influenza, and MR/MMR. Recorded vaccines include date, batch, doctor, and KIPI note.

- [ ] **Step 3: Build cashier invoice table and payment modal**

```tsx
<Form.Item name="paymentMethod" rules={[{ required: true }]}>
  <Radio.Group options={['Tunai', 'QRIS', 'Debit']} />
</Form.Item>
```

- [ ] **Step 4: Mark invoice paid and visit finished**

Call `settleInvoice(invoice.id, paymentMethod)`, show message, then render printable receipt preview.

- [ ] **Step 5: Run build and settle invoice manually**

Run: `rtk npm run build`

Expected: paid invoice and visit remain complete after refresh.

### Task 9: Run visual QA and workflow verification

**Files:**
- Modify: any component or CSS file requiring corrections.

**Interfaces:**
- Consumes: completed application.
- Produces: verified final UI.

- [ ] **Step 1: Generate primary desktop and mobile visual concepts with Image Gen**

Use design specification colors, density, shell, header, dashboard, and pediatric identity as exact concept source.

- [ ] **Step 2: Run app and inspect browser flows**

Run: `rtk npm run dev`

Verify: reset, create booking, check-in, walk-in, triage, examination, follow-up, vaccine, invoice payment, role switching.

- [ ] **Step 3: Capture desktop and 390px screenshots**

Compare both screenshots against approved concept. Correct layout, typography, spacing, color, interaction, and overflow differences.

- [ ] **Step 4: Run automated verification**

Run: `rtk npm test && rtk npm run build`

Expected: test suite and production build exit with code 0.

## Plan self-review

- Spec coverage: Tasks 1-8 map every required PRD area; Task 9 covers visual and workflow quality.
- Placeholder scan: no `TBD`, `TODO`, or deferred implementation text remains.
- Type consistency: data interfaces originate in Task 2, helpers in Task 2, provider actions in Task 3, and each component consumes those names unchanged.
