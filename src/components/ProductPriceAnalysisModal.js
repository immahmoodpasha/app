import React, { useEffect, useState } from "react";
import apiClient from "../apiClient/axiosObject.js";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Line, Legend } from "recharts";

const ProductPriceAnalysisModal = ({ productId, headers, onClose }) => {
  const [productPriceData, setProductPriceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductPriceAnalysis = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`api/Statistics/ProductPriceAnalysis/${productId}`, { headers });
        const dict = response.data.data;
        // Transform dictionary to array for recharts
        const arr = dict
          ? Object.entries(dict).map(([month, stats]) => ({ month, ...stats }))
          : [];
        setProductPriceData(arr);
      } catch (error) {
        setProductPriceData([]);
        console.error("Error fetching product price analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProductPriceAnalysis();
  }, [productId, headers]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div className="graph-container" style={{ background: "white", borderRadius: 8, padding: 24, width: '80%'}}>
        <div className="graph-header">
          <h3 id="graph-header-text">Product Price Analysis</h3>
          <hr />
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
        ) : productPriceData && productPriceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={productPriceData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e42" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e42" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16de0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16de0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "profitPercentage") return [`${value}%`, "Profit %"];
                  if (name === "totalRevenue") return [`₹${value.toLocaleString("en-IN")}`, "Revenue"];
                  if (name === "costPrice") return [`₹${value.toLocaleString("en-IN")}`, "Cost Price"];
                  if (name === "profit") return [`₹${value.toLocaleString("en-IN")}`, "Profit"];
                  return value;
                }}
                labelStyle={{ color: "#000", fontWeight: 500 }}
                contentStyle={{
                  backgroundColor: "#f5f5ff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "5px",
                  boxShadow: "0px 1px 0px 3px #16de0b38"
                }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area
                type="monotone"
                dataKey="totalRevenue"
                name="Revenue"
                stroke="#4f46e5"
                fill="url(#revenueGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", stroke: "#4f46e5", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="costPrice"
                name="Cost Price"
                stroke="#f59e42"
                fill="url(#costGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", stroke: "#f59e42", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#16de0b"
                fill="url(#profitGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", stroke: "#16de0b", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="profitPercentage"
                name="Profit %"
                stroke="#e51c23"
                strokeWidth={2}
                dot={{ r: 3, fill: "#fff", stroke: "#e51c23", strokeWidth: 2 }}
                yAxisId={1}
              />
              <YAxis
                yAxisId={1}
                orientation="right"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickFormatter={v => `${v}%`}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: 40 }}>No price analysis data available.</div>
        )}
        <button onClick={onClose} style={{ marginTop: 24, display: "block", marginLeft: "auto", marginRight: "auto", backgroundColor: '#8404ae', color: 'white', padding: '1%', paddingRight: '2%', paddingLeft: '2%',border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductPriceAnalysisModal;