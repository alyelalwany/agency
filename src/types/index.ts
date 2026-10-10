import type {
  RealEstateUnit,
  Agent,
  Tenant,
  Amenity,
  Process,
  Task,
  ChatMessage,
} from "@/generated/prisma/client";

export type UnitWithRelations = RealEstateUnit & {
  tenants: Tenant[];
  amenities: Amenity[];
  processes: Process[];
  agent: Agent | null;
  tasks: Task[];
};

export type AgentWithUnit = Agent & {
  unit: RealEstateUnit & {
    tenants: Tenant[];
    amenities: Amenity[];
    processes: Process[];
  };
};

export type TaskWithMessages = Task & {
  messages: ChatMessage[];
};

export type {
  RealEstateUnit,
  Agent,
  Tenant,
  Amenity,
  Process,
  Task,
  ChatMessage,
};
