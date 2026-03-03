import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

// POST - Upload image to Vercel Blob or fallback to local
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload to Vercel Blob
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true, // Adds random suffix to prevent name conflicts
      });

      return NextResponse.json({
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: file.type,
      });
    } else {
      // Fallback to local upload (public/uploads)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const randomSuffix = crypto.randomBytes(8).toString("hex");
      const ext = file.name.split('.').pop();
      const filename = `${file.name.replace(`.${ext}`, "")}-${randomSuffix}.${ext}`;
      
      const path = join(process.cwd(), "public", "uploads", filename);
      await writeFile(path, buffer);
      
      return NextResponse.json({
        url: `/uploads/${filename}`,
        pathname: `/uploads/${filename}`,
        size: file.size,
        contentType: file.type,
      });
    }

  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE - Remove image from Vercel Blob
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    // TODO: Add authentication check here
    // const session = await getServerSession();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized - Admin access required' },
    //     { status: 401 }
    //   );
    // }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Delete from Vercel Blob
    await del(url);



    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed. Please try again." },
      { status: 500 }
    );
  }
}
