// src/components/admin/ProductForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminService } from "@/services/adminService";

const schema = z.object({
  title: z.string().min(1),
  price: z.number().min(0),
  description: z.string().optional(),
  category: z.string().min(1),
  image: z.string().optional(),
});

export default function ProductForm({ initialValues = {}, onSaved }) {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues.title || "",
      price: initialValues.price || 0,
      description: initialValues.description || "",
      category: initialValues.category || "",
      image: initialValues.image || "",
    },
  });

  const onSubmit = async (data) => {
    if (onSaved) {
      await onSaved(data);
    }
  };

  const file = watch("fileUpload");

  useEffect(() => {
    // when file changes, upload to server via adminService.uploadImage
    if (!file || file.length === 0) return;
    const upload = async () => {
      setUploading(true);
      try {
        const res = await adminService.uploadImage(file[0]);
        // expect response to include url
        if (res?.url) {
          setValue("image", res.url);
        }
      } catch (err) {
        console.error("Upload failed", err);
        // optionally expose error to user
      } finally {
        setUploading(false);
      }
    };
    upload();
  }, [file, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          {...register("title")}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            {...register("category")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Image URL</label>
        <input
          {...register("image")}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-sm text-gray-500 my-1">Or upload a file:</p>
        <input type="file" {...register("fileUpload")} accept="image/*" />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      </div>

      <div className="flex gap-2">
        <button
          disabled={isSubmitting}
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
