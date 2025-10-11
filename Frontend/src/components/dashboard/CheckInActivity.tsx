// src/components/dashboard/CheckInActivity.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CheckInData {
  time: string;
  count: number;
}

interface CheckInActivityProps {
  data: CheckInData[];
}

const CheckInActivity = ({ data }: CheckInActivityProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">Today's Check-in Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Check-ins" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-400">Peak time: 6 PM with 45 check-ins</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInActivity;