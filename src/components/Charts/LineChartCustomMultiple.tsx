import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

type LineConfig = {
    dataKey: string;
    stroke: string;
    label: string;
};

type Props = {
    data: { [key: string]: any }[];
    labelKey: string;
    lines: LineConfig[];
    height?: number;
    title?: string;
};

const LineChartCustomMultiple = ({ data, labelKey, lines, title, height = 220 }: Props) => {
    const formatCurrency = (v: number) => `$${v.toLocaleString("es-CO")}`;

    return (
        <div style={{ width: "100%", height }}>
            {title && (
                <h4 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    {title}
                </h4>
            )}
            <ResponsiveContainer >
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
                    <Legend />
                    {lines.map((line) => (
                        <Line
                            key={line.dataKey}
                            type="monotone"
                            dataKey={line.dataKey}
                            name={line.label}
                            stroke={line.stroke}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartCustomMultiple;
