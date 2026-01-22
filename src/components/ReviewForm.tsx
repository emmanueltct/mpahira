"use client";

import { useState } from "react";
import { useCreateReview } from "@/hooks/useReviews";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ReviewForm({productId}) {
  const [form, setForm] = useState({
    customerName: "",
    rating: 0, // default: no stars selected
    comment: "",
    productId,
  });

  const { mutate, isPending } = useCreateReview();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submitting 0 stars
    if (form.rating === 0) {
      alert("Please select a rating!");
      return;
    }

    mutate(form);

    // Reset form
    setForm({
      customerName: "",
      rating: 0, // reset to no stars
      comment: "",
      productId,
    });
  };

  return (
    <div>
        <h3 className="w-full text-xl font-semibold mb-4"> Add your review here</h3>
    <form
      onSubmit={submit}
      className="space-y-4 p-4 border rounded bg-white"
    >
      {/* Name */}
      <TextField
        label="Your name"
        value={form.customerName}
        onChange={(e) =>
          setForm({ ...form, customerName: e.target.value })
        }
        fullWidth
        required
      />

      {/* ⭐ Rating with Half Stars */}
      <Stack spacing={1}>
        <label className="font-medium">Rating</label>
        <Rating
          value={form.rating}
          precision={0.5} // allow half stars
          size="large"
          onChange={(_, newValue) => {
            if (newValue !== null) {
              setForm({ ...form, rating: newValue });
            }
          }}
          sx={{
            "& .MuiRating-iconFilled": { color: "#f472b6" }, // pink-400
            "& .MuiRating-iconHover": { color: "#ec4899" }, // pink-500
          }}
        />
        <span className="text-gray-500 text-sm">
          {form.rating === 0 ? "No rating selected" : `You selected ${form.rating} stars`}
        </span>
      </Stack>

      {/* Comment */}
      <TextField
        label="Your review"
        multiline
        rows={3}
        value={form.comment}
        onChange={(e) =>
          setForm({ ...form, comment: e.target.value })
        }
        fullWidth
        required
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="contained"
        disabled={isPending}
        sx={{
          marginTop:"10px",
          backgroundColor: "#f472b6",
          "&:hover": { backgroundColor: "#ec4899" },
        }}
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
    </div>
  );
}
