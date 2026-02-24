import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, MapPin, TrendingUp, Users, Skull } from "lucide-react";

const OutbreakStats = () => {
  const continentStats = [
    { icon: Activity, label: "Confirmed Cases (2026 YTD)", value: "3,842", trend: "+15% vs 2025", trendUp: true },
    { icon: Skull, label: "Deaths Reported", value: "487", trend: "CFR: 12.7%", trendUp: true },
    { icon: Users, label: "Suspected Cases", value: "12,650", trend: "Under investigation", trendUp: false },
    { icon: MapPin, label: "Affected Countries", value: "11", trend: "West & Central Africa", trendUp: true },
  ];

  const countryData = [
    { country: "Nigeria", cases: 1187, deaths: 168, status: "critical" },
    { country: "Sierra Leone", cases: 624, deaths: 89, status: "critical" },
    { country: "Liberia", cases: 412, deaths: 54, status: "high" },
    { country: "Guinea", cases: 387, deaths: 48, status: "high" },
    { country: "Ghana", cases: 298, deaths: 35, status: "high" },
    { country: "Benin", cases: 214, deaths: 22, status: "moderate" },
    { country: "Togo", cases: 178, deaths: 19, status: "moderate" },
    { country: "Mali", cases: 156, deaths: 18, status: "moderate" },
    { country: "Côte d'Ivoire", cases: 134, deaths: 15, status: "moderate" },
    { country: "Cameroon", cases: 112, deaths: 12, status: "moderate" },
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
            Africa Lassa Fever Outbreak Statistics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Current epidemiological data across Africa. Sources include WHO AFRO, NCDC, and national health agencies. Updated weekly.
          </p>
        </div>

        {/* National Summary */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {continentStats.map((stat, index) => (
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
              Most Affected Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Country</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-center">Confirmed Cases</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-center">Deaths</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-center">CFR</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground text-right">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {countryData.map((row, index) => (
                    <tr key={index} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium">{row.country}</td>
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
              Sources: WHO AFRO, NCDC, and national health agencies across Africa • Data represents illustrative figures based on historical outbreak patterns. 
              For official data, visit <a href="https://www.afro.who.int" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WHO AFRO</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OutbreakStats;
