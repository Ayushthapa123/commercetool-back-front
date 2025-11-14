import { APIResponse } from "@/lib/types";
import { errorResponse, getServiceAuthToken } from "@/lib/utils";
import { Payment, PaymentDraft } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";

/**
 * Creates a payment object in commercetools.
 * @param request the request object
 * @returns payment information about the payment service provider (PSP)
 */
export async function POST(request: Request): APIResponse<Payment> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const draft = (await request.json()) as PaymentDraft;
  const token = await getServiceAuthToken();

  const options: AxiosRequestConfig<PaymentDraft> = {
    method: "POST",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/payments`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: draft,
  };

  try {
    const { data, status } = await axios.request<Payment>(options);

    return NextResponse.json(data, { status: status });
  } catch (error: unknown) {
    return errorResponse(
      error,
      `Unable to create payment for anonymous id: ${draft.anonymousId}`,
    );
  }
}
