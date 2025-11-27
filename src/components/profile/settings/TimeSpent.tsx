
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { subDays, format } from 'date-fns';

const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
        date: format(date, 'MMM d'),
        day: format(date, 'eee'),
        minutes: Math.floor(Math.random() * 180) + 20, // Random time between 20 and 200 minutes
    };
}).reverse();

const chartConfig = {
    minutes: {
        label: "Minutes",
        color: "hsl(var(--primary))",
    },
};

export default function TimeSpent() {
    const averageTime = dailyData.reduce((acc, curr) => acc + curr.minutes, 0) / dailyData.length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Time Spent</CardTitle>
                <CardDescription>
                    Your average time spent on YCP this week was {Math.round(averageTime)} minutes per day.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={dailyData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${value}m`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent 
                                labelFormatter={(value, payload) => {
                                    const date = payload[0]?.payload.date;
                                    return date ? `${date}` : value;
                                }}
                            />}
                        />
                        <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

    