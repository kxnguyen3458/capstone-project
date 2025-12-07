import PriceandDuration from "@/components/vendorServices/PriceandDuration";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
    getRegisteredServicesforVendor,
    getServicesforVendor,
} from "@/services/servicesforVendor";
import type { Service, RegisteredService } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import RegisteredServices from "@/components/vendorServices/RegisteredServices";
import { CircleCheck, ClipboardList } from "lucide-react";
import VendorProfileRequiredMessage from "@/components/vendorServices/VendorProfileRequiredMessage";

const ServicesPages = () => {
    const api = useAxiosPrivate();
    const [openAddPrice, setOpenAddPrice] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const {
        data: services = [],
        isLoading,
        isError,
    } = useQuery<Service[]>({
        queryKey: ["services"],
        queryFn: async () => getServicesforVendor(api),
    });

    const { data: registeredServices = [],
        error: registeredServicesError,
        isError: isRegisteredServicesError,
        isLoading: isRegisteredServicesLoading
    } = useQuery<RegisteredService[]>({
        queryKey: ["registeredServices"],
        queryFn: async () => getRegisteredServicesforVendor(api),
        retry: false,
    });

    if (isRegisteredServicesLoading) {
        return <div>Loading...</div>;
    }

    if (isRegisteredServicesError
        && (registeredServicesError as Error)?.message === "NO_VENDOR_PROFILE"
    ) {
        return <VendorProfileRequiredMessage />
    }

    if (isLoading) return <div>Loading...</div>;

    if (isError) {
        return <div>Something went wrong.</div>;
    }
    
    const registeredServiceIds = new Set(registeredServices.map((rs) => rs.id));


    return (
        <div className="[&_p]:text-sm [&_p]:text-gray-600 [&_p]:leading-6 h-screen px-10">
            <div>
                <h2 className="font-bold mb-0">Service Registration</h2>
            </div>

            <div className="grid grid-cols-3 space-x-5 my-6">
                <div
                    className="bg-white border-[1.5px] border-slate-200 shadow-md
          rounded-lg p-5 flex justify-between items-center"
                >
                    <div>
                        <p className="font-bold">Available Services</p>
                        <p>{services.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-md bg-blue-500/20 flex justify-center items-center">
                        <ClipboardList size={20} className="text-blue-500" />
                    </div>
                </div>

                <div className="flex justify-between items-center bg-white border-[1.5px] border-slate-200 shadow-md rounded-lg p-5">
                    <div>
                        <p className="font-bold">Registered Services</p>
                        <p>{registeredServices.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-md bg-green-400/10 flex justify-center items-center">
                        <CircleCheck size={20} className="text-green-800" />
                    </div>
                </div>

                <div className="flex justify-between items-center bg-white border-[1.5px] border-slate-200 shadow-md rounded-lg p-5">
                    <div>
                        <p className="font-bold">Active Services</p>
                        <p>{registeredServices.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-md bg-purple-500/10 flex justify-center items-center">
                        <CircleCheck size={20} className="text-purple-600" />
                    </div>
                </div>
            </div>

            <main className="bg-white border-[1.5px] border-slate-200 shadow-md rounded-lg p-5">
                <h3 className="mb-0">Available Services</h3>
                <p>Choose from our catalog of services to offer your customers</p>

                <div className="grid grid-cols-3 gap-8 mt-5">
                    {services.map((s) => {
                        const isRegistered = registeredServiceIds.has(s.id);

                        return (
                            <Card className={`gap-2 ${isRegistered ? "bg-green-50 border-green-300" : "bg-white"
                                }`}
                                key={s.id}
                            >
                                <CardHeader>
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <CardTitle>{s.name}</CardTitle>

                                            {isRegistered && (
                                                <span
                                                    className="inline-flex items-center rounded-md
                            bg-green-400/10 px-2 py-1 text-xs font-medium
                            text-green-800 inset-ring inset-ring-green-500/20"
                                                >
                                                    Added
                                                </span>
                                            )}
                                        </div>
                                        <CardDescription>{s.description}</CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent></CardContent>

                                <CardFooter>
                                    {!isRegistered && (
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                setOpenAddPrice(true);
                                                setSelectedService(s);
                                            }}
                                        >
                                            + Add Service
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}

                    <PriceandDuration
                        open={openAddPrice}
                        onOpenChange={(open) => {
                            setOpenAddPrice(open);
                            if (!open) setSelectedService(null);
                        }}
                        service={selectedService}
                    />
                </div>
            </main>

            <div className="mt-5 bg-white border-[1.5px] border-slate-200 shadow-md rounded-lg p-5">
                <RegisteredServices registeredServices={registeredServices} />
            </div>
        </div>
    );
};

export default ServicesPages;
