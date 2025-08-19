

'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';


type SellerCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  data: { name: string; value: number }[];
};

export const SellerCard = ({ title, value, icon, data }: SellerCardProps) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h4 className="text-sm text-gray-500">{title}</h4>
            <h2 className="text-xl font-bold">{value}</h2>
          </div>
          <div className="text-blue-500">{icon}</div>
        </div>
        <div className="h-24 z-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} >
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

         <Button variant="ghost" className="flex items-center gap-2 text-sm self-start">
          <Eye className="h-4 w-4" /> View Details
        </Button>
      </CardContent>
    </Card>
  );
};

