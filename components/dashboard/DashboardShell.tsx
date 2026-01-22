import { StatsOverview } from './StatsOverview';
import { PostFeed } from './PostFeed';
import { FilterToolbar } from './FilterToolbar';
import { getDashboardStats, getPendingPosts } from '@/actions/posts';

interface DashboardShellProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function DashboardShell({ searchParams }: DashboardShellProps) {
    const stats = await getDashboardStats();

    const sort = (searchParams?.sort as 'date' | 'quality') || 'date';
    const audience = searchParams?.audience as string | undefined;
    const sentiment = searchParams?.sentiment as string | undefined;

    const posts = await getPendingPosts(sort, audience, sentiment);

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container flex h-14 items-center pl-8">
                    <div className="mr-4 flex">
                        <a className="mr-6 flex items-center space-x-2 font-bold" href="/">
                            <span>☕️ CuratorHub</span>
                        </a>
                    </div>
                </div>
            </header>

            <main className="container py-4 px-4 mx-auto">
                <StatsOverview stats={stats} />

                <div className="mt-8">
                    <FilterToolbar />
                    <PostFeed initialPosts={posts} />
                </div>
            </main>
        </div>
    );
}
