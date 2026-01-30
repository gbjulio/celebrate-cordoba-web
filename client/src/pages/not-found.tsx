import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center celebrate-shell px-4">
      <Card className="w-full max-w-md mx-4 rounded-3xl border-border/70 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[hsl(0_84%_55%)]" />
            <h1 className="text-2xl font-extrabold tracking-tight">Página no encontrada</h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-404">
            Parece que esta página no existe.
          </p>

          <Button asChild className="mt-5 w-full rounded-full font-extrabold" data-testid="button-volver-inicio">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
