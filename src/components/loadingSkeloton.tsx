import React from 'react'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
function LoadingSkeloton() {
  return (

    <div className="block overflow-x-auto rounded-lg shadow-sm border mb-8 w-full bg-amber-50 min-w-full">
      <Table>
        <TableBody>
          {Array.from({ length: 12 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell colSpan={7}>
                 <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default LoadingSkeloton