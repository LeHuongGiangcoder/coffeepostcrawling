import { getPostById, updatePostStatus } from "@/actions/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PostPageProps {
    params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    // Server Action wrappers
    async function approve() {
        'use server';
        await updatePostStatus(id, 'approved');
        redirect('/');
    }

    async function reject() {
        'use server';
        await updatePostStatus(id, 'rejected');
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header / Nav */}
            <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
                <div className="container mx-auto h-14 flex items-center px-4 lg:px-8">
                    <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Queue
                    </Link>
                    <div className="mx-4 h-4 w-[1px] bg-border/50" />
                    <span className="font-semibold text-sm truncate max-w-sm">{post.title}</span>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                {/* Main Content Column */}
                <div className="space-y-8">
                    {/* Meta Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">{post.sentiment || 'News'}</Badge>
                            {post.topics?.map(topic => (
                                <Badge key={topic} variant="outline" className="text-[10px] text-muted-foreground">{topic}</Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{post.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                {post.author?.[0] || '?'}
                            </div>
                            <div className="flex flex-col text-sm">
                                <span className="font-medium text-foreground">{post.author}</span>
                                <span className="text-xs">
                                    {post.published_date ? new Date(post.published_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No Date'}
                                    <span> • </span>
                                    <a href={post.url} target="_blank" className="hover:underline text-primary">Source Link <ExternalLink className="inline w-3 h-3" /></a>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Banner Image Placeholder */}
                    {/* Banner Image */}
                    {post.metadata && (post.metadata['og:image'] || post.metadata.ogImage) ? (
                        <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-[400px] bg-secondary/20 rounded-xl overflow-hidden relative border border-border/20 group cursor-pointer"
                        >
                            <img
                                src={post.metadata['og:image'] || post.metadata.ogImage}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                Original source <ExternalLink className="ml-2 w-3 h-3" />
                            </div>
                        </a>
                    ) : (
                        <div className="w-full h-[400px] bg-secondary/20 rounded-xl overflow-hidden relative border border-border/20 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                            <span className="text-muted-foreground/30 font-serif text-6xl">Coffee</span>
                        </div>
                    )}

                    {/* Key Insights Box */}
                    {post.key_insights && (
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                            <h3 className="flex items-center gap-2 font-semibold text-primary mb-4">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                Key Insights Extracted
                            </h3>
                            <div className="space-y-2">
                                {post.key_insights.split('\n').map((line, i) => (
                                    <div key={i} className="flex gap-3 text-foreground/90 leading-relaxed">
                                        <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        <p>{line.replace(/^[•-]\s*/, '')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full Content */}
                    <article className="prose prose-zinc dark:prose-invert lg:prose-xl max-w-none font-serif leading-loose">
                        {/* Drop cap style for first letter handled by prose or custom CSS if needed */}
                        {post.content_markdown ? (
                            <ReactMarkdown>{post.content_markdown}</ReactMarkdown>
                        ) : (
                            <p className="italic text-muted-foreground">Content not available.</p>
                        )}
                    </article>

                    <div className="pt-8 border-t border-border">
                        <a href={post.url} target="_blank" className="flex items-center justify-center w-full py-4 rounded-lg border border-border bg-secondary/10 hover:bg-secondary/20 transition-all text-sm font-medium">
                            Original source <ExternalLink className="ml-2 w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Sidebar (Right Rail) */}
                <div className="space-y-6">
                    <div className="sticky top-24 space-y-6">

                        {/* Decision Card */}
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
                            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Moderation Decision</h3>
                            <div className="space-y-3">
                                <form action={approve}>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-bold h-12 text-base shadow-lg shadow-emerald-900/10">
                                        <CheckCircle className="w-5 h-5" /> Approve Content
                                    </Button>
                                </form>
                                <form action={reject}>
                                    <Button variant="outline" className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 gap-2 h-12 text-base">
                                        <XCircle className="w-5 h-5" /> Reject Content
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Analysis Card */}
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Content Analysis</h3>
                                <span className="text-xs text-muted-foreground">AI Scored</span>
                            </div>

                            <div className="flex flex-col items-center justify-center py-2">
                                <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                                    <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/5">
                                        <span className="text-3xl font-bold text-emerald-500">{post.content_quality_score}</span>
                                    </div>
                                </div>
                                <p className="mt-2 font-medium text-emerald-500">Excellent Quality</p>
                            </div>

                            <Separator />

                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground text-xs uppercase block mb-1">Sentiment</span>
                                    <div className="flex items-center justify-between font-medium">
                                        <span className="capitalize">{post.sentiment || 'Neutral'}</span>
                                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-3/4 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-xs uppercase block mb-1">Target Audience</span>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge variant="secondary" className="text-indigo-400 bg-indigo-500/10 border-indigo-500/20">{post.target_audience || 'All'}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
