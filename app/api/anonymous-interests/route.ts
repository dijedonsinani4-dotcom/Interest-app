import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";

const LABEL_MAX = 60;

function parseLabel(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return null;
  }
  const obj = body as Record<string, unknown>;
  const raw =
    typeof obj.label === "string"
      ? obj.label
      : typeof obj.interest === "string"
        ? obj.interest
        : null;
  if (raw === null) {
    return null;
  }
  return raw.trim();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const label = parseLabel(body);
  if (label === null) {
    return NextResponse.json(
      { error: "Provide a \"label\" or \"interest\" string field" },
      { status: 400 },
    );
  }
  if (label.length < 1 || label.length > LABEL_MAX) {
    return NextResponse.json(
      { error: `Interest must be 1–${LABEL_MAX} characters after trimming` },
      { status: 400 },
    );
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (e) {
    console.error("anonymous-interests: service client", e);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 503 },
    );
  }

  const normalized_label = label.toLocaleLowerCase("en-US");

  const { data, error } = await supabase
    .from("anonymous_interests")
    .insert({ label, normalized_label })
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("anonymous_interests insert", error);
    return NextResponse.json({ error: "Could not save submission" }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id ?? null }, { status: 201 });
}
