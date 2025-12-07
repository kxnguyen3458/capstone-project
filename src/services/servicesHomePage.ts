import { api as publicApi } from '../api/axios';
import { SERVICES_HOME_PAGE, SERVICES_OF_EACH_VENDOR } from "@/constants";
import type { ProvidedService } from '@/types';

type ServicesApiResponse = {
  results: ProvidedService[];
  next: string | null;
  previous: string | null;
  count: number; 
};

const PAGE_SIZE = 9;

export const getAllServices = async (): Promise<ProvidedService[]> => {
  let page = 1;
  let all: ProvidedService[] = [];

  let total = 0;   
  let loaded = 0;  

  do {
    const res = await publicApi.get<ServicesApiResponse>(SERVICES_HOME_PAGE, {
      params: {
        page,
        limit: PAGE_SIZE, 
      },
    });

    const data = res.data;

    if (page === 1) {
      total = data.count; 
    }

    all = all.concat(data.results);
    loaded += data.results.length;
    page += 1;
  } while (loaded < total); 

  return all;
};






export type GetServicesWithLimitParams = {
  page: number;
  limit: number;
  serviceIds?: string[];
};


export type Pagination = {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalItems: number;
};

export type ServicesHomePageResponse = {
  services: ProvidedService[];
  pagination: Pagination;
};

export const getServicesWithLimit = async ({ page, limit, serviceIds }: GetServicesWithLimitParams
): Promise<ServicesHomePageResponse> => {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (serviceIds && serviceIds.length > 0) {
    params.set("serviceIds", serviceIds.join(","));
  }

  const res = await publicApi.get<{ data: ServicesHomePageResponse }>(
    `${SERVICES_HOME_PAGE}?${params.toString()}`
  );

  return res.data.data;
};



export const getServicesOfEachVendor = async ( vendor_id: string) => {
    try {
        const res = await publicApi.get(`${SERVICES_OF_EACH_VENDOR}${vendor_id}/`);

        if (!res) {
            throw new Error("No data return!");
        }
        return res.data;
    } catch (error) {
        throw new Error("No data return!");
    }
}