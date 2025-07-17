import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Metodo = {
  nombre: string;
  monto: number;
};

type Props = {
  data: Metodo[];
};

const VentasPorMetodoPago = ({ data }: Props) => {
  const formatNumber = (v: number) => v.toLocaleString("es-CO", {style: "currency", currency: "COP"});

  return (
    <div style={{ background: "var(--background)",  width: "100%", height: 270 }}>

      <ResponsiveContainer >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)" />
          <XAxis
            type="number"
            tickFormatter={formatNumber}
            stroke="var(--text-muted)"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            stroke="var(--text-muted)"
            tick={{ fontSize: 12 }}
            width={70}
          />
          <Tooltip
            formatter={(value: number) => `${formatNumber(value)} pesos`}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderRadius: "6px",
              fontSize: "0.85rem",
            }}
          />
          <Bar dataKey="monto" fill="var(--primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VentasPorMetodoPago;
