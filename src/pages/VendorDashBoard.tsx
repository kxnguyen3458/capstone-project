import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Timer,
  Package2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  getVendorBookingItems,
  markBookingItemDone,
  type BookingItem,
} from "@/services/bookingserviceForVendor";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const VendorDashboard = () => {
  const [bookings, setBookings] = React.useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const apiPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = await getVendorBookingItems(apiPrivate);
        if (!isMounted) return;
        setBookings(data);
      } catch (err) {
        console.warn("Failed to load bookings:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [apiPrivate]);

  const activeBookings = bookings.filter(
    (b) => b.status === "processing" || b.status === "awaiting_customer"
  );
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const awaitingConfirmation = bookings.filter(
    (b) => b.status === "awaiting_customer"
  );

  const handleMarkCompleted = async (id: string) => {
    try {
      await markBookingItemDone(apiPrivate, id);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "awaiting_customer" } : b
        )
      );
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update booking status.";
      alert(message);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your service bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bookings
            </CardTitle>
            <div className="rounded-full p-2 bg-primary/10">
              <Package2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Bookings currently in progress.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Awaiting Confirmation
            </CardTitle>
            <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/40">
              <Timer className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {awaitingConfirmation.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed by you, waiting for customer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Bookings
            </CardTitle>
            <div className="rounded-full p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Fully completed & confirmed.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">
            Active Bookings ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Bookings ({completedBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading bookings...</p>
          )}

          {!isLoading &&
            activeBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onMarkCompleted={handleMarkCompleted}
              />
            ))}

          {!isLoading && activeBookings.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any active bookings right now.
            </p>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading bookings...</p>
          )}

          {!isLoading &&
            completedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onMarkCompleted={handleMarkCompleted}
                readOnly
              />
            ))}

          {!isLoading && completedBookings.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No completed bookings yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

type BookingCardProps = {
  booking: BookingItem;
  onMarkCompleted: (id: string) => void;
  readOnly?: boolean;
};

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onMarkCompleted,
  readOnly,
}) => {
  const isProcessing = booking.status === "processing";
  const isAwaiting = booking.status === "awaiting_customer";
  const isCompleted = booking.status === "completed";

  return (
    <Card className="border border-border/60">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">
                {booking.service_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Booking ID:</span>{" "}
                <span className="text-indigo-700">{booking.booking_id}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                <span>{booking.duration} min</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Price:</span> {booking.price}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <Badge
              variant="outline"
              className={
                isProcessing
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800"
                  : isAwaiting
                  ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-100 dark:border-purple-800"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800"
              }
            >
              {isProcessing && "Processing"}
              {isAwaiting && "Waiting for customer confirmation"}
              {isCompleted && "Completed"}
            </Badge>

            <Button
              disabled={!isProcessing || readOnly}
              onClick={() => onMarkCompleted(booking.id)}
              className="mt-1"
            >
              {isProcessing ? "Mark as Completed" : "Awaiting Customer"}
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium ">
            <User className="h-4 w-4" />
            <span>Customer Information</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                Full Name
              </p>
              <p className="font-medium text-foreground">
                {booking.customer.fullname}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                Email
              </p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{booking.customer.email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                Contact Info
              </p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{booking.customer.contact_info}</span>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                Address
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{booking.customer.address}</span>
              </div>
            </div>
          </div>
        </div>

        {isAwaiting && (
          <>
            <Separator className="my-4" />
            <CardFooter className="mt-0 p-0">
              <div className="w-full rounded-lg bg-purple-50 px-4 py-3 text-sm text-purple-700 dark:bg-purple-900/20 dark:text-purple-100">
                ✓ Marked as completed. Waiting for customer to confirm.
              </div>
            </CardFooter>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorDashboard;
