import { Readable } from "stream";
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

const convertStreamToBuffer = async (buffer: Readable) => {
  const chunks = [];

  for await (const c of buffer) {
    chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  }

  return Buffer.concat(chunks);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const Webhooks = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const buffer = await convertStreamToBuffer(request);

    const secret = request.headers["stripe-signature"];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        buffer,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (e) {
      return response.status(400).send(`Webhook Error: ${e.message}`);
    }

    const { type } = event;
    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;

          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;

          default:
            throw new Error("Unhandled event");
        }
      } catch (e) {
        return response.json({
          erro: "Webhook handler failed",
        });
      }
    }

    response.json({ recived: true });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
};

export default Webhooks;
