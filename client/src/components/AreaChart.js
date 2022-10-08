
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function AreaChartComponent({data}) {
  return (
    <ResponsiveContainer
      width='100%'
      height={300}
    >
      <AreaChart
        data={data}
        margin={{
          top: 50
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='data' />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area 
          type='monotone' 
          dataKey='count' 
          fill='#bef8fd'
          stroke='#2cb1bc'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}