import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';

export const metadata: Metadata = { title: 'KidCare Clinic', description: 'PoC Klinik Spesialis Anak' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id" suppressHydrationWarning><body suppressHydrationWarning><AntdRegistry>{children}</AntdRegistry></body></html>; }
