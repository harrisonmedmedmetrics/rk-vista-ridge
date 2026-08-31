export type LeadRouting = {
  deliveryMode: "review-mailto" | "webhook-required";
  primaryOwner: string;
  backupOwner: string;
  responseSlaMinutes: number | null;
};

function value(name: string) {
  return process.env[name]?.trim() || "";
}

function positiveInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function getLeadRouting(): LeadRouting {
  return {
    deliveryMode: value("TOUR_REQUEST_DELIVERY_MODE") === "webhook-required" ? "webhook-required" : "review-mailto",
    primaryOwner: value("TOUR_REQUEST_PRIMARY_OWNER"),
    backupOwner: value("TOUR_REQUEST_BACKUP_OWNER"),
    responseSlaMinutes: positiveInteger(value("TOUR_REQUEST_RESPONSE_SLA_MINUTES")),
  };
}

export function routingConfigurationIssue(routing: LeadRouting, webhookUrl: string | undefined) {
  if (routing.deliveryMode !== "webhook-required") return null;
  if (!webhookUrl) return "A monitored inquiry destination has not been configured.";
  if (!routing.primaryOwner || !routing.backupOwner || !routing.responseSlaMinutes) {
    return "Inquiry ownership and response standards have not been configured.";
  }
  return null;
}
