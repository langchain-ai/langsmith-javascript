import { addSandboxMetadata } from "./tracing.js";

/** How a service URL is gated. Omit for a minted token. */
export type ServiceAccess = "restricted" | "workspace";

/** Header the sandbox router reads the minted service token from. */
export const SERVICE_TOKEN_HEADER = "X-Langsmith-Sandbox-Service-Token";

/** Refresh this many seconds before the token actually expires. */
const REFRESH_MARGIN_SECONDS = 60;

export interface ServiceUrlData {
  browser_url?: string;
  service_url?: string;
  token?: string;
  expires_at?: string;
  access?: string;
  embed_url?: string;
  embed_origins?: string[];
}

/**
 * Service URL carrying a short-lived token, refreshed as it nears expiry.
 *
 * Accessors are async because a refresh is a network call.
 */
export class ServiceUrl {
  private _browserUrl: string;
  private _serviceUrl: string;
  private _token: string;
  private _expiresAt: string;
  private _embedUrl: string;
  private _embedOrigins: string[];
  private readonly _refresher?: () => Promise<ServiceUrl>;

  constructor(
    data: ServiceUrlData,
    refresher?: () => Promise<ServiceUrl>,
    private readonly _sandboxId?: string,
  ) {
    this._browserUrl = data.browser_url ?? "";
    this._serviceUrl = data.service_url ?? "";
    this._token = data.token ?? "";
    this._expiresAt = data.expires_at ?? "";
    this._embedUrl = data.embed_url ?? "";
    this._embedOrigins = data.embed_origins ?? [];
    this._refresher = refresher;
  }

  private _shouldRefresh(): boolean {
    if (!this._refresher || !this._expiresAt) return false;
    const expires = Date.parse(this._expiresAt);
    if (Number.isNaN(expires)) return false;
    return (expires - Date.now()) / 1000 <= REFRESH_MARGIN_SECONDS;
  }

  private async _maybeRefresh(): Promise<void> {
    if (!this._refresher || !this._shouldRefresh()) return;
    const fresh = await this._refresher();
    this._browserUrl = fresh._browserUrl;
    this._serviceUrl = fresh._serviceUrl;
    this._token = fresh._token;
    this._expiresAt = fresh._expiresAt;
    this._embedUrl = fresh._embedUrl;
    this._embedOrigins = fresh._embedOrigins;
  }

  /** The signed token, refreshed if near expiry. */
  async token(): Promise<string> {
    await this._maybeRefresh();
    return this._token;
  }

  /** The service base URL, refreshed if near expiry. */
  async serviceUrl(): Promise<string> {
    await this._maybeRefresh();
    return this._serviceUrl;
  }

  /** The browser URL that authenticates then redirects, refreshed if near expiry. */
  async browserUrl(): Promise<string> {
    await this._maybeRefresh();
    return this._browserUrl;
  }

  /**
   * The URL to load in an iframe, refreshed if near expiry. The token rides
   * the URL fragment, so no server sees it; append `&redirect=/path` to open a
   * page other than `/`. Only pages on {@link embedOrigins} may frame it.
   */
  async embedUrl(): Promise<string> {
    await this._maybeRefresh();
    return this._embedUrl;
  }

  /** The origins allowed to frame the URL, as the server normalized them. */
  get embedOrigins(): string[] {
    return [...this._embedOrigins];
  }

  /** ISO 8601 expiry of the current token, refreshed if near expiry. */
  async expiresAt(): Promise<string> {
    await this._maybeRefresh();
    return this._expiresAt;
  }

  /** Fetch a path on the service with the token header injected. */
  async fetch(path = "/", init: RequestInit = {}): Promise<Response> {
    addSandboxMetadata(this._sandboxId);
    const base = (await this.serviceUrl()).replace(/\/+$/, "");
    const url = `${base}/${path.replace(/^\/+/, "")}`;
    const headers = new Headers(init.headers);
    headers.set(SERVICE_TOKEN_HEADER, await this.token());
    return fetch(url, { ...init, headers });
  }
}

/**
 * Service URL gated by LangSmith login rather than a token.
 *
 * The grant is durable: no token, no expiry, and only usable from a browser
 * signed in to LangSmith — which is why there is no fetch helper here, a
 * programmatic request cannot satisfy the login.
 */
export class ServiceLoginUrl {
  /** The URL to open in a browser. */
  readonly url: string;
  /** Who may open it: "restricted" or "workspace". */
  readonly access: string;
  /**
   * The origins allowed to frame the URL, as the server normalized them. A
   * viewer signs in from inside the frame through a LangSmith popup.
   */
  readonly embedOrigins: string[];

  constructor(data: ServiceUrlData) {
    this.url = data.browser_url || data.service_url || "";
    this.access = data.access ?? "";
    this.embedOrigins = data.embed_origins ?? [];
  }
}
