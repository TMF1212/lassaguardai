import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HealthChatbot from "@/components/HealthChatbot";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Stethoscope, Building2, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", email);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">
                LassaGuard AI Professional Login
              </h1>
              <p className="text-muted-foreground">
                Secure access for Lassa fever response teams and public health authorities.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="healthcare" className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="healthcare" className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Healthcare
                    </TabsTrigger>
                    <TabsTrigger value="authority" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Authority
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="healthcare">
                    <p className="text-sm text-muted-foreground mb-4">
                      Access Lassa fever case management, clinical checklists, and reporting tools.
                    </p>
                  </TabsContent>
                  <TabsContent value="authority">
                    <p className="text-sm text-muted-foreground mb-4">
                      Access Lassa fever outbreak intelligence, analytics dashboards, and data exports.
                    </p>
                  </TabsContent>
                </Tabs>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@healthcare.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Secure Login
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    This is a demo login. In production, LassaGuard AI would integrate with secure authentication 
                    and role-based access control for verified Lassa fever response professionals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default Login;
