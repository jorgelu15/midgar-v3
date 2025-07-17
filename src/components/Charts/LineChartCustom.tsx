import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { [key: string]: any }[];
  dataKey: string;
  labelKey: string;
  height?: number;
  strokeColor?: string;
  title?: string;
};

const LineChartCustom = ({
  data,
  dataKey,
  labelKey,
  height = 220,
  strokeColor = "var(--primary)",
  title,
}: Props) => {
  const formatCurrency = (v: number) => `$${v.toLocaleString("es-CO")}`;

  return (
    <div style={{ width: "100%", height }}>
      {title && (
        <h4 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          {title}
        </h4>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)" />
          <XAxis dataKey={labelKey} stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={formatCurrency}
            stroke="var(--text-muted)"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "var(--background)",
              color: "var(--text-muted)",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.85rem",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCustom;
