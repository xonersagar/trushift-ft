import { ApiSection } from "@/components/ApiSection";
import { ApiEndpoint } from "@/components/ApiEndpoint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authAPI, companyAPI, employeeAPI, verificationAPI, setAuthToken, clearAuthToken, getAuthToken } from "@/lib/api";
import { Shield, Database, Users, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getAuthToken());
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setHasToken(false);
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">TrueShift API Tester</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Base URL: <code className="bg-muted px-2 py-1 rounded text-xs">https://trueshift-backend-1.onrender.com</code>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasToken ? (
                <>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    🔓 Authenticated
                  </Badge>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Badge variant="outline" className="bg-muted">
                  🔒 Not Authenticated
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Authentication Section */}
        <ApiSection
          title="🔐 Authentication"
          description="Register, verify OTP, and login endpoints"
        >
          <ApiEndpoint
            method="POST"
            endpoint="/api/auth/register"
            description="Register a new employee account. Sends OTP to email."
            fields={[
              { name: "name", type: "text", label: "Name", placeholder: "John Doe" },
              { name: "email", type: "email", label: "Email", placeholder: "john@example.com" },
              { name: "password", type: "password", label: "Password", placeholder: "••••••••" },
            ]}
            onSubmit={async (data) => {
              const response = await authAPI.register({
                email: data.email,
                password: data.password,
                name: data.name
              });
              return response.data;
            }}
          />

          <ApiEndpoint
            method="POST"
            endpoint="/api/auth/verify-otp"
            description="Verify the OTP sent to your email"
            fields={[
              { name: "email", type: "email", label: "Email", placeholder: "john@example.com" },
              { name: "otp", type: "text", label: "OTP Code", placeholder: "123456" },
            ]}
            onSubmit={async (data) => {
              const response = await authAPI.verifyOtp(data.email, data.otp);
              return response.data;
            }}
          />

          <ApiEndpoint
            method="POST"
            endpoint="/api/auth/login"
            description="Login and receive JWT token"
            fields={[
              { name: "email", type: "email", label: "Email", placeholder: "john@example.com" },
              { name: "password", type: "password", label: "Password", placeholder: "••••••••" },
            ]}
            onSubmit={async (data) => {
              const response = await authAPI.login(data.email, data.password);
              const token = response.data;
              setAuthToken(token);
              setHasToken(true);
              toast.success("JWT token saved!");
              return { token, message: "Token saved to localStorage" };
            }}
          />
        </ApiSection>

        {/* Company Section */}
        <ApiSection
          title="🏢 Company Management"
          description="Register companies and retrieve company information"
        >
          <ApiEndpoint
            method="POST"
            endpoint="/api/company/register"
            description="Register a new company and get a unique trust code"
            fields={[
              { name: "name", type: "text", label: "Company Name", placeholder: "Acme Corp" },
              { name: "email", type: "email", label: "Company Email", placeholder: "info@acme.com" },
            ]}
            onSubmit={async (data) => {
              const response = await companyAPI.register({
                email: data.email,
                name: data.name
              });
              return response.data;
            }}
          />

          <ApiEndpoint
            method="GET"
            endpoint="/api/company/trust/{code}"
            description="Get company details by trust code"
            fields={[
              { name: "code", type: "text", label: "Trust Code", placeholder: "ABC123" },
            ]}
            onSubmit={async (data) => {
              const response = await companyAPI.getByTrustCode(data.code);
              return response.data;
            }}
          />

          <ApiEndpoint
            method="GET"
            endpoint="/api/company/all"
            description="Get all registered companies"
            fields={[]}
            onSubmit={async () => {
              const response = await companyAPI.getAll();
              return response.data;
            }}
            requiresAuth
          />
        </ApiSection>

        {/* Employee Section */}
        <ApiSection
          title="👥 Employee Management"
          description="Create and retrieve employee information"
        >
          <ApiEndpoint
            method="POST"
            endpoint="/api/employees"
            description="Create a new employee record (internal use)"
            fields={[
              { name: "employee", type: "textarea", label: "Employee JSON", placeholder: '{"name": "John", "email": "john@example.com", ...}' },
            ]}
            onSubmit={async (data) => {
              const employeeData = JSON.parse(data.employee);
              const response = await employeeAPI.create(employeeData);
              return response.data;
            }}
            requiresAuth
          />

          <ApiEndpoint
            method="GET"
            endpoint="/api/employees/{id}"
            description="Get employee by ID"
            fields={[
              { name: "id", type: "number", label: "Employee ID", placeholder: "1" },
            ]}
            onSubmit={async (data) => {
              const response = await employeeAPI.getById(Number(data.id));
              return response.data;
            }}
            requiresAuth
          />

          <ApiEndpoint
            method="GET"
            endpoint="/api/employees/trust/{trustCode}"
            description="Get employee by trust code"
            fields={[
              { name: "trustCode", type: "text", label: "Trust Code", placeholder: "EMP123" },
            ]}
            onSubmit={async (data) => {
              const response = await employeeAPI.getByTrustCode(data.trustCode);
              return response.data;
            }}
            requiresAuth
          />
        </ApiSection>

        {/* Verification Section */}
        <ApiSection
          title="✅ Verification Requests"
          description="Submit and manage verification requests"
        >
          <ApiEndpoint
            method="POST"
            endpoint="/api/verify/request"
            description="Submit a new verification request"
            fields={[
              { name: "request", type: "textarea", label: "Verification Request JSON", placeholder: '{"requestedByCompany": {...}, "employee": {...}}' },
            ]}
            onSubmit={async (data) => {
              const requestData = JSON.parse(data.request);
              const response = await verificationAPI.submitRequest(requestData);
              return response.data;
            }}
            requiresAuth
          />

          <ApiEndpoint
            method="GET"
            endpoint="/api/verify/{id}"
            description="Get verification request by ID"
            fields={[
              { name: "id", type: "number", label: "Request ID", placeholder: "1" },
            ]}
            onSubmit={async (data) => {
              const response = await verificationAPI.getById(Number(data.id));
              return response.data;
            }}
            requiresAuth
          />

          <ApiEndpoint
            method="GET"
            endpoint="/api/verify/all"
            description="Get all verification requests"
            fields={[]}
            onSubmit={async () => {
              const response = await verificationAPI.getAll();
              return response.data;
            }}
            requiresAuth
          />
        </ApiSection>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>TrueShift API Testing Interface • Built with React & TypeScript</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
