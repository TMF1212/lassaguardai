import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertTriangle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StateData {
  name: string;
  cases: number;
  deaths: number;
  status: "critical" | "high" | "moderate" | "low";
  x: number;
  y: number;
}

const stateOutbreakData: StateData[] = [
  { name: "Ondo", cases: 245, deaths: 38, status: "critical", x: 33, y: 62 },
  { name: "Edo", cases: 198, deaths: 27, status: "critical", x: 38, y: 58 },
  { name: "Bauchi", cases: 134, deaths: 19, status: "high", x: 58, y: 28 },
  { name: "Taraba", cases: 112, deaths: 15, status: "high", x: 68, y: 38 },
  { name: "Ebonyi", cases: 98, deaths: 14, status: "high", x: 52, y: 60 },
  { name: "Plateau", cases: 87, deaths: 12, status: "moderate", x: 55, y: 35 },
  { name: "Nasarawa", cases: 76, deaths: 10, status: "moderate", x: 52, y: 40 },
  { name: "Benue", cases: 68, deaths: 9, status: "moderate", x: 55, y: 48 },
  { name: "Kogi", cases: 54, deaths: 8, status: "moderate", x: 42, y: 50 },
  { name: "Kaduna", cases: 47, deaths: 6, status: "moderate", x: 48, y: 22 },
  { name: "Lagos", cases: 32, deaths: 3, status: "low", x: 22, y: 62 },
  { name: "Ogun", cases: 28, deaths: 2, status: "low", x: 25, y: 58 },
  { name: "Oyo", cases: 25, deaths: 2, status: "low", x: 28, y: 54 },
  { name: "Kano", cases: 22, deaths: 3, status: "low", x: 52, y: 15 },
  { name: "Enugu", cases: 45, deaths: 6, status: "moderate", x: 48, y: 58 },
  { name: "Delta", cases: 38, deaths: 5, status: "moderate", x: 37, y: 65 },
  { name: "Anambra", cases: 30, deaths: 4, status: "low", x: 45, y: 62 },
  { name: "FCT", cases: 20, deaths: 2, status: "low", x: 47, y: 40 },
];

const statusConfig = {
  critical: { color: "bg-destructive", ring: "ring-destructive/40", pulse: true, label: "Critical", textColor: "text-destructive" },
  high: { color: "bg-warning", ring: "ring-warning/40", pulse: true, label: "High", textColor: "text-warning" },
  moderate: { color: "bg-accent", ring: "ring-accent/40", pulse: false, label: "Moderate", textColor: "text-accent" },
  low: { color: "bg-muted-foreground/50", ring: "ring-muted/40", pulse: false, label: "Low", textColor: "text-muted-foreground" },
};

const NigeriaOutbreakMap = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const getMarkerSize = (status: string) => {
    switch (status) {
      case "critical": return "w-5 h-5 md:w-6 md:h-6";
      case "high": return "w-4 h-4 md:w-5 md:h-5";
      case "moderate": return "w-3.5 h-3.5 md:w-4 md:h-4";
      default: return "w-3 h-3 md:w-3.5 md:h-3.5";
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            <span>Interactive Outbreak Map</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3">
            Nigeria Lassa Fever Hotspot Map
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tap any hotspot to view state-level outbreak details. Larger, pulsing markers indicate higher severity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-border/50">
            <CardContent className="p-4 md:p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Map */}
                <div className="relative flex-1 min-h-[350px] md:min-h-[450px] rounded-xl bg-secondary/50 border border-border/30 overflow-hidden">
                  {/* Nigeria outline shape (simplified SVG) */}
                  <svg
                    viewBox="0 0 100 85"
                    className="absolute inset-0 w-full h-full p-4 md:p-6"
                    style={{ filter: "drop-shadow(0 1px 3px hsl(210 20% 50% / 0.15))" }}
                  >
                    <path
                      d="M15,40 L18,32 L22,26 L28,22 L35,18 L42,15 L48,12 L55,13 L60,16 L65,18 L70,22 L75,28 L78,32 L80,38 L78,45 L75,50 L72,55 L68,60 L62,65 L56,68 L50,70 L44,72 L38,70 L32,68 L26,65 L22,60 L18,55 L15,48 Z"
                      fill="hsl(var(--primary) / 0.08)"
                      stroke="hsl(var(--primary) / 0.25)"
                      strokeWidth="0.5"
                    />
                  </svg>

                  {/* Hotspot markers */}
                  {stateOutbreakData.map((state) => {
                    const config = statusConfig[state.status];
                    return (
                      <motion.button
                        key={state.name}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full ${config.color} ${getMarkerSize(state.status)} ring-2 ${config.ring} cursor-pointer z-10 ${config.pulse ? "animate-pulse" : ""}`}
                        style={{ left: `${state.x}%`, top: `${state.y}%` }}
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedState(state)}
                        onMouseEnter={() => setHoveredState(state.name)}
                        onMouseLeave={() => setHoveredState(null)}
                        aria-label={`${state.name}: ${state.cases} cases`}
                      />
                    );
                  })}

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hoveredState && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-3 left-3 bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-md pointer-events-none z-20"
                      >
                        <span className="text-sm font-semibold">{hoveredState}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Details panel */}
                <div className="lg:w-72 xl:w-80 space-y-4">
                  {/* Legend */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Risk Legend</h4>
                    {(["critical", "high", "moderate", "low"] as const).map((level) => {
                      const config = statusConfig[level];
                      return (
                        <div key={level} className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? "animate-pulse" : ""}`} />
                          <span className={`text-sm font-medium capitalize ${config.textColor}`}>{config.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected state detail */}
                  <AnimatePresence mode="wait">
                    {selectedState ? (
                      <motion.div
                        key={selectedState.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="p-4 rounded-xl bg-secondary/60 border border-border/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold font-display">{selectedState.name} State</h4>
                          <button onClick={() => setSelectedState(null)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusConfig[selectedState.status].color} text-card`}>
                          <AlertTriangle className="w-3 h-3" />
                          {selectedState.status} risk
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-2xl font-bold font-display">{selectedState.cases}</div>
                            <div className="text-xs text-muted-foreground">Confirmed Cases</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold font-display text-destructive">{selectedState.deaths}</div>
                            <div className="text-xs text-muted-foreground">Deaths</div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CFR: <span className="font-semibold text-foreground">{((selectedState.deaths / selectedState.cases) * 100).toFixed(1)}%</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-xl bg-secondary/40 border border-dashed border-border/40 text-center"
                      >
                        <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Tap a hotspot on the map to view details
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick stats */}
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="text-xs font-semibold text-destructive">Highest Alert</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ondo & Edo states remain critical zones. Enhanced surveillance recommended.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default NigeriaOutbreakMap;
