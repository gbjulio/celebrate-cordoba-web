import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
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
  isBefore,
} from "date-fns";

import logo from "@assets/image_1769815092292.png";
import celebrateLogo from "@/assets/images/logo.png";
import heroBalloons from "@/assets/images/hero-balloons.png";
import partyStickers from "@/assets/images/stickers-party.png";

// Gallery Images
import imgSalon from "@/assets/images/venue-salon.jpg";
import imgPlayground from "@/assets/images/venue-playground.jpg";
import imgCandyBar from "@/assets/images/venue-candybar.jpg";
import imgDecoration from "@/assets/images/venue-decoration.jpg";
import imgFamily from "@/assets/images/venue-family.jpg";
import imgKitchen from "@/assets/images/venue-kitchen.jpg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const WHATSAPP_NUMBER = "614994794";
const CONTACT_EMAIL = "celebratecordoba@gmail.com";
const ADDRESS = "C. Letonia, 145, 5b, 14014 Córdoba";

type DayStatus = "available" | "booked" | "blocked" | "booked-morning" | "booked-afternoon";

function classNames(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useStickyShadow() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

function Nav() {
  const scrolled = useStickyShadow();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={classNames(
        "sticky top-0 z-50",
        scrolled ? "backdrop-blur-xl" : "",
      )}
    >
      <div
        className={classNames(
          "mx-auto max-w-6xl px-4 sm:px-6",
          "mt-2",
        )}
      >
        <div
          className={classNames(
            "glass rounded-2xl",
            "px-3 sm:px-4 py-1.5",
            scrolled ? "shadow-md" : "shadow-sm",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Celebrate Córdoba"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white/70 p-1"
                data-testid="img-logo"
              />
              <div className="leading-tight">
                <div className="font-display text-base sm:text-lg font-extrabold tracking-tight">
                  Celebrate Córdoba
                </div>
                <div
                  className="text-xs sm:text-sm text-muted-foreground"
                  data-testid="text-tagline"
                >
                  Celebraciones y eventos con magia
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {["inicio", "instalaciones", "tarifas", "disponibilidad", "contacto"].map(
                (id) => (
                  <button
                    key={id}
                    onClick={() => scrollToId(id)}
                    className="px-3 py-2 text-sm font-bold tracking-tight text-foreground/80 hover:text-foreground transition focus-ring rounded-xl"
                    data-testid={`link-nav-${id}`}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => scrollToId("disponibilidad")}
                className="rounded-full font-extrabold party-bounce"
                data-testid="button-reservar"
              >
                Reservar
              </Button>
              <button
                className="md:hidden bubble h-11 w-11 grid place-items-center hover:bg-white/90 transition focus-ring"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label="Abrir menú"
                data-testid="button-menu"
              >
                <span className="text-lg font-extrabold">≡</span>
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden mt-3 pt-3 border-t border-border/70">
              <div className="grid gap-1">
                {["inicio", "instalaciones", "tarifas", "disponibilidad", "contacto"].map(
                  (id) => (
                    <button
                      key={id}
                      onClick={() => {
                        setOpen(false);
                        scrollToId(id);
                      }}
                      className="px-3 py-2 text-sm font-bold tracking-tight text-foreground/80 hover:text-foreground transition focus-ring rounded-xl text-left"
                      data-testid={`link-nav-mobile-${id}`}
                    >
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <section id="inicio" className="pt-8 sm:pt-10" data-testid="section-hero">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-border/70 glass">
          <div className="absolute inset-0">
            <img
              src={heroBalloons}
              alt="Fondo de globos"
              className="absolute inset-0 h-full w-full object-cover opacity-[0.28]"
              loading="lazy"
              data-testid="img-hero-bg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/35 to-white/88" />
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-28 h-80 w-80 rounded-full bg-[hsl(196_92%_52%/0.36)] blur-3xl" />
            <div className="absolute -top-20 -right-28 h-80 w-80 rounded-full bg-[hsl(340_92%_68%/0.36)] blur-3xl" />
            <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-[hsl(48_98%_62%/0.30)] blur-3xl" />
          </div>

          <div className="relative grid md:grid-cols-12 gap-6 p-6 sm:p-9">
            <motion.div
              className="md:col-span-6"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 sticker px-3 py-1.5 text-sm font-extrabold" data-testid="badge-hero">
                <Sparkles className="h-4 w-4 text-[hsl(340_92%_60%)]" />
                Celebrate Córdoba
              </div>

              <h1
                className="mt-4 font-display text-4xl sm:text-6xl leading-[1.00] font-extrabold tracking-tight"
                data-testid="text-title"
              >
                Celebraciones con estilo
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-prose" data-testid="text-subtitle">
                Cumpleaños, bautizos, baby showers, revelaciones, jubilaciones y mucho más.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => scrollToId("contacto")}
                  className="rounded-full font-extrabold party-bounce"
                  data-testid="button-portada-contacto"
                >
                  Contactar
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => scrollToId("disponibilidad")}
                  className="rounded-full font-extrabold party-bounce"
                  data-testid="button-portada-disponibilidad"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Ver disponibilidad
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            >
              <div className="grid gap-4">
                <div className="glass rounded-3xl p-6" data-testid="card-portada-contacto">
                  <div className="font-display text-2xl font-extrabold tracking-tight">Contacto</div>
                  <div className="mt-4 flex items-center gap-6">
                  <div className="grid gap-3 text-sm flex-1">
                    <div className="flex items-start gap-3" data-testid="row-portada-address">
                      <MapPin className="h-5 w-5 text-[hsl(196_92%_46%)] mt-0.5" />
                      <div>
                        <div className="font-extrabold tracking-tight">Dirección</div>
                        <div className="text-muted-foreground" data-testid="text-portada-address">{ADDRESS}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3" data-testid="row-portada-whatsapp">
                      <MessageCircle className="h-5 w-5 text-[hsl(330_92%_60%)] mt-0.5" />
                      <div>
                        <div className="font-extrabold tracking-tight">WhatsApp</div>
                        <a
                          className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                          href={waHref}
                          target="_blank"
                          rel="noreferrer"
                          data-testid="link-portada-whatsapp"
                        >
                          {WHATSAPP_NUMBER}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3" data-testid="row-portada-email">
                      <Phone className="h-5 w-5 text-[hsl(48_98%_44%)] mt-0.5" />
                      <div>
                        <div className="font-extrabold tracking-tight">Email</div>
                        <a
                          className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                          href={`mailto:${CONTACT_EMAIL}`}
                          data-testid="link-portada-email"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <img src={celebrateLogo} alt="Celebrate Córdoba" className="h-32 w-32 rounded-full object-cover" data-testid="img-portada-logo" />
                  </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Presentation() {
  return (
    <section className="pt-10 sm:pt-14" data-testid="section-presentacion">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight" data-testid="text-presentacion-title">
              Celebraciones sin estrés
            </h2>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg" data-testid="text-presentacion-desc">
              Celebrate Córdoba es un espacio versátil para celebrar cumpleaños, bautizos, baby showers, revelaciones, jubilaciones y mucho más.
              Cuidamos cada detalle para que tu evento sea fácil, bonito y seguro.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Espacio versátil",
                  desc: "Salón para mesa dulce, meriendas y zona de estar.",
                },
                {
                  title: "Zona de juegos",
                  desc: "Para distintas edades, con ambiente cómodo para familias.",
                },
                {
                  title: "Estilo adorable",
                  desc: "Decoración y vibe alegre, listo para fotos increíbles.",
                },
                {
                  title: "Acompañamiento",
                  desc: "Te guiamos para elegir la opción ideal según tu plan.",
                },
              ].map((v) => (
                <div key={v.title} className="glass rounded-2xl p-5" data-testid={`card-valor-${v.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="font-extrabold tracking-tight">{v.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="glass rounded-3xl p-6">
              <div className="font-display text-2xl font-extrabold tracking-tight" data-testid="text-destacado-title">
                ¿Por qué elegirnos?
              </div>
              <div className="mt-3 grid gap-3">
                {["Ubicación cómoda", "Horarios flexibles", "Tarifas claras", "Ambiente familiar"].map((t, i) => (
                  <div key={t} className="flex items-center gap-3" data-testid={`row-why-${i}`}>
                    <span className="h-9 w-9 rounded-2xl bg-[hsl(196_92%_52%/0.14)] border border-border grid place-items-center">
                      <Star className="h-4 w-4 text-[hsl(196_92%_42%)]" />
                    </span>
                    <div className="font-extrabold tracking-tight">{t}</div>
                  </div>
                ))}
              </div>
              <Separator className="my-5" />
              <div className="text-sm text-muted-foreground" data-testid="text-destacado-note">
                También podemos adaptar la experiencia según el tipo de evento. Cuéntanos tu idea.
              </div>
              <Button
                variant="secondary"
                className="mt-4 w-full rounded-full font-extrabold"
                onClick={() => scrollToId("contacto")}
                data-testid="button-consultar"
              >
                Consultar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const photos = useMemo(
    () =>
      [
        { label: "Salón principal", seed: "salon", src: imgSalon },
        { label: "Zona de juegos", seed: "juegos", src: imgPlayground },
        { label: "Mesa dulce", seed: "mesa", src: imgCandyBar },
        { label: "Decoración", seed: "deco", src: imgDecoration },
        { label: "Celebraciones", seed: "celebraciones", src: imgFamily },
        { label: "Cocina y Detalles", seed: "detalles", src: imgKitchen },
      ] as const,
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="instalaciones" className="pt-10 sm:pt-14" data-testid="section-galeria">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight" data-testid="text-galeria-title">
            Instalaciones
          </h2>
          <p className="mt-2 text-muted-foreground" data-testid="text-galeria-desc">
            Una muestra de cómo se vive Celebrate Córdoba.
          </p>
        </div>

        <div className="mt-6 relative group" data-testid="carousel-galeria">
          <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4 py-4">
              {photos.map((p, idx) => (
                <div className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] pl-4" key={p.seed}>
                  <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    <img
                      alt={p.label}
                      src={p.src}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-bold text-lg">{p.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-foreground hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50 cursor-pointer"
            onClick={scrollPrev}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-foreground hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50 cursor-pointer"
            onClick={scrollNext}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Tarifas() {
  const paquetes = [
    {
      title: "Lunes a jueves · Mañanas",
      time: "10:00 a 14:00",
      price: "50€",
      details: ["4 horas", "Ideal para celebraciones cortas", "Consultar servicios incluidos"],
    },
    {
      title: "Lunes a jueves · Tardes",
      time: "16:00 a 22:00",
      price: "70€",
      details: ["6 horas", "Merienda / celebración", "Consultar servicios incluidos"],
    },
    {
      title: "Lunes a jueves · Día completo",
      time: "10:00 a 22:00",
      price: "90€",
      details: ["12 horas", "Más tiempo para disfrutar", "Consultar servicios incluidos"],
    },
    {
      title: "Vie-Sáb-Dom / vísperas de festivos / festivos · Mañanas",
      time: "10:00 a 14:00",
      price: "80€",
      details: ["4 horas", "Fin de semana", "Consultar servicios incluidos"],
    },
    {
      title: "Vie-Sáb-Dom / vísperas de festivos / festivos · Tardes",
      time: "16:00 a 23:00",
      price: "120€",
      details: ["7 horas", "Horario extendido", "Consultar servicios incluidos"],
    },
    {
      title: "Vie-Sáb-Dom / vísperas de festivos / festivos · Día completo",
      time: "10:00 a 23:00",
      price: "145€",
      details: ["13 horas", "Todo el día", "Consultar servicios incluidos"],
    },
  ];

  return (
    <section id="tarifas" className="pt-10 sm:pt-14" data-testid="section-tarifas">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight" data-testid="text-tarifas-title">
            Tarifas
          </h2>
          <p className="mt-2 text-muted-foreground" data-testid="text-tarifas-desc">
            Paquetes claros y sin sorpresas. Mañana, tarde o día completo.
          </p>

          <div
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            data-testid="grid-paquetes"
          >
            {paquetes.map((p, idx) => (
              <Card
                key={p.title}
                className="glass rounded-3xl border-border/70 shadow-sm"
                data-testid={`card-paquete-${idx}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg font-extrabold tracking-tight">
                    {p.title}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground" data-testid={`text-paquete-time-${idx}`}>
                    {p.time}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-extrabold text-muted-foreground">Precio</div>
                      <div className="font-display text-3xl font-extrabold" data-testid={`text-paquete-price-${idx}`}>
                        {p.price}
                      </div>
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm">
                    {p.details.map((d, i) => (
                      <li key={d} className="flex items-start gap-2" data-testid={`list-paquete-${idx}-${i}`}>
                        <Check className="h-4 w-4 text-[hsl(196_92%_46%)] mt-0.5" />
                        <span className="text-foreground/85">{d}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="glass rounded-3xl p-5" data-testid="card-extra-hora-suelta">
              <div className="text-xs font-extrabold text-muted-foreground">Hora suelta</div>
              <div className="font-display text-3xl font-extrabold tracking-tight" data-testid="text-hora-suelta">
                30€
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Perfecto para alargar un ratito.</div>
            </div>
            <div className="glass rounded-3xl p-5" data-testid="card-extra-hora-extra">
              <div className="text-xs font-extrabold text-muted-foreground">Hora extra</div>
              <div className="font-display text-3xl font-extrabold tracking-tight" data-testid="text-hora-extra">
                10€
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Añádela a tu paquete.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface Booking {
  id: string;
  date: string;
  status: DayStatus;
}

function AvailabilityCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(today));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Fetch bookings from API
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const booked: Record<string, DayStatus> = useMemo(() => {
    const base: Record<string, DayStatus> = {};
    bookings.forEach((booking: Booking) => {
      base[booking.date] = booking.status;
    });
    return base;
  }, [bookings]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = gridStart;
  while (day <= gridEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  function statusFor(date: Date): DayStatus {
    if (isBefore(date, startOfMonth(today)) && !isSameMonth(date, today)) {
      // previous months handled by past check below anyway
    }

    const isPast = isBefore(date, today) && !isSameDay(date, today);
    if (isPast) return "blocked";

    const key = format(date, "yyyy-MM-dd");
    return booked[key] ?? "available";
  }

  const legend = [
    { key: "available", label: "Disponible", color: "bg-[hsl(140_68%_44%/0.18)] border-[hsl(140_58%_38%/0.35)] text-[hsl(140_48%_28%)]" },
    { key: "booked", label: "Ocupado", color: "bg-[hsl(0_84%_55%/0.14)] border-[hsl(0_74%_48%/0.28)] text-[hsl(0_62%_34%)]" },
    { key: "booked-morning", label: "Mañana ocupada", color: "bg-[linear-gradient(135deg,hsl(0_84%_55%/0.14)_50%,hsl(140_68%_44%/0.18)_50%)] border-[hsl(0_74%_48%/0.28)] text-[hsl(228_24%_16%)]" },
    { key: "booked-afternoon", label: "Tarde ocupada", color: "bg-[linear-gradient(135deg,hsl(140_68%_44%/0.18)_50%,hsl(0_84%_55%/0.14)_50%)] border-[hsl(140_58%_38%/0.35)] text-[hsl(228_24%_16%)]" },
    { key: "blocked", label: "No disponible", color: "bg-[hsl(220_14%_56%/0.14)] border-[hsl(220_16%_48%/0.22)] text-[hsl(220_18%_30%)]" },
  ] as const;

  const selectedStatus = selectedDay ? statusFor(selectedDay) : null;

  return (
    <section id="disponibilidad" className="pt-10 sm:pt-14" data-testid="section-disponibilidad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-center" data-testid="text-disponibilidad-title">
              Disponibilidad
            </h2>
            <p className="mt-2 text-muted-foreground text-center" data-testid="text-disponibilidad-desc">
              Selecciona un día para ver el estado.
            </p>

            <div className="mt-6 glass rounded-[28px] p-5 sm:p-6 max-w-2xl mx-auto" data-testid="card-calendar">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-muted-foreground">Mes</div>
                  <div className="font-display text-2xl font-extrabold tracking-tight" data-testid="text-month">
                    {format(currentMonth, "LLLL yyyy")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                    data-testid="button-month-prev"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                    data-testid="button-month-next"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-2 text-xs font-extrabold text-muted-foreground" data-testid="row-weekdays">
                {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                  <div key={d} className="text-center" data-testid={`text-weekday-${d}`}>{d}</div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-2" data-testid="grid-calendar-days">
                {days.map((date, idx) => {
                  const inMonth = isSameMonth(date, monthStart);
                  const status = statusFor(date);

                  let color = "bg-[hsl(220_14%_56%/0.12)] border-[hsl(220_16%_48%/0.18)]"; // blocked default
                  let textColor = "text-[hsl(220_18%_32%)]";

                  if (status === "available") {
                    color = "bg-[hsl(140_68%_44%/0.16)] border-[hsl(140_58%_38%/0.25)]";
                    textColor = "text-[hsl(140_48%_22%)]";
                  } else if (status === "booked") {
                    color = "bg-[hsl(0_84%_55%/0.14)] border-[hsl(0_74%_48%/0.22)]";
                    textColor = "text-[hsl(0_62%_30%)]";
                  } else if (status === "booked-morning") {
                     // Morning booked (red), Afternoon available (green)
                     // Top-left red, bottom-right green
                    color = "bg-[linear-gradient(135deg,hsl(0_84%_55%/0.14)_50%,hsl(140_68%_44%/0.16)_50%)] border-[hsl(0_74%_48%/0.22)]";
                    textColor = "text-foreground";
                  } else if (status === "booked-afternoon") {
                     // Morning available (green), Afternoon booked (red)
                     // Top-left green, bottom-right red
                    color = "bg-[linear-gradient(135deg,hsl(140_68%_44%/0.16)_50%,hsl(0_84%_55%/0.14)_50%)] border-[hsl(140_58%_38%/0.25)]";
                    textColor = "text-foreground";
                  }

                  const selected = selectedDay && isSameDay(date, selectedDay);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(date)}
                      className={classNames(
                        "h-11 sm:h-12 rounded-2xl border text-sm font-extrabold transition",
                        inMonth ? "" : "opacity-45",
                        color,
                        textColor,
                        selected ? "ring-4 ring-[hsl(196_90%_55%/0.25)]" : "hover:brightness-[1.02]",
                        "focus-ring",
                      )}
                      data-testid={`button-day-${format(date, "yyyy-MM-dd")}`}
                    >
                      {format(date, "d")}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 text-sm text-muted-foreground text-center" data-testid="text-selected-day">
                {selectedDay ? (
                  <span>
                    <span className="font-extrabold text-foreground">{format(selectedDay, "dd/MM/yyyy")}</span> · {legend.find((x) => x.key === selectedStatus)?.label}
                  </span>
                ) : (
                  "Elige un día para ver detalles."
                )}
              </div>

              {selectedDay && selectedStatus !== 'blocked' && selectedStatus !== 'booked' && (
                <div className="mt-3 flex justify-center">
                  <Button
                    className="rounded-full font-extrabold"
                    asChild
                    data-testid="button-consultar-fecha"
                  >
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=Quiero%20reservar%20para%20el%20dia%20${format(selectedDay, "dd/MM/yyyy")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Consultar esta fecha
                    </a>
                  </Button>
                </div>
              )}

              <Separator className="my-5" />

              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                {legend.map((l) => (
                  <div key={l.key} className="flex items-center gap-1.5" data-testid={`row-legend-${l.key}`}>
                    <span className={classNames("h-3 w-3 rounded-full border", l.color)} />
                    <span className="text-xs font-bold text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    timeoutRef.current = window.setTimeout(() => setSent(false), 4500);
  }

  const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <section id="contacto" className="pt-10 sm:pt-14 pb-12" data-testid="section-contacto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-center" data-testid="text-contacto-title">
              Contacto
            </h2>
            <p className="mt-2 text-muted-foreground text-center" data-testid="text-contacto-desc">
              Envíanos un mensaje y te respondemos lo antes posible.
            </p>

            <div className="mt-6 glass rounded-3xl p-6 max-w-2xl mx-auto" data-testid="card-contact-info">
              <div className="grid gap-4 text-base">
                <div className="flex items-start gap-4" data-testid="row-whatsapp">
                  <span className="h-10 w-10 rounded-xl bg-[hsl(340_92%_60%/0.14)] grid place-items-center shrink-0">
                    <MessageCircle className="h-5 w-5 text-[hsl(340_92%_60%)]" />
                  </span>
                  <div>
                    <div className="font-extrabold tracking-tight text-lg">WhatsApp</div>
                    <a
                      className="text-muted-foreground underline underline-offset-4 hover:text-foreground block"
                      href={waHref}
                      target="_blank"
                      rel="noreferrer"
                      data-testid="link-whatsapp"
                    >
                      {WHATSAPP_NUMBER}
                    </a>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-4 text-center">
                <h3 className="font-display text-xl font-bold tracking-tight text-[hsl(196_92%_46%)]">
                  ¿Dónde estamos?
                </h3>
              </div>
              
              <div className="rounded-2xl overflow-hidden border border-[hsl(var(--primary)/0.2)]" data-testid="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.385215773582!2d-4.73109!3d37.8980578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6cdf34bb0a6265%3A0x5f23a68aeb30d55a!2sCelebrate%20C%C3%B3rdoba!5e0!3m2!1ses!2ses!4v1770401769319!5m2!1ses!2ses" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Celebrate Córdoba"
                ></iframe>
              </div>

              <div className="mt-4 text-sm text-center text-muted-foreground" data-testid="text-contact-note">
                También puedes escribirnos por WhatsApp para consultas rápidas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pb-10" data-testid="footer">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass rounded-3xl p-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Celebrate Córdoba" className="h-12 w-12 rounded-2xl bg-white/70 p-1" data-testid="img-footer-logo" />
              <div>
                <div className="font-display text-xl font-extrabold tracking-tight">Celebrate Córdoba</div>
                <div className="text-sm text-muted-foreground" data-testid="text-footer-desc">
                  Celebraciones y eventos · Córdoba
                </div>
              </div>
            </div>

            <div className="grid gap-2 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 font-bold text-foreground/85 hover:text-foreground" data-testid="link-footer-email">
                <Send className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-foreground/85 hover:text-foreground" data-testid="link-footer-whatsapp">
                <MessageCircle className="h-4 w-4" />
                {WHATSAPP_NUMBER}
              </a>
              <a href="https://maps.app.goo.gl/GYjF4R7ZaXydwNhb7" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-foreground/85 hover:text-foreground" data-testid="link-footer-address">
                <MapPin className="h-4 w-4" />
                {ADDRESS}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/celebratecordoba/"
                target="_blank"
                rel="noreferrer"
                className="bubble h-11 w-11 grid place-items-center hover:bg-white/90 transition"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <Separator className="my-5" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <div data-testid="text-copyright">Copyright © 2026 Celebrate Córdoba</div>
            <div className="font-bold" data-testid="text-footer-note">
              Hecho con cariño para celebrar.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="celebrate-shell">
      <Nav />
      <main>
        <Hero />
        <Presentation />
        <Gallery />
        <Tarifas />
        <AvailabilityCalendar />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
