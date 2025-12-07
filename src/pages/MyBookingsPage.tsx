import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CalendarDays,
  Clock,
  Package2,
  CheckCircle2,
} from "lucide-react";
import { getBookings, type BookingResponse } from "@/services/bookingServices";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";



type BookingDerivedStatus = "processing" | "finished" | "awaiting_confirmation";

type BookingWithStatus = BookingResponse & { _status: BookingDerivedStatus };

function deriveBookingStatus(booking: BookingResponse): BookingDerivedStatus {
  const items = booking.items;

  const hasAwaiting = items.some(
    (i) => i.status === "vendor_done" && !i.customer_confirmed_at
  );
  if (hasAwaiting) return "awaiting_confirmation";

  const allConfirmed =
    items.length > 0 && items.every((i) => i.status === "customer_confirmed");
  if (allConfirmed) return "finished";

  return "processing";
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

const MyBookingsPage = () => {
  const apiPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getBookings(apiPrivate);

        if (!mounted) return;

        const withStatus: BookingWithStatus[] = data.map((b:any) => ({
          ...b,
          _status: deriveBookingStatus(b),
        }));

        withStatus.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
        );

        setBookings(withStatus);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Failed to load bookings.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [apiPrivate]);

  const totalBookings = bookings.length;
  const processingCount = bookings.filter(
    (b) =>
      b._status === "processing" || b._status === "awaiting_confirmation"
  ).length;
  const finishedCount = bookings.filter(
    (b) => b._status === "finished"
  ).length;
  const awaitingCount = bookings.filter(
    (b) => b._status === "awaiting_confirmation"
  ).length;

  const processingBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b._status === "processing" ||
          b._status === "awaiting_confirmation"
      ),
    [bookings]
  );

  const finishedBookings = useMemo(
    () => bookings.filter((b) => b._status === "finished"),
    [bookings]
  );

  const renderBookingCard = (booking: BookingWithStatus) => {
    const created = formatDateTime(booking.created_at);
    const updated = formatDateTime(booking.updated_at);
    const numServices = booking.items.length;

    const hasAwaitingItem = booking.items.some(
      (i:any) => i.status === "vendor_done" && !i.customer_confirmed_at
    );

    return (
      <Card
        key={booking.id}
        className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <CardContent className="space-y-4 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  Booking ID: {booking.id}
                </p>
                {hasAwaitingItem && (
                  <Badge
                    variant="outline"
                    className="rounded-full bg-amber-100 text-amber-800 border-amber-200 text-xs"
                  >
                    Awaiting Confirmation
                  </Badge>
                )}
              </div>
            </div>

            <Button
              size="sm"
              className="rounded-full px-4 text-xs"
              onClick={() => navigate(`/bookings/${booking.id}`)}
            >
              View Details
            </Button>
          </div>

          <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Created At
              </p>
              <div className="mt-1 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <span>{created.date}</span>
              </div>
              <div className="ml-6 text-xs text-slate-500">{created.time}</div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Updated At
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{updated.date}</span>
              </div>
              <div className="ml-6 text-xs text-slate-500">{updated.time}</div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Number of Services
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Package2 className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {numServices} {numServices === 1 ? "Service" : "Services"}
                </span>
              </div>
            </div>
          </div>

          {hasAwaitingItem && (
            <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <p>
                Vendor has marked this booking as completed. Please review and
                confirm.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 lg:px-8">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage all your service bookings
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200">
            <CardContent className="flex flex-col gap-2 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-400">
                Total Bookings
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-slate-900">
                  {totalBookings}
                </span>
                <CheckCircle2 className="h-6 w-6 text-slate-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="flex flex-col gap-2 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-400">
                Processing
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-slate-900">
                  {processingCount}
                </span>
                <Clock className="h-6 w-6 text-slate-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="flex flex-col gap-2 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-400">
                Finished
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-slate-900">
                  {finishedCount}
                </span>
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="flex flex-col gap-2 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-400">
                Awaiting Confirmation
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-slate-900">
                  {awaitingCount}
                </span>
                <AlertCircle className="h-6 w-6 text-amber-300" />
              </div>
            </CardContent>
          </Card>
        </section>

        {isLoading && (
          <div className="mt-6 flex justify-center text-sm text-slate-500">
            Loading bookings...
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <section>
            <Tabs defaultValue="processing" className="w-full">
             

              <TabsContent value="processing" className="mt-6 space-y-4">
                {processingBookings.length === 0 && (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-10 text-sm text-slate-500">
                    No processing bookings right now.
                  </div>
                )}
                {processingBookings.map(renderBookingCard)}
              </TabsContent>

              <TabsContent value="finished" className="mt-6 space-y-4">
                {finishedBookings.length === 0 && (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-10 text-sm text-slate-500">
                    No finished bookings yet.
                  </div>
                )}
                {finishedBookings.map(renderBookingCard)}
              </TabsContent>
            </Tabs>
          </section>
        )}
      </main>
    </div>
  );
};

export default MyBookingsPage;
