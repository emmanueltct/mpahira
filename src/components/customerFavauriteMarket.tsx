"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Market {
  id: string;
  marketName: string;
}

interface Props {
  marketId?: string; // preselected marketId from params
  markets: Market[]; // markets fetched from API
  isModalOpen: boolean;
  onClose: () => void;
  onSave: (selectedMarketId: string) => void;
}

const CustomerFavouriteMarket: React.FC<Props> = ({
  marketId,
  markets,
  isModalOpen,
  onClose,
  onSave,
}) => {
  const [selectedMarket, setSelectedMarket] = React.useState(marketId || "");

  const handleSave = () => {
    if (selectedMarket) {
      onSave(selectedMarket);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto w-[90%] p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Nearest favorite market</DialogTitle>
          <DialogDescription>
            You can place orders only from your selected favorite market. Please choose the nearest market to reduce delivery costs.
          </DialogDescription>
        </DialogHeader>

        {/* Market Select */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Market</label>
          <select
            className="w-full border rounded-md p-2"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            <option value="">Select a market</option>
            {markets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.marketName}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedMarket}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFavouriteMarket;
