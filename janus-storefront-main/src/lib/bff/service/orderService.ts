import { getCsrfToken } from "@/lib/http/getCsrfToken";
import { logError } from "@/lib/logger";
import {
  emptyOrder,
  OrderModel,
  OrderNumberModel,
} from "@/lib/models/orderModel";
import {
  getSessionCartId,
  getSessionCartVersion,
  removeSessionCartId,
  removeSessionCartVersion,
} from "@/lib/session/sessionStore";
import { getBffAuth } from "@/lib/utils";
import {
  OrderAddPaymentAction,
  OrderFromCartDraft,
  OrderUpdate,
  OrderUpdateAction,
} from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";

export type OrderRequest = {
  anonymousId?: string;
  cartId?: string;
};

class OrderService {
  private readonly baseUrl: string;
  private readonly auth: string;

  constructor(bffUrl: string, auth: string) {
    this.baseUrl = `${bffUrl}/orders`;
    this.auth = auth;
  }

  private mapQueryParams(request: OrderRequest): URLSearchParams {
    const params = new URLSearchParams();
    const addParam = (name: string, value: string | undefined) => {
      if (value && value !== "") {
        params.append(name, value);
      }
    };

    addParam("anonymousId", request.anonymousId);
    addParam("cartId", request.cartId);

    return params;
  }

  async getNextOrderNumber(): Promise<string> {
    try {
      const url = `${this.baseUrl}/number`;
      const csrfToken = await getCsrfToken(this.auth);
      const options: AxiosRequestConfig = {
        url: url,
        method: "POST",
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
          "x-csrf-token": csrfToken,
        },
      };

      const response = await axios.request<OrderNumberModel>(options);
      return response.data.orderNumber;
    } catch (error) {
      logError(error, `Error retrieving order number`);
      return "";
    }
  }

  async searchOrders(request: OrderRequest): Promise<OrderModel[]> {
    try {
      const params = this.mapQueryParams(request);
      const options: AxiosRequestConfig = {
        url: this.baseUrl,
        method: "GET",
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
        },
        params: params,
      };

      const response = await axios.request<OrderModel[]>(options);
      return response.data;
    } catch (error) {
      logError(error, `Error retrieving order: ${request}`);
      return [];
    }
  }

  async getOrder(id: string): Promise<OrderModel> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const options: AxiosRequestConfig = {
        url: url,
        method: "GET",
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
        },
      };

      const response = await axios.request<OrderModel>(options);
      return response.data;
    } catch (error) {
      logError(error, `Error retrieving order with id: ${id}`);
      return emptyOrder();
    }
  }

  async placeOrder(orderNumber: string): Promise<OrderModel> {
    const id = await getSessionCartId();
    const version = await getSessionCartVersion();

    try {
      const draft: OrderFromCartDraft = {
        version: version,
        cart: {
          typeId: "cart",
          id: id,
        },
        orderNumber,
      };

      const csrfToken = await getCsrfToken(this.auth as string);

      const options: AxiosRequestConfig = {
        url: this.baseUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
          "x-csrf-token": csrfToken,
        },
        data: draft,
      };

      const request = await axios.request<OrderModel>(options);
      await removeSessionCartId();
      await removeSessionCartVersion();

      return request.data;
    } catch (error) {
      logError(error, `Error placing order for cart with id: ${id}`);
      return emptyOrder();
    }
  }

  async addPayment(order: OrderModel, id: string): Promise<OrderModel> {
    const action = OrderUpdateActionUtil.mapAddPaymentAction(id);
    return this.updateOrder(order, [action]);
  }

  async updateOrder(
    order: OrderModel,
    actions: OrderUpdateAction[],
  ): Promise<OrderModel> {
    try {
      const update: OrderUpdate = {
        version: order.version,
        actions: actions,
      };

      const csrfToken = await getCsrfToken(this.auth as string);

      const url = `${this.baseUrl}/${order.id}`;
      const options: AxiosRequestConfig<OrderUpdate> = {
        url: url,
        method: "POST",
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
          "x-csrf-token": csrfToken,
        },
        data: update,
      };

      const response = await axios.request<OrderModel>(options);
      return response.data;
    } catch (error) {
      logError(error, `Error updating order with id: ${order.id}`);
      return emptyOrder();
    }
  }
}

let instance: OrderService | null = null;
export function getOrderService(): OrderService {
  if (!instance) {
    const { BFF_URL } = process.env;
    if (!BFF_URL) {
      throw new Error("Missing required url for BFF");
    }

    const auth = getBffAuth();
    instance = new OrderService(BFF_URL, auth);
  }

  return instance;
}

/**
 * Utility class used to build {@link OrderUpdateAction}s
 */
class OrderUpdateActionUtil {
  static mapAddPaymentAction = (id: string): OrderAddPaymentAction => ({
    action: "addPayment",
    payment: {
      typeId: "payment",
      id: id,
    },
  });
}
