"use server";

import { getOrderService, OrderRequest } from "@/lib/bff/service/orderService";
import { OrderModel } from "@/lib/models/orderModel";

/**
 * get the next available order number in a fashion that prevents clashes.
 * @returns next available order number
 */
export async function getNextOrderNumber(): Promise<string> {
  return getOrderService().getNextOrderNumber();
}

/**
 * Search for orders in commercetools.
 * @param request the request paramaters
 * @returns the list of orders matching provided parameters
 */
export async function searchOrders(
  request: OrderRequest,
): Promise<OrderModel[]> {
  return getOrderService().searchOrders(request);
}

/**
 * Retrieve an order from commercetools by id.
 * @param id the order id
 * @returns the order matching the provided id
 */
export async function getOrder(id: string): Promise<OrderModel> {
  return getOrderService().getOrder(id);
}

/**
 * Creates an order in commercetools from state of the current users cart.
 * @returns the created order model
 */
export async function placeOrder(orderNumber: string): Promise<OrderModel> {
  return getOrderService().placeOrder(orderNumber);
}

/**
 * Add payment information to an order in commercetools.
 * @param order the order model
 * @param paymentId the id of the payment
 * @returns the updated order
 */
export async function addPayment(
  order: OrderModel,
  paymentId: string,
): Promise<OrderModel> {
  return getOrderService().addPayment(order, paymentId);
}
