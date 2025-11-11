import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  description: string;
  fields?: Array<{ name: string; type: "text" | "email" | "password" | "number" | "textarea"; label: string; placeholder?: string }>;
  onSubmit: (data: Record<string, string>) => Promise<any>;
  requiresAuth?: boolean;
}

export const ApiEndpoint = ({ method, endpoint, description, fields = [], onSubmit, requiresAuth }: ApiEndpointProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const methodColors = {
    GET: "bg-success text-success-foreground",
    POST: "bg-primary text-primary-foreground",
    PUT: "bg-accent text-accent-foreground",
    DELETE: "bg-destructive text-destructive-foreground",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const result = await onSubmit(formData);
      setResponse(JSON.stringify(result, null, 2));
      toast.success("Request successful!");
    } catch (error: any) {
      const errorMsg = error.response?.data || error.message || "Request failed";
      setResponse(JSON.stringify({ error: errorMsg }, null, 2));
      toast.error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border rounded-lg p-6 space-y-4 bg-card">
      <div className="flex items-start gap-3">
        <Badge className={methodColors[method]} variant="secondary">
          {method}
        </Badge>
        <div className="flex-1">
          <code className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded">
            {endpoint}
          </code>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
          {requiresAuth && (
            <Badge variant="outline" className="mt-2">
              🔒 Requires JWT
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="font-mono text-sm"
                rows={6}
              />
            ) : (
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            )}
          </div>
        ))}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Send Request"}
        </Button>
      </form>

      {response && (
        <div className="mt-4">
          <Label>Response:</Label>
          <pre className="mt-2 p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono text-foreground">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
};
