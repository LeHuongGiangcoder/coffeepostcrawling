import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  return (
    <DashboardShell searchParams={searchParams} />
  );
}
