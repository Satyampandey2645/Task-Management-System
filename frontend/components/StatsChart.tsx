"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function StatsChart({ total, completed }: any) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: total - completed },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="h-60 mb-6">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
