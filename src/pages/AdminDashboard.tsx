import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GARDEN, type Tree, type TreeUpdate, formatDateShort } from "@/lib/garden";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Camera, ClipboardList, Image as ImageIcon, Leaf, ListTree, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [updates, setUpdates] = useState<TreeUpdate[]>([]);

  useEffect(() => {
    document.title = "Admin Dashboard · Rabeeyunil Awwal Mango Garden";
    Promise.all([
      supabase.from("trees").select("*").order("id"),
      supabase.from("tree_updates").select("*").order("created_at", { ascending: false }).limit(10),
    ]).then(([t, u]) => {
      if (t.data) setTrees(t.data as Tree[]);
      if (u.data) setUpdates(u.data as TreeUpdate[]);
    });
  }, []);

  const treesWithPhotos = new Set<string>();
  const treesWithLogs = new Set<string>();
  // Need full updates to determine those — quick refetch
  useEffect(() => {
    supabase.from("tree_updates").select("tree_id, photo_url").then(({ data }) => {
      if (!data) return;
      data.forEach((u: any) => {
        treesWithLogs.add(u.tree_id);
        if (u.photo_url) treesWithPhotos.add(u.tree_id);
      });
      // trigger update by setting a state copy (cheap)
      setStatsTick(x => x + 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [statsTick, setStatsTick] = useState(0);

  // Derive stats from current state — recompute
  const [photosCount, setPhotosCount] = useState(0);
  const [logsCount, setLogsCount] = useState(0);
  useEffect(() => {
    supabase.from("tree_updates").select("tree_id, photo_url").then(({ data }) => {
      if (!data) return;
      const photos = new Set<string>();
      const logs = new Set<string>();
      data.forEach((u: any) => {
        logs.add(u.tree_id);
        if (u.photo_url) photos.add(u.tree_id);
      });
      setPhotosCount(photos.size);
      setLogsCount(logs.size);
    });
  }, [trees.length]);

  const noData = Math.max(0, trees.length - logsCount);
  const good = trees.filter(t => t.health_status === "Good").length;
  const monitor = trees.filter(t => t.health_status === "Monitor").length;
  const attention = trees.filter(t => t.health_status === "Attention").length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-gradient-leaf text-primary-foreground py-12 geo-pattern">
        <div className="container">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent mb-3 font-sub">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </div>
          <h1 className="font-display text-4xl md:text-5xl">Dashboard</h1>
          <p className="font-sub text-primary-foreground/75 mt-2">Signed in as {user?.email}</p>
        </div>
      </section>

      <main className="container py-12 space-y-10">
        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: ListTree, label: "Total trees", value: trees.length },
            { Icon: Camera, label: "Trees with photos", value: photosCount },
            { Icon: ClipboardList, label: "Trees with logs", value: logsCount },
            { Icon: Leaf, label: "Trees with no data", value: noData },
          ].map(({ Icon, label, value }) => (
            <Card key={label} className="p-6 border-border/60 shadow-soft">
              <Icon className="w-5 h-5 text-accent mb-3" />
              <div className="font-display text-4xl text-primary">{value}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-sub mt-1">{label}</div>
            </Card>
          ))}
        </div>

        {/* Health breakdown */}
        <Card className="p-6 md:p-8 border-border/60 shadow-soft">
          <h2 className="font-display text-2xl text-primary mb-5">Health breakdown</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-health-good/10 border border-health-good/30">
              <div className="text-3xl font-display text-health-good">{good}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-sub mt-1">Good</div>
            </div>
            <div className="p-5 rounded-xl bg-health-attention/10 border border-health-attention/30">
              <div className="text-3xl font-display text-health-attention">{monitor}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-sub mt-1">Needs Attention</div>
            </div>
            <div className="p-5 rounded-xl bg-health-critical/10 border border-health-critical/30">
              <div className="text-3xl font-display text-health-critical">{attention}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-sub mt-1">Critical</div>
            </div>
          </div>
        </Card>

        {/* Quick links */}
        <Card className="p-6 md:p-8 border-border/60 shadow-soft">
          <h2 className="font-display text-2xl text-primary mb-5">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-full font-sub">
              <Link to="/garden#directory">Browse all trees</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full font-sub">
              <Link to="/tree/RAMG-1501">Open RAMG-1501</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full font-sub">
              <Link to="/garden">Garden map</Link>
            </Button>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6 md:p-8 border-border/60 shadow-soft">
          <h2 className="font-display text-2xl text-primary mb-5 flex items-center gap-2"><Activity className="w-5 h-5 text-accent" /> Recent activity</h2>
          {updates.length === 0 ? (
            <p className="text-sm text-muted-foreground font-sub italic">No updates recorded yet. The garden's chronicle is just beginning 🌱</p>
          ) : (
            <ol className="relative border-l-2 border-sage/40 ml-2 space-y-5">
              {updates.map(u => (
                <li key={u.id} className="ml-5">
                  <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-accent border-2 border-background" />
                  <div className="flex items-center gap-2 text-xs font-sub text-muted-foreground">
                    <span className="font-medium text-foreground">{formatDateShort(u.created_at)}</span>
                    <Link to={`/tree/${u.tree_id}`} className="font-mono text-accent hover:underline">{u.tree_id}</Link>
                    <Badge variant="secondary" className="text-[10px] capitalize">{u.update_type}</Badge>
                  </div>
                  {u.note && <p className="text-sm mt-1 text-foreground">{u.note}</p>}
                  {u.photo_url && <img src={u.photo_url} alt="" className="mt-2 w-24 h-24 object-cover rounded-md border border-border/60" loading="lazy" />}
                </li>
              ))}
            </ol>
          )}
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
