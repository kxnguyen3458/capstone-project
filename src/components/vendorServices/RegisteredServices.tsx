import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from "@/utils";

import { Clock, DollarSign, Package, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { deleteRegisteredService, patchRegisteredService } from "@/services/servicesforVendor";
import type { RegisteredService } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { EditServiceModal } from "./EditServiceModal";

type RegisteredServiceProps = {
  registeredServices?: RegisteredService[];
};

const RegisteredServices = ({ registeredServices }: RegisteredServiceProps) => {
  const api = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState<RegisteredService | null>(null);

  const updateService = useMutation({
    mutationFn: ({ id, updateField }: { id: string; updateField: any }) =>
      patchRegisteredService(id, updateField, api),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registeredServices"],
      });
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => deleteRegisteredService(id, api),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registeredServices"],
      });
    },
  });

  const onToggleActive = (checked: boolean, serviceId: string) => {
    updateService.mutate({ id: serviceId, updateField: { is_active: checked } });
  };

  const onEditService = (serviceId: string, updateField: any) => {
    updateService.mutate({ id: serviceId, updateField });
  };

  const onRemoveService = (id: string) => {
    deleteService.mutate(id);
  };

  const hasServices = registeredServices && registeredServices.length > 0;

  return (
    <>
      <Card className="shadow-lg border-indigo-200 bg-white">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Your Registered Services
          </CardTitle>
          <CardDescription>Services you're offering to customers</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {!hasServices ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Package className="w-16 h-16 mb-4" />
              <p>No services registered yet</p>
              <p className="text-sm">Add services from the catalog above to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="min-w-[180px]">Name</TableHead>
                    <TableHead className="min-w-[300px]">Description</TableHead>
                    <TableHead className="w-[120px]">Base Price</TableHead>
                    <TableHead className="w-[100px]">Duration</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {registeredServices?.map((service: RegisteredService, index: number) => {

                    return (
                      <TableRow key={service.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-900">{service.name}</TableCell>

                        <TableCell className="text-sm text-slate-600">
                          {service.description}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-900">
                            <DollarSign className="w-4 h-4 text-indigo-600" />
                            {service.price !== undefined && service.price !== null
                              ? Number(service.price).toFixed(2)
                              : "--"}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-700">
                            <Clock className="w-4 h-4 text-purple-600" />
                            {formatDuration(service.duration)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`active-${service.id}`}
                              checked={service.is_active}
                              onCheckedChange={(checked) =>
                                onToggleActive(checked, service.id)
                              }
                            />
                            <Badge
                              className={
                                service.is_active
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }
                            >
                              {service.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setOpenEdit(true);
                              setSelectedService(service);
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveService(service.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <EditServiceModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        service={selectedService}
        onEditService={onEditService}
      />
    </>
  );
};

export default RegisteredServices;
