import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type DayStatus = "available" | "booked" | "blocked" | "booked-morning" | "booked-afternoon";

interface Booking {
  id: string;
  date: string;
  status: DayStatus;
}

function classNames(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check auth status
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (authData?.user) {
      setIsLoggedIn(true);
    }
  }, [authData]);

  // Get bookings
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: isLoggedIn,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Sesión iniciada correctamente" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Register mutation (for first-time setup)
  const registerMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Usuario creado correctamente" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      setIsLoggedIn(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      navigate("/");
      toast({ title: "Sesión cerrada" });
    },
  });

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ date, status }: { date: string; status: DayStatus }) => {
      const res = await fetch(`/api/bookings/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update booking");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Reserva actualizada" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async (date: string) => {
      const res = await fetch(`/api/bookings/${date}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete booking");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Reserva eliminada" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ username, password });
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = bookings.find((b) => b.date === dateStr);
    
    // Cycle through statuses: available -> booked-morning -> booked-afternoon -> booked -> blocked -> (delete)
    let newStatus: DayStatus | null = null;
    
    if (!existing || existing.status === "available") {
      newStatus = "booked-morning";
    } else if (existing.status === "booked-morning") {
      newStatus = "booked-afternoon";
    } else if (existing.status === "booked-afternoon") {
      newStatus = "booked";
    } else if (existing.status === "booked") {
      newStatus = "blocked";
    } else if (existing.status === "blocked") {
      // Delete the booking to return to default
      deleteBookingMutation.mutate(dateStr);
      return;
    }

    if (newStatus) {
      updateBookingMutation.mutate({ date: dateStr, status: newStatus });
    }
  };

  // Calendar calculation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const legend = useMemo(
    () => [
      { key: "available", label: "Disponible", color: "bg-[hsl(140_68%_44%/0.16)] border-[hsl(140_58%_38%/0.25)]" },
      { key: "booked-morning", label: "Reservado mañana", color: "bg-[linear-gradient(135deg,hsl(0_84%_55%/0.14)_50%,hsl(140_68%_44%/0.16)_50%)] border-[hsl(0_70%_45%/0.25)]" },
      { key: "booked-afternoon", label: "Reservado tarde", color: "bg-[linear-gradient(135deg,hsl(140_68%_44%/0.16)_50%,hsl(0_84%_55%/0.14)_50%)] border-[hsl(140_58%_38%/0.25)]" },
      { key: "booked", label: "Reservado", color: "bg-[hsl(0_84%_55%/0.14)] border-[hsl(0_70%_45%/0.25)]" },
      { key: "blocked", label: "Bloqueado", color: "bg-muted/50 border-border" },
    ],
    []
  );

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(196_92%_92%)] via-[hsl(330_92%_95%)] to-[hsl(48_98%_95%)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Panel de Administración</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(196_92%_92%)] via-[hsl(330_92%_95%)] to-[hsl(48_98%_95%)] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button onClick={() => logoutMutation.mutate()} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Reservas</CardTitle>
            <p className="text-sm text-muted-foreground">Haz clic en un día para cambiar su estado</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">
                {format(currentMonth, "MMMM yyyy", { locale: require("date-fns/locale/es") })}
              </h2>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, idx) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const booking = bookings.find((b) => b.date === dateStr);
                const status = booking?.status || "available";
                const inMonth = isSameMonth(date, currentMonth);

                const statusColor = legend.find((l) => l.key === status)?.color || legend[0].color;

                return (
                  <button
                    key={idx}
                    onClick={() => handleDayClick(date)}
                    className={classNames(
                      "h-12 rounded-lg border text-sm font-bold transition cursor-pointer hover:brightness-105",
                      inMonth ? "" : "opacity-40",
                      statusColor
                    )}
                  >
                    {format(date, "d")}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2">
              <h3 className="font-bold text-sm">Leyenda:</h3>
              <div className="flex flex-wrap gap-3">
                {legend.map((l) => (
                  <div key={l.key} className="flex items-center gap-2">
                    <span className={classNames("h-4 w-4 rounded border", l.color)} />
                    <span className="text-xs">{l.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Haz clic múltiples veces en un día para ciclar entre estados.
                El último clic elimina la reserva.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
