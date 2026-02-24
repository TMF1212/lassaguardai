import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RiskChecker from "@/components/RiskChecker";
import HealthChatbot from "@/components/HealthChatbot";

const RiskCheckerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Colorful hero banner */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 border-b border-primary/10">
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4">
              <span>🛡️</span>
              <span>AI-Powered Assessment</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
              AI-Powered Risk Assessment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions about your symptoms and exposure history to receive personalized risk guidance — designed for communities across Africa.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10">
          <RiskChecker />
        </div>
      </main>
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default RiskCheckerPage;