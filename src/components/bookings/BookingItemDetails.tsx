import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Package2,
  CheckCircle2,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";
import {
  type BookingResponse,
  type BookingResponseItem,
  type CustomerStatusUpdate,
  updateCustomerStatus,
} from "@/services/bookingServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { VendorInfo } from "@/types";
import { getVendorInfo } from "@/services/requestInfo";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type BookingItemDetailsProps = {
  booking: BookingResponse;
  item: BookingResponseItem;
};

const getStatusInfo = (
  status: BookingResponseItem["status"],
  customerConfirmedAt: string | null
) => {
  if (status === "vendor_done" && !customerConfirmedAt) {
    return {
      label: "Awaiting Confirmation",
      className: "bg-amber-100 text-amber-800 border border-amber-200",
    };
  }

  if (status === "processing") {
    return {
      label: "Processing",
      className: "bg-blue-100 text-blue-800 border border-blue-200",
    };
  }

  if (status === "customer_confirmed") {
    return {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    };
  }

  if (status === "cancelled") {
    return {
      label: "Cancelled",
      className: "bg-slate-100 text-slate-800 border border-slate-200",
    };
  }

  return {
    label: status,
    className: "bg-slate-100 text-slate-800 border border-slate-200",
  };
};

const formatPreferred = (dateStr: string, timeStr: string) => {
  const date = new Date(`${dateStr}T${timeStr}:00`);
  const dateLabel = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeLabel = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dateLabel, timeLabel };
};

export const BookingItemDetails = ({ booking, item }: BookingItemDetailsProps) => {
  const apiPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const { data: vendor } = useQuery<VendorInfo>({
    queryKey: ["vendor", item.vendor_id],
    queryFn: () => getVendorInfo(item.vendor_id!),
    enabled: !!item.vendor_id,
  });

  const confirmMutation = useMutation({
    mutationFn: (status: CustomerStatusUpdate) =>
      updateCustomerStatus(apiPrivate, item.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    },
    onError: (error: any) => {
      console.error(error);
      alert(
        error?.message ||
        "Failed to confirm that the service has been completed."
      );
    },
  });

  const handleConfirmFinished = () => {
    confirmMutation.mutate("customer_confirmed" as CustomerStatusUpdate);
  };

  const { dateLabel, timeLabel } = formatPreferred(
    item.preferred_date,
    item.preferred_time
  );

  const { dateLabel: createdDate, timeLabel: createdTime } = (() => {
    const d = new Date(booking.created_at);
    return {
      dateLabel: d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      timeLabel: d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  })();

  const statusInfo = getStatusInfo(item.status, item.customer_confirmed_at);

  const showVendorDoneBanner =
    !!item.vendor_marked_done_at && !item.customer_confirmed_at;

  const isConfirming = confirmMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {item.service_name}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Booking ID: {booking.id}
              </p>
            </div>

            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
            >
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 px-6 py-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Vendor
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <User className="h-4 w-4 text-slate-400" />
                <span>{vendor?.fullname}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Date &amp; Time
              </p>
              <div className="mt-1 flex flex-col gap-1 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <span>{dateLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>
                    {timeLabel} ({item.duration} minutes)
                  </span>
                </div>
              </div>
            </div>

            {booking.customer.address && (
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Location
                </p>
                <div className="mt-1 flex items-start gap-2 text-sm text-slate-700">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>{booking.customer.address}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Price
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                ${item.price}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showVendorDoneBanner && (
        <Card className="border-amber-200 bg-amber-50/80">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <CheckCircle2 className="h-8 w-8 text-amber-500" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">
                The vendor marked this service as completed
              </p>
              <p className="text-sm text-slate-600">
                Please confirm that the service has been fully completed.
              </p>
            </div>

            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button
                className="min-w-[180px]"
                onClick={handleConfirmFinished}
                disabled={isConfirming}
              >
                <Package2 className="mr-2 h-4 w-4" />
                {isConfirming ? "Confirming..." : "Confirm Finished"}
              </Button>
              <Button
                variant="outline"
                className="min-w-[180px] border-red-200 text-red-600 hover:bg-red-50"
              >
                Report an Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">
              Booking Details
            </h3>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-6">
            <div className="grid grid-cols-1 gap-1 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Customer Name
                </p>
                <p className="mt-1">{booking.customer.fullname}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Contact Number
                </p>
                <p className="mt-1">{booking.customer.contact_info}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Email Address
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {booking.customer.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">
              Activity Timeline
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-indigo-50 p-2">
                <Package2 className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-900">
                  Order created
                </p>
                <p className="text-xs text-slate-500">
                  {createdDate} at {createdTime}
                </p>
              </div>
            </div>

            {item.vendor_marked_done_at && (
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-indigo-50 p-2">
                  <Package2 className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">
                    Vendor marked as completed
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.vendor_marked_done_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
