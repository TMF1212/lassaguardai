import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserRoles from "@/components/UserRoles";
import SDGSection from "@/components/SDGSection";
import Footer from "@/components/Footer";
import HealthChatbot from "@/components/HealthChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <UserRoles />
      <SDGSection />
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default Index;