import { LangSmithValidationError } from "./errors.js";

/** How a delegation grant derives its permission set. */
export type AccessDelegationMode = "EXPLICIT";

/**
 * Grant letting code inside a sandbox call the LangSmith API as the creator.
 *
 * The grant is capped to `permissions`, which are a ceiling re-checked on
 * every request rather than a snapshot, so access the creator loses is lost
 * here too.
 */
export interface AccessDelegation {
  mode: AccessDelegationMode;
  permissions: string[];
}

/** Rejects grants the server would refuse, without the round trip. */
export function validateAccessDelegation(
  value: AccessDelegation,
): AccessDelegation {
  if (value.mode !== "EXPLICIT") {
    throw new LangSmithValidationError(
      'accessDelegation.mode must be "EXPLICIT"',
      "accessDelegation",
    );
  }

  const { permissions } = value;
  if (permissions !== undefined && !Array.isArray(permissions)) {
    throw new LangSmithValidationError(
      "accessDelegation.permissions must be an array of strings",
      "accessDelegation",
    );
  }

  if (permissions === undefined || permissions.length === 0) {
    throw new LangSmithValidationError(
      "accessDelegation.permissions is required",
      "accessDelegation",
    );
  }
  return { mode: "EXPLICIT", permissions: [...permissions] };
}
