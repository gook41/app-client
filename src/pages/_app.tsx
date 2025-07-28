// filepath: c:\WorkSpace\gook41.org\app-client\src\pages\_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}