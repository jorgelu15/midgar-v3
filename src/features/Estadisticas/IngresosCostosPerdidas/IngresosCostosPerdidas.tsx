import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const IngresosCostosPerdidas = () => {
    const formatCurrency = (v: number) => `$${v.toLocaleString("es-CO")}`;
    const data = [
        { mes: 'Ene', ingresos: 2400000, costos: 1800000, perdidas: 150000 },
        { mes: 'Feb', ingresos: 2800000, costos: 2000000, perdidas: 100000 },
        { mes: 'Mar', ingresos: 3100000, costos: 2200000, perdidas: 120000 },
    ];

    return (
        <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)" />
                    <XAxis dataKey="mes" stroke="var(--text-muted)"
                        tick={{ fontSize: 12 }} />
                    <YAxis
                        tickFormatter={formatCurrency}
                        stroke="var(--text-muted)"
                        tick={{ fontSize: 12 }}
                        width={70}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--background)",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                        }}
                    />
                    <Legend />
                    <Bar dataKey="ingresos" fill="var(--primary)" name="Ingresos" />
                    <Bar dataKey="costos" fill="var(--warning)" name="Costos" />
                    <Bar dataKey="perdidas" fill="var(--danger)" name="Pérdidas" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};