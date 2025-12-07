import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  priceandDurationSchema,
  type InputPriceandDurationValues,
} from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Service } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServiceforVendor } from "@/services/servicesforVendor";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: Service | null;
};

const PriceandDuration = ({ open, onOpenChange, service }: Props) => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const api = useAxiosPrivate();

  const form = useForm<InputPriceandDurationValues>({
    resolver: zodResolver(priceandDurationSchema),
    defaultValues: { price: "", duration: "" },
    mode: "onSubmit",
  });

  const addServiceMutation = useMutation({
    mutationFn: (payload: Service) => createServiceforVendor(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registeredServices"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });


  if (!service) return null;
  
  const onSubmit = async (data: InputPriceandDurationValues) => {
    setIsSubmitting(true);

    try {
      const newService: Service = {
        ...service,
        price: data.price,
        duration: Number(data.duration),
      };

      await addServiceMutation.mutateAsync(newService);

      form.reset({ price: "", duration: "" });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="gap-0 space-y-1 mb-4">
          <DialogTitle>Add Service:</DialogTitle>
          <DialogDescription>
            Set your price and duration for this service.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-7 mb-10">
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter price"
                        inputMode="decimal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="duration"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter duration in minutes"
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-fit ml-auto space-x-1">
              <Button
                type="button"
                className="border border-gray-300"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PriceandDuration;
