import { ApplicationError } from "@/protocols";

export function paymentNotFound(): ApplicationError {
    return {
        name: 'PaymentRequiredError',
        message: 'Payment Required',
    }
}