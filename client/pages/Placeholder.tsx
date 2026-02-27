import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  userType?: "admin" | "user";
}

export default function Placeholder({
  title,
  description,
  userType = "admin",
}: PlaceholderProps) {
  return (
    <Layout userType={userType}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 md:p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
            <ArrowRight className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          <p className="text-sm text-muted-foreground">
            Continue with your next request to build this page.
          </p>
        </Card>
      </div>
    </Layout>
  );
}
