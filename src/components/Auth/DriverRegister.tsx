"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OrderDriverForm({processedItem,orderItem}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    plateNumber: "",
  });

  const [driverExists, setDriverExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
 
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Search driver by telephone
  const handleSearch = async () => {
    if (!formData.telephone) {
      toast.error("Please enter a phone number first");
      return;
    }

    setSearching(true);
    try {
      const res = await axiosInstance.get(`/drivers/${formData.telephone}`);
      if (res.data) {
        setFormData({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          telephone: res.data.telephone,
          plateNumber: res.data.plateNumber,
        });
        setDriverExists(true);
        toast.success("Driver information retrieved successful");
      }
    } catch (error: any) {
      // Driver not found
      setDriverExists(false);
      toast.error("Driver not found. Please fill in details.");
    } finally {
      setSearching(false);
    }
  };

  // Submit - create or use existing driver
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
      try {
  let res;
  if (driverExists) {
    res = await axiosInstance.post(`/drivers/use-existing/${orderItem.id}`, {
      telephone: formData.telephone,

    });
    if(res.data){
       toast.success(res.data.message);
       router.push("/agent/orders")
    }else{
       toast.error("Something went wrong please try again");
    }
  
  } else {
    res = await axiosInstance.post(`/drivers/${orderItem.id}`, formData);
    router.push("/agent/orders")
    toast.success("New driver created and assigned!");
  }

} catch (error: any) {
  console.error(error);

  const validationErrors = error?.response?.data?.errors;

  if (Array.isArray(validationErrors)) {
    // Show each error message from the backend
    validationErrors.forEach((err: any) => {
      toast.error(err.message);
    });
    return
  } else {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
} finally {
  setLoading(false);
}

  };

  return (
  <>
    {orderItem.items.length === processedItem.length ? (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mt-8 space-y-5 border"
      >
        <h2 className="text-lg font-semibold mb-2">Assign Driver</h2>

        {/* Telephone & Plate Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="telephone" className="mb-2">
                Telephone
              </Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                placeholder="e.g. +2507XX XXX XXX"
                value={formData.telephone}
                onChange={handleChange}
                required
                disabled={driverExists} // lock if driver found
              />
            </div>
            {!driverExists && (
              <Button type="button" onClick={handleSearch} disabled={searching}>
                {searching ? "Searching..." : "Search"}
              </Button>
            )}
          </div>

          <div>
            <Label htmlFor="plateNumber" className="mb-2">
              Plate Number
            </Label>
            <Input
              id="plateNumber"
              name="plateNumber"
              placeholder="e.g. RAD 123 A"
              value={formData.plateNumber}
              onChange={handleChange}
              required={!driverExists}
              disabled={driverExists}
            />
          </div>
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="mb-2">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              required={!driverExists}
              disabled={driverExists}
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="mb-2">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              required={!driverExists}
              disabled={driverExists}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex  justify-end">
          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading
              ? "Processing..."
              : driverExists
              ? "Assign & Complete order"
              : "Save & Complete order"}
          </Button>
        </div>
      </form>
    ) : (
      <div className="w-full p-4 text-gray-700 bg-yellow-50 border border-yellow-200 rounded-md">
        As an agent, you must mark all order items as{" "}
        <span className="font-semibold">processed</span> before completing the
        order. Additionally, you will be required to provide the driver’s
        details so the order can be delivered.
      </div>
    )}
  </>
);

}
