import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = uuid() + "-" + file.name;

  const filepath = path.join(process.cwd(), "public/uploads/" + filename);
  await writeFile(filepath, buffer);

  return NextResponse.json({
    url: "/uploads/" + filename,
  });
}
