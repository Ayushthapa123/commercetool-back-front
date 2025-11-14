import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
} from "@commercetools/ts-client";

// --- Configuration ---
const projectKey = process.env.CTP_PROJECT_KEY ?? "";
const clientId = process.env.CTP_CLIENT_ID ?? "";
const clientSecret = process.env.CTP_CLIENT_SECRET ?? "";
const authUrl = process.env.CTP_AUTH_URL ?? "";
const apiUrl = process.env.CTP_API_URL ?? "";
const scopes = [
  `manage_customers:${projectKey}`,
  `view_products:${projectKey}`,
];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: { clientId, clientSecret },
  scopes: scopes,
  httpClient: fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  includeResponseHeaders: true,
  maskSensitiveHeaderData: false,
  includeOriginalRequest: true,
  includeRequestInErrorResponse: true,
  enableRetry: true,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 200,
    backoff: false,
    retryCodes: [500, 503],
  },
  httpClient: fetch,
};

const client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey,
});

export default apiRoot;
