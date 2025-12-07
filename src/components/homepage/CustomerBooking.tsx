
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import type { ProvidedService } from "@/types";

import { LockKeyhole } from "lucide-react";
import { Calendar } from "../ui/calendar";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { bookingTime, type BookingTime } from "@/schemas/booking";

import { useCartStore, type CartItem } from "@/store/cartStore";
import {
  fetchAvailability,
  type AvailableSlot,
} from "@/services/cartService";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface CustomerBookingProps {
  openAddService: boolean;
  setOpenAddService: React.Dispatch<React.SetStateAction<boolean>>;
  selectedService: ProvidedService | null;
  editingItem?: CartItem | null;
}

export function CustomerBooking({
  openAddService,
  setOpenAddService,
  selectedService,
  editingItem,
}: CustomerBookingProps) {
  const { currentUser } = useAuth();
  const apiPrivate = useAxiosPrivate();
  const addOrUpdateItem = useCartStore((s) => s.addOrUpdateItem);

  const form = useForm<BookingTime>({
    resolver: zodResolver(bookingTime),
    defaultValues: {
      preferredDate: editingItem?.preferredDate || undefined,
      preferredTime: editingItem?.preferredTime || "",
    },
    mode: "onChange",
  });

  const preferredDate = form.watch("preferredDate");

  const vendor_id = selectedService?.vendor_id ?? editingItem?.vendor_id ?? "";
  const service_id =
    selectedService?.service_id ?? editingItem?.service_id ?? "";

  const availabilityQueryKey = [
    "vendorAvailability",
    vendor_id,
    service_id,
    preferredDate ? format(preferredDate, "yyyy-MM-dd") : null,
  ];

  const { data: availableSlots, isLoading, isError } = useQuery<
    AvailableSlot[]
  >({
    queryKey: availabilityQueryKey,
    queryFn: () => fetchAvailability(vendor_id, service_id, preferredDate),
    enabled: !!preferredDate && !!vendor_id && !!service_id,
  });

  const renderTimeLabel = (time: string) => {
    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    if (hour > 12) hour -= 12;
    return `${hour}:${m} ${suffix}`;
  };

  const onSubmit = async (data: BookingTime) => {
    if (!selectedService && !editingItem) return;
    if (!apiPrivate) return;

    const slot = availableSlots?.find((s) => s.time === data.preferredTime);
    if (slot && !slot.is_available) {
      alert("The selected time slot is no longer available.");
      return;
    }

    const baseService = selectedService ?? (editingItem as any) ?? null;

    const payload = {
      preferredDate: data.preferredDate!,
      preferredTime: data.preferredTime,
      vendor_id,
      service_id,

      name: baseService?.name ?? "",
      description: baseService?.description ?? "",
      price: String(baseService?.price ?? ""),
      duration: Number(baseService?.duration ?? 0),
    };


    if (editingItem) {
      await addOrUpdateItem(apiPrivate, {
        ...payload,
        id: editingItem.id,
        clientId: editingItem.clientId,
      });
    } else {
      await addOrUpdateItem(apiPrivate, payload);
    }

    setOpenAddService(false);
  };

  if (!currentUser) {
    return (
      <Dialog open={openAddService} onOpenChange={setOpenAddService}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="mx-auto bg-slate-200 w-14 h-14 p-4 rounded-full flex justify-center items-center">
                <LockKeyhole size={40} />
              </div>
            </DialogTitle>
            <h4 className="text-center text-gray-600">
              You need to login before booking!
            </h4>
          </DialogHeader>

          <Button className="w-5/6 bg-indigo-600 mx-auto mt-4" asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={openAddService} onOpenChange={setOpenAddService}>
      <DialogContent className="sm:max-w-240 max-h-[90vh] p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>
                {editingItem ? "Edit Booking" : "Complete Your Booking"}
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-4 space-y-6">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border p-4 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading || isError}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {availableSlots?.map((slot) => (
                              <SelectItem
                                key={slot.time}
                                value={slot.time}
                                disabled={!slot.is_available}
                              >
                                {renderTimeLabel(slot.time)}
                                {!slot.is_available && " (Booked)"}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-6 pb-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {editingItem ? "Save Changes" : "Add To Cart"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
