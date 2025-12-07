import { CustomerBooking } from "@/components/homepage/CustomerBooking";
import Banner from "@/components/homepage/Banner"
import HomeFilter from "@/components/homepage/HomeFilter"
import ServiceListContainter from "@/components/homepage/ServiceListContainter"
import { Button } from "@/components/ui/button";
import type { ProvidedService } from "@/types";
import { formatNumberWithDecimal } from "@/utils";
import { useState } from "react";

const HomePage = () => {
  const [selectedService, setSelectedService] = useState<ProvidedService | null>(null);
  const [openAddService, setOpenAddService] = useState<boolean>(false);

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  return (
    <div className="static">
      <Banner />
      <div className="grid grid-cols-4 w-8/9 mx-auto space-x-5 mt-8 items-start">
        <section className=" p-5 rounded-md shadow-xl bg-white">
          <HomeFilter
            selectedServiceIds={selectedServiceIds}
            onChange={setSelectedServiceIds}
          />
        </section>
        <main className="col-span-3">
          <ServiceListContainter
            selectedService={selectedService}
            setSelectedService={setSelectedService}

            selectedServiceIds={selectedServiceIds}
          />
        </main>
      </div>
      {
        selectedService &&
        <div
          style={{ boxShadow: "0 -20px 20px -5px rgba(0,0,0,0.1)" }}
          className="px-15 sticky bottom-0 w-full p-3 bg-white flex justify-between items-center" >
          <div>
            <p>1 services selected</p>
            <p className="text-gray-600">Total: $ {formatNumberWithDecimal(selectedService.price)}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedService(null)}>Cancel</Button>
            <Button
              onClick={() => {
                setOpenAddService(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Book Now
            </Button>
          </div>
        </div>
      }

      <CustomerBooking
        openAddService={openAddService}
        setOpenAddService={setOpenAddService}
        selectedService={selectedService}
      />
    </div>

  )
}

export default HomePage
