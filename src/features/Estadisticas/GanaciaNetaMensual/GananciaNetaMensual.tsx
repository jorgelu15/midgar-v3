import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const GananciaNetaMensual = () => {
    const formatCurrency = (v: number) => `$${v.toLocaleString("es-CO")}`;
    const data = [
        { mes: 'Ene', ganancia: 450000 },
        { mes: 'Feb', ganancia: 700000 },
        { mes: 'Mar', ganancia: 780000 },
    ];

    return (
        <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer >
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--secondary)"/>
                    <XAxis dataKey="mes" stroke="var(--text-muted)"
                        tick={{ fontSize: 12 }}/>
                    <YAxis tickFormatter={formatCurrency} stroke="var(--text-muted)"
                        tick={{ fontSize: 12 }}
                        width={70} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--background)",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                        }}
                    />
                    <Line type="monotone" dataKey="ganancia" stroke="var(--primary)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};