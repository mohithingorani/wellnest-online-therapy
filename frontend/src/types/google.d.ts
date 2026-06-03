/* Google Identity Services type declarations */
interface Window {
  google?: typeof google;
}

declare namespace google.accounts.id {
  interface CredentialResponse {
    credential: string;
    select_by?: string;
  }

  interface IdConfiguration {
    client_id: string;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: string;
    state_cookie_domain?: string;
    ux_mode?: "popup" | "redirect";
    callback: (response: CredentialResponse) => void;
    native_callback?: (response: CredentialResponse) => void;
    nonce?: string;
    prompt_parent_id?: string;
    itp_support?: boolean;
  }

  function initialize(config: IdConfiguration): void;
  function prompt(momentListener?: (moment: PromptMomentNotification) => void): void;
  function renderButton(
    parent: HTMLElement,
    options: GsiButtonConfiguration,
  ): void;
  function disableAutoSelect(): void;
  function storeCredential(
    credential: string,
    callback: () => void,
  ): void;
  function cancel(): void;
  function revoke(handle: string, callback?: (done: boolean) => void): void;
}

declare namespace google.accounts.oauth2 {
  interface TokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }

  interface TokenClientConfig {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse | { error: string }) => void;
    error_callback?: (error: { type: string; message: string }) => void;
    prompt?: string;
    enable_serial_consent?: boolean;
    hint?: string;
    state?: string;
    itp_support?: boolean;
  }

  function initTokenClient(config: TokenClientConfig): {
    requestAccessToken: (overrideConfig?: { hint?: string; prompt?: string }) => void;
  };

  function hasGrantedAnyScope(
    tokenResponse: TokenResponse,
    ...scopes: string[]
  ): boolean;

  function hasGrantedAllScopes(
    tokenResponse: TokenResponse,
    ...scopes: string[]
  ): boolean;

  function revoke(token: string, callback?: () => void): void;
}

declare namespace google.accounts {
  const id: typeof google.accounts.id;
  const oauth2: typeof google.accounts.oauth2;
}

interface PromptMomentNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () =>
    | "browser_not_supported"
    | "invalid_client"
    | "missing_client_id"
    | "opt_out_or_no_session"
    | "secure_http_required"
    | "suppressed_by_user"
    | "unregistered_origin"
    | "unknown_reason";
  getSkippedReason: () =>
    | "auto_cancel"
    | "user_cancel"
    | "tap_outside"
    | "issuing_failed";
  getDismissedReason: () =>
    | "credential_returned"
    | "cancel_called"
    | "flow_restarted";
  getMomentType: () => "display" | "skipped" | "dismissed";
}

interface GsiButtonConfiguration {
  type: "standard" | "icon";
  shape?: "rectangular" | "pill" | "circle" | "square";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  logo_alignment?: "left" | "center";
  width?: number;
  locale?: string;
}
