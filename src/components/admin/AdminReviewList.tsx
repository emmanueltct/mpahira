"use client";

import { useState, useMemo } from "react";
import { useReviews, Review } from "@/hooks/useReviews";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axiosInstance from "@/lib/axios";

type ReviewStatus = "all" | "approved" | "unapproved";

interface TogglePayload {
  id: string;
  isApproved: boolean;
}

export default function AdminReviewList() {
  const queryClient = useQueryClient();

  /* -------------------- STATE -------------------- */
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>("all");
  const [searchProductId, setSearchProductId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  /* -------------------- DATA -------------------- */
  const { data: reviewsData = [], isLoading } = useReviews();

  /* -------------------- FILTERING -------------------- */
  const filteredReviews = useMemo(() => {
    let temp = [...reviewsData];

    if (statusFilter === "approved") {
      temp = temp.filter(r => r.isApproved);
    }

    if (statusFilter === "unapproved") {
      temp = temp.filter(r => !r.isApproved);
    }

    if (searchProductId.trim()) {
      temp = temp.filter(r =>
        r.productId.toLowerCase().includes(searchProductId.toLowerCase())
      );
    }

    return temp;
  }, [reviewsData, statusFilter, searchProductId]);

  /* -------------------- PAGINATION -------------------- */
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* -------------------- MUTATIONS -------------------- */
  const toggleApprovalMutation = useMutation<Review, Error, TogglePayload>({
    mutationFn: async ({ id, isApproved }) => {
      const endpoint = isApproved
        ? `/product-reviews/${id}/unapprove`
        : `/product-reviews/${id}/approve`;

      const { data } = await axiosInstance.patch(`/product-reviews/${id}/approve`, {
        isApproved: !isApproved,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/product-reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  /* -------------------- UI -------------------- */
  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="space-y-4">
      {/* -------------------- FILTERS -------------------- */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Select
          size="small"
          value={statusFilter}
          onChange={(e: SelectChangeEvent<ReviewStatus>) => {
            setStatusFilter(e.target.value as ReviewStatus);
            setCurrentPage(1);
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="unapproved">Unapproved</MenuItem>
        </Select>

        <TextField
          size="small"
          label="Search by Product ID"
          value={searchProductId}
          onChange={(e) => {
            setSearchProductId(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Select
          size="small"
          value={pageSize.toString()}
          onChange={(e: SelectChangeEvent) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <MenuItem value="5">5 per page</MenuItem>
          <MenuItem value="10">10 per page</MenuItem>
          <MenuItem value="20">20 per page</MenuItem>
        </Select>
      </div>

      {/* -------------------- EMPTY STATE -------------------- */}
      {paginatedReviews.length === 0 && (
        <p className="text-center text-gray-500">No reviews found.</p>
      )}

      {/* -------------------- REVIEW LIST -------------------- */}
      {paginatedReviews.map((review: Review) => (
        <div
          key={review.id}
          className="border p-4 rounded bg-white shadow-sm flex justify-between items-start"
        >
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{review.customerName}</span>

              <Stack spacing={0}>
                <Rating value={review.rating} precision={0.5} readOnly />
                <span className="text-gray-500 text-sm">
                  {review.rating} stars
                </span>
              </Stack>
            </div>

            <p className="text-gray-700">{review.comment}</p>

            <p className="mt-1 text-sm">
              Product ID: <span className="font-medium">{review.productId}</span>
            </p>

             <p className="mt-1 text-sm">
              Product Name: <span className="font-medium">{review.productId}</span>
            </p>


            <p className="mt-1 text-sm">
              Status:{" "}
              <span
                className={
                  review.isApproved ? "text-green-600" : "text-red-500"
                }
              >
                {review.isApproved ? "Approved" : "Pending"}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="contained"
              color={review.isApproved ? "warning" : "success"}
              size="small"
              disabled={toggleApprovalMutation.isPending}
              onClick={() =>
                toggleApprovalMutation.mutate({
                  id: review.id,
                  isApproved: review.isApproved,
                })
              }
            >
              {review.isApproved ? "Unapprove" : "Approve"}
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(review.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}

      {/* -------------------- PAGINATION -------------------- */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Prev
        </Button>

        <span className="flex items-center px-2">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
