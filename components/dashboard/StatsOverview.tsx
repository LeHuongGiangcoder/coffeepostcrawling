import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';
import { Coffee, CheckCircle, Activity, BarChart3 } from 'lucide-react';

interface StatsOverviewProps {
    stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Scraped
                    </CardTitle>
                    <Coffee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalScraped}</div>
                    <p className="text-xs text-muted-foreground">
                        All time posts
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending Review
                    </CardTitle>
                    <Activity className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-400">{stats.pendingReview}</div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting action
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Approval Rate
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-400">{stats.approvalRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        acceptance ratio
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg Quality
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-400">{stats.avgQualityScore}</div>
                    <p className="text-xs text-muted-foreground">
                        / 10 Scale
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
