import Stripe from 'stripe';
import dotenv from "dotenv"
dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

class PaymentService {
    calculateDiscountedPrice(originalPrice: number, discountPercentage: number) {
        if (originalPrice <= 0 || discountPercentage < 0 || discountPercentage > 100) {
            return 0;
        }
        return originalPrice - (discountPercentage / 100) * originalPrice;
    };

    async makeStripePayment(items: any[]) {
        return await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items,
            mode: 'payment',
            success_url: 'http://localhost:3000/checkout/success',
            cancel_url: 'http://localhost:3000/checkout/cancel',
            allow_promotion_codes: true,
        })
    }

}

export const paymentService = new PaymentService();