import ServiceCard from "./ServiceCard";
import type { ProvidedService } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getServicesWithLimit } from "@/services/servicesHomePage";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface ServiceContainerProps {
  selectedService: ProvidedService | null;
  setSelectedService: React.Dispatch<React.SetStateAction<ProvidedService | null>>;
  selectedServiceIds: string[];
}

type Pagination = {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalItems: number;
};

const ServiceListContainter = ({
  selectedService,
  setSelectedService,
  selectedServiceIds,
}: ServiceContainerProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 9;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const { data: response, isLoading } = useQuery({
    queryKey: ["services", currentPage, limit, selectedServiceIds],
    queryFn: () =>
      getServicesWithLimit({
        page: currentPage,
        limit,
        serviceIds: selectedServiceIds ?? [],
      }),
  });

  const servicesList = (response?.services ?? []) as ProvidedService[];
  const paginationInfo = (response?.pagination ?? {}) as Pagination;
  const totalPages = paginationInfo.totalPages ?? 1;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: String(page), limit: String(limit) });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {servicesList.map((s: ProvidedService, i: number) => (
          <ServiceCard
            key={i}
            service={s}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
          « Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={currentPage === num ? "font-bold text-blue-600" : ""}
          >
            {num}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next »
        </button>
      </div>
    </div>
  );
};

export default ServiceListContainter;
