
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { BookingItemCard } from "@/components/bookings/BookingItemCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  getBookingById,
  type BookingResponse,
  type BookingResponseItem,
} from "@/services/bookingServices";
import { BookingItemDetails } from "@/components/bookings/BookingItemDetails";

type RouteParams = {
  bookingId: string;
};

export default function BookingDetailPage() {
  const apiPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { bookingId } = useParams<RouteParams>();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [selectedItem, setSelectedItem] = useState<BookingResponseItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!bookingId) {
      setError("Booking id is missing.");
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getBookingById(apiPrivate, bookingId);
        if (!mounted) return;
        setBooking(data);
        setSelectedItem(null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Failed to load booking.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [apiPrivate, bookingId]);

  const handleBackToMyBookings = () => {
    navigate("/mybookings");
  };

  const handleBackToBookingRoot = () => {
    setSelectedItem(null);
  };

  const hasData = !!booking;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={handleBackToMyBookings}
                className="cursor-pointer"
              >
                My Bookings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {selectedItem ? (
                <BreadcrumbLink
                  onClick={handleBackToBookingRoot}
                  className="cursor-pointer"
                >
                  {bookingId}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{bookingId}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {selectedItem && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedItem.service_name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <section className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Booking Details
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Booking ID:{" "}
              <span className="font-mono">
                {bookingId ?? "Unknown booking"}
              </span>
            </p>
          </div>


        </section>

        {isLoading && (
          <div className="mt-6 flex justify-center text-sm text-slate-500">
            Loading booking...
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {hasData && !isLoading && !error && booking && (
          <section className="space-y-6">
            {!selectedItem && (
              <div className="space-y-4">
                {booking.items.map((item) => (
                  <BookingItemCard
                    key={item.id}
                    item={item}
                    onViewDetails={() => setSelectedItem(item)}
                  />
                ))}
                {booking.items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
                    No services in this booking.
                  </div>
                )}
              </div>
            )}

            {selectedItem && (
              <BookingItemDetails booking={booking} item={selectedItem} />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
