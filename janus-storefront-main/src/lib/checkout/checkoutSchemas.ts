export type StripeAddress = {
  line1: string;
  line2?: string | null;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
};

export type StripeAddressDetails = {
  name: string;
  firstName?: string;
  lastName?: string;
  address: StripeAddress;
  phone?: string;
  email: string;
};
