import { ImageResponse } from 'next/og';

export const alt = 'Dashboard Tindak Lanjut Audit Universitas Syiah Kuala';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '80px',
        background: '#101827',
        color: '#fff'
      }}
    >
      <div style={{ fontSize: 26, color: '#93c5fd', letterSpacing: 3 }}>
        UNIVERSITAS SYIAH KUALA
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 72,
          fontWeight: 700,
          marginTop: 32,
          lineHeight: 1.15
        }}
      >
        <span style={{ display: 'flex' }}>Dashboard Tindak</span>
        <span style={{ display: 'flex' }}>Lanjut Audit</span>
      </div>
      <div style={{ fontSize: 30, color: '#cbd5e1', marginTop: 28 }}>
        Pemantauan temuan BPK dan KAP
      </div>
    </div>,
    size
  );
}
