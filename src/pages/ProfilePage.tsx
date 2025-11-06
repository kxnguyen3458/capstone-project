
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileSchema, type ProfileForm } from "@/schemas/auth";
import { Address } from "@/components/Address";
import { toast } from "sonner";
import { getProfileService, updateProfileService } from "@/services/profile";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";




export default function ProfilePage() {
  const apiPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();

  const user_email = currentUser?.email ?? "";

  const [isEditing, setIsEditing] = useState(false);
  const [original, setOriginal] = useState<ProfileForm>({
    fullname: "",
    email: user_email,
    contact_info: "",
    formatted_address: "",
    place_id: "",
    latitude: null,
    longitude: null,
  });
  const [addrOpen, setAddrOpen] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: original,
    mode: "onChange",
  });


  useEffect(() => {
    (async () => {
      try {
        const data = await getProfileService(apiPrivate);
        if (!data) return;

        const safe = {
          ...data,
          latitude: data.latitude == null ? null : Number(data.latitude),
          longitude: data.longitude == null ? null : Number(data.longitude)
        }
        console.log(safe)

        setOriginal(safe);
        form.reset(safe);
      } catch (e: any) {

        toast.error(e?.message ?? "Failed to load profile");
      }
    })();
  }, [form, apiPrivate]);

  async function updateProfile(payload: ProfileForm) {

    try {
      const res = await updateProfileService(apiPrivate, payload);
      if (!res) return;

      return res;

    } catch (error: any) {
      if (error?.message) toast.error(error.message);
      if (error?.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([key, message]) =>
          form.setError(key as any, { type: "server", message: String(message) }))
      }
      return undefined;
    }
  }

  const onSubmitInvalid = (errors: any) => {
    console.log("INVALID errors:", errors);
    toast.error(
      "Please fix: " + Object.keys(errors).join(", ")
    );
  };

  const onSubmit = async (values: ProfileForm) => {

    const updated = await updateProfile(values);

    if (!updated) {
      return;
    }

    setOriginal(updated);
    form.reset(updated);
    toast.success("Profile updated");
    setIsEditing(false);
  };


  const handleCancel = () => {
    form.reset(original);
    setIsEditing(false);
  };

  const onAddressConfirmed = (res: {
    formatted_address: string;
    place_id: string;
    latitude: number;
    longitude: number;
  }) => {
    form.setValue("formatted_address", res.formatted_address, { shouldDirty: true, shouldValidate: true });
    form.setValue("place_id", res.place_id, { shouldDirty: true });
    form.setValue("latitude", res.latitude, { shouldDirty: true });
    form.setValue("longitude", res.longitude, { shouldDirty: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Profile</h1>

      </div>
      <Form {...form}>
        <form
          id="profile-form"
          onSubmit={form.handleSubmit(onSubmit, onSubmitInvalid)}
          className="grid grid-cols-1 gap-5"
        >

          <div className="flex items-center justify-end gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  form="profile-form"
                  type="submit"
                  disabled={!form.formState.isDirty || form.formState.isSubmitting}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                {isEditing ? (
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                ) : (
                  <FormControl>
                    <Input  {...field} disabled />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input  {...field} disabled />
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
                <FormLabel>Contact_info (e.g. 5551234567)</FormLabel>
                {isEditing ? (
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                ) : (
                  <FormControl>
                    <Input  {...field} disabled />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="formatted_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                {!isEditing ? (
                  <FormControl>
                    <Input  {...field} disabled />
                  </FormControl>
                ) : (
                  <div className="flex items-baseline gap-3 ">
                    <div className="flex-1">
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                    </div>
                    <button type="button" onClick={() => setAddrOpen(true)}
                      className="text-blue-700 underline underline-offset-2 hover:text-primary/70"
                    >
                      Add / Change address
                    </button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Address
        open={addrOpen}
        onOpenChange={setAddrOpen}
        onAddressConfirmed={onAddressConfirmed}
        defaultAddress={original.formatted_address}
      ></Address>


    </div>
  );
}
