import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CalendarDays, Clock, User } from "lucide-react";
import type { BookingResponseItem } from "@/services/bookingServices";

type BookingItemCardProps = {
  item: BookingResponseItem;
  onViewDetails?: () => void;
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

export const BookingItemCard = ({ item, onViewDetails }: BookingItemCardProps) => {
  const date = new Date(`${item.preferred_date}T${item.preferred_time}:00`);

  const statusInfo = getStatusInfo(item.status, item.customer_confirmed_at);

  const shouldShowVendorDoneBanner =
    !!item.vendor_marked_done_at && !item.customer_confirmed_at;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">
            {item.service_name}
          </h2>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <User className="h-4 w-4" />
            <span>{item.vendor_id}</span>
          </div>

          <div className="flex gap-3 text-xs text-slate-500">
            <span>${item.price}</span>
            <span>• {item.duration} mins</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge
            variant="outline"
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
          >
            {statusInfo.label}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span>{date.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {shouldShowVendorDoneBanner && (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <p>
              Vendor has marked this service as completed. Please review and
              confirm.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
