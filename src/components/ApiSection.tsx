import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ApiSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const ApiSection = ({ title, description, children }: ApiSectionProps) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
};
