import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.task.deleteMany();
  await prisma.process.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.realEstateUnit.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.settings.create({ data: { id: "singleton" } });

  const units = [
    {
      name: "Sunset Ridge Apartments",
      address: "742 Evergreen Terrace, Springfield, IL 62704",
      type: "residential",
      status: "active",
      agent: { name: "Sunset Ridge Assistant", description: "Dedicated property management AI for Sunset Ridge Apartments. Handles tenant inquiries, maintenance scheduling, and lease management." },
      tenants: [
        { name: "Maria Santos", email: "maria.santos@email.com", phone: "+1-555-0101", leaseStart: "2025-03-01", leaseEnd: "2026-02-28", rentAmount: 1850, rentStatus: "paid" },
        { name: "James Chen", email: "james.chen@email.com", phone: "+1-555-0102", leaseStart: "2025-06-15", leaseEnd: "2026-06-14", rentAmount: 2100, rentStatus: "paid" },
        { name: "Aisha Johnson", email: "aisha.johnson@email.com", phone: "+1-555-0103", leaseStart: "2024-11-01", leaseEnd: "2025-10-31", rentAmount: 1650, rentStatus: "overdue" },
        { name: "Robert Kim", email: "robert.kim@email.com", phone: "+1-555-0104", leaseStart: "2025-01-01", leaseEnd: "2026-12-31", rentAmount: 2300, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Rooftop Pool", type: "pool", status: "active", description: "Heated rooftop pool with panoramic city views, open May through September." },
        { name: "Fitness Center", type: "gym", status: "active", description: "24/7 fully equipped gym with cardio machines, free weights, and yoga studio." },
        { name: "Underground Parking", type: "parking", status: "active", description: "Secure underground garage with 120 reserved spaces and EV charging stations." },
      ],
      processes: [
        { title: "Annual Fire Safety Inspection", description: "Scheduled fire safety inspection for all units and common areas.", type: "inspection", status: "pending", dueDate: "2026-11-15" },
        { title: "Unit 3B Plumbing Repair", description: "Tenant reported leaking faucet in kitchen. Plumber scheduled for Wednesday.", type: "maintenance", status: "in_progress", dueDate: "2026-10-18" },
      ],
    },
    {
      name: "Harbor Point Business Center",
      address: "200 Commercial Drive, Suite 100, San Francisco, CA 94105",
      type: "commercial",
      status: "active",
      agent: { name: "Harbor Point Concierge", description: "AI assistant for Harbor Point Business Center. Manages tenant relations, facility bookings, and building operations." },
      tenants: [
        { name: "TechFlow Solutions Inc.", email: "office@techflow.io", phone: "+1-555-0201", leaseStart: "2024-01-01", leaseEnd: "2028-12-31", rentAmount: 12500, rentStatus: "paid" },
        { name: "Meridian Legal Partners", email: "admin@meridianlegal.com", phone: "+1-555-0202", leaseStart: "2025-07-01", leaseEnd: "2027-06-30", rentAmount: 8750, rentStatus: "paid" },
        { name: "GreenLeaf Marketing Agency", email: "hello@greenleafmktg.com", phone: "+1-555-0203", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", rentAmount: 6200, rentStatus: "pending" },
      ],
      amenities: [
        { name: "Conference Center", type: "other", status: "active", description: "Three fully equipped conference rooms with video conferencing." },
        { name: "Visitor Parking Lot", type: "parking", status: "active", description: "50-space visitor parking lot with validated parking." },
        { name: "24/7 Security System", type: "security", status: "active", description: "Keycard access, CCTV monitoring, and on-site security guard." },
      ],
      processes: [
        { title: "HVAC System Upgrade", description: "Replacing aging HVAC units on floors 3-5 with energy-efficient models.", type: "maintenance", status: "in_progress", dueDate: "2026-12-01" },
      ],
    },
    {
      name: "The Cornerstone",
      address: "55 Main Street, Austin, TX 78701",
      type: "mixed",
      status: "active",
      agent: { name: "Cornerstone Manager", description: "AI property manager for The Cornerstone mixed-use development." },
      tenants: [
        { name: "Daily Grind Coffee Shop", email: "manager@dailygrindcoffee.com", phone: "+1-555-0301", leaseStart: "2024-06-01", leaseEnd: "2029-05-31", rentAmount: 4500, rentStatus: "paid" },
        { name: "Elena Vasquez", email: "elena.vasquez@email.com", phone: "+1-555-0302", leaseStart: "2025-04-01", leaseEnd: "2026-03-31", rentAmount: 1950, rentStatus: "paid" },
        { name: "David Okonkwo", email: "david.okonkwo@email.com", phone: "+1-555-0303", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", rentAmount: 2200, rentStatus: "partial" },
        { name: "Bloom Boutique LLC", email: "info@bloomboutique.com", phone: "+1-555-0304", leaseStart: "2025-01-15", leaseEnd: "2027-01-14", rentAmount: 5800, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Rooftop Garden", type: "garden", status: "active", description: "Shared rooftop garden with seating areas and herb planters." },
        { name: "Package Lockers", type: "other", status: "active", description: "Smart package locker system in lobby. 48 compartments." },
      ],
      processes: [
        { title: "Lease Renewal - Elena Vasquez", description: "Lease expiring March 2026. Prepare renewal offer with 3% increase.", type: "lease_renewal", status: "pending", dueDate: "2026-01-15" },
        { title: "Noise Complaint Investigation", description: "Residential tenant filed noise complaint regarding coffee shop early morning deliveries.", type: "complaint", status: "in_progress", dueDate: "2026-10-20" },
      ],
    },
    {
      name: "Parkview Towers",
      address: "1200 Lakeshore Blvd, Chicago, IL 60611",
      type: "residential",
      status: "active",
      agent: { name: "Parkview Concierge", description: "AI concierge for Parkview Towers luxury residential high-rise on Chicago's lakefront." },
      tenants: [
        { name: "Sophia Nguyen", email: "sophia.nguyen@email.com", phone: "+1-555-0401", leaseStart: "2025-01-01", leaseEnd: "2026-12-31", rentAmount: 3200, rentStatus: "paid" },
        { name: "Marcus Williams", email: "marcus.w@email.com", phone: "+1-555-0402", leaseStart: "2025-05-01", leaseEnd: "2026-04-30", rentAmount: 2800, rentStatus: "paid" },
        { name: "Lena Petrov", email: "lena.petrov@email.com", phone: "+1-555-0403", leaseStart: "2024-09-01", leaseEnd: "2026-08-31", rentAmount: 3500, rentStatus: "overdue" },
        { name: "Daniel Reyes", email: "daniel.reyes@email.com", phone: "+1-555-0404", leaseStart: "2025-07-01", leaseEnd: "2026-06-30", rentAmount: 2600, rentStatus: "paid" },
        { name: "Olivia Park", email: "olivia.park@email.com", phone: "+1-555-0405", leaseStart: "2025-03-15", leaseEnd: "2026-03-14", rentAmount: 4100, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Indoor Pool & Spa", type: "pool", status: "active", description: "Year-round heated indoor pool with adjacent sauna and hot tub." },
        { name: "Doorman Service", type: "security", status: "active", description: "24/7 doorman and front desk concierge." },
        { name: "Resident Lounge", type: "other", status: "active", description: "Furnished lounge with fireplace, billiards, and private event space." },
        { name: "Bike Storage", type: "parking", status: "active", description: "Secure bike storage room with repair station for 80 bicycles." },
      ],
      processes: [
        { title: "Elevator Modernization Phase 2", description: "Upgrading east tower elevators. Estimated 6-week project.", type: "maintenance", status: "in_progress", dueDate: "2026-11-30" },
        { title: "Holiday Party Planning", description: "Annual resident holiday party in the lounge. Budget approved at $5,000.", type: "other", status: "pending", dueDate: "2026-12-15" },
        { title: "Lease Renewal - Lena Petrov", description: "Overdue rent balance of $7,000 must be resolved before renewal discussion.", type: "lease_renewal", status: "pending", dueDate: "2026-07-01" },
      ],
    },
    {
      name: "Innovation Hub",
      address: "3500 Sand Hill Road, Menlo Park, CA 94025",
      type: "commercial",
      status: "active",
      agent: { name: "Innovation Hub AI", description: "AI facility manager for Innovation Hub tech campus. Coordinates shared spaces and startup tenant needs." },
      tenants: [
        { name: "NeuralPath AI", email: "ops@neuralpath.ai", phone: "+1-555-0501", leaseStart: "2025-01-01", leaseEnd: "2027-12-31", rentAmount: 18000, rentStatus: "paid" },
        { name: "QuantumLeap Labs", email: "admin@quantumleap.io", phone: "+1-555-0502", leaseStart: "2025-06-01", leaseEnd: "2027-05-31", rentAmount: 14200, rentStatus: "paid" },
        { name: "Verde Robotics", email: "info@verderobotics.com", phone: "+1-555-0503", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", rentAmount: 9800, rentStatus: "pending" },
        { name: "Skyline Ventures", email: "office@skylinevc.com", phone: "+1-555-0504", leaseStart: "2024-04-01", leaseEnd: "2029-03-31", rentAmount: 22000, rentStatus: "paid" },
        { name: "DataMesh Corp", email: "lease@datamesh.co", phone: "+1-555-0505", leaseStart: "2025-10-01", leaseEnd: "2026-09-30", rentAmount: 7600, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Maker Space", type: "other", status: "active", description: "Shared prototyping lab with 3D printers, laser cutter, and electronics bench." },
        { name: "EV Charging Stations", type: "parking", status: "active", description: "40 Level 2 and 8 DC fast chargers in the parking structure." },
        { name: "Campus Gym", type: "gym", status: "active", description: "Full gym with showers, towel service, and personal training." },
        { name: "Auditorium", type: "other", status: "active", description: "200-seat auditorium with AV equipment for demos and all-hands." },
      ],
      processes: [
        { title: "Campus Wi-Fi 7 Upgrade", description: "Replacing all access points with Wi-Fi 7 hardware. Phased rollout by floor.", type: "maintenance", status: "in_progress", dueDate: "2026-11-01" },
        { title: "Annual Safety Walkthrough", description: "Fire marshal walkthrough for all buildings on campus.", type: "inspection", status: "pending", dueDate: "2026-12-10" },
      ],
    },
    {
      name: "Maple Grove Residences",
      address: "88 Maple Avenue, Portland, OR 97205",
      type: "residential",
      status: "active",
      agent: { name: "Maple Grove Helper", description: "AI assistant for Maple Grove Residences, a boutique apartment community in Portland." },
      tenants: [
        { name: "Zara Thompson", email: "zara.t@email.com", phone: "+1-555-0601", leaseStart: "2025-02-01", leaseEnd: "2026-01-31", rentAmount: 1400, rentStatus: "paid" },
        { name: "Kai Nakamura", email: "kai.n@email.com", phone: "+1-555-0602", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", rentAmount: 1550, rentStatus: "paid" },
        { name: "Priya Sharma", email: "priya.s@email.com", phone: "+1-555-0603", leaseStart: "2024-12-01", leaseEnd: "2025-11-30", rentAmount: 1350, rentStatus: "overdue" },
      ],
      amenities: [
        { name: "Community Garden", type: "garden", status: "active", description: "Organic community garden with 20 individual plots." },
        { name: "Laundry Room", type: "laundry", status: "active", description: "Coin-operated laundry with 8 washers and 8 dryers." },
        { name: "Covered Parking", type: "parking", status: "active", description: "Covered carport with 30 assigned spaces." },
      ],
      processes: [
        { title: "Exterior Painting", description: "Repainting building exterior. Color approved: Sage Green.", type: "maintenance", status: "pending", dueDate: "2026-11-01" },
        { title: "Late Rent - Priya Sharma", description: "Tenant 2 months behind. Sent formal notice on Oct 1.", type: "complaint", status: "in_progress", dueDate: "2026-10-25" },
      ],
    },
    {
      name: "Riverside Commerce Park",
      address: "4700 River Road, Nashville, TN 37209",
      type: "commercial",
      status: "active",
      agent: { name: "Riverside Agent", description: "AI operations manager for Riverside Commerce Park warehouse and office complex." },
      tenants: [
        { name: "Southern Logistics Co.", email: "ops@southernlogistics.com", phone: "+1-555-0701", leaseStart: "2023-06-01", leaseEnd: "2028-05-31", rentAmount: 15000, rentStatus: "paid" },
        { name: "Cumberland Brewing", email: "brewery@cumberlandbrew.com", phone: "+1-555-0702", leaseStart: "2025-01-01", leaseEnd: "2027-12-31", rentAmount: 8500, rentStatus: "paid" },
        { name: "MidSouth Printing", email: "orders@midsouthprint.com", phone: "+1-555-0703", leaseStart: "2025-04-01", leaseEnd: "2026-03-31", rentAmount: 5200, rentStatus: "partial" },
      ],
      amenities: [
        { name: "Loading Docks", type: "other", status: "active", description: "6 loading docks with hydraulic levelers for semi-truck access." },
        { name: "Gated Lot", type: "parking", status: "active", description: "Fenced and gated parking for 200 vehicles with security cameras." },
        { name: "Break Room Pavilion", type: "other", status: "active", description: "Covered outdoor pavilion with picnic tables and vending machines." },
      ],
      processes: [
        { title: "Dock #3 Repair", description: "Hydraulic leveler jammed. Parts on order.", type: "maintenance", status: "in_progress", dueDate: "2026-10-28" },
        { title: "Lease Renewal - MidSouth Printing", description: "Current lease expires March 2026. Tenant undecided on renewal.", type: "lease_renewal", status: "pending", dueDate: "2026-01-31" },
      ],
    },
    {
      name: "The Brickyard Lofts",
      address: "320 Industrial Boulevard, Denver, CO 80204",
      type: "residential",
      status: "active",
      agent: { name: "Brickyard AI", description: "AI manager for The Brickyard Lofts, a converted warehouse loft community." },
      tenants: [
        { name: "Casey Morgan", email: "casey.m@email.com", phone: "+1-555-0801", leaseStart: "2025-05-01", leaseEnd: "2026-04-30", rentAmount: 2400, rentStatus: "paid" },
        { name: "Jordan Ellis", email: "jordan.e@email.com", phone: "+1-555-0802", leaseStart: "2025-02-01", leaseEnd: "2026-01-31", rentAmount: 2200, rentStatus: "paid" },
        { name: "Riley Cooper", email: "riley.c@email.com", phone: "+1-555-0803", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", rentAmount: 2600, rentStatus: "pending" },
        { name: "Avery Diaz", email: "avery.d@email.com", phone: "+1-555-0804", leaseStart: "2024-08-01", leaseEnd: "2026-07-31", rentAmount: 2800, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Co-Working Lounge", type: "other", status: "active", description: "Shared workspace with desks, printers, and high-speed internet." },
        { name: "Dog Park", type: "garden", status: "active", description: "Enclosed off-leash dog park with agility equipment." },
        { name: "Rooftop Deck", type: "other", status: "active", description: "Furnished rooftop with mountain views, grills, and fire pit." },
      ],
      processes: [
        { title: "Roof Membrane Inspection", description: "Annual inspection of flat roof membrane before winter.", type: "inspection", status: "pending", dueDate: "2026-10-31" },
        { title: "Unit 4A Appliance Replacement", description: "Dishwasher and garbage disposal need replacement in unit 4A.", type: "maintenance", status: "in_progress", dueDate: "2026-10-22" },
      ],
    },
    {
      name: "Oceanview Condos",
      address: "1500 Pacific Coast Highway, Santa Monica, CA 90401",
      type: "residential",
      status: "active",
      agent: { name: "Oceanview Concierge", description: "AI concierge for Oceanview Condos beachfront luxury property." },
      tenants: [
        { name: "Victoria Lane", email: "victoria.l@email.com", phone: "+1-555-0901", leaseStart: "2025-06-01", leaseEnd: "2026-05-31", rentAmount: 5500, rentStatus: "paid" },
        { name: "Nathan Brooks", email: "nathan.b@email.com", phone: "+1-555-0902", leaseStart: "2025-01-01", leaseEnd: "2026-12-31", rentAmount: 4800, rentStatus: "paid" },
        { name: "Camille Dubois", email: "camille.d@email.com", phone: "+1-555-0903", leaseStart: "2025-03-01", leaseEnd: "2026-02-28", rentAmount: 6200, rentStatus: "overdue" },
        { name: "Tyler Washington", email: "tyler.w@email.com", phone: "+1-555-0904", leaseStart: "2025-08-15", leaseEnd: "2026-08-14", rentAmount: 5100, rentStatus: "paid" },
        { name: "Isabella Cruz", email: "isabella.c@email.com", phone: "+1-555-0905", leaseStart: "2025-04-01", leaseEnd: "2027-03-31", rentAmount: 7200, rentStatus: "paid" },
        { name: "Ethan Gallagher", email: "ethan.g@email.com", phone: "+1-555-0906", leaseStart: "2025-10-01", leaseEnd: "2026-09-30", rentAmount: 4600, rentStatus: "pending" },
      ],
      amenities: [
        { name: "Beach Access", type: "other", status: "active", description: "Private beach access with surf locker and outdoor showers." },
        { name: "Infinity Pool", type: "pool", status: "active", description: "Ocean-facing infinity pool with poolside bar service." },
        { name: "Valet Parking", type: "parking", status: "active", description: "Full valet parking service, 7 days a week." },
        { name: "Private Gym", type: "gym", status: "active", description: "Ocean-view gym with Peloton bikes and personal training." },
      ],
      processes: [
        { title: "Seawall Repair", description: "Saltwater erosion on west seawall. Contractor evaluating scope.", type: "maintenance", status: "in_progress", dueDate: "2027-01-15" },
        { title: "Pool Resurfacing", description: "Infinity pool scheduled for acid wash and tile repair.", type: "maintenance", status: "pending", dueDate: "2026-11-20" },
        { title: "Late Payment - Camille Dubois", description: "Two months overdue. Property manager sent notice.", type: "complaint", status: "in_progress", dueDate: "2026-10-30" },
      ],
    },
    {
      name: "Metro Tower One",
      address: "900 Peachtree Street NE, Atlanta, GA 30309",
      type: "commercial",
      status: "active",
      agent: { name: "Metro Tower Agent", description: "AI building manager for Metro Tower One, a Class A office tower in Midtown Atlanta." },
      tenants: [
        { name: "Peach State Capital", email: "info@peachstatecap.com", phone: "+1-555-1001", leaseStart: "2024-01-01", leaseEnd: "2029-12-31", rentAmount: 28000, rentStatus: "paid" },
        { name: "Atlas Consulting Group", email: "admin@atlascg.com", phone: "+1-555-1002", leaseStart: "2025-03-01", leaseEnd: "2027-02-28", rentAmount: 16500, rentStatus: "paid" },
        { name: "BrightPath Education", email: "ops@brightpath.edu", phone: "+1-555-1003", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", rentAmount: 11200, rentStatus: "paid" },
        { name: "Zenith Health Partners", email: "office@zenithhealth.com", phone: "+1-555-1004", leaseStart: "2025-06-01", leaseEnd: "2028-05-31", rentAmount: 19500, rentStatus: "pending" },
      ],
      amenities: [
        { name: "Executive Lounge", type: "other", status: "active", description: "Top-floor executive lounge with catering kitchen and skyline views." },
        { name: "Parking Garage", type: "parking", status: "active", description: "8-story attached parking garage with 600 spaces." },
        { name: "Fitness & Wellness Center", type: "gym", status: "active", description: "Full gym with locker rooms, steam room, and yoga studio." },
        { name: "Security & Access Control", type: "security", status: "active", description: "Biometric lobby access, CCTV on all floors, 24/7 security desk." },
      ],
      processes: [
        { title: "Lobby Renovation", description: "Complete lobby redesign with new marble floors and digital directory.", type: "maintenance", status: "in_progress", dueDate: "2027-02-01" },
        { title: "Fire Alarm System Test", description: "Quarterly fire alarm and sprinkler system test for all floors.", type: "inspection", status: "pending", dueDate: "2026-11-05" },
      ],
    },
    {
      name: "Willowbrook Village",
      address: "250 Willow Lane, Charlotte, NC 28203",
      type: "residential",
      status: "active",
      agent: { name: "Willowbrook AI", description: "AI assistant for Willowbrook Village townhome community." },
      tenants: [
        { name: "Hannah Lee", email: "hannah.l@email.com", phone: "+1-555-1101", leaseStart: "2025-04-01", leaseEnd: "2026-03-31", rentAmount: 1700, rentStatus: "paid" },
        { name: "Omar Hassan", email: "omar.h@email.com", phone: "+1-555-1102", leaseStart: "2025-01-15", leaseEnd: "2026-01-14", rentAmount: 1850, rentStatus: "paid" },
        { name: "Grace Adebayo", email: "grace.a@email.com", phone: "+1-555-1103", leaseStart: "2025-07-01", leaseEnd: "2026-06-30", rentAmount: 1600, rentStatus: "partial" },
        { name: "Liam McCarthy", email: "liam.m@email.com", phone: "+1-555-1104", leaseStart: "2024-10-01", leaseEnd: "2026-09-30", rentAmount: 1900, rentStatus: "paid" },
        { name: "Nina Johansson", email: "nina.j@email.com", phone: "+1-555-1105", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", rentAmount: 1750, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Playground", type: "other", status: "active", description: "Fenced children's playground with modern equipment." },
        { name: "Community Pool", type: "pool", status: "maintenance", description: "Pool closed for liner replacement. Reopening December." },
        { name: "Walking Trails", type: "garden", status: "active", description: "1.5 miles of paved walking trails through wooded areas." },
      ],
      processes: [
        { title: "Pool Liner Replacement", description: "Replacing vinyl liner on community pool. Contractor: AquaPro.", type: "maintenance", status: "in_progress", dueDate: "2026-12-01" },
        { title: "Pest Control - Building C", description: "Ant infestation reported in 3 units. Exterminator scheduled.", type: "maintenance", status: "pending", dueDate: "2026-10-18" },
      ],
    },
    {
      name: "SkyBridge Offices",
      address: "1 World Trade Center, Floor 55, New York, NY 10007",
      type: "commercial",
      status: "active",
      agent: { name: "SkyBridge Coordinator", description: "AI coordinator for SkyBridge Offices premium coworking and office space." },
      tenants: [
        { name: "Apex Financial Advisors", email: "contact@apexfa.com", phone: "+1-555-1201", leaseStart: "2024-07-01", leaseEnd: "2029-06-30", rentAmount: 45000, rentStatus: "paid" },
        { name: "Luminary Design Studio", email: "hello@luminarydesign.co", phone: "+1-555-1202", leaseStart: "2025-02-01", leaseEnd: "2026-01-31", rentAmount: 12800, rentStatus: "paid" },
        { name: "Cipher Cybersecurity", email: "admin@ciphersec.io", phone: "+1-555-1203", leaseStart: "2025-05-01", leaseEnd: "2027-04-30", rentAmount: 21000, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Observation Lounge", type: "other", status: "active", description: "55th-floor lounge with panoramic city and harbor views." },
        { name: "Private Dining Room", type: "other", status: "active", description: "Catered private dining room seating 24 for client events." },
        { name: "Concierge Desk", type: "security", status: "active", description: "Full-service concierge for mail, deliveries, and reservations." },
      ],
      processes: [
        { title: "Window Cleaning Schedule", description: "Quarterly exterior window cleaning for floors 50-60.", type: "maintenance", status: "pending", dueDate: "2026-11-10" },
        { title: "Lease Negotiation - Luminary Design", description: "Current lease expiring Jan 2026. Tenant requesting 15% discount for 3-year term.", type: "lease_renewal", status: "in_progress", dueDate: "2026-11-30" },
      ],
    },
    {
      name: "Desert Springs Villas",
      address: "7800 E Camelback Road, Scottsdale, AZ 85251",
      type: "residential",
      status: "active",
      agent: { name: "Desert Springs AI", description: "AI property manager for Desert Springs Villas luxury desert community." },
      tenants: [
        { name: "Frank Morrison", email: "frank.m@email.com", phone: "+1-555-1301", leaseStart: "2025-01-01", leaseEnd: "2026-12-31", rentAmount: 3800, rentStatus: "paid" },
        { name: "Diana Cheng", email: "diana.c@email.com", phone: "+1-555-1302", leaseStart: "2025-04-01", leaseEnd: "2026-03-31", rentAmount: 3200, rentStatus: "paid" },
        { name: "Gary Ostrowski", email: "gary.o@email.com", phone: "+1-555-1303", leaseStart: "2025-06-15", leaseEnd: "2026-06-14", rentAmount: 4200, rentStatus: "overdue" },
        { name: "Patricia Sandoval", email: "patricia.s@email.com", phone: "+1-555-1304", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", rentAmount: 3600, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Resort Pool", type: "pool", status: "active", description: "Resort-style pool with waterfall, cabanas, and fire bowls." },
        { name: "Tennis Courts", type: "other", status: "active", description: "Two lighted tennis courts with pro shop." },
        { name: "Gated Entry", type: "security", status: "active", description: "Guard-gated entrance with visitor logging." },
        { name: "Covered Parking", type: "parking", status: "active", description: "Shaded carports protecting vehicles from desert sun." },
      ],
      processes: [
        { title: "Landscaping Overhaul", description: "Replacing non-native plants with drought-resistant xeriscaping.", type: "maintenance", status: "in_progress", dueDate: "2026-12-15" },
        { title: "Late Rent - Gary Ostrowski", description: "Tenant 1 month behind. Phone call scheduled for next week.", type: "complaint", status: "pending", dueDate: "2026-10-20" },
        { title: "HOA Annual Meeting", description: "Annual homeowners meeting to discuss budget and capital improvements.", type: "other", status: "pending", dueDate: "2026-11-08" },
      ],
    },
    {
      name: "Capitol Square",
      address: "500 K Street NW, Washington, DC 20001",
      type: "mixed",
      status: "active",
      agent: { name: "Capitol Square Agent", description: "AI facility manager for Capitol Square mixed-use development near the Capitol." },
      tenants: [
        { name: "Federal Affairs Group", email: "info@fedaffairs.com", phone: "+1-555-1401", leaseStart: "2024-03-01", leaseEnd: "2029-02-28", rentAmount: 25000, rentStatus: "paid" },
        { name: "The Daily Press Cafe", email: "manager@dailypress.cafe", phone: "+1-555-1402", leaseStart: "2025-01-01", leaseEnd: "2027-12-31", rentAmount: 6800, rentStatus: "paid" },
        { name: "Rachel Whitmore", email: "rachel.w@email.com", phone: "+1-555-1403", leaseStart: "2025-05-01", leaseEnd: "2026-04-30", rentAmount: 3100, rentStatus: "paid" },
        { name: "Kevin Tran", email: "kevin.t@email.com", phone: "+1-555-1404", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", rentAmount: 2900, rentStatus: "pending" },
        { name: "Heritage Books LLC", email: "info@heritagebooks.com", phone: "+1-555-1405", leaseStart: "2025-03-01", leaseEnd: "2028-02-29", rentAmount: 5500, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Courtyard Plaza", type: "garden", status: "active", description: "Landscaped courtyard with fountain, seating, and seasonal plantings." },
        { name: "Underground Garage", type: "parking", status: "active", description: "3-level underground parking with 250 spaces and EV chargers." },
        { name: "24-Hour Security", type: "security", status: "active", description: "Security desk, key fob access, and camera system throughout." },
      ],
      processes: [
        { title: "Retail Vacancy Marketing", description: "Ground-floor retail space 102 vacant since August. Marketing to food/beverage tenants.", type: "other", status: "in_progress", dueDate: "2026-12-31" },
        { title: "Garage Waterproofing", description: "Level 3 of underground garage showing water intrusion. Seal coating needed.", type: "maintenance", status: "pending", dueDate: "2026-11-15" },
      ],
    },
    {
      name: "Pine Ridge Apartments",
      address: "1600 Pine Street, Seattle, WA 98101",
      type: "residential",
      status: "maintenance",
      agent: { name: "Pine Ridge Helper", description: "AI assistant for Pine Ridge Apartments during renovation period." },
      tenants: [
        { name: "Sam Takahashi", email: "sam.t@email.com", phone: "+1-555-1501", leaseStart: "2025-02-01", leaseEnd: "2026-01-31", rentAmount: 2100, rentStatus: "paid" },
        { name: "Alex Rivera", email: "alex.r@email.com", phone: "+1-555-1502", leaseStart: "2025-06-01", leaseEnd: "2026-05-31", rentAmount: 1900, rentStatus: "paid" },
        { name: "Morgan Bailey", email: "morgan.b@email.com", phone: "+1-555-1503", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", rentAmount: 2300, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Rooftop Terrace", type: "other", status: "maintenance", description: "Terrace closed for waterproofing. Reopening December." },
        { name: "Laundry Facility", type: "laundry", status: "active", description: "Card-operated laundry on each floor." },
        { name: "Secure Entry", type: "security", status: "active", description: "Video intercom and electronic lock entry system." },
      ],
      processes: [
        { title: "Building-Wide Pipe Replacement", description: "Replacing galvanized pipes in all 40 units. Phase 1 (floors 1-3) underway.", type: "maintenance", status: "in_progress", dueDate: "2027-03-01" },
        { title: "Temporary Water Shutoff Notice", description: "Notify tenants of scheduled shutoffs each Wednesday 9am-1pm.", type: "other", status: "in_progress", dueDate: "2026-10-16" },
      ],
    },
    {
      name: "Harbour Centre",
      address: "1200 Waterfront Drive, Miami, FL 33132",
      type: "commercial",
      status: "active",
      agent: { name: "Harbour Centre AI", description: "AI manager for Harbour Centre waterfront commercial complex in Miami." },
      tenants: [
        { name: "Caribbean Imports Ltd.", email: "trade@caribimports.com", phone: "+1-555-1601", leaseStart: "2024-06-01", leaseEnd: "2027-05-31", rentAmount: 11000, rentStatus: "paid" },
        { name: "Azure Maritime Services", email: "ops@azuremaritime.com", phone: "+1-555-1602", leaseStart: "2025-01-01", leaseEnd: "2028-12-31", rentAmount: 18500, rentStatus: "paid" },
        { name: "Tropical Realty Group", email: "info@tropicalrealty.com", phone: "+1-555-1603", leaseStart: "2025-07-01", leaseEnd: "2026-06-30", rentAmount: 7400, rentStatus: "partial" },
        { name: "Havana Nights Restaurant", email: "reservations@havananights.com", phone: "+1-555-1604", leaseStart: "2025-03-01", leaseEnd: "2030-02-28", rentAmount: 9200, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Marina Access", type: "other", status: "active", description: "Private marina with 30 boat slips for tenant use." },
        { name: "Waterfront Promenade", type: "garden", status: "active", description: "Landscaped walkway along the bay with seating and lighting." },
        { name: "Structured Parking", type: "parking", status: "active", description: "4-story parking structure with 350 spaces." },
      ],
      processes: [
        { title: "Hurricane Season Prep", description: "Installing storm shutters and testing backup generators.", type: "inspection", status: "in_progress", dueDate: "2026-11-01" },
        { title: "Marina Dock Repair", description: "Slips 12-18 need piling replacement. Marine contractor engaged.", type: "maintenance", status: "pending", dueDate: "2027-01-15" },
      ],
    },
    {
      name: "Gateway Plaza",
      address: "2200 Gateway Blvd, Dallas, TX 75201",
      type: "mixed",
      status: "active",
      agent: { name: "Gateway AI Manager", description: "AI property manager for Gateway Plaza mixed-use development in downtown Dallas." },
      tenants: [
        { name: "Lone Star Insurance", email: "claims@lonestarins.com", phone: "+1-555-1701", leaseStart: "2024-01-01", leaseEnd: "2028-12-31", rentAmount: 20000, rentStatus: "paid" },
        { name: "Fusion Sushi Bar", email: "hello@fusionsushi.com", phone: "+1-555-1702", leaseStart: "2025-05-01", leaseEnd: "2028-04-30", rentAmount: 7500, rentStatus: "paid" },
        { name: "Amanda Foster", email: "amanda.f@email.com", phone: "+1-555-1703", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", rentAmount: 2400, rentStatus: "paid" },
        { name: "Derek Hughes", email: "derek.h@email.com", phone: "+1-555-1704", leaseStart: "2025-03-01", leaseEnd: "2026-02-28", rentAmount: 2200, rentStatus: "overdue" },
        { name: "Core Fitness Studio", email: "info@corefitnessdallas.com", phone: "+1-555-1705", leaseStart: "2025-01-01", leaseEnd: "2027-12-31", rentAmount: 6000, rentStatus: "paid" },
        { name: "Lisa Bergmann", email: "lisa.b@email.com", phone: "+1-555-1706", leaseStart: "2025-10-01", leaseEnd: "2026-09-30", rentAmount: 2600, rentStatus: "pending" },
      ],
      amenities: [
        { name: "Retail Atrium", type: "other", status: "active", description: "3-story glass atrium with ground-floor retail and dining." },
        { name: "Sky Lounge", type: "other", status: "active", description: "Residents-only 20th-floor lounge with skyline views and kitchen." },
        { name: "Garage Parking", type: "parking", status: "active", description: "5-level attached garage with reserved residential and guest spaces." },
        { name: "Lap Pool", type: "pool", status: "active", description: "25-meter lap pool on the 5th floor amenity deck." },
      ],
      processes: [
        { title: "Elevator Cab Refurbishment", description: "Refinishing all 4 elevator cabs with new panels and lighting.", type: "maintenance", status: "in_progress", dueDate: "2026-11-20" },
        { title: "Late Rent - Derek Hughes", description: "Resident 45 days overdue. Formal notice mailed.", type: "complaint", status: "in_progress", dueDate: "2026-10-25" },
        { title: "Holiday Decoration Setup", description: "Lobby and atrium seasonal decorations. Vendor confirmed.", type: "other", status: "pending", dueDate: "2026-11-25" },
      ],
    },
    {
      name: "Summit Ridge Executive Suites",
      address: "3300 Summit Parkway, Raleigh, NC 27609",
      type: "commercial",
      status: "active",
      agent: { name: "Summit Ridge Coordinator", description: "AI coordinator for Summit Ridge Executive Suites serviced office complex." },
      tenants: [
        { name: "Pinecone Analytics", email: "contact@pineconeanalytics.com", phone: "+1-555-1801", leaseStart: "2025-04-01", leaseEnd: "2026-03-31", rentAmount: 5200, rentStatus: "paid" },
        { name: "RedHawk Legal", email: "admin@redhawklegal.com", phone: "+1-555-1802", leaseStart: "2025-01-01", leaseEnd: "2027-12-31", rentAmount: 8900, rentStatus: "paid" },
        { name: "Wren & Finch Creative", email: "hello@wrenfinch.co", phone: "+1-555-1803", leaseStart: "2025-07-01", leaseEnd: "2026-06-30", rentAmount: 4100, rentStatus: "pending" },
        { name: "Triangle Biotech", email: "facilities@trianglebio.com", phone: "+1-555-1804", leaseStart: "2025-09-01", leaseEnd: "2028-08-31", rentAmount: 14000, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Shared Reception", type: "other", status: "active", description: "Professional reception desk with call answering for all tenants." },
        { name: "Kitchen & Café", type: "other", status: "active", description: "Full kitchen with espresso bar, complimentary for tenants." },
        { name: "Surface Lot", type: "parking", status: "active", description: "200-space surface lot with reserved spots for each suite." },
      ],
      processes: [
        { title: "Carpet Replacement - Wing B", description: "Replacing worn carpet in Wing B corridors and 6 suites.", type: "maintenance", status: "pending", dueDate: "2026-12-01" },
        { title: "Building Energy Audit", description: "Duke Energy offering free commercial audit. Scheduled for November.", type: "inspection", status: "pending", dueDate: "2026-11-10" },
      ],
    },
    {
      name: "Magnolia Heights",
      address: "450 Magnolia Street, Savannah, GA 31401",
      type: "residential",
      status: "active",
      agent: { name: "Magnolia AI", description: "AI property assistant for Magnolia Heights historic district apartments." },
      tenants: [
        { name: "Chloe Martin", email: "chloe.m@email.com", phone: "+1-555-1901", leaseStart: "2025-03-01", leaseEnd: "2026-02-28", rentAmount: 1500, rentStatus: "paid" },
        { name: "Isaac Wright", email: "isaac.w@email.com", phone: "+1-555-1902", leaseStart: "2025-06-01", leaseEnd: "2026-05-31", rentAmount: 1650, rentStatus: "paid" },
        { name: "Nadia Kovac", email: "nadia.k@email.com", phone: "+1-555-1903", leaseStart: "2024-12-01", leaseEnd: "2025-11-30", rentAmount: 1400, rentStatus: "overdue" },
        { name: "Ben Adeola", email: "ben.a@email.com", phone: "+1-555-1904", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", rentAmount: 1550, rentStatus: "paid" },
        { name: "Lily Tanaka", email: "lily.t@email.com", phone: "+1-555-1905", leaseStart: "2025-01-15", leaseEnd: "2026-01-14", rentAmount: 1700, rentStatus: "paid" },
        { name: "Owen Bradshaw", email: "owen.b@email.com", phone: "+1-555-1906", leaseStart: "2025-10-01", leaseEnd: "2026-09-30", rentAmount: 1450, rentStatus: "pending" },
      ],
      amenities: [
        { name: "Historic Courtyard", type: "garden", status: "active", description: "Original 1890s courtyard with live oaks and cast-iron fountain." },
        { name: "Street Parking Permits", type: "parking", status: "active", description: "Reserved on-street parking permits for each unit." },
        { name: "On-Site Laundry", type: "laundry", status: "active", description: "Basement laundry room with 6 washers and 6 dryers." },
      ],
      processes: [
        { title: "Historic Preservation Review", description: "Annual review by Savannah Historic District Board. Exterior must comply.", type: "inspection", status: "pending", dueDate: "2026-12-01" },
        { title: "Window Restoration - Unit 2C", description: "Original wood windows in unit 2C need sash cord repair and repainting.", type: "maintenance", status: "in_progress", dueDate: "2026-10-30" },
        { title: "Late Rent - Nadia Kovac", description: "Tenant 3 months behind. Legal consultation initiated.", type: "complaint", status: "in_progress", dueDate: "2026-10-15" },
      ],
    },
    {
      name: "Pacific Heights Medical Plaza",
      address: "800 Divisadero Street, San Francisco, CA 94115",
      type: "commercial",
      status: "active",
      agent: { name: "MedPlaza Coordinator", description: "AI coordinator for Pacific Heights Medical Plaza healthcare office complex." },
      tenants: [
        { name: "Bay Area Dermatology", email: "office@bayareaderm.com", phone: "+1-555-2001", leaseStart: "2024-07-01", leaseEnd: "2029-06-30", rentAmount: 16000, rentStatus: "paid" },
        { name: "Golden Gate Pediatrics", email: "info@ggpediatrics.com", phone: "+1-555-2002", leaseStart: "2025-01-01", leaseEnd: "2027-12-31", rentAmount: 13500, rentStatus: "paid" },
        { name: "Presidio Physical Therapy", email: "appointments@presidiopt.com", phone: "+1-555-2003", leaseStart: "2025-05-01", leaseEnd: "2026-04-30", rentAmount: 8200, rentStatus: "paid" },
        { name: "Nob Hill Dental", email: "smile@nobhilldental.com", phone: "+1-555-2004", leaseStart: "2025-08-01", leaseEnd: "2028-07-31", rentAmount: 11000, rentStatus: "pending" },
        { name: "ClearView Optometry", email: "eyes@clearviewopt.com", phone: "+1-555-2005", leaseStart: "2025-03-01", leaseEnd: "2026-02-28", rentAmount: 7800, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Patient Parking", type: "parking", status: "active", description: "Validated patient parking garage with 80 spaces." },
        { name: "ADA Compliance Suite", type: "other", status: "active", description: "Fully ADA-compliant common areas, elevators, and restrooms." },
        { name: "Medical Waste Disposal", type: "other", status: "active", description: "Licensed biohazard waste collection, weekly pickup." },
      ],
      processes: [
        { title: "HVAC Filter Replacement", description: "Medical-grade HEPA filter replacement on all HVAC units.", type: "maintenance", status: "in_progress", dueDate: "2026-10-25" },
        { title: "ADA Audit", description: "Annual ADA compliance audit scheduled with city inspector.", type: "inspection", status: "pending", dueDate: "2026-11-15" },
        { title: "Lease Renewal - ClearView Optometry", description: "Lease expiring Feb 2026. Tenant wants to expand into adjacent suite.", type: "lease_renewal", status: "in_progress", dueDate: "2026-12-01" },
      ],
    },
    {
      name: "Aspen Creek Townhomes",
      address: "900 Aspen Creek Drive, Boulder, CO 80302",
      type: "residential",
      status: "active",
      agent: { name: "Aspen Creek AI", description: "AI assistant for Aspen Creek Townhomes mountain community in Boulder." },
      tenants: [
        { name: "Jake Lawson", email: "jake.l@email.com", phone: "+1-555-2101", leaseStart: "2025-05-01", leaseEnd: "2026-04-30", rentAmount: 2800, rentStatus: "paid" },
        { name: "Mia Fernandez", email: "mia.f@email.com", phone: "+1-555-2102", leaseStart: "2025-01-01", leaseEnd: "2026-12-31", rentAmount: 3100, rentStatus: "paid" },
        { name: "Chris Patel", email: "chris.p@email.com", phone: "+1-555-2103", leaseStart: "2025-07-15", leaseEnd: "2026-07-14", rentAmount: 2600, rentStatus: "paid" },
        { name: "Emma Johansson", email: "emma.j@email.com", phone: "+1-555-2104", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", rentAmount: 3300, rentStatus: "partial" },
        { name: "Theo Washington", email: "theo.w@email.com", phone: "+1-555-2105", leaseStart: "2025-03-01", leaseEnd: "2026-02-28", rentAmount: 2900, rentStatus: "paid" },
      ],
      amenities: [
        { name: "Ski Storage", type: "other", status: "active", description: "Heated ski and snowboard storage room with waxing bench." },
        { name: "Hot Tub Deck", type: "pool", status: "active", description: "Outdoor hot tub with mountain views and privacy screens." },
        { name: "Garage Parking", type: "parking", status: "active", description: "Attached single-car garage for each townhome unit." },
        { name: "Trail Access", type: "garden", status: "active", description: "Direct trailhead access to Boulder Creek Path." },
      ],
      processes: [
        { title: "Snow Removal Contract", description: "Renewing annual snow removal contract with Alpine Plowing.", type: "other", status: "pending", dueDate: "2026-11-01" },
        { title: "Furnace Inspection - All Units", description: "Pre-winter furnace check for all 20 townhomes.", type: "inspection", status: "in_progress", dueDate: "2026-10-31" },
        { title: "Partial Payment - Emma Johansson", description: "Tenant paid $2,000 of $3,300. Follow-up for remaining balance.", type: "complaint", status: "pending", dueDate: "2026-10-20" },
      ],
    },
    {
      name: "Midtown Lofts",
      address: "155 Ponce de Leon Ave NE, Atlanta, GA 30308",
      type: "residential",
      status: "active",
      agent: { name: "Midtown Lofts AI", description: "AI manager for Midtown Lofts converted textile mill apartments." },
      tenants: [
        { name: "Jasmine Rhodes", email: "jasmine.r@email.com", phone: "+1-555-2201", leaseStart: "2025-04-01", leaseEnd: "2026-03-31", rentAmount: 1800, rentStatus: "paid" },
        { name: "Mateo Reyes", email: "mateo.r@email.com", phone: "+1-555-2202", leaseStart: "2025-07-01", leaseEnd: "2026-06-30", rentAmount: 2000, rentStatus: "paid" },
        { name: "Simone Baptiste", email: "simone.b@email.com", phone: "+1-555-2203", leaseStart: "2025-01-01", leaseEnd: "2025-12-31", rentAmount: 1750, rentStatus: "overdue" },
        { name: "Devon Park", email: "devon.p@email.com", phone: "+1-555-2204", leaseStart: "2025-10-01", leaseEnd: "2026-09-30", rentAmount: 2200, rentStatus: "pending" },
      ],
      amenities: [
        { name: "Art Gallery Space", type: "other", status: "active", description: "Rotating gallery showcasing local artists in the lobby." },
        { name: "Bike Room", type: "parking", status: "active", description: "Indoor bike storage with repair tools and air pump." },
        { name: "Rooftop Lounge", type: "other", status: "active", description: "Open-air rooftop with city views, string lights, and seating." },
        { name: "Package Room", type: "other", status: "active", description: "Secure package room with 24/7 access via key fob." },
      ],
      processes: [
        { title: "Sprinkler System Test", description: "Mandatory annual fire sprinkler system test for all floors.", type: "inspection", status: "pending", dueDate: "2026-11-05" },
        { title: "Late Rent - Simone Baptiste", description: "Tenant 2 months behind. Payment plan discussion scheduled.", type: "complaint", status: "in_progress", dueDate: "2026-10-18" },
      ],
    },
    {
      name: "Bayshore Industrial Park",
      address: "6500 Bayshore Freeway, South San Francisco, CA 94080",
      type: "commercial",
      status: "active",
      agent: { name: "Bayshore Operations AI", description: "AI operations manager for Bayshore Industrial Park biotech and logistics campus." },
      tenants: [
        { name: "Helix Biomedical", email: "facilities@helixbio.com", phone: "+1-555-2301", leaseStart: "2024-01-01", leaseEnd: "2029-12-31", rentAmount: 35000, rentStatus: "paid" },
        { name: "Pacific Coast Fulfillment", email: "ops@pcfulfillment.com", phone: "+1-555-2302", leaseStart: "2025-04-01", leaseEnd: "2027-03-31", rentAmount: 12000, rentStatus: "paid" },
        { name: "NanoScale Materials", email: "admin@nanoscalemat.com", phone: "+1-555-2303", leaseStart: "2025-09-01", leaseEnd: "2028-08-31", rentAmount: 22000, rentStatus: "paid" },
        { name: "Bay Logistics Group", email: "dispatch@baylogistics.com", phone: "+1-555-2304", leaseStart: "2025-06-01", leaseEnd: "2026-05-31", rentAmount: 8500, rentStatus: "partial" },
      ],
      amenities: [
        { name: "Loading & Receiving", type: "other", status: "active", description: "12 truck-height loading bays with dock management system." },
        { name: "Hazmat Storage", type: "other", status: "active", description: "Licensed hazardous materials storage facility with containment." },
        { name: "Employee Lot", type: "parking", status: "active", description: "800-space employee lot with shuttle to Caltrain." },
        { name: "Perimeter Security", type: "security", status: "active", description: "Fenced campus with guard booth, badge access, and CCTV." },
      ],
      processes: [
        { title: "EPA Compliance Inspection", description: "Scheduled EPA inspection of hazmat storage and waste disposal practices.", type: "inspection", status: "pending", dueDate: "2026-11-20" },
        { title: "Parking Lot Resurfacing", description: "Section A and B of employee lot need repaving.", type: "maintenance", status: "in_progress", dueDate: "2026-11-15" },
        { title: "Lease Renewal - Bay Logistics", description: "Lease expires May 2026. Tenant requesting 3 additional bays.", type: "lease_renewal", status: "pending", dueDate: "2026-02-01" },
      ],
    },
  ];

  const created = [];
  for (const u of units) {
    const unit = await prisma.realEstateUnit.create({
      data: {
        name: u.name,
        address: u.address,
        type: u.type,
        status: u.status,
        agent: { create: u.agent },
        tenants: {
          create: u.tenants.map((t) => ({
            ...t,
            leaseStart: new Date(t.leaseStart),
            leaseEnd: new Date(t.leaseEnd),
          })),
        },
        amenities: { create: u.amenities },
        processes: {
          create: u.processes.map((p) => ({
            ...p,
            dueDate: p.dueDate ? new Date(p.dueDate) : null,
          })),
        },
      },
    });
    created.push(unit);
  }

  console.log(`Seed data created successfully: ${created.length} units`);
  created.forEach((u) => console.log(`  - ${u.name} (${u.id})`));
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
