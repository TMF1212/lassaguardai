import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserRoles from "@/components/UserRoles";
import SDGSection from "@/components/SDGSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <UserRoles />
      <SDGSection />
      <Footer />
    </div>
  );
};

export default Index;