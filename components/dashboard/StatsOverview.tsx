import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';
import { Coffee, CheckCircle, Activity, BarChart3 } from 'lucide-react';

interface StatsOverviewProps {
    stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
                    <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Total Scraped
                    </CardTitle>
                    <Coffee className="h-3 w-3 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                    <div className="text-lg font-bold">{stats.totalScraped}</div>
                    <p className="text-[9px] text-muted-foreground">
                        All time posts
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
                    <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Pending Review
                    </CardTitle>
                    <Activity className="h-3 w-3 text-orange-400" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                    <div className="text-lg font-bold text-orange-400">{stats.pendingReview}</div>
                    <p className="text-[9px] text-muted-foreground">
                        Awaiting action
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
                    <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Approval Rate
                    </CardTitle>
                    <CheckCircle className="h-3 w-3 text-green-400" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                    <div className="text-lg font-bold text-green-400">{stats.approvalRate}%</div>
                    <p className="text-[9px] text-muted-foreground">
                        acceptance ratio
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
                    <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Avg Quality
                    </CardTitle>
                    <BarChart3 className="h-3 w-3 text-blue-400" />
                </CardHeader>
                <CardContent className="px-3 pb-3">
                    <div className="text-lg font-bold text-blue-400">{stats.avgQualityScore}</div>
                    <p className="text-[9px] text-muted-foreground">
                        / 10 Scale
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
