"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { useSaveLocation } from '@/hooks/clientsDeliveryLocation';
import toast from "react-hot-toast";
import { LoadingSpinner } from './ui/loading-spiner';

type DeliveryLocationCardProps = {
  isModalOpen: boolean;
  onClose: () => void;
};

const DeliveryLocationCard: React.FC<DeliveryLocationCardProps> = ({ isModalOpen, onClose }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocationText, setCurrentLocationText] = useState('');
   const [location, setLocation] = useState('');
  const [manualLocation, setManualLocation] = useState({
    streetNumber: '',
    nearestLandmark: '',
    description: '',
  });
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const saveLocationMutation = useSaveLocation();

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setLocation(`Lat: ${latitude}, Long: ${longitude}`)
        try {
          const apiKey = 'db0eec1de2dc420297f0a80481bb0ed2'; // Replace with env var in production
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en&pretty=1`
          );
          const data = await response.json();

          const locationName = data.results?.[0]?.formatted || `Lat: ${latitude}, Long: ${longitude}`;
          setCurrentLocationText(locationName);

        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setCurrentLocationText(`Lat: ${latitude}, Long: ${longitude}`);
        }
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSave = () => {
    if (useCurrentLocation) {
      if (!currentLocationText || !coords) {
        toast.error("Please fetch your current location first.");
        return;
      }

      const { streetNumber, nearestLandmark, description } = manualLocation;
        if (!streetNumber || !nearestLandmark || !description) {
        toast.error("Please fill in all location fields for more details to help us find you easily.");
        return;
      }
      const payload = {
        locationLongitude: coords.longitude.toString(),
        locationLatitude: coords.latitude.toString(),
        googleMapCoordinate: `Lat: ${coords.latitude}, Long: ${coords.longitude}`,
        streetNumber: manualLocation.streetNumber,
        nearestLandmark: manualLocation.nearestLandmark,
        locationDescription: manualLocation.description || currentLocationText,
      };

      saveLocationMutation.mutate(
        { type: "current", location: payload },
        {
          onSuccess: () => {
            toast.success("Location saved successfully!");
            onClose();
          },
          onError: () => {
            toast.error("Failed to save location.");
          }
        }
      );
    } else {
      const { streetNumber, nearestLandmark, description } = manualLocation;

      if (!streetNumber || !nearestLandmark || !description) {
        toast.error("Please fill in all manual location fields.");
        return;
      }

      const payload = {
        locationLongitude: '',
        locationLatitude: '',
        googleMapCoordinate: '',
        streetNumber,
        nearestLandmark,
        locationDescription: description,
      };

      saveLocationMutation.mutate(
        { type: "manual", location: payload },
        {
          onSuccess: () => {
            toast.success("Location saved successfully!");
            onClose();
          },
          onError: () => {
            toast.error("Failed to save location.");
          }
        }
      );
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Change Delivery Location</DialogTitle>
          <DialogDescription>
            Choose how you want to provide your delivery location.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Button
            variant={useCurrentLocation ? "default" : "outline"}
            onClick={() => {
              setUseCurrentLocation(true);
              setCurrentLocationText("");
              handleGetCurrentLocation();
            }}
          >
            Current Location
          </Button>
          <Button
            variant={!useCurrentLocation ? "default" : "outline"}
            onClick={() => setUseCurrentLocation(false)}
          >
            Different Location
          </Button>
        </div>

        {useCurrentLocation && (
          <div className="mt-4 space-y-3">
            <div className='w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 flex flex-col'>
               {currentLocationText && (<span>{location}</span>)}

              { currentLocationText || "Location will appear here..."}

                 {!currentLocationText&& <LoadingSpinner/>}
            </div>

            {currentLocationText && (
              <span className='text-sm text-gray-500'>
                Add more details to help us find you easily:
              </span>
            )}
          </div>
        )}

        {((useCurrentLocation && currentLocationText) || !useCurrentLocation) && (
          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Street Number"
              value={manualLocation.streetNumber}
              onChange={(e) =>
                setManualLocation({ ...manualLocation, streetNumber: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-gray-300"
            />
            <input
              type="text"
              placeholder="Nearest Landmark"
              value={manualLocation.nearestLandmark}
              onChange={(e) =>
                setManualLocation({ ...manualLocation, nearestLandmark: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-gray-300"
            />
            <textarea
              placeholder="Additional Description"
              value={manualLocation.description}
              onChange={(e) =>
                setManualLocation({ ...manualLocation, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border rounded-md border-gray-300"
            />
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saveLocationMutation.isPending}>
            {saveLocationMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryLocationCard;
