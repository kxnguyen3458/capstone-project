import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegisteredService } from "@/types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type EditServiceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: RegisteredService | null;
  onEditService: (serviceId: string, updateField: any) => void;
};

type FormValues = {
  price: number;
  duration: number;
};

export const EditServiceModal = ({
  open,
  onOpenChange,
  service,
  onEditService,
}: EditServiceModalProps) => {
  const { register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      price: service?.price ?? 0,
      duration: Number(service?.duration ?? 0),
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        price: service.price ?? 0,
        duration: Number(service.duration ?? 0),
      });
    }
  }, [service, reset]);

  const onSubmit = (values: FormValues) => {
    if (!service) return;

    onEditService(service.id, {
      price: values.price,
      duration: values.duration,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Price & Duration</DialogTitle>
          <DialogDescription>
            Update only the price and duration of this service.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          <div>
            <Label>Service Name</Label>
            <Input value={service?.name ?? ""} disabled />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={0}
              {...register("duration", { valueAsNumber: true })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
