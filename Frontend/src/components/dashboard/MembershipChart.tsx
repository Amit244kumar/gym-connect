// src/components/dashboard/MembershipChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface MembershipData {
  name: string;
  value: number;
  color: string;
}

interface MembershipChartProps {
  data: MembershipData[];
}

const MembershipChart = ({ data }: MembershipChartProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">Membership Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="value" name="Members">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-slate-400">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipChart;