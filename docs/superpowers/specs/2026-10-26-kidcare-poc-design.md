# KidCare Clinic PoC: Design Specification

## Scope

Build a client-only pediatric clinic application with Next.js App Router, TypeScript, Ant Design, and browser `localStorage`. The product demonstrates the full clinic handoff: appointment booking, check-in, nurse triage, doctor examination, pharmacy, payment, growth tracking, and immunization history. It is not a production clinical system and makes no clinical diagnosis beyond the explicitly specified demonstration calculations.

## Product boundaries

- Data stays in browser key `kidcare_poc_db_v1`.
- First client render reads or seeds five realistic but fictional patients.
- Reset restores only PoC data.
- No authentication, network API, printing integration, or multi-user synchronization.
- Role switcher controls menu access and provides a presentation-friendly simulation; it does not provide security.

## User experience and visual direction

The interface is a warm, data-dense pediatric clinic workspace. Cream surfaces reduce harshness in long operational use; mint identifies clinical action and coral appears only for urgent or outstanding states. A friendly display face titles sections, while a highly legible sans-serif supports records and tabular data. Layout follows clinic work, not generic dashboard patterns: a fixed working sidebar, utility header, compact metrics, actionable lists, and focused task drawers.

Visual choices have explicit purpose:

- Soft cream background and restrained rounded corners make child-care context welcoming without hiding data density.
- Mint is reserved for successful clinical progress and primary completion actions.
- Coral marks attention states such as waiting, unpaid, or allergies.
- Table-first operational pages keep the next staff action visible.
- On narrow screens, navigation moves into a drawer and records become stacked summaries with large tap targets.

## Architecture

`app/page.tsx` renders a mounted client application inside an Ant Design provider. A clinic context owns database state, persists changes after mounting, and exposes domain actions. Feature views consume this context without accessing `localStorage` themselves.

```text
app/page.tsx
  ClinicProvider
    App shell
      Dashboard
      Appointments
      Queue and triage
      Patients
      Doctor workspace
      KMS and immunizations
      Pharmacy and cashier

lib/types.ts       Domain interfaces and status unions
lib/demo-data.ts   Deterministic seed database
lib/clinic-store.tsx  Persistence, derived values, domain actions
lib/clinic-utils.ts   Age, nutrition, currency, queue, dosage helpers
```

## Domain data and state

The database follows PRD interfaces: patients, appointments, visits, growth records, immunizations, and invoices. Each context mutation produces a new database object and persists it to `localStorage` once mounted.

Domain actions:

- `addPatient` creates an RM number.
- `createAppointment` saves a booking with selected patient, service, doctor, slot, and source.
- `checkInAppointment` changes appointment to `CHECKED_IN` and creates one `TERDAFTAR` visit.
- `createWalkIn` creates a new visit and queue ticket.
- `saveTriage` records anthropometry, complaint, nutrition status, and makes visit `SIAP_DIPERIKSA`.
- `saveExamination` stores SOAP and prescriptions, adds optional growth or immunization records, creates an invoice, and moves visit to `MENUNGGU_OBAT_BAYAR`.
- `settleInvoice` marks invoice paid and visit complete.
- `resetDemoData` restores the seeded database.

Invalid actions are blocked: an appointment cannot check in twice; triage requires values; doctor save requires diagnosis; payment requires an invoice.

## Screens and flow

| Surface | Primary purpose | Actions |
| --- | --- | --- |
| Dashboard | Daily operational overview | Check in booked child; jump to patient work |
| Appointment | Book and manage scheduled arrivals | Filter, create booking, one-click check-in |
| Queue and triage | Register arrivals and capture measurements | Add walk-in; save triage |
| Patients | Search child profile and birth history | Add patient; view allergies, records |
| Doctor EMR | Complete examination | SOAP, weight-based dose guide, prescriptions, follow-up, vaccine record |
| KMS and immunization | Review longitudinal care | Growth chart/table and vaccine checklist/history |
| Pharmacy and cashier | Prepare medication and settle bill | View invoice, choose payment method, mark paid |

The user path is booking or walk-in, triage, examination, invoice, then payment. Deep links between queue, patient profile, EMR, and cashier preserve the selected child.

## Pediatric calculations

Age is calculated from date of birth in years and months. Nutrition classification is a clearly labelled PoC heuristic based on weight relative to age bands, never a clinical diagnosis. The EMR dose helper shows:

- Paracetamol: 10-15 mg/kg per dose.
- Amoxicillin: 20-40 mg/kg/day, divided into three doses.
- Cetirizine: age and weight guidance label.

The UI labels all dosage output as a reference for clinician verification.

## Quality and test plan

- Unit-test data helpers: age, nutrition status, queue numbering, dose calculations, invoice totals.
- Build and TypeScript check before handoff.
- Browser test key paths: seed, create appointment, check-in, triage, doctor save, payment, reset.
- Verify role switcher changes available navigation.
- Test desktop and 390px-width mobile layout.
- Verify keyboard focus and Ant Design form validation.

## Delivery definition

The app starts without hydration errors, seeds only after client mount, survives refresh through browser storage, and allows every PRD workflow to complete. The final pass compares generated visual concept with browser screenshots on desktop and mobile, then corrects mismatches.
