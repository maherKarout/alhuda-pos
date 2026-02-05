import { useTheme } from "@emotion/react";
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 1000,
  },
  {
    name: "Page G",
    uv: 1000,
  },
  {
    name: "Page G",
    uv: 1000,
  },
];
function BarChartSection() {
  const theme: any = useTheme();
  return (
    <ResponsiveContainer minHeight={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        {/* <YAxis /> */}
        <Bar
          dataKey="uv"
          fill="#E1D3DE"
          shape={(props: any) => {
            const { x, y, width, height, fill, value } = props;

            return (
              <>
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    rx={10}
                    ry={10}
                  />{" "}
                  <text
                    x={x + width / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fill="black"
                  >
                    {value}
                  </text>
                </g>
              </>
            );
          }}
        ></Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartSection;
