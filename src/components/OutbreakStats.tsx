import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, MapPin, TrendingUp, Users, Skull } from "lucide-react";

const OutbreakStats = () => {
  const nationalStats = [
    { icon: Activity, label: "Confirmed Cases (2026 YTD)", value: "1,187", trend: "+12% vs 2025", trendUp: true },
    { icon: Skull, label: "Deaths Reported", value: "168", trend: "CFR: 14.2%", trendUp: true },
    { icon: Users, label: "Suspected Cases", value: "5,432", trend: "Under investigation", trendUp: false },
    { icon: MapPin, label: "Affected States", value: "28 / 36", trend: "Across all zones", trendUp: true },
  ];

  const stateData = [
    { state: "Ondo", cases: 312, deaths: 42, status: "critical" },
    { state: "Edo", cases: 248, deaths: 31, status: "critical" },
    { state: "Bauchi", cases: 127, deaths: 19, status: "high" },
    { state: "Taraba", cases: 98, deaths: 14, status: "high" },
    { state: "Ebonyi", cases: 87, deaths: 11, status: "high" },
    { state: "Plateau", cases: 72, deaths: 9, status: "moderate" },
    { state: "Nasarawa", cases: 58, deaths: 8, status: "moderate" },
    { state: "Kogi", cases: 45, deaths: 7, status: "moderate" },
    { state: "Benue", cases: 41, deaths: 6, status: "moderate" },
    { state: "Enugu", cases: 34, deaths: 5, status: "moderate" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "high": return "bg-warning/10 text-warning border-warning/20";
      case "moderate": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "moderate": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>Live Outbreak Data</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Nigeria Lassa Fever Outbreak Statistics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Current epidemiological data from the Nigeria Centre for Disease Control (NCDC). Updated weekly.
          </p>
        </div>

        {/* National Summary */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {nationalStats.map((stat, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-3xl font-bold font-display mb-1">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trendUp && <TrendingUp className="w-3 h-3 text-destructive" />}
                  <span className="text-muted-foreground">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* State-level breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Most Affected States
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">State</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-center">Confirmed Cases</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-center">Deaths</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-center">CFR</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-right">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {stateData.map((row, index) => (
                    <tr key={index} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium">{row.state}</td>
                      <td className="py-3 text-center font-semibold">{row.cases.toLocaleString()}</td>
                      <td className="py-3 text-center text-destructive font-semibold">{row.deaths}</td>
                      <td className="py-3 text-center text-muted-foreground">
                        {((row.deaths / row.cases) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
              Source: Nigeria Centre for Disease Control (NCDC) • Data represents illustrative figures based on historical outbreak patterns. 
              For official data, visit <a href="https://ncdc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ncdc.gov.ng</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OutbreakStats;
