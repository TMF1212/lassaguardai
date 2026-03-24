import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HealthChatbot from "@/components/HealthChatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, TrendingUp, Shield, Clock, LogIn } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Assessment {
  id: string;
  score: number;
  risk_level: string;
  language: string;
  answers: Record<string, number>;
  created_at: string;
}

const RISK_COLORS = {
  low: "hsl(158 55% 42%)",
  medium: "hsl(38 92% 50%)",
  high: "hsl(0 72% 51%)",
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchAssessments();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchAssessments();
      else setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("risk_assessments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setAssessments(data as Assessment[]);
    }
    setLoading(false);
  };

  // Stats
  const totalAssessments = assessments.length;
  const riskCounts = assessments.reduce(
    (acc, a) => {
      acc[a.risk_level as keyof typeof acc] = (acc[a.risk_level as keyof typeof acc] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const pieData = [
    { name: "Low Risk", value: riskCounts.low, color: RISK_COLORS.low },
    { name: "Medium Risk", value: riskCounts.medium, color: RISK_COLORS.medium },
    { name: "High Risk", value: riskCounts.high, color: RISK_COLORS.high },
  ].filter((d) => d.value > 0);

  // Score trend (last 10 assessments, reversed for chronological order)
  const scoreTrend = [...assessments]
    .slice(0, 10)
    .reverse()
    .map((a, i) => ({
      name: `#${i + 1}`,
      score: a.score,
      date: new Date(a.created_at).toLocaleDateString(),
    }));

  const latestRisk = assessments[0]?.risk_level ?? "none";
  const avgScore = totalAssessments > 0 ? Math.round(assessments.reduce((s, a) => s + a.score, 0) / totalAssessments) : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-4">Sign in to view your dashboard</h1>
              <p className="text-muted-foreground mb-6">
                Track your assessment history, view trends, and get personalized insights.
              </p>
              <Button onClick={() => navigate("/login")} size="lg" className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 border-b border-primary/10">
          <div className="container mx-auto px-4 py-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              <span>Assessment Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
              Your Health Dashboard
            </h1>
            <p className="text-muted-foreground">Track your risk assessments over time</p>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-20">
              <Shield className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">No assessments yet</h2>
              <p className="text-muted-foreground mb-6">Take your first risk assessment to start tracking.</p>
              <Button onClick={() => navigate("/risk-checker")} className="gap-2">
                <Activity className="w-4 h-4" />
                Start Assessment
              </Button>
            </div>
          ) : (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Assessments</p>
                    <p className="text-3xl font-display font-bold text-primary">{totalAssessments}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                    <p className="text-3xl font-display font-bold">{avgScore}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Latest Result</p>
                    <Badge
                      className={`text-sm ${
                        latestRisk === "low"
                          ? "bg-[hsl(158_55%_42%)] text-white"
                          : latestRisk === "medium"
                          ? "bg-[hsl(38_92%_50%)] text-white"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {latestRisk.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">High Risk Count</p>
                    <p className="text-3xl font-display font-bold text-destructive">{riskCounts.high}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Score Trend */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-display flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Score Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={scoreTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Risk Distribution */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-display flex items-center gap-2">
                      <Shield className="w-4 h-4 text-accent" />
                      Risk Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Assessments */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Recent Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessments.slice(0, 10).map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              a.risk_level === "low"
                                ? "bg-[hsl(158_55%_42%)]"
                                : a.risk_level === "medium"
                                ? "bg-[hsl(38_92%_50%)]"
                                : "bg-destructive"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium capitalize">{a.risk_level} Risk</p>
                            <p className="text-xs text-muted-foreground">
                              Score: {a.score} • {new Date(a.created_at).toLocaleDateString()} at{" "}
                              {new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs uppercase">
                          {a.language}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button onClick={() => navigate("/risk-checker")} className="gap-2">
                  <Activity className="w-4 h-4" />
                  Take New Assessment
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default Dashboard;
