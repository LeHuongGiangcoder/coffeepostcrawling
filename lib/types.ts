export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface CoffeePost {
    id: string; // UUID
    url: string;
    title: string;
    summary: string | null;
    content_markdown: string | null;
    published_date: string | Date | null; // Timestamp
    author: string | null;
    topics: string[] | null;
    sentiment: 'educational' | 'tutorial' | 'opinion' | 'news' | 'review' | null;
    key_insights: string | null;
    content_quality_score: number | null; // 1-10
    target_audience: 'beginner' | 'enthusiast' | 'professional' | null;
    metadata: Record<string, any>;
    crawled_at: string | Date;
    approval_status: ApprovalStatus;
}

export interface DashboardStats {
    totalScraped: number;
    pendingReview: number;
    approvalRate: number; // percentage
    avgQualityScore: number;
}
