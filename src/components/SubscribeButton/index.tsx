import { useSession, signIn } from "next-auth/react";

import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

import style from "./styles.module.scss";

type SubscribeButtonProps = {
  priceId: string;
};

export const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
  const { data: session } = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      return signIn("github");
    }

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <button
      className={style.subscribeButton}
      type="button"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
