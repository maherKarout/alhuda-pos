import React from "react";
import { Pie, Cell, ResponsiveContainer, PieChart, Label } from "recharts";
import PriceFormat from "src/components/price-format";

function PieChartSection({
  data,
  COLORS,
}: {
  data: { name: string; value: number }[];
  COLORS: string[];
}) {
  const cx = 390;
  const cy = 180;
  return (
    <ResponsiveContainer minHeight={200} onResize={() => {}}>
      <PieChart>
        <Pie
          data={data}
          cy={200}
          startAngle={180}
          endAngle={0}
          innerRadius={120}
          outerRadius={180}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          // label={<PriceFormat price={30000} />}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          {/* <Label
            content={
              <g>
                <text
                  x={"50%"}
                  y={cy - 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  fontWeight="bold"
                  fill="black"
                >
                  <PriceFormat price={3000} />
                </text>
                <text
                  x={"50%"}
                  y={cy + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fill="black"
                >
                  المجموع الكلي
                </text>
              </g>
            }
          /> */}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartSection;
