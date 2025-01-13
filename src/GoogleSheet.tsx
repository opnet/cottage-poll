import React, { useEffect, useState } from "react";
import axios from "axios";

type Sheet = Array<Array<string>>

const GoogleSheetFetcher = ({ apiKey, sheetId, range }: { apiKey: string, sheetId: string, range: string }) => {
    const [data, setData] = useState<Sheet>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
                const response = await axios.get(url);
                const rows = response.data.values || [];
                setData(rows);
            } catch (err) {
                setError("Failed to fetch data from Google Sheets.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiKey, sheetId, range]);

    if (loading) return <p>Loading data...</p>;
    if (error) return <p>{error}</p>;

    return (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
                <tr>
                    {data[0]?.map((header: string, index: number) => (
                        <th
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                                backgroundColor: "#f4f4f4",
                            }}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                            <td
                                key={cellIndex}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GoogleSheetFetcher;
