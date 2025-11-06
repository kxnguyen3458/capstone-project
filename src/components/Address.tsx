
import {
    Form, FormField, FormItem, FormControl, FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { addressSchema, type AddressType } from "@/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import axios from "axios";
import { apiKey, GEOAPIFY_URL } from "@/constants";
import { useEffect, useState } from "react";

export function Address({
    open,
    onOpenChange,
    onAddressConfirmed,
    defaultAddress
}: {
    open: boolean;
    defaultAddress: string | undefined,
    onOpenChange: (v: boolean) => void;
    onAddressConfirmed: (res: {
        formatted_address: string;
        place_id: string;
        latitude: number;
        longitude: number;
    }) => void;
}) {
    const form = useForm<AddressType>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            address: defaultAddress
        },
        mode: "onSubmit",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const ACCEPT_LEVEL = 0.9;
    type AddressValidationResult =
        | {
            validation: "CONFIRMED",
            addressDetails: {
                formatted_address: string;
                longitude: number;
                latitude: number;
                place_id: string;
            }
        }
        | {
            validation: "NOT_CONFIRMED";
        }

    useEffect(()=>{
        if(open){
            form.reset({address:defaultAddress ?? ""});
        }
    },[open, defaultAddress, form])


    const roundCoordinate = (coordinate:number, decimalPlaces = 6) => {
        if(typeof coordinate !== "number" || isNaN(coordinate)){
            return coordinate;
        }

        const factor = Math.pow(10,decimalPlaces);
        return Math.round(coordinate * factor) / factor;
        
    }

    async function validateAddressViaGeoAPI(data: AddressType): Promise<AddressValidationResult> {

        try {
            const res = await axios.get(
                GEOAPIFY_URL,
                {
                    params: {
                        text: data.address,
                        apiKey: apiKey,
                        format:"json"
                    }
                }
            );
            const results = res.data?.results ?? [];
            if (results.length === 0) {
                return { validation: "NOT_CONFIRMED" };
            }
            const address = results[0];
            const confidence: number = address?.rank?.confidence ?? 0;

            if (confidence >= ACCEPT_LEVEL) {
                const lon = roundCoordinate(address.lon);
                const lat = roundCoordinate(address.lat);

                const addressDetails = {
                    formatted_address: address.formatted,
                    longitude: lon,
                    latitude: lat,
                    place_id: address.place_id
                }
                return {
                    validation: "CONFIRMED",
                    addressDetails
                }
            } else return { validation: "NOT_CONFIRMED" };
        } catch (error) {
            toast.error("Network error! Please try again.");
            return { validation: "NOT_CONFIRMED" };
        }
    }
    const handleSubmit = async (values: AddressType) => {
        setIsSubmitting(true);
        try {
            const result = await validateAddressViaGeoAPI(values);

            if (result.validation === "NOT_CONFIRMED") {
                form.setError("address", {
                    type: "manual",
                    message: "Invalid address."
                });
                return;
            }
            const { addressDetails } = result;
            form.setValue("address", addressDetails.formatted_address, {
                shouldValidate: true,
                shouldDirty: true,
            })
            form.clearErrors("address");
            onAddressConfirmed(addressDetails);
            onOpenChange(false);

        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Add/Update address</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form className="" onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="mt-3 flex flex-col space-y-5 ">
                            <FormField
                                name="address"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel className="text-xs text-gray-400">e.g. 2801 S. University Ave, Little Rock, AR 72204</FormLabel>
                                        <FormControl>
                                            <Input
                                                // placeholder="2801 S. University Ave, Little Rock, AR 72204"
                                              
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="ml-auto space-x-1">
                                <Button type="button" className="border-1 border-gray-300" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>Update</Button>

                            </div>

                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}



