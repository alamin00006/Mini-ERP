import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginMutation } from "@/redux";
import { useAppDispatch } from "@/redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { loginFormValues, loginSchema } from "@/schemas/loginSchema";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, hydrated } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (hydrated && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  const [login] = useLoginMutation();

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await login({ email: values.email, password: values.password }).unwrap();
      dispatch(
        setCredentials({
          token: result.data.accessToken,
          user: result.data.user,
          permissions: result.data.user.permissions || [],
        }),
      );
      toast.success(`Welcome, ${result.data.user.name}`);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      const err = error as { data?: { message?: string } } | undefined;
      setError(err?.data?.message || "An error occurred during login. Please try again.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
