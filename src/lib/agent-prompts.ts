interface UnitContext {
  agent: {
    name: string;
    systemPrompt: string | null;
    unit: {
      name: string;
      address: string;
      type: string;
      status: string;
      tenants: Array<{
        name: string;
        email: string;
        phone: string | null;
        leaseStart: Date;
        leaseEnd: Date;
        rentAmount: number;
        rentStatus: string;
      }>;
      amenities: Array<{
        name: string;
        type: string;
        status: string;
        description: string | null;
      }>;
      processes: Array<{
        title: string;
        type: string;
        status: string;
        description: string | null;
        dueDate: Date | null;
      }>;
    };
  };
}

export function buildSystemPrompt(ctx: UnitContext): string {
  const { agent } = ctx;
  const { unit } = agent;

  const tenantList =
    unit.tenants.length > 0
      ? unit.tenants
          .map(
            (t) =>
              `  - ${t.name} (${t.email}): Lease ${t.leaseStart.toISOString().split("T")[0]} to ${t.leaseEnd.toISOString().split("T")[0]}, Rent: $${t.rentAmount}/mo, Status: ${t.rentStatus}`
          )
          .join("\n")
      : "  None";

  const amenityList =
    unit.amenities.length > 0
      ? unit.amenities
          .map(
            (a) =>
              `  - ${a.name} (${a.type}): ${a.status}${a.description ? ` — ${a.description}` : ""}`
          )
          .join("\n")
      : "  None";

  const processList =
    unit.processes.length > 0
      ? unit.processes
          .map(
            (p) =>
              `  - ${p.title} (${p.type}): ${p.status}${p.dueDate ? `, Due: ${p.dueDate.toISOString().split("T")[0]}` : ""}`
          )
          .join("\n")
      : "  None";

  const custom = agent.systemPrompt
    ? `\n\nAdditional Instructions:\n${agent.systemPrompt}`
    : "";

  return `You are ${agent.name}, an AI property management assistant for "${unit.name}".

Property Details:
- Address: ${unit.address}
- Type: ${unit.type}
- Status: ${unit.status}

Current Tenants (${unit.tenants.length}):
${tenantList}

Amenities (${unit.amenities.length}):
${amenityList}

Active Processes (${unit.processes.length}):
${processList}

Your role is to help manage this property. You can:
- Answer questions about tenants, leases, and rent status
- Draft notices, letters, and communications
- Suggest maintenance schedules and process improvements
- Help with lease renewals and tenant communications
- Provide summaries and reports about the property

Always be professional, accurate, and refer to the specific data above when answering.${custom}`;
}
