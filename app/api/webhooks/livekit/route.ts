import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { db } from "@/lib/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerPayload = headers();
    const authorization = headerPayload.get("Authorization");

    if (!authorization) {
      return new Response("No authorization header", { status: 400 });
    }

    const event = await receiver.receive(body, authorization);
    const ingressId = event.ingressInfo?.ingressId;

    if (!ingressId) {
      return new Response("Ingress ID not found", { status: 400 });
    }

    // Find the stream by ingressId
    const stream = await db.stream.findFirst({
      where: { ingressId },
    });

    if (!stream) {
      return new Response("Stream not found", { status: 404 });
    }

    // Update the stream based on the event type
    await db.stream.update({
      where: { id: stream.id }, // Use the unique `id` for the update
      data: {
        isLive: event.event === "ingress_started",
      },
    });

    return new Response("Event processed successfully", { status: 200 });

  } catch (error) {
    console.error("Error processing webhook event:", error);
    return new Response("Error processing webhook event", { status: 500 });
  }
}