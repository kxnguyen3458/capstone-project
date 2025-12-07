import { getVendorInfo } from "@/services/requestInfo";
import { useQuery } from "@tanstack/react-query"
import { Contact,  MapPin,  User } from "lucide-react";
import { useParams } from "react-router-dom";
import { getServicesOfEachVendor } from "@/services/servicesHomePage";
import { formatDuration, formatNumberWithDecimal } from "@/utils";
import { useState } from "react";
import type { ProvidedService, ServiceProvidedByVendor, VendorInfo } from "@/types";
import { CustomerBooking } from "@/components/homepage/CustomerBooking";

const VendorPage = () => {

    const [selectedService] = useState<ProvidedService | null>(null);
    const [openAddService, setOpenAddService] = useState<boolean>(false);


    const { vendor_id } = useParams();

    const { data: vendor } = useQuery<VendorInfo>({
        queryKey: ['vendor', vendor_id],
        queryFn: () => getVendorInfo(vendor_id!),
        enabled: !!vendor_id
    })


    const { data: services } = useQuery<ServiceProvidedByVendor[]>({
        queryKey: ['personalServices'],
        queryFn: () => getServicesOfEachVendor(vendor_id!),
        enabled: !!vendor_id
    })


    return (
        <main className="min-h-screen p-6">
            <section className="relative">
                <div className="w-full h-48 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500"></div>

                <div className="w-28 h-28 rounded-full border-4 border-white bg-rose-200 text-white text-3xl font-bold flex items-center justify-center absolute left-1/2 -bottom-14 -translate-x-1/2 shadow-lg">
                    <User size={40} />
                </div>
            </section>



            <section className="mt-20 max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 text-center">
                <h2 className="text-2xl font-semibold">{vendor?.fullname}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <Contact />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Contact Info</p>
                            <p className="font-medium">{vendor?.contact_info}</p>
                        </div>
                    </div>


                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <MapPin />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{vendor?.formatted_address}</p>
                        </div>
                    </div>

                </div>
            </section>
            <section className="max-w-[90%] p-6 mx-auto mt-10 bg-white rounded-md">
                <h2 className="text-xl font-semibold mb-4">Services Offered</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {services?.map((s, index: number) => {
                        return (
                            <div className="bg-white rounded-xl shadow border border-gray-200 p-5" key={index}>
                                <div className="flex justify-between">
                                    <h3 className="font-semibold text-lg">{s.name}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {s.description}
                                </p>
                                <div className="flex justify-between mt-3 text-sm text-gray-600">
                                    <p>Price: <span className="font-medium text-gray-800">$ {formatNumberWithDecimal(s.price)}</span></p>
                                    <p>Duration: <span className="font-medium text-gray-800">{formatDuration(s.duration)}</span></p>
                                </div>
                                <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                                    onClick={() => {
                                        setOpenAddService(true);
                                    }}
                                >
                                    Register for This Service
                                </button>
                            </div>
                        )
                    })}

                </div>
            </section>

            <CustomerBooking
                openAddService={openAddService}
                selectedService={selectedService}
                setOpenAddService={setOpenAddService}

            ></CustomerBooking>



        </main>
    )
}

export default VendorPage