"use client";

import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

/* -------------------- Types -------------------- */
interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment?: string | null;
  createdAt?: string;
}

interface ReviewListProps {
  productReview: Review[];
}

/* -------------------- Component -------------------- */
export default function ReviewList({
  productReview,
}: ReviewListProps) {
  if (!productReview || productReview.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No reviews yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        Customer Reviews
      </h2>

      {productReview.map((review) => (
        <div
          key={review.id}
          className="border p-4 rounded bg-white shadow-sm"
        >
          {/* Customer Name & Rating */}
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg">
              {review.customerName}
            </span>

            <Stack spacing={0} alignItems="flex-end">
              <Rating
                value={review.rating}
                precision={0.5}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#f472b6",
                  },
                  "& .MuiRating-iconEmpty": {
                    color: "#d1d5db",
                  },
                }}
              />
              <span className="text-gray-500 text-sm">
                {review.rating} stars
              </span>
            </Stack>
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
