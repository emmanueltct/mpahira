"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";




type AllSubUnitProductProps = {
   isSubUnitDeltailModalOpen: boolean;
   unit:string,
   subUnits:Array<any>;
onCloseSubUnitDetails: () => void;
};

const AllSubUnitProductDetails: React.FC<AllSubUnitProductProps> = ({
   isSubUnitDeltailModalOpen,
   unit,subUnits,
onCloseSubUnitDetails,
}) => {


  

  return (
    <Dialog open={isSubUnitDeltailModalOpen} onOpenChange={onCloseSubUnitDetails}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Product Sub units </DialogTitle>
          <DialogDescription>
            All  sub-units  under a unit product of <b>{unit}</b> .
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subUnits.map((sub, i) => (
              <TableRow key={sub.id}>
                <TableCell>{i + 1 }</TableCell>
                <TableCell>{sub.subUnit}</TableCell>
                <TableCell>{sub.createdAt}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    // onClick={() => handleRoleChange(sub.id, sub.roleId)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       
      </DialogContent>
    </Dialog>
  );
};

export default  AllSubUnitProductDetails;
