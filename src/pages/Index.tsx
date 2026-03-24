import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OutbreakStats from "@/components/OutbreakStats";
import NigeriaOutbreakMap from "@/components/NigeriaOutbreakMap";
import Features from "@/components/Features";
import UserRoles from "@/components/UserRoles";
import NigeriaHealthContacts from "@/components/AfricaHealthContacts";
import SDGSection from "@/components/SDGSection";
import AlertSubscription from "@/components/AlertSubscription";
import Footer from "@/components/Footer";
import HealthChatbot from "@/components/HealthChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <OutbreakStats />
      <NigeriaOutbreakMap />
      <Features />
      <UserRoles />
      <NigeriaHealthContacts />
      <AlertSubscription />
      <SDGSection />
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default Index;
