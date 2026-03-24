"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", total: 1800 },
  { month: "Feb", total: 2200 },
  { month: "Mar", total: 2600 },
  { month: "Apr", total: 3100 },
  { month: "May", total: 3400 },
];

export default function ImpactChart() {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 8 }}>
          <XAxis dataKey="month" stroke="#475569" />
          <YAxis stroke="#475569" />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
