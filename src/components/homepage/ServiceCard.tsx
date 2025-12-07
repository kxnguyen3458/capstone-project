import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IMAGE_BASE_URL, serviceImageURLMap } from "@/constants";
import { getVendorInfo } from "@/services/requestInfo";
import { type VendorInfo, type ProvidedService } from "@/types";
import { formatDuration, formatNumberWithDecimal } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceProps {
  service: ProvidedService,
  selectedService: ProvidedService | null,
  setSelectedService: React.Dispatch<React.SetStateAction<ProvidedService | null>>
}


export default function ServiceCard({
  service, selectedService, setSelectedService

}: ServiceProps) {

  const getImgUrl = (service_id: string) => {

    return IMAGE_BASE_URL + serviceImageURLMap.get(service_id);
  }

  const isSelected = selectedService?.service_id === service.service_id
    && selectedService?.vendor_id === service.vendor_id;


  const { data: vendor } = useQuery<VendorInfo>({
    queryKey: ['vendor', service.vendor_id],
    queryFn: () => getVendorInfo(service.vendor_id),
  })


  return (
    <>
      <Card
        className={`overflow-hidden relative rounded-2xl shadow-xl py-0 gap-2 
         ${isSelected ? "outline-3 outline-offset-4 outline-indigo-600" : ""
          }`}>
        {isSelected ? <CircleCheck className="bg-indigo-600 text-white rounded-full absolute right-3 top-3" /> : null}
        <img
          src={`${getImgUrl(service.service_id)}`}
          alt={service.name}
          className="w-full h-44 overflow-hidden  "
        />

        <CardContent className="p-y-3 p-x-5 space-y-4">
          <div>
            <p className="h-12  font-semibold text-gray-900">
              {service.name}
            </p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {service.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-1 text-purple-700 text-sm">
              <DollarSign className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{formatNumberWithDecimal(service.price)}</span>
            </div>

            <div className="flex items-center gap-1 text-purple-700 text-sm">
              <Clock className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{formatDuration(service.duration)}</span>
            </div>
          </div>

          <div>
            <p>Vendor </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex flex-col gap-2 ">
          <button
            onClick={() => {
              setSelectedService(prev =>
                prev &&
                  prev.service_id === service.service_id &&
                  prev.vendor_id === service.vendor_id
                  ? null
                  : service
              );
            }
            }
            className={`w-full py-2 rounded-lg transition 
              ${isSelected ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-200 text-gray-700 hover:bg-slate-300 "}`}>
            Select Service
          </button>
          <span className="block w-full m-3 h-px bg-gray-200"></span>

          <div className="mr-auto">
            <p className="text-gray-500 text-xs">Service provider: <Link to={`/vendors/${vendor?.id}`} className="
              hover:underline underline-offset-2 font-semibold text-indigo-600 ">{vendor?.fullname}</Link></p>
          </div>


        </CardFooter>
      </Card>

    </>



  );
}
