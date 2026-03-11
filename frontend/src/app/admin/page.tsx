"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle,
  Mic2,
  Gift,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus,
  Send,
  Download,
  Award,
  RefreshCw,
  AlertCircle,
  Shield
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ProgressBar,
  Badge,
  Button,
  Divider,
  Avatar
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { apiCall } from "@/lib/api";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const StatCard = ({ stat, index }: { stat: any, index: number }) => {
  const percentage = Math.round((stat.value / stat.target) * 100);
  
  // Icon Mapping
  const Icon = stat.label.includes("Registered") ? Users : 
                 stat.label.includes("Checked") ? CheckCircle :
                 stat.label.includes("Speaker") ? Mic2 : 
                 stat.label.includes("Captains") ? Shield : Gift;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--electric)]/30 hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">
            {stat.label}
          </CardTitle>
          <div className={cn(
            "h-10 w-10 flex items-center justify-center rounded-lg bg-opacity-10"
          )} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
            <Icon size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-[var(--text-1)]">
              {stat.value}
            </span>
            <span className="text-xs text-[var(--text-3)] font-mono">/ {stat.target}</span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-tighter">
              <span className="text-[var(--text-3)]">Progress</span>
              <span style={{ color: stat.color }}>{percentage}%</span>
            </div>
            <ProgressBar
              value={percentage}
              className="h-1.5"
              indicatorClassName={cn(
                stat.color === "var(--electric)" && "bg-[var(--electric)]",
                stat.color === "var(--success)" && "bg-[var(--success)]",
                stat.color === "var(--ember)" && "bg-[var(--ember)]",
                stat.color === "var(--electric-light)" && "bg-[var(--electric-light)]"
              )}
            />
          </div>

          <div className="mt-4 flex items-center gap-1.5 pt-4 border-t border-[var(--border)]/5">
            <TrendingUp size={12} className="text-[var(--success)]" />
            <span className="text-[10px] font-bold text-[var(--success)]">{stat.growth}</span>
            <span className="text-[10px] text-[var(--text-3)] uppercase tracking-widest">Update</span>
          </div>
        </CardContent>

        <div className="absolute -bottom-1 -right-1 h-12 w-12 bg-gradient-to-br transition-opacity opacity-0 group-hover:opacity-10 opacity-0.05" style={{ background: `radial-gradient(circle at bottom right, ${stat.color}, transparent)` }} />
      </Card>
    </motion.div>
  );
};

export default function AdminPage() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const response = await apiCall('/event/dashboard', { method: 'GET' });
      if (response.success) {
        setData(response.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Telemetry sync failed");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--electric)]"></div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-3)]">Synchronizing with mainframe...</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">System Overview</h2>
              {isRefreshing && <RefreshCw size={16} className="animate-spin text-[var(--electric)]" />}
            </div>
            <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Live event telemetry • Node 01 • {data?.systemHealth?.dbSync} Sync</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchDashboardData} className="border-[var(--border)] text-xs font-bold gap-2">
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> Sync Now
            </Button>
            <Button variant="primary" size="sm" className="shadow-glow text-xs font-bold gap-2" asChild>
              <a href="/admin/attendees"><Plus size={14} /> Manage Attendees</a>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data?.stats.map((stat: any, i: number) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Recent Activity Feed */}
          <Card className="lg:col-span-2 border-[var(--border)] bg-[var(--surface)] shadow-elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Activity Feed</CardTitle>
                <p className="text-xs text-[var(--text-3)] mt-1">Real-time occurrence log</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-[var(--electric)] gap-1" asChild>
                <a href="/admin/logs">System Audit <ChevronRight size={14} /></a>
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence mode="popLayout">
                {data?.activities.length > 0 ? data.activities.map((item: any, i: number) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar name={item.user} className="h-10 w-10 border border-[var(--border)]" />
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)]",
                          item.status === 'success' ? 'bg-[var(--success)] shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                            item.status === 'warning' ? 'bg-[var(--ember)]' : 'bg-[var(--electric)]'
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-1)] group-hover:text-[var(--electric-light)] transition-colors">
                          {item.user}
                        </p>
                        <p className="text-xs text-[var(--text-3)] flex items-center gap-1.5 mt-0.5 uppercase tracking-wider font-mono">
                          {item.type === 'checkin' && <><CheckCircle size={10} /> Checked-In</>}
                          {item.type === 'registration' && <><Plus size={10} /> Registered</>}
                          {item.type === 'speaker' && <><Mic2 size={10} /> Speaker Lead</>}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-3)] uppercase">
                        <Clock size={10} className="inline mr-1" /> {formatDistanceToNow(new Date(item.time))} ago
                      </span>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-10 text-[var(--text-3)] gap-2">
                    <AlertCircle size={20} className="opacity-20" />
                    <span className="text-xs uppercase font-mono tracking-widest">No recent data packet</span>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Quick Actions & System Health */}
          <div className="space-y-6">
            <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated overflow-hidden">
              <div className="h-1 bg-[var(--electric)] w-full opacity-50" />
              <CardHeader>
                <CardTitle className="text-lg font-bold">Quick Control</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start gap-4 h-12 border-[var(--border)] hover:bg-[var(--electric)]/5 hover:text-[var(--electric-light)] group" asChild>
                  <a href="/admin/attendees?mode=checkin">
                    <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-[var(--electric)]/20 transition-colors">
                      <Users size={16} />
                    </div>
                    Rapid Check-in
                  </a>
                </Button>
                <Button variant="outline" className="justify-start gap-4 h-12 border-[var(--border)] hover:bg-[var(--electric)]/5 hover:text-[var(--electric-light)] group" asChild>
                  <a href="/admin/communication">
                    <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-[var(--electric)]/20 transition-colors">
                      <Send size={16} />
                    </div>
                    Broadcast Alert
                  </a>
                </Button>
                <Button variant="outline" className="justify-start gap-4 h-12 border-[var(--border)] hover:bg-[var(--electric)]/5 hover:text-[var(--electric-light)] group" asChild>
                  <a href="/admin/certificates">
                    <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-[var(--electric)]/20 transition-colors">
                      <Award size={16} />
                    </div>
                    Batch Certs
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Event Load</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="flex flex-col items-center">
                  <div className="relative h-40 w-40">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="var(--border)" strokeWidth="8" fill="transparent" opacity="0.1" />
                      <circle
                        cx="80" cy="80" r="70" stroke="var(--electric)" strokeWidth="10" fill="transparent"
                        strokeDasharray="440" strokeDashoffset={440 * (1 - (data?.capacity?.percentage / 100 || 0))}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-display font-black text-[var(--text-1)]">{data?.capacity?.percentage || 0}%</span>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-3)] text-center">Fill Ratio</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--border)]/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-3)] font-medium">Headcount</span>
                    <Badge variant="outline" className="text-[var(--electric)] border-[var(--electric)]/20 bg-[var(--electric)]/5 font-mono">
                      {data?.capacity?.filled}/{data?.capacity?.total}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-3)] font-medium">Link Status</span>
                    <span className="flex items-center gap-1.5 text-[var(--success)] font-bold">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" /> Live
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-[var(--electric)]/5 blur-3xl rounded-full" />
            </Card>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
