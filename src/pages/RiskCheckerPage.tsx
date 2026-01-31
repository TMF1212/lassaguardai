import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RiskChecker from "@/components/RiskChecker";
import HealthChatbot from "@/components/HealthChatbot";

const RiskCheckerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              AI-Powered Risk Assessment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions about your symptoms and exposure history to receive personalized risk guidance.
            </p>
          </div>
          <RiskChecker />
        </div>
      </main>
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default RiskCheckerPage;