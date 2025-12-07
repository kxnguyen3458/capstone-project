import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Lock,
  ShoppingCart,
  User,
} from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

import { CustomerBooking } from "../components/homepage/CustomerBooking";

import { useEffect, useState } from "react";
import type { ProvidedService, CustomerBookingInfo } from "@/types";

import { useCartStore, type CartItem } from "@/store/cartStore";
import { getProfileService } from "@/services/profile";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { customerBookingInfoSchema } from "@/schemas/booking";

import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { createBooking } from "@/services/bookingServices";

export type CartLocationState = {
  booking: any;
};

const Cart = () => {
  const apiPrivate = useAxiosPrivate(); 
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const cart = useCartStore((s) => s.cart);
  const deleteItem = useCartStore((s) => s.deleteItem);
  const loadCart = useCartStore((s) => s.loadCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const [selectedService, setSelectedService] =
    useState<ProvidedService | null>(null);
  const [openAddService, setOpenAddService] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);


  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => {
      const rawPrice: unknown = (item as any).price;
      let priceNumber = 0;

      if (typeof rawPrice === "number") {
        priceNumber = rawPrice;
      } else if (typeof rawPrice === "string") {
        const parsed = Number(rawPrice);
        priceNumber = isNaN(parsed) ? 0 : parsed;
      }

      return sum + priceNumber;
    }, 0);

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals(cart);

  const form = useForm<CustomerBookingInfo>({
    resolver: zodResolver(customerBookingInfoSchema),
    defaultValues: {
      fullname: "",
      contact_info: "",
      email: "",
      address: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!currentUser || !apiPrivate) return;
    loadCart(apiPrivate);
  }, [currentUser, apiPrivate, loadCart]);

  useEffect(() => {
    if (!currentUser || !apiPrivate) return;

    (async () => {
      try {
        const data = await getProfileService(apiPrivate);
        if (!data) return;

        const customerInfo: CustomerBookingInfo = {
          fullname: data.fullname ?? "",
          contact_info: data.contact_info ?? "",
          email: data.user_email ?? "",
          address: data.formatted_address ?? "",
        };

        form.reset(customerInfo);
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to load profile");
      }
    })();
  }, [currentUser, apiPrivate, form]);

  const onSubmitCustomerInfo = (data: CustomerBookingInfo) => {
    console.log(data);
  };

  const handlePlaceOrder = async () => {
    if (!apiPrivate) {
      toast.error("Missing API client. Please try again.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please check your customer information.");
      return;
    }

    const customerInfo = form.getValues();

    const customer = {
      fullname: customerInfo.fullname,
      contact_info: customerInfo.contact_info,
      email: customerInfo.email,
      address: customerInfo.address,
    };

    const items = cart.map((item) => ({
      service_id: item.service_id,
      vendor_id: item.vendor_id,
      preferred_date: item.preferredDate.toISOString().split("T")[0],
      preferred_time: item.preferredTime,
    }));

    try {
      const booking = await createBooking(apiPrivate, { customer, items });

      console.log("BOOKING CREATED:", booking);

      await clearCart(apiPrivate);
      setOrderSuccess(true);

      toast.success("Order placed successfully!");
    } catch (err: any) {
      console.error("Booking error:", err);

      const status = err.status;
      const data = err.data;

      if (status === 400 && data?.items) {
        if (typeof data.items[0] === "string") toast.error(data.items[0]);
        else toast.error("Invalid booking info.");
      } else if (status === 401) {
        toast.error("You must login first.");
      } else if (status === 403) {
        toast.error(data?.detail || "Forbidden.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  if (!currentUser) {
    return (
      <main className="w-7/8 mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mx-auto bg-slate-200 w-20 h-20 p-4 rounded-full flex justify-center items-center mb-4">
          <Lock size={40} />
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          You need to login to view your cart
        </h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Please log in to review your booking details and proceed to checkout.
        </p>

        <Button className="w-64 bg-indigo-600 mb-3" asChild>
          <Link to="/login">Log In</Link>
        </Button>

        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Sign up here
          </Link>
        </p>
      </main>
    );
  }

  if (orderSuccess) {
    return (
      <main className="w-7/8 mx-auto p6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mx-auto bg-green-100 w-20 h-20 p-4 rounded-full flex justify-center items-center mb-4">
          <ShoppingCart size={40} className="text-green-600" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          Successfully placed order 
        </h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Your booking has been created. You can go back to the home page.
        </p>

        <Button className="w-64 bg-indigo-600" onClick={() => navigate("/")}>
          Back to home page
        </Button>
      </main>
    );
  }

  return (
    <main className="w-7/8 mx-auto p-6">
      <div className="flex gap-3 items-center mb-10">
        <ShoppingCart
          className="bg-indigo-600 text-white p-2 rounded-md"
          size={45}
        />
        <div>
          <h2 className="mb-0">Your Cart</h2>
          <p>Review your booking and complete payment</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 rounded-lg ">
        <section className="col-span-2 space-y-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitCustomerInfo)}
              className="bg-white p-6 border border-gray-200 rounded-lg space-y-4"
            >
              <h4 className="flex gap-2 items-center mb-2">
                <User size={20} className="text-indigo-600" /> Customer
                Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex flex-col space-y-5">
            {cart.map((item) => (
              <div
                key={item.clientId}
                className="bg-white p-6 border border-gray-200 rounded-lg"
              >
                <div>
                  <h4>{(item as any).name}</h4>
                  <p className="text-gray-600 text-sm">
                    {(item as any).description}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Badge
                      variant="outline"
                      className="border-2  border-indigo-600 text-indigo-700 flex items-center gap-1"
                    >
                      <Clock size={15} className="w-10 h-10" />
                      {(item as any).duration} mins
                    </Badge>
                    <Badge className="bg-indigo-600 border-2 border-indigo-600 text-white flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {(item as any).price}
                    </Badge>
                  </div>
                </div>

                <hr className="my-5 w-5/6 mx-auto" />

                <div className="grid grid-cols-2 bg-slate-100 p-2">
                  <div>
                    <p className="mb-2 text-gray-600 text-sm flex gap-2 items-center">
                      <Calendar size={15} /> Preferred Date
                    </p>
                    <p className="text-sm">
                      {item.preferredDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-600 text-sm flex gap-2 items-center">
                      <Clock size={15} /> Preferred Time
                    </p>
                    <p className="text-sm">{item.preferredTime}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <Button
                    className="rounded-xl border border-black"
                    onClick={() => {
                      setEditingItem(item);
                      setSelectedService(null);
                      setOpenAddService(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl border border-black"
                    onClick={() => deleteItem(apiPrivate, item.clientId)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-1 ">
            <h4 className="font-semibold text-lg mb-2">Order Summary</h4>

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>$ {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Tax (10%)</span>
              <span>$ {tax.toLocaleString()}</span>
            </div>

            <hr />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-indigo-600">
                $ {total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-2">
            <div className="flex gap-2 mb-4">
              <CreditCard className="text-indigo-600" /> Payment Information
            </div>
            <p className="rounded-md flex items-center gap-2 text-sm p-2 border border-green-200 bg-green-100/80 text-green-800">
              <Lock size={15} />
              Your payment information is encrypted and secure
            </p>
            <p className="mt-5">Card Number *</p>
          </div>

          <Button
            className="w-full bg-indigo-600 text-white"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
          >
            Place Order
          </Button>
        </section>
      </div>

      <CustomerBooking
        openAddService={openAddService}
        setOpenAddService={setOpenAddService}
        selectedService={selectedService}
        editingItem={editingItem}
      />
    </main>
  );
};

export default Cart;
