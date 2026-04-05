const PASSWORD_POLICY_MESSAGES = [
  "Minimum 8 characters",
  "At least one alphabet",
  "At least one number",
  "At least one special character",
] as const;

export const passwordPolicyDescription = PASSWORD_POLICY_MESSAGES.join(
  ". ",
) + ".";

export function validatePasswordPolicy(password: string): string | null {
  if (password.length < 8) {
    return PASSWORD_POLICY_MESSAGES[0];
  }

  if (!/[A-Za-z]/.test(password)) {
    return PASSWORD_POLICY_MESSAGES[1];
  }

  if (!/[0-9]/.test(password)) {
    return PASSWORD_POLICY_MESSAGES[2];
  }

  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return PASSWORD_POLICY_MESSAGES[3];
  }

  return null;
}