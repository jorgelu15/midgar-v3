import style from "./receipt.module.css";

type Item = {
    ref: string;
    description: string;
    qty: number;       // Cant.
    um: string;        // U.M
    unitPrice: number; // V/r Uni.
};

const Receipt = () => {
    const items: Item[] = [
        { ref: "00123", description: "Galletas Festival Vainilla 6u", qty: 2, um: "UND", unitPrice: 2500 },
        { ref: "ABC-45", description: "Aceite de cocina 900 ml", qty: 1, um: "UND", unitPrice: 9300 },
        { ref: "Q-001", description: "Queso campesino (por peso)", qty: 0.45, um: "KG", unitPrice: 14500 },
    ];
    const currency = (n: number) =>
        n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

    const fmtQty = (q: number) => (Number.isInteger(q) ? q : q.toFixed(2));
    const subtotal = items.reduce((acc, it) => acc + it.qty * it.unitPrice, 0);
    return (
        <div className={style.container_receipt}>
            <header>
                <div className={style.center}>
                    <h1 className={style.title}>TIENDA LA MILANESA</h1>
                    <p className={style.small}>BRR SOCORRO MZ 132 LOTE 9 PLAN 134</p>
                </div>

                <br />

                <div className={style.info_receipt}>
                    <div className={style.row_info}>
                        <p>No. Factura:</p>
                        <p>FA123456789</p>
                    </div>
                    <div className={style.row_info}>
                        <p>Fecha:</p>
                        <p>01/01/2023 Hora 10:00:00</p>
                    </div>
                    <div className={style.row_info}>
                        <p>Comprobante de pago</p>
                    </div>
                    <div className={style.row_info}>
                        <p>Vendedor:</p>
                        <p>JORGE LUIS GUARDO ROMERO</p>
                    </div>
                    <div className={style.row_info}>
                        <p>Condición de pago:</p>
                        <p>CONTADO</p>
                    </div>
                    <div className={style.row_info}>
                        <p>Cliente:</p>
                        <p>DELIA ROSA ROMERO FLOREZ</p>
                    </div>
                    <div className={style.row_info}>
                        <p>NIT/C.C:</p>
                        <p>45512237</p>
                    </div>
                </div>

                <div className={style.divider} aria-hidden="true" />
                <div className={style.row_info}>
                    <p>Ref.</p>
                    <p>Descrición del item</p>
                </div>
                <div className={style.row_info}>
                    <p>Cant.</p>
                    <p>U.M</p>
                    <p>V/r Uni.</p>
                    <p>Total</p>
                </div>
                <div className={style.divider} aria-hidden="true" />
                {items.map((it, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                        <div className={style.row_info}>
                            <p>{it.ref}</p>
                            <p>{it.description}</p>
                        </div>
                        <div className={style.row_info}>
                            <div style={{ display: "flex", gap: 10 }}>
                                <p>{fmtQty(it.qty)}</p>
                                <p>{it.um}</p>
                            </div>
                            <p style={{ textAlign: "right" }}>{currency(it.unitPrice)}</p>
                            <p style={{ textAlign: "right" }}>{currency(it.qty * it.unitPrice)}</p>
                        </div>
                    </div>
                ))}
                <div className={style.divider}></div>
                <div className={style.row_info}>
                    <p>TOTAL</p>
                    <p style={{ textAlign: "right" }}>
                        <strong>{currency(subtotal)}</strong>
                    </p>
                </div>
                <div className={style.row_info}>
                    <p>Total de articulos</p>
                    <p style={{ textAlign: "right" }}>
                        <strong>{items.length}</strong>
                    </p>
                </div>
                <div className={style.divider}></div>
                <div className={style.row_info}>
                    <p>EFECTIVO</p>
                    <p style={{ textAlign: "right" }}>
                        <strong>{currency(subtotal)}</strong>
                    </p>
                </div>
                <div className={style.row_info}>
                    <p>CAMBIO</p>
                    <p style={{ textAlign: "right" }}>
                        <strong>{currency(subtotal)}</strong>
                    </p>
                </div>
                <br/>
                <center><h1 className={style.title}>NIT. 1143403473-0</h1></center>
                <center><h1 className={style.title}>TIENDA LA MILANESA SA</h1></center>
                <center><h1 className={style.title}><strong>GRACIAS POR PREFERIRNOS</strong></h1></center>
                <br/>
                <div className={style.divider}></div>
                <p className={style.small}>
                    Factura generada por software Midgar SA
                </p>
                <p>www.midgarsa.com</p>
            </header>
        </div>
    );
};

export default Receipt;
