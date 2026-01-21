'use server';

import { query } from '@/lib/db';
import { CoffeePost, DashboardStats, ApprovalStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getDashboardStats(): Promise<DashboardStats> {
    const totalRes = await query(`SELECT COUNT(*) as count FROM curated_coffee_posts`);
    const pendingRes = await query(`SELECT COUNT(*) as count FROM curated_coffee_posts WHERE approval_status = 'pending'`);
    const statusRes = await query(`
    SELECT 
      approval_status, 
      COUNT(*) as count 
    FROM curated_coffee_posts 
    GROUP BY approval_status
  `);

    const avgQ = await query(`SELECT AVG(content_quality_score) as avg FROM curated_coffee_posts`);

    // Calculate approval rate: approved / (approved + rejected)
    // Ignoring pending in the denominator for "rate of decision" logic, or use total.
    // User asked for "Approval Rate (%)". Let's assume it's Approved / Total *Processed* (Approved+Rejected)
    let approvedCount = 0;
    let rejectedCount = 0;

    statusRes.rows.forEach((row: any) => {
        if (row.approval_status === 'approved') approvedCount = parseInt(row.count, 10);
        if (row.approval_status === 'rejected') rejectedCount = parseInt(row.count, 10);
    });

    const totalDecided = approvedCount + rejectedCount;
    const approvalRate = totalDecided > 0 ? (approvedCount / totalDecided) * 100 : 0;

    return {
        totalScraped: parseInt(totalRes.rows[0].count, 10),
        pendingReview: parseInt(pendingRes.rows[0].count, 10),
        approvalRate: parseFloat(approvalRate.toFixed(1)),
        avgQualityScore: parseFloat(avgQ.rows[0].avg || '0').toFixed(1) as any as number,
    };
}

export async function getPendingPosts(
    sortBy: 'date' | 'quality' = 'date',
    filterAudience?: string,
    filterSentiment?: string
): Promise<CoffeePost[]> {
    let orderByClause = 'ORDER BY crawled_at DESC';
    if (sortBy === 'quality') {
        orderByClause = 'ORDER BY content_quality_score DESC, crawled_at DESC';
    } else if (sortBy === 'date') {
        orderByClause = 'ORDER BY published_date DESC NULLS LAST, crawled_at DESC';
    }

    let whereClause = `WHERE approval_status = 'pending'`;
    const params: any[] = [];

    if (filterAudience && filterAudience !== 'all') {
        params.push(filterAudience);
        whereClause += ` AND target_audience = $${params.length}`;
    }

    if (filterSentiment && filterSentiment !== 'all') {
        params.push(filterSentiment);
        whereClause += ` AND sentiment = $${params.length}`;
    }

    const sql = `
    SELECT * FROM curated_coffee_posts 
    ${whereClause}
    ${orderByClause}
  `;

    const res = await query<CoffeePost>(sql, params);

    // Convert timestamps to string/Date if needed, but pg usually returns Date objects for timestamps
    // We might need to serialize for Client Components if we pass them down as props
    // Server Actions returning to Server Components is fine.
    return res.rows;
}

export async function updatePostStatus(id: string, status: 'approved' | 'rejected') {
    await query(
        `UPDATE curated_coffee_posts SET approval_status = $1 WHERE id = $2`,
        [status, id]
    );
    revalidatePath('/'); // Refresh dashboard
}

export async function getPostById(id: string): Promise<CoffeePost | null> {
    const res = await query<CoffeePost>(`SELECT * FROM curated_coffee_posts WHERE id = $1`, [id]);
    return res.rows[0] || null;
}
