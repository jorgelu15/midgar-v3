import { useState } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

type Periodo = 'diario' | 'mensual' | 'trimestral' | 'anual';

interface DiarioData {
  dia: string;
  ventas: number;
}

interface MensualData {
  mes: string;
  ventas: number;
}

interface TrimestralData {
  trimestre: string;
  ventas2023: number;
  ventas2024: number;
}

interface AnualData {
  anio: string;
  ventas: number;
}

const data: Record<Periodo, any[]> = {
  diario: Array.from({ length: 30 }, (_, i) => ({
    dia: (i + 1).toString().padStart(2, '0'),
    ventas: Math.floor(90000 + Math.random() * 50000)
  })) as DiarioData[],

  mensual: [
    { mes: 'Ene', ventas: 2400000 },
    { mes: 'Feb', ventas: 2800000 },
    { mes: 'Mar', ventas: 3100000 },
    { mes: 'Abr', ventas: 2950000 },
    { mes: 'May', ventas: 3200000 },
    { mes: 'Jun', ventas: 3000000 },
    { mes: 'Jul', ventas: 3450000 }
  ] as MensualData[],

  trimestral: [
    { trimestre: 'Q1', ventas2023: 8100000, ventas2024: 8500000 },
    { trimestre: 'Q2', ventas2023: 9100000, ventas2024: 9200000 },
    { trimestre: 'Q3', ventas2023: 9500000, ventas2024: 9800000 }
  ] as TrimestralData[],

  anual: [
    { anio: '2021', ventas: 24000000 },
    { anio: '2022', ventas: 26000000 },
    { anio: '2023', ventas: 28000000 },
    { anio: '2024', ventas: 30000000 }
  ] as AnualData[]
};




const VentasPorPeriodo: React.FC = () => {
  const [periodo, setPeriodo] = useState<Periodo>('diario');

  const chartContent = (() => {
    if (periodo === 'diario') {
      return (
        <LineChart data={data.diario as DiarioData[]} >
          <CartesianGrid strokeDasharray="3 3" stroke='var(--secondary)' />
          <XAxis dataKey="dia" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
          <YAxis width={80} stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              color: "var(--text-muted)",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.85rem",
            }}
          />
          <Line type="monotone" dataKey="ventas" stroke="var(--primary)" />
        </LineChart>
      );
    }

    if (periodo === 'mensual') {
      return (
        <BarChart data={data.mensual as MensualData[]}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)" />
          <XAxis stroke="var(--text-muted)" dataKey="mes" tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--text-muted)" width={80} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              color: "var(--text-muted)",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.85rem",
            }}
          />
          <Bar dataKey="ventas" fill="var(--secondary)" />
        </BarChart>
      );
    }

    if (periodo === 'trimestral') {
      return (
        <BarChart data={data.trimestral as TrimestralData[]}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)" />
          <XAxis dataKey="trimestre" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              color: "var(--text-muted)",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.85rem",
            }}
          />
          <Legend />
          <Bar dataKey="ventas2023" fill="var(--info)" name="2023" />
          <Bar dataKey="ventas2024" fill="var(--primary)" name="2024" />
        </BarChart>
      );
    }

    return (
      <LineChart data={data.anual as AnualData[]}>
        <CartesianGrid strokeDasharray="3 3"  stroke="var(--secondary)" />
        <XAxis dataKey="anio" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fontSize: 12 }}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            color: "var(--text-muted)",
            borderRadius: "6px",
            border: "none",
            fontSize: "0.85rem",
          }}
        />
        <Line type="monotone" dataKey="ventas" stroke="var(--primary)" />
      </LineChart>
    );
  })();

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    border: 'none',
    background: active ? 'var(--background)' : 'var(--secondary)',
    color: active ? 'var(--text-muted)' : 'var(--text-muted)',
    fontWeight: 'bold',
    borderRadius: 5,
    cursor: 'pointer'
  });

  return (
    <div style={{ background: 'var(--background)', borderRadius: 10, width: "100%", height: 220, marginBottom: 50 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {(['diario', 'mensual', 'trimestral', 'anual'] as Periodo[]).map(p => (
          <button key={p} onClick={() => setPeriodo(p)} style={tabStyle(periodo === p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <ResponsiveContainer  height={220}>
        {chartContent}
      </ResponsiveContainer>
    </div>
  );
};

export default VentasPorPeriodo;
