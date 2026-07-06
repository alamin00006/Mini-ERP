import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLoginMutation } from "@/redux";
import { useAppDispatch } from "@/redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type Values = z.infer<typeof schema>;

type DemoRole = "admin" | "manager" | "employee";

const DEMO_ACCOUNTS: Record<string, { password: string; name: string; role: DemoRole }> = {
  "admin@demo.com": { password: "admin123", name: "Alex Admin", role: "admin" },
  "manager@demo.com": { password: "manager123", name: "Morgan Manager", role: "manager" },
  "employee@demo.com": { password: "employee123", name: "Emma Employee", role: "employee" },
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, hydrated } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (hydrated && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  const signInAs = (email: string, password: string, name: string, role: DemoRole) => {
    const token = `demo-token-${role}-${Date.now()}`;
    dispatch(
      setCredentials({
        token,
        user: { id: role, email, name, role },
      }),
    );
    toast.success(`Welcome, ${name}`);
    navigate("/dashboard", { replace: true });
  };

  const [login] = useLoginMutation();

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      const demo = DEMO_ACCOUNTS[values.email.toLowerCase()];
      if (demo && demo.password === values.password) {
        signInAs(values.email.toLowerCase(), demo.password, demo.name, demo.role);
        return;
      }
      // Fallback to real API if configured
      const result = await login({ email: values.email, password: values.password }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      toast.success(`Welcome, ${result.user.name}`);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  });

  const fillDemo = (email: string) => {
    const acc = DEMO_ACCOUNTS[email];
    if (!acc) return;
    setValue("email", email, { shouldValidate: true });
    setValue("password", acc.password, { shouldValidate: true });
  };

  const quickLogin = (email: string) => {
    const acc = DEMO_ACCOUNTS[email];
    if (!acc) return;
    signInAs(email, acc.password, acc.name, acc.role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Access your Mini ERP console.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label className="mb-2 block">Email</Label>
              <Input type="email" autoComplete="email" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-2 block">Password</Label>
              <Input type="password" autoComplete="current-password" {...register("password")} />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 border-t pt-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Demo accounts
            </p>
            <div className="grid gap-2">
              {(Object.keys(DEMO_ACCOUNTS) as Array<keyof typeof DEMO_ACCOUNTS>).map((email) => {
                const acc = DEMO_ACCOUNTS[email];
                return (
                  <div
                    key={email}
                    className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{acc.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {email} · <span className="capitalize">{acc.role}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemo(email)}
                      >
                        Fill
                      </Button>
                      <Button type="button" size="sm" onClick={() => quickLogin(email)}>
                        Login
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
