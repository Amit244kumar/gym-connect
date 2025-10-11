import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Shimmer from "./Shimmer";
const StatCard = ({ title, value, change, icon: Icon, iconColor, changeType = 'positive', isLoading = false }: {
  title: any;
  value: string | number;
  change?: string;
  icon: any;
  iconColor: string;
  changeType?: 'positive' | 'negative';
  isLoading?: boolean;
}) => (
  <Card className="bg-slate-800/50 border-slate-700 hover:shadow-lg transition-all duration-300 hover:border-slate-600">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-300">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Shimmer width="60px" height="32px" />
      ) : (
        <div className="text-2xl font-bold text-white">{value}</div>
      )}
      {change && (
        <p className={`text-xs ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);

export default StatCard;