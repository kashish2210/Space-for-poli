import { type Official } from "@/components/OfficialsList";

export interface Ward {
  id: string;
  name: string;
  number: number;
  zone: string;
  population: number;
  area: string; // sq km
  councillor: Official;
  officials: Official[];
}

export interface Zone {
  id: string;
  name: string;
  wards: Ward[];
  zonalOfficer: Official;
  population: number;
}

export interface MunicipalDepartment {
  id: string;
  name: string;
  head: Official;
  description: string;
  functions: string[];
}

export interface Municipality {
  id: string;
  cityId: string;
  name: string;
  type: "Municipal Corporation" | "Municipal Council" | "Nagar Panchayat";
  tier?: "Tier 1" | "Tier 2" | "Tier 3";
  mayor: Official;
  commissioner: Official;
  departments: MunicipalDepartment[];
  zones: Zone[];
  memberCount: number;
  description: string;
  established: string;
  totalWards: number;
}

// Helper to build ward officials
function wardOfficials(wardName: string, city: string): Official[] {
  return [
    { name: `${wardName} Sanitary Inspector`, designation: "Sanitary Inspector", department: "Sanitation & SWM", link: `/municipalities/${city}` },
    { name: `${wardName} Jr. Engineer`, designation: "Junior Engineer", department: "Public Works", link: `/municipalities/${city}` },
    { name: `${wardName} Health Worker`, designation: "Community Health Worker", department: "Public Health", link: `/municipalities/${city}` },
    { name: `${wardName} Tax Collector`, designation: "Ward Tax Collector", department: "Revenue & Property Tax", link: `/municipalities/${city}` },
  ];
}

export const municipalities: Record<string, Municipality> = {
  delhi: {
    id: "delhi",
    cityId: "delhi",
    name: "Municipal Corporation of Delhi (MCD)",
    type: "Municipal Corporation",
    mayor: { name: "Dr. Shelly Oberoi", designation: "Mayor of Delhi", department: "MCD", email: "mayor@mcd.gov.in", link: "/cities/delhi" },
    commissioner: { name: "Gyanesh Bharti", designation: "MCD Commissioner, IAS", department: "MCD", email: "commissioner@mcd.gov.in", link: "/cities/delhi" },
    description: "Largest municipal body in the world by population, governing 250 wards across 12 zones.",
    established: "1958 (unified 2022)",
    totalWards: 250,
    memberCount: 245000,
    departments: [
      {
        id: "delhi-swm", name: "Solid Waste Management", description: "Garbage collection, waste segregation, landfill management, recycling plants",
        head: { name: "R.K. Sharma", designation: "Director, SWM", department: "Solid Waste Management", link: "/municipalities/delhi" },
        functions: ["Door-to-door garbage collection", "Waste segregation enforcement", "Landfill management", "Composting & recycling plants", "Bio-mining operations"],
      },
      {
        id: "delhi-water-supply", name: "Water Supply & Drainage", description: "Water distribution, sewerage maintenance, drainage infrastructure",
        head: { name: "Amit Verma", designation: "Superintending Engineer, Water", department: "Water Supply", link: "/municipalities/delhi" },
        functions: ["Water pipeline maintenance", "New water connections", "Sewerage network management", "Drainage cleaning & desilting", "Water quality testing"],
      },
      {
        id: "delhi-roads", name: "Roads & Infrastructure", description: "Road construction, street lighting, footpaths, bridges",
        head: { name: "Sunil Mehra", designation: "Chief Engineer, Roads", department: "Roads Division", link: "/municipalities/delhi" },
        functions: ["Road construction & repair", "Street lighting", "Footpath maintenance", "Bridge & flyover upkeep", "Pothole filling drives"],
      },
      {
        id: "delhi-health-muni", name: "Public Health & Sanitation", description: "Disease prevention, pest control, food safety, birth & death registration",
        head: { name: "Dr. Priya Singh", designation: "Chief Medical Officer", department: "Public Health", link: "/municipalities/delhi" },
        functions: ["Mosquito & pest control", "Food safety inspections", "Birth & death registration", "Dispensary management", "Epidemic preparedness"],
      },
      {
        id: "delhi-revenue", name: "Revenue & Property Tax", description: "Property tax assessment, trade licensing, advertisement tax",
        head: { name: "Rajesh Gupta", designation: "Director, Revenue", department: "Revenue Dept.", link: "/municipalities/delhi" },
        functions: ["Property tax assessment & collection", "Trade license issuance", "Building plan approval", "Advertisement & hoarding tax", "Mutation of property records"],
      },
      {
        id: "delhi-edu-muni", name: "Education (Municipal Schools)", description: "Management of MCD-run primary schools",
        head: { name: "Dr. Neelam Sharma", designation: "Director, Education", department: "Education Wing", link: "/municipalities/delhi" },
        functions: ["MCD primary school management", "Mid-day meal program", "Teacher recruitment & training", "School infrastructure", "Student enrollment drives"],
      },
      {
        id: "delhi-horticulture", name: "Horticulture & Parks", description: "Park maintenance, tree plantation, green belt development",
        head: { name: "V.K. Jain", designation: "Director, Horticulture", department: "Horticulture Dept.", link: "/municipalities/delhi" },
        functions: ["Park & garden maintenance", "Tree plantation drives", "Green belt development", "Nursery management", "Urban forestry"],
      },
      {
        id: "delhi-building", name: "Building & Planning", description: "Building permits, unauthorized construction, master plan enforcement",
        head: { name: "Sanjeev Mittal", designation: "Chief Town Planner", department: "Building Dept.", link: "/municipalities/delhi" },
        functions: ["Building plan sanctioning", "Unauthorized construction demolition", "Occupancy certificate issuance", "Master plan enforcement", "Land use change approvals"],
      },
    ],
    zones: [
      {
        id: "delhi-civil-lines", name: "Civil Lines Zone", population: 850000,
        zonalOfficer: { name: "Arvind Sharma, IAS", designation: "Zonal Deputy Commissioner", department: "Civil Lines Zone", link: "/municipalities/delhi" },
        wards: [
          { id: "delhi-w1", name: "Civil Lines", number: 1, zone: "Civil Lines Zone", population: 42000, area: "3.2", councillor: { name: "Ramesh Khanna", designation: "Ward Councillor", department: "Ward 1 - Civil Lines", link: "/municipalities/delhi" }, officials: wardOfficials("Civil Lines", "delhi") },
          { id: "delhi-w2", name: "Kamla Nagar", number: 2, zone: "Civil Lines Zone", population: 38000, area: "2.8", councillor: { name: "Sunita Devi", designation: "Ward Councillor", department: "Ward 2 - Kamla Nagar", link: "/municipalities/delhi" }, officials: wardOfficials("Kamla Nagar", "delhi") },
          { id: "delhi-w3", name: "Timarpur", number: 3, zone: "Civil Lines Zone", population: 45000, area: "4.1", councillor: { name: "Anil Bhardwaj", designation: "Ward Councillor", department: "Ward 3 - Timarpur", link: "/municipalities/delhi" }, officials: wardOfficials("Timarpur", "delhi") },
        ],
      },
      {
        id: "delhi-karol-bagh", name: "Karol Bagh Zone", population: 920000,
        zonalOfficer: { name: "Meena Agarwal, IAS", designation: "Zonal Deputy Commissioner", department: "Karol Bagh Zone", link: "/municipalities/delhi" },
        wards: [
          { id: "delhi-w10", name: "Karol Bagh", number: 10, zone: "Karol Bagh Zone", population: 52000, area: "2.5", councillor: { name: "Vijay Malhotra", designation: "Ward Councillor", department: "Ward 10 - Karol Bagh", link: "/municipalities/delhi" }, officials: wardOfficials("Karol Bagh", "delhi") },
          { id: "delhi-w11", name: "Patel Nagar", number: 11, zone: "Karol Bagh Zone", population: 48000, area: "3.0", councillor: { name: "Rekha Sharma", designation: "Ward Councillor", department: "Ward 11 - Patel Nagar", link: "/municipalities/delhi" }, officials: wardOfficials("Patel Nagar", "delhi") },
          { id: "delhi-w12", name: "Rajender Nagar", number: 12, zone: "Karol Bagh Zone", population: 41000, area: "2.2", councillor: { name: "Mohit Gupta", designation: "Ward Councillor", department: "Ward 12 - Rajender Nagar", link: "/municipalities/delhi" }, officials: wardOfficials("Rajender Nagar", "delhi") },
        ],
      },
      {
        id: "delhi-south", name: "South Zone", population: 1100000,
        zonalOfficer: { name: "Pradeep Kumar, IAS", designation: "Zonal Deputy Commissioner", department: "South Zone", link: "/municipalities/delhi" },
        wards: [
          { id: "delhi-w50", name: "Malviya Nagar", number: 50, zone: "South Zone", population: 55000, area: "4.5", councillor: { name: "Anita Jain", designation: "Ward Councillor", department: "Ward 50 - Malviya Nagar", link: "/municipalities/delhi" }, officials: wardOfficials("Malviya Nagar", "delhi") },
          { id: "delhi-w51", name: "Saket", number: 51, zone: "South Zone", population: 47000, area: "3.8", councillor: { name: "Deepak Yadav", designation: "Ward Councillor", department: "Ward 51 - Saket", link: "/municipalities/delhi" }, officials: wardOfficials("Saket", "delhi") },
          { id: "delhi-w52", name: "Hauz Khas", number: 52, zone: "South Zone", population: 39000, area: "3.1", councillor: { name: "Priya Mehra", designation: "Ward Councillor", department: "Ward 52 - Hauz Khas", link: "/municipalities/delhi" }, officials: wardOfficials("Hauz Khas", "delhi") },
        ],
      },
      {
        id: "delhi-east", name: "Shahdara (East) Zone", population: 980000,
        zonalOfficer: { name: "Rakesh Singh, IAS", designation: "Zonal Deputy Commissioner", department: "Shahdara Zone", link: "/municipalities/delhi" },
        wards: [
          { id: "delhi-w100", name: "Shahdara", number: 100, zone: "Shahdara Zone", population: 61000, area: "3.5", councillor: { name: "Suresh Chauhan", designation: "Ward Councillor", department: "Ward 100 - Shahdara", link: "/municipalities/delhi" }, officials: wardOfficials("Shahdara", "delhi") },
          { id: "delhi-w101", name: "Vivek Vihar", number: 101, zone: "Shahdara Zone", population: 54000, area: "3.2", councillor: { name: "Kavita Singh", designation: "Ward Councillor", department: "Ward 101 - Vivek Vihar", link: "/municipalities/delhi" }, officials: wardOfficials("Vivek Vihar", "delhi") },
        ],
      },
    ],
  },

  mumbai: {
    id: "mumbai",
    cityId: "mumbai",
    name: "Brihanmumbai Municipal Corporation (BMC)",
    type: "Municipal Corporation",
    mayor: { name: "Kishori Pednekar", designation: "Mayor of Mumbai", department: "BMC", email: "mayor@mcgm.gov.in", link: "/cities/mumbai" },
    commissioner: { name: "Iqbal Singh Chahal", designation: "BMC Commissioner, IAS", department: "BMC", email: "mc@mcgm.gov.in", link: "/cities/mumbai" },
    description: "Richest municipal corporation in Asia, responsible for civic infrastructure of Greater Mumbai.",
    established: "1888",
    totalWards: 227,
    memberCount: 198000,
    departments: [
      { id: "bmc-swm", name: "Solid Waste Management", description: "Waste collection, processing, and disposal across Greater Mumbai", head: { name: "A.K. Parab", designation: "Dy. Commissioner, SWM", department: "SWM Dept.", link: "/municipalities/mumbai" }, functions: ["Waste collection from 70 lakh households", "Waste-to-energy plants", "Beach cleanup drives", "Hazardous waste management", "Zero-waste ward initiative"] },
      { id: "bmc-storm", name: "Storm Water Drains", description: "Flood prevention, drainage infrastructure, pump stations", head: { name: "P. Velrasu", designation: "Chief Engineer, SWD", department: "Storm Water Drains", link: "/municipalities/mumbai" }, functions: ["Nullah widening & desilting", "Pump station operations", "Flood monitoring", "BRIMSTOWAD project", "Mithi River rejuvenation"] },
      { id: "bmc-roads", name: "Roads & Bridges", description: "Road maintenance, flyovers, pedestrian infrastructure", head: { name: "S.K. Patil", designation: "Chief Engineer, Roads", department: "Roads Dept.", link: "/municipalities/mumbai" }, functions: ["Road resurfacing & repair", "Flyover maintenance", "Pedestrian skywalk upkeep", "Coastal road project", "Pothole-free Mumbai initiative"] },
      { id: "bmc-health", name: "Public Health", description: "Municipal hospitals, dispensaries, disease surveillance", head: { name: "Dr. Mangala Gomare", designation: "Executive Health Officer", department: "Public Health", link: "/municipalities/mumbai" }, functions: ["Municipal hospital management", "Dispensary network", "Malaria & dengue control", "Food adulteration checks", "Birth & death registration"] },
      { id: "bmc-water", name: "Water Supply", description: "Water treatment, distribution, metering across Mumbai", head: { name: "R.D. Sawant", designation: "Chief Engineer, Water", department: "Water Supply", link: "/municipalities/mumbai" }, functions: ["Water treatment plants", "Pipeline network management", "Water meter installation", "24x7 water supply project", "Water quality monitoring"] },
      { id: "bmc-license", name: "License & Revenue", description: "Property tax, trade licenses, building permissions", head: { name: "Vishwas Mote", designation: "Assessor & Collector", department: "License Dept.", link: "/municipalities/mumbai" }, functions: ["Property tax collection", "Shop & establishment license", "Building plan approval", "Hawker license management", "Entertainment tax"] },
      { id: "bmc-garden", name: "Gardens & Open Spaces", description: "Parks, playgrounds, botanical gardens", head: { name: "Jitendra Pardeshi", designation: "Superintendent, Gardens", department: "Gardens Dept.", link: "/municipalities/mumbai" }, functions: ["Park & garden maintenance", "Playground development", "Tree census & conservation", "Coastal promenade upkeep", "Urban forestry"] },
      { id: "bmc-edu", name: "Education (Municipal Schools)", description: "BMC-run schools for primary education", head: { name: "Rajesh Kankal", designation: "Education Officer", department: "Education Dept.", link: "/municipalities/mumbai" }, functions: ["Municipal school management", "Teacher recruitment", "Mid-day meal program", "Digital classrooms", "Student welfare schemes"] },
    ],
    zones: [
      {
        id: "mumbai-a", name: "A Ward (Fort/Colaba)", population: 195000,
        zonalOfficer: { name: "Sharad Ughade", designation: "Assistant Commissioner", department: "A Ward", link: "/municipalities/mumbai" },
        wards: [
          { id: "mumbai-a1", name: "Fort", number: 1, zone: "A Ward", population: 32000, area: "2.1", councillor: { name: "Makrand Narwekar", designation: "Ward Councillor", department: "Ward 1 - Fort", link: "/municipalities/mumbai" }, officials: wardOfficials("Fort", "mumbai") },
          { id: "mumbai-a2", name: "Colaba", number: 2, zone: "A Ward", population: 28000, area: "3.5", councillor: { name: "Harshita Narwekar", designation: "Ward Councillor", department: "Ward 2 - Colaba", link: "/municipalities/mumbai" }, officials: wardOfficials("Colaba", "mumbai") },
        ],
      },
      {
        id: "mumbai-h", name: "H Ward (Bandra)", population: 680000,
        zonalOfficer: { name: "Vinod Chitore", designation: "Assistant Commissioner", department: "H Ward", link: "/municipalities/mumbai" },
        wards: [
          { id: "mumbai-h1", name: "Bandra West", number: 95, zone: "H Ward", population: 65000, area: "3.8", councillor: { name: "Asif Zakaria", designation: "Ward Councillor", department: "Ward 95 - Bandra West", link: "/municipalities/mumbai" }, officials: wardOfficials("Bandra West", "mumbai") },
          { id: "mumbai-h2", name: "Khar", number: 96, zone: "H Ward", population: 52000, area: "2.9", councillor: { name: "Sameer Desai", designation: "Ward Councillor", department: "Ward 96 - Khar", link: "/municipalities/mumbai" }, officials: wardOfficials("Khar", "mumbai") },
        ],
      },
      {
        id: "mumbai-l", name: "L Ward (Kurla)", population: 890000,
        zonalOfficer: { name: "Manish Valanju", designation: "Assistant Commissioner", department: "L Ward", link: "/municipalities/mumbai" },
        wards: [
          { id: "mumbai-l1", name: "Kurla West", number: 150, zone: "L Ward", population: 78000, area: "3.2", councillor: { name: "Fauzia Khan", designation: "Ward Councillor", department: "Ward 150 - Kurla West", link: "/municipalities/mumbai" }, officials: wardOfficials("Kurla West", "mumbai") },
          { id: "mumbai-l2", name: "BKC", number: 151, zone: "L Ward", population: 15000, area: "4.5", councillor: { name: "Ravi Patil", designation: "Ward Councillor", department: "Ward 151 - BKC", link: "/municipalities/mumbai" }, officials: wardOfficials("BKC", "mumbai") },
        ],
      },
    ],
  },

  bangalore: {
    id: "bangalore",
    cityId: "bangalore",
    name: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    type: "Municipal Corporation",
    mayor: { name: "M. Goutham Kumar", designation: "Mayor of Bengaluru", department: "BBMP", link: "/cities/bangalore" },
    commissioner: { name: "Tushar Giri Nath", designation: "BBMP Chief Commissioner, IAS", department: "BBMP", email: "commissioner@bbmp.gov.in", link: "/cities/bangalore" },
    description: "Governs India's Silicon Valley with 243 wards across 8 zones.",
    established: "2007",
    totalWards: 243,
    memberCount: 167000,
    departments: [
      { id: "bbmp-swm", name: "Solid Waste Management", description: "Waste collection, processing, wet/dry segregation", head: { name: "Harish Kumar", designation: "Special Commissioner, SWM", department: "SWM", link: "/municipalities/bangalore" }, functions: ["Door-to-door collection", "Wet waste composting", "Dry waste collection centers", "Bulk waste generators management", "Plastic ban enforcement"] },
      { id: "bbmp-infra", name: "Infrastructure", description: "Roads, stormwater drains, flyovers", head: { name: "B.S. Prahlad", designation: "Chief Engineer, Infra", department: "Infrastructure", link: "/municipalities/bangalore" }, functions: ["Road asphalting & white-topping", "Stormwater drain construction", "Flyover & underpass maintenance", "Footpath development", "Street lighting"] },
      { id: "bbmp-health", name: "Health & Family Welfare", description: "Public health centers, disease control, sanitation", head: { name: "Dr. Suralkar Vikas", designation: "Special Commissioner, Health", department: "Health Wing", link: "/municipalities/bangalore" }, functions: ["Primary health center management", "Dengue & malaria prevention", "Food safety inspections", "Maternity homes", "Vaccination drives"] },
      { id: "bbmp-revenue", name: "Revenue", description: "Property tax, trade licenses, building permits", head: { name: "Munish Moudgil", designation: "Special Commissioner, Revenue", department: "Revenue", link: "/municipalities/bangalore" }, functions: ["Property tax assessment", "Khata transfer & bifurcation", "Trade license issuance", "Advertisement tax", "Betterment charges"] },
      { id: "bbmp-town", name: "Town Planning", description: "Master plan, land use, building regulations", head: { name: "K.R. Niranjan", designation: "Director, Town Planning", department: "Town Planning", link: "/municipalities/bangalore" }, functions: ["Building plan approval", "Revised Master Plan enforcement", "Land use change", "Unauthorized construction action", "FAR computation"] },
      { id: "bbmp-lakes", name: "Lakes & Environment", description: "Lake rejuvenation, parks, environment protection", head: { name: "Dr. Ram Prasath Manohar", designation: "Chief Engineer, Lakes", department: "Lakes Dept.", link: "/municipalities/bangalore" }, functions: ["Lake rejuvenation & fencing", "Sewage treatment for lakes", "Park & playground maintenance", "Tree census & plantation", "Air quality monitoring"] },
    ],
    zones: [
      {
        id: "bbmp-east", name: "East Zone", population: 450000,
        zonalOfficer: { name: "Randeep D.", designation: "Joint Commissioner, East", department: "East Zone", link: "/municipalities/bangalore" },
        wards: [
          { id: "blr-w1", name: "Indiranagar", number: 74, zone: "East Zone", population: 38000, area: "2.8", councillor: { name: "Kusuma Hanumantharayappa", designation: "Ward Councillor", department: "Ward 74 - Indiranagar", link: "/municipalities/bangalore" }, officials: wardOfficials("Indiranagar", "bangalore") },
          { id: "blr-w2", name: "Domlur", number: 75, zone: "East Zone", population: 32000, area: "2.2", councillor: { name: "Ramesh B.", designation: "Ward Councillor", department: "Ward 75 - Domlur", link: "/municipalities/bangalore" }, officials: wardOfficials("Domlur", "bangalore") },
          { id: "blr-w3", name: "HAL Airport", number: 76, zone: "East Zone", population: 42000, area: "4.5", councillor: { name: "Vijay Kumar N.", designation: "Ward Councillor", department: "Ward 76 - HAL Airport", link: "/municipalities/bangalore" }, officials: wardOfficials("HAL Airport", "bangalore") },
        ],
      },
      {
        id: "bbmp-south", name: "South Zone", population: 520000,
        zonalOfficer: { name: "Tulasi Maddineni", designation: "Joint Commissioner, South", department: "South Zone", link: "/municipalities/bangalore" },
        wards: [
          { id: "blr-w50", name: "Jayanagar", number: 170, zone: "South Zone", population: 35000, area: "3.1", councillor: { name: "Sowmya Reddy", designation: "Ward Councillor", department: "Ward 170 - Jayanagar", link: "/municipalities/bangalore" }, officials: wardOfficials("Jayanagar", "bangalore") },
          { id: "blr-w51", name: "JP Nagar", number: 171, zone: "South Zone", population: 44000, area: "3.8", councillor: { name: "Padmanabha Reddy", designation: "Ward Councillor", department: "Ward 171 - JP Nagar", link: "/municipalities/bangalore" }, officials: wardOfficials("JP Nagar", "bangalore") },
        ],
      },
      {
        id: "bbmp-west", name: "West Zone", population: 480000,
        zonalOfficer: { name: "Sarfaraz Khan", designation: "Joint Commissioner, West", department: "West Zone", link: "/municipalities/bangalore" },
        wards: [
          { id: "blr-w80", name: "Rajajinagar", number: 100, zone: "West Zone", population: 39000, area: "3.0", councillor: { name: "Suresh Babu", designation: "Ward Councillor", department: "Ward 100 - Rajajinagar", link: "/municipalities/bangalore" }, officials: wardOfficials("Rajajinagar", "bangalore") },
          { id: "blr-w81", name: "Malleshwaram", number: 101, zone: "West Zone", population: 33000, area: "2.5", councillor: { name: "S.N. Seetharam", designation: "Ward Councillor", department: "Ward 101 - Malleshwaram", link: "/municipalities/bangalore" }, officials: wardOfficials("Malleshwaram", "bangalore") },
        ],
      },
    ],
  },

  chennai: {
    id: "chennai",
    cityId: "chennai",
    name: "Greater Chennai Corporation (GCC)",
    type: "Municipal Corporation",
    mayor: { name: "R. Priya", designation: "Mayor of Chennai", department: "GCC", link: "/cities/chennai" },
    commissioner: { name: "Gagandeep Singh Bedi", designation: "GCC Commissioner, IAS", department: "GCC", email: "commissioner@chennaicorporation.gov.in", link: "/cities/chennai" },
    description: "Second oldest municipal corporation in India (after Mumbai), governing 200 wards across 15 zones.",
    established: "1688",
    totalWards: 200,
    memberCount: 112000,
    departments: [
      { id: "gcc-swm", name: "Solid Waste Management", description: "Waste management across 200 wards", head: { name: "M. Vijayalakshmi", designation: "Superintending Engineer, SWM", department: "SWM", link: "/municipalities/chennai" }, functions: ["Source segregation enforcement", "Micro composting centers", "Construction debris management", "E-waste collection drives", "Zero waste ward program"] },
      { id: "gcc-water", name: "Water & Drainage", description: "Water distribution, underground drainage", head: { name: "T. Prabhakaran", designation: "Chief Engineer, Water", department: "Water Supply", link: "/municipalities/chennai" }, functions: ["Water distribution", "Underground drainage network", "Rainwater harvesting enforcement", "Desalination plant management", "Water tanker services"] },
      { id: "gcc-roads", name: "Roads & Infrastructure", description: "Road maintenance, street lighting, bridges", head: { name: "S. Rajendran", designation: "Chief Engineer, Roads", department: "Roads Wing", link: "/municipalities/chennai" }, functions: ["Road relaying & repair", "Stormwater drain construction", "Street lighting with LED", "Signal & median maintenance", "Pedestrian subway upkeep"] },
      { id: "gcc-health", name: "Public Health", description: "Corporation hospitals, health posts, sanitation", head: { name: "Dr. P. Kuganantham", designation: "City Health Officer", department: "Public Health", link: "/municipalities/chennai" }, functions: ["Corporation hospital management", "Urban health posts", "Vector control", "Food safety", "Anti-rabies vaccination"] },
      { id: "gcc-revenue", name: "Revenue & Property Tax", description: "Property tax, professional tax, trade licensing", head: { name: "K. Balachander", designation: "Revenue Officer", department: "Revenue", link: "/municipalities/chennai" }, functions: ["Property tax collection", "Professional tax", "Trade licensing", "Building plan approval", "Encroachment removal"] },
      { id: "gcc-town", name: "Town Planning", description: "Building permits, master plan, development control", head: { name: "R. Srinivasan", designation: "City Planner", department: "Town Planning", link: "/municipalities/chennai" }, functions: ["Building permit issuance", "Master plan enforcement", "Layout approval", "Regularization schemes", "Heritage building conservation"] },
    ],
    zones: [
      {
        id: "gcc-tondiarpet", name: "Tondiarpet Zone (I)", population: 450000,
        zonalOfficer: { name: "R. Manoharan", designation: "Zonal Officer", department: "Zone I", link: "/municipalities/chennai" },
        wards: [
          { id: "chennai-w1", name: "Tondiarpet", number: 1, zone: "Tondiarpet Zone", population: 45000, area: "2.5", councillor: { name: "P. Selvam", designation: "Ward Councillor", department: "Ward 1 - Tondiarpet", link: "/municipalities/chennai" }, officials: wardOfficials("Tondiarpet", "chennai") },
          { id: "chennai-w2", name: "Washermanpet", number: 2, zone: "Tondiarpet Zone", population: 42000, area: "2.1", councillor: { name: "Fathima Banu", designation: "Ward Councillor", department: "Ward 2 - Washermanpet", link: "/municipalities/chennai" }, officials: wardOfficials("Washermanpet", "chennai") },
        ],
      },
      {
        id: "gcc-anna-nagar", name: "Anna Nagar Zone (VIII)", population: 380000,
        zonalOfficer: { name: "S. Thirunavukkarasu", designation: "Zonal Officer", department: "Zone VIII", link: "/municipalities/chennai" },
        wards: [
          { id: "chennai-w100", name: "Anna Nagar", number: 100, zone: "Anna Nagar Zone", population: 35000, area: "3.2", councillor: { name: "S. Kumar", designation: "Ward Councillor", department: "Ward 100 - Anna Nagar", link: "/municipalities/chennai" }, officials: wardOfficials("Anna Nagar", "chennai") },
          { id: "chennai-w101", name: "Kilpauk", number: 101, zone: "Anna Nagar Zone", population: 38000, area: "2.8", councillor: { name: "T. Radhika", designation: "Ward Councillor", department: "Ward 101 - Kilpauk", link: "/municipalities/chennai" }, officials: wardOfficials("Kilpauk", "chennai") },
        ],
      },
      {
        id: "gcc-adyar", name: "Adyar Zone (XIII)", population: 420000,
        zonalOfficer: { name: "M. Balasubramanian", designation: "Zonal Officer", department: "Zone XIII", link: "/municipalities/chennai" },
        wards: [
          { id: "chennai-w170", name: "Adyar", number: 170, zone: "Adyar Zone", population: 32000, area: "3.5", councillor: { name: "R. Jayashree", designation: "Ward Councillor", department: "Ward 170 - Adyar", link: "/municipalities/chennai" }, officials: wardOfficials("Adyar", "chennai") },
          { id: "chennai-w171", name: "Besant Nagar", number: 171, zone: "Adyar Zone", population: 28000, area: "2.9", councillor: { name: "K. Dhanasekaran", designation: "Ward Councillor", department: "Ward 171 - Besant Nagar", link: "/municipalities/chennai" }, officials: wardOfficials("Besant Nagar", "chennai") },
        ],
      },
    ],
  },

  kolkata: {
    id: "kolkata",
    cityId: "kolkata",
    name: "Kolkata Municipal Corporation (KMC)",
    type: "Municipal Corporation",
    mayor: { name: "Firhad Hakim", designation: "Mayor of Kolkata", department: "KMC", link: "/cities/kolkata" },
    commissioner: { name: "Binod Kumar", designation: "KMC Commissioner, IAS", department: "KMC", link: "/cities/kolkata" },
    description: "One of the oldest municipal bodies in India, managing 144 wards across 16 boroughs.",
    established: "1876",
    totalWards: 144,
    memberCount: 95000,
    departments: [
      { id: "kmc-swm", name: "Solid Waste Management", description: "Waste collection and disposal", head: { name: "Debashis Kumar", designation: "Member, SWM Committee", department: "SWM", link: "/municipalities/kolkata" }, functions: ["Waste collection", "Dhapa landfill management", "Composting", "Bio-medical waste", "Street sweeping"] },
      { id: "kmc-water", name: "Water Supply", description: "Water treatment and distribution", head: { name: "S.K. Mukherjee", designation: "Chief Engineer, Water", department: "Water Supply", link: "/municipalities/kolkata" }, functions: ["Water treatment plants", "Pipeline maintenance", "New connections", "Water quality testing", "Borewell management"] },
      { id: "kmc-roads", name: "Roads & Bridges", description: "Road construction and maintenance", head: { name: "A. Banerjee", designation: "Chief Engineer, Roads", department: "Roads Dept.", link: "/municipalities/kolkata" }, functions: ["Road repair", "Bridge maintenance", "Drain construction", "Street lighting", "Footpath management"] },
      { id: "kmc-health", name: "Health", description: "Public health, hospitals, dispensaries", head: { name: "Dr. Atin Ghosh", designation: "Deputy Mayor & Health Chair", department: "Health Dept.", link: "/municipalities/kolkata" }, functions: ["KMC hospital management", "Dispensaries", "Mosquito control", "Birth/death registration", "Health camps"] },
      { id: "kmc-revenue", name: "Assessment & Collection", description: "Property tax, mutation, license", head: { name: "Avik Mitra", designation: "Assessor-Collector", department: "Revenue", link: "/municipalities/kolkata" }, functions: ["Property assessment", "Tax collection", "Mutation", "Trade license", "Building plan sanction"] },
    ],
    zones: [
      {
        id: "kmc-borough1", name: "Borough I (North Kolkata)", population: 220000,
        zonalOfficer: { name: "Tapas Dey", designation: "Borough Executive Engineer", department: "Borough I", link: "/municipalities/kolkata" },
        wards: [
          { id: "kol-w1", name: "Jorabagan", number: 1, zone: "Borough I", population: 28000, area: "1.5", councillor: { name: "Amit Chatterjee", designation: "Ward Councillor", department: "Ward 1 - Jorabagan", link: "/municipalities/kolkata" }, officials: wardOfficials("Jorabagan", "kolkata") },
          { id: "kol-w2", name: "Shyambazar", number: 2, zone: "Borough I", population: 32000, area: "1.8", councillor: { name: "Mala Das", designation: "Ward Councillor", department: "Ward 2 - Shyambazar", link: "/municipalities/kolkata" }, officials: wardOfficials("Shyambazar", "kolkata") },
        ],
      },
      {
        id: "kmc-borough7", name: "Borough VII (South Kolkata)", population: 280000,
        zonalOfficer: { name: "S.K. Roy", designation: "Borough Executive Engineer", department: "Borough VII", link: "/municipalities/kolkata" },
        wards: [
          { id: "kol-w60", name: "Ballygunge", number: 60, zone: "Borough VII", population: 35000, area: "2.5", councillor: { name: "Ratna Sur", designation: "Ward Councillor", department: "Ward 60 - Ballygunge", link: "/municipalities/kolkata" }, officials: wardOfficials("Ballygunge", "kolkata") },
          { id: "kol-w61", name: "Gariahat", number: 61, zone: "Borough VII", population: 38000, area: "2.2", councillor: { name: "Debabrata Majumdar", designation: "Ward Councillor", department: "Ward 61 - Gariahat", link: "/municipalities/kolkata" }, officials: wardOfficials("Gariahat", "kolkata") },
        ],
      },
    ],
  },

  hyderabad: {
    id: "hyderabad",
    cityId: "hyderabad",
    name: "Greater Hyderabad Municipal Corporation (GHMC)",
    type: "Municipal Corporation",
    mayor: { name: "Gadwal Vijayalakshmi", designation: "Mayor of Hyderabad", department: "GHMC", link: "/cities/hyderabad" },
    commissioner: { name: "Dana Kishore", designation: "GHMC Commissioner, IAS", department: "GHMC", link: "/cities/hyderabad" },
    description: "Fourth largest municipal corporation in India, governing 150 wards across 6 zones.",
    established: "2007",
    totalWards: 150,
    memberCount: 134000,
    departments: [
      { id: "ghmc-swm", name: "Solid Waste Management", description: "Swachh Hyderabad initiative, waste processing", head: { name: "B. Janardhan Reddy", designation: "Director, Swachh", department: "SWM", link: "/municipalities/hyderabad" }, functions: ["Door-to-door collection", "Transfer stations", "Waste processing plants", "Street sweeping", "Debris removal"] },
      { id: "ghmc-eng", name: "Engineering", description: "Roads, bridges, stormwater drains", head: { name: "K. Srinivas Reddy", designation: "Chief Engineer", department: "Engineering Wing", link: "/municipalities/hyderabad" }, functions: ["Road construction", "Naala development", "Bridge maintenance", "Street lighting", "Traffic infrastructure"] },
      { id: "ghmc-town", name: "Town Planning", description: "Building permissions, layout approvals", head: { name: "M. Srinivas", designation: "Director, Town Planning", department: "Town Planning", link: "/municipalities/hyderabad" }, functions: ["Building permission", "Layout approval", "Master plan enforcement", "Demolition of illegal structures", "Land use conversion"] },
      { id: "ghmc-health", name: "Entomology & Public Health", description: "Vector control, sanitation, public health", head: { name: "Dr. Rambabu", designation: "Chief Entomologist", department: "Public Health", link: "/municipalities/hyderabad" }, functions: ["Mosquito control", "Sanitation inspection", "Food safety", "Health camps", "Dog sterilization"] },
      { id: "ghmc-revenue", name: "Revenue", description: "Property tax, trade license, advertisements", head: { name: "S. Srinivas", designation: "Chief Revenue Officer", department: "Revenue", link: "/municipalities/hyderabad" }, functions: ["Property tax", "GIS-based assessment", "Trade license", "Advertisement permission", "Encroachment action"] },
      { id: "ghmc-lakes", name: "Lakes & Parks", description: "Lake protection, park maintenance", head: { name: "V. Srinivas", designation: "Director, Lakes", department: "Lakes Wing", link: "/municipalities/hyderabad" }, functions: ["Lake rejuvenation", "FTL demarcation", "Park maintenance", "Urban forestry", "Lake police coordination"] },
    ],
    zones: [
      {
        id: "ghmc-charminar", name: "Charminar Zone", population: 520000,
        zonalOfficer: { name: "Hari Chandana", designation: "Zonal Commissioner", department: "Charminar Zone", link: "/municipalities/hyderabad" },
        wards: [
          { id: "hyd-w1", name: "Charminar", number: 1, zone: "Charminar Zone", population: 42000, area: "2.0", councillor: { name: "Mohd. Moazam Khan", designation: "Ward Councillor", department: "Ward 1 - Charminar", link: "/municipalities/hyderabad" }, officials: wardOfficials("Charminar", "hyderabad") },
          { id: "hyd-w2", name: "Falaknuma", number: 2, zone: "Charminar Zone", population: 48000, area: "3.1", councillor: { name: "Reshma Begum", designation: "Ward Councillor", department: "Ward 2 - Falaknuma", link: "/municipalities/hyderabad" }, officials: wardOfficials("Falaknuma", "hyderabad") },
        ],
      },
      {
        id: "ghmc-secunderabad", name: "Secunderabad Zone", population: 480000,
        zonalOfficer: { name: "B. Srinivas", designation: "Zonal Commissioner", department: "Secunderabad Zone", link: "/municipalities/hyderabad" },
        wards: [
          { id: "hyd-w50", name: "Secunderabad", number: 50, zone: "Secunderabad Zone", population: 38000, area: "2.5", councillor: { name: "G. Sridhar Reddy", designation: "Ward Councillor", department: "Ward 50 - Secunderabad", link: "/municipalities/hyderabad" }, officials: wardOfficials("Secunderabad", "hyderabad") },
          { id: "hyd-w51", name: "Begumpet", number: 51, zone: "Secunderabad Zone", population: 35000, area: "3.2", councillor: { name: "K. Laxmi", designation: "Ward Councillor", department: "Ward 51 - Begumpet", link: "/municipalities/hyderabad" }, officials: wardOfficials("Begumpet", "hyderabad") },
        ],
      },
      {
        id: "ghmc-lb-nagar", name: "LB Nagar Zone", population: 550000,
        zonalOfficer: { name: "R. Venkat Reddy", designation: "Zonal Commissioner", department: "LB Nagar Zone", link: "/municipalities/hyderabad" },
        wards: [
          { id: "hyd-w100", name: "LB Nagar", number: 100, zone: "LB Nagar Zone", population: 52000, area: "4.0", councillor: { name: "Devi Prasad", designation: "Ward Councillor", department: "Ward 100 - LB Nagar", link: "/municipalities/hyderabad" }, officials: wardOfficials("LB Nagar", "hyderabad") },
          { id: "hyd-w101", name: "Dilsukhnagar", number: 101, zone: "LB Nagar Zone", population: 58000, area: "3.5", councillor: { name: "T. Srikanth", designation: "Ward Councillor", department: "Ward 101 - Dilsukhnagar", link: "/municipalities/hyderabad" }, officials: wardOfficials("Dilsukhnagar", "hyderabad") },
        ],
      },
    ],
  },

  pune: {
    id: "pune",
    cityId: "pune",
    name: "Pune Municipal Corporation (PMC)",
    type: "Municipal Corporation",
    mayor: { name: "Murlidhar Mohol", designation: "Mayor of Pune", department: "PMC", link: "/cities/pune" },
    commissioner: { name: "Vikram Kumar", designation: "PMC Commissioner, IAS", department: "PMC", link: "/cities/pune" },
    description: "Progressive municipal body governing the Oxford of the East with 58 wards across 15 ward offices.",
    established: "1950",
    totalWards: 58,
    memberCount: 89000,
    departments: [
      { id: "pmc-swm", name: "Solid Waste Management", description: "Swachh Pune initiative", head: { name: "Asha Raut", designation: "Head, SWM Cell", department: "SWM", link: "/municipalities/pune" }, functions: ["Waste collection", "Segregation enforcement", "Biogas plants", "Recycling centers", "Debris management"] },
      { id: "pmc-water", name: "Water Supply", description: "Water treatment and distribution", head: { name: "Aniruddha Pawaskar", designation: "Superintendent Engineer, Water", department: "Water Supply", link: "/municipalities/pune" }, functions: ["Water treatment", "Pipeline network", "Water meter", "24x7 water pilot", "Tanker management"] },
      { id: "pmc-roads", name: "Road & Infrastructure", description: "Road network, bridges, flyovers", head: { name: "V.G. Kulkarni", designation: "City Engineer", department: "Road Dept.", link: "/municipalities/pune" }, functions: ["Road construction", "Bridge maintenance", "Smart road initiative", "Cycle tracks", "Pedestrian infrastructure"] },
      { id: "pmc-health", name: "Health", description: "Public health, hospitals, sanitation", head: { name: "Dr. Ashish Bharati", designation: "Health Officer", department: "Health Dept.", link: "/municipalities/pune" }, functions: ["PMC hospitals", "Dispensaries", "Epidemic control", "Food licensing", "Birth/death registration"] },
      { id: "pmc-revenue", name: "Property Tax & Revenue", description: "Assessment, collection, licensing", head: { name: "Rajendra Muthe", designation: "Revenue Officer", department: "Revenue", link: "/municipalities/pune" }, functions: ["Property tax", "Water tax", "Trade license", "Building permission", "Encroachment"] },
    ],
    zones: [
      {
        id: "pmc-aundh", name: "Aundh Ward Office", population: 180000,
        zonalOfficer: { name: "S.M. Patil", designation: "Ward Officer", department: "Aundh Ward", link: "/municipalities/pune" },
        wards: [
          { id: "pune-w1", name: "Aundh", number: 1, zone: "Aundh Ward Office", population: 45000, area: "4.2", councillor: { name: "Supriya Deokar", designation: "Ward Councillor", department: "Ward 1 - Aundh", link: "/municipalities/pune" }, officials: wardOfficials("Aundh", "pune") },
          { id: "pune-w2", name: "Baner", number: 2, zone: "Aundh Ward Office", population: 52000, area: "5.0", councillor: { name: "Amol Balwadkar", designation: "Ward Councillor", department: "Ward 2 - Baner", link: "/municipalities/pune" }, officials: wardOfficials("Baner", "pune") },
        ],
      },
      {
        id: "pmc-shivaji", name: "Shivajinagar Ward Office", population: 150000,
        zonalOfficer: { name: "R.V. Joshi", designation: "Ward Officer", department: "Shivajinagar Ward", link: "/municipalities/pune" },
        wards: [
          { id: "pune-w20", name: "Shivajinagar", number: 20, zone: "Shivajinagar Ward Office", population: 38000, area: "3.0", councillor: { name: "Siddharth Shirole", designation: "Ward Councillor", department: "Ward 20 - Shivajinagar", link: "/municipalities/pune" }, officials: wardOfficials("Shivajinagar", "pune") },
          { id: "pune-w21", name: "Deccan", number: 21, zone: "Shivajinagar Ward Office", population: 35000, area: "2.5", councillor: { name: "Mukta Tilak", designation: "Ward Councillor", department: "Ward 21 - Deccan", link: "/municipalities/pune" }, officials: wardOfficials("Deccan", "pune") },
        ],
      },
    ],
  },

  ahmedabad: {
    id: "ahmedabad",
    cityId: "ahmedabad",
    name: "Ahmedabad Municipal Corporation (AMC)",
    type: "Municipal Corporation",
    mayor: { name: "Kiritkumar Parmar", designation: "Mayor of Ahmedabad", department: "AMC", link: "/cities/ahmedabad" },
    commissioner: { name: "M. Thennarasan", designation: "AMC Commissioner, IAS", department: "AMC", link: "/cities/ahmedabad" },
    description: "Governs India's first UNESCO World Heritage City with 48 wards across 7 zones.",
    established: "1950",
    totalWards: 48,
    memberCount: 76000,
    departments: [
      { id: "amc-swm", name: "Solid Waste Management", description: "Waste collection and processing", head: { name: "Harpalsinh Zala", designation: "Director, SWM", department: "SWM", link: "/municipalities/ahmedabad" }, functions: ["Door-to-door collection", "Transfer stations", "Pirana landfill management", "Composting", "Segregation"] },
      { id: "amc-water", name: "Water Supply & Sewerage", description: "Water distribution and drainage", head: { name: "R.K. Mehta", designation: "Chief Engineer, Water", department: "Water Supply", link: "/municipalities/ahmedabad" }, functions: ["Water treatment", "Pipeline network", "Sewerage", "STP management", "Water quality"] },
      { id: "amc-roads", name: "Roads & Buildings", description: "Road infrastructure and public buildings", head: { name: "M.D. Patel", designation: "City Engineer", department: "Engineering", link: "/municipalities/ahmedabad" }, functions: ["Road construction", "Public building maintenance", "Street lighting", "Footpaths", "Smart road"] },
      { id: "amc-health", name: "Health", description: "Public health services", head: { name: "Dr. Bhavin Solanki", designation: "Medical Officer of Health", department: "Health", link: "/municipalities/ahmedabad" }, functions: ["Urban health centers", "Vector control", "Food safety", "Birth/death registration", "Epidemic management"] },
      { id: "amc-revenue", name: "Revenue & Tax", description: "Property tax and licensing", head: { name: "K.M. Shah", designation: "Revenue Officer", department: "Revenue", link: "/municipalities/ahmedabad" }, functions: ["Property tax", "Professional tax", "Trade license", "Building use permission", "Hawker management"] },
      { id: "amc-town", name: "Town Planning & Development", description: "Heritage conservation, building permits", head: { name: "A.J. Patel", designation: "Town Planner", department: "Town Planning", link: "/municipalities/ahmedabad" }, functions: ["Building permission", "Heritage conservation", "TP scheme implementation", "Development charges", "Land pooling"] },
    ],
    zones: [
      {
        id: "amc-central", name: "Central Zone", population: 320000,
        zonalOfficer: { name: "P.M. Desai", designation: "Deputy Commissioner", department: "Central Zone", link: "/municipalities/ahmedabad" },
        wards: [
          { id: "amd-w1", name: "Lal Darwaja", number: 1, zone: "Central Zone", population: 35000, area: "2.0", councillor: { name: "Bhushan Bhatt", designation: "Ward Councillor", department: "Ward 1 - Lal Darwaja", link: "/municipalities/ahmedabad" }, officials: wardOfficials("Lal Darwaja", "ahmedabad") },
          { id: "amd-w2", name: "Kalupur", number: 2, zone: "Central Zone", population: 42000, area: "1.8", councillor: { name: "Firoza Diwan", designation: "Ward Councillor", department: "Ward 2 - Kalupur", link: "/municipalities/ahmedabad" }, officials: wardOfficials("Kalupur", "ahmedabad") },
        ],
      },
      {
        id: "amc-west", name: "West Zone", population: 380000,
        zonalOfficer: { name: "H.R. Shah", designation: "Deputy Commissioner", department: "West Zone", link: "/municipalities/ahmedabad" },
        wards: [
          { id: "amd-w20", name: "Navrangpura", number: 20, zone: "West Zone", population: 38000, area: "3.5", councillor: { name: "Jignesh Shah", designation: "Ward Councillor", department: "Ward 20 - Navrangpura", link: "/municipalities/ahmedabad" }, officials: wardOfficials("Navrangpura", "ahmedabad") },
          { id: "amd-w21", name: "Satellite", number: 21, zone: "West Zone", population: 45000, area: "4.2", councillor: { name: "Pravin Patel", designation: "Ward Councillor", department: "Ward 21 - Satellite", link: "/municipalities/ahmedabad" }, officials: wardOfficials("Satellite", "ahmedabad") },
        ],
      },
    ],
  },

  jaipur: {
    id: "jaipur",
    cityId: "jaipur",
    name: "Jaipur Municipal Corporation (JMC)",
    type: "Municipal Corporation",
    mayor: { name: "Saumya Gurjar", designation: "Mayor of Jaipur", department: "JMC", link: "/cities/jaipur" },
    commissioner: { name: "Sudhansh Pant", designation: "JMC Commissioner, IAS", department: "JMC", link: "/cities/jaipur" },
    description: "Governs the Pink City's 150 wards with focus on heritage conservation and smart city initiatives.",
    established: "1994 (Heritage City est. 1727)",
    totalWards: 150,
    memberCount: 65000,
    departments: [
      { id: "jmc-swm", name: "Solid Waste Management", description: "Waste collection under Swachh Bharat", head: { name: "N.K. Gupta", designation: "CE, SWM", department: "SWM", link: "/municipalities/jaipur" }, functions: ["Door-to-door collection", "Waste processing plant", "Street sweeping", "Debris removal", "Recycling"] },
      { id: "jmc-water", name: "Water & Sanitation", description: "Water supply and sewerage", head: { name: "R.S. Rathore", designation: "SE, Water", department: "Water Supply", link: "/municipalities/jaipur" }, functions: ["Water distribution", "Sewerage network", "STP operation", "Water tanker", "Water quality"] },
      { id: "jmc-roads", name: "Roads & Civil Works", description: "Road maintenance, drainage", head: { name: "A.K. Mathur", designation: "City Engineer", department: "Engineering", link: "/municipalities/jaipur" }, functions: ["Road construction", "Drain desilting", "Street lighting", "Public building", "Heritage area upkeep"] },
      { id: "jmc-health", name: "Public Health", description: "Health services and sanitation", head: { name: "Dr. Narottam Sharma", designation: "CMO", department: "Health", link: "/municipalities/jaipur" }, functions: ["Dispensaries", "Epidemic control", "Food safety", "Birth/death registration", "Anti-larval spray"] },
      { id: "jmc-revenue", name: "Revenue & Property Tax", description: "Tax collection and licensing", head: { name: "B.L. Meena", designation: "Revenue Officer", department: "Revenue", link: "/municipalities/jaipur" }, functions: ["Property tax", "Trade license", "Building permission", "Advertisement tax", "Encroachment"] },
      { id: "jmc-heritage", name: "Heritage & Smart City", description: "Heritage conservation and smart city projects", head: { name: "V.K. Singh", designation: "CEO, Smart City", department: "Heritage & Smart City", link: "/municipalities/jaipur" }, functions: ["Walled city conservation", "Smart lighting", "Smart traffic", "Heritage walk infrastructure", "Digital governance"] },
    ],
    zones: [
      {
        id: "jmc-walled", name: "Walled City Zone", population: 280000,
        zonalOfficer: { name: "S.L. Sharma", designation: "Zonal Officer", department: "Walled City Zone", link: "/municipalities/jaipur" },
        wards: [
          { id: "jpr-w1", name: "Hawa Mahal", number: 1, zone: "Walled City Zone", population: 22000, area: "1.2", councillor: { name: "Mohan Lal", designation: "Ward Councillor", department: "Ward 1 - Hawa Mahal", link: "/municipalities/jaipur" }, officials: wardOfficials("Hawa Mahal", "jaipur") },
          { id: "jpr-w2", name: "Johari Bazaar", number: 2, zone: "Walled City Zone", population: 25000, area: "1.0", councillor: { name: "Prem Chand Jain", designation: "Ward Councillor", department: "Ward 2 - Johari Bazaar", link: "/municipalities/jaipur" }, officials: wardOfficials("Johari Bazaar", "jaipur") },
          { id: "jpr-w3", name: "Chandpole", number: 3, zone: "Walled City Zone", population: 20000, area: "1.5", councillor: { name: "Kailash Verma", designation: "Ward Councillor", department: "Ward 3 - Chandpole", link: "/municipalities/jaipur" }, officials: wardOfficials("Chandpole", "jaipur") },
        ],
      },
      {
        id: "jmc-mansarovar", name: "Mansarovar Zone", population: 350000,
        zonalOfficer: { name: "R.P. Meena", designation: "Zonal Officer", department: "Mansarovar Zone", link: "/municipalities/jaipur" },
        wards: [
          { id: "jpr-w50", name: "Mansarovar", number: 50, zone: "Mansarovar Zone", population: 45000, area: "4.5", councillor: { name: "Seema Mathur", designation: "Ward Councillor", department: "Ward 50 - Mansarovar", link: "/municipalities/jaipur" }, officials: wardOfficials("Mansarovar", "jaipur") },
          { id: "jpr-w51", name: "Pratap Nagar", number: 51, zone: "Mansarovar Zone", population: 48000, area: "5.0", councillor: { name: "Ghanshyam Sharma", designation: "Ward Councillor", department: "Ward 51 - Pratap Nagar", link: "/municipalities/jaipur" }, officials: wardOfficials("Pratap Nagar", "jaipur") },
        ],
      },
    ],
  },

  // ── Tier 2 Cities ──────────────────────────────────────────────

  lucknow: {
    id: "lucknow", cityId: "lucknow", name: "Lucknow Municipal Corporation (LMC)", type: "Municipal Corporation", tier: "Tier 2",
    mayor: { name: "Sushma Kharakwal", designation: "Mayor of Lucknow", department: "LMC", link: "/municipalities/lucknow" },
    commissioner: { name: "Inderjit Singh", designation: "Municipal Commissioner, IAS", department: "LMC", link: "/municipalities/lucknow" },
    description: "City of Nawabs. Capital of Uttar Pradesh known for its art, cuisine, and heritage architecture.",
    established: "1916", totalWards: 110, memberCount: 52000,
    departments: [
      { id: "lmc-swm", name: "Solid Waste Management", description: "Waste collection and Swachh Bharat initiatives", head: { name: "A.K. Pandey", designation: "Director, SWM", department: "SWM", link: "/municipalities/lucknow" }, functions: ["Door-to-door collection", "Waste processing", "Street sweeping", "Debris removal", "Recycling drives"] },
      { id: "lmc-water", name: "Water & Sewerage", description: "Water supply, drainage, sewage treatment", head: { name: "R.P. Mishra", designation: "SE, Water", department: "Water Supply", link: "/municipalities/lucknow" }, functions: ["Water distribution", "Sewerage network", "STP operations", "Borewell management", "Water quality testing"] },
      { id: "lmc-roads", name: "Roads & Infrastructure", description: "Road construction and public infrastructure", head: { name: "S.K. Verma", designation: "City Engineer", department: "Roads", link: "/municipalities/lucknow" }, functions: ["Road maintenance", "Street lighting", "Drain construction", "Footpath development", "Bridge upkeep"] },
      { id: "lmc-health", name: "Public Health", description: "Health services, sanitation, disease control", head: { name: "Dr. M.K. Singh", designation: "CMO", department: "Health", link: "/municipalities/lucknow" }, functions: ["Dispensaries", "Vector control", "Food safety", "Birth/death registration", "Health camps"] },
      { id: "lmc-revenue", name: "Revenue & Tax", description: "Property tax, licensing", head: { name: "P.K. Gupta", designation: "Revenue Officer", department: "Revenue", link: "/municipalities/lucknow" }, functions: ["Property tax collection", "Trade license", "Building permission", "Encroachment action", "Advertisement tax"] },
    ],
    zones: [
      { id: "lmc-zone1", name: "Zone 1 (Chowk)", population: 280000, zonalOfficer: { name: "Anita Srivastava", designation: "Zonal Officer", department: "Zone 1", link: "/municipalities/lucknow" }, wards: [
        { id: "lko-w1", name: "Chowk", number: 1, zone: "Zone 1", population: 32000, area: "1.8", councillor: { name: "Rajesh Yadav", designation: "Ward Councillor", department: "Ward 1 - Chowk", link: "/municipalities/lucknow" }, officials: wardOfficials("Chowk", "lucknow") },
        { id: "lko-w2", name: "Aminabad", number: 2, zone: "Zone 1", population: 35000, area: "2.0", councillor: { name: "Shabana Begum", designation: "Ward Councillor", department: "Ward 2 - Aminabad", link: "/municipalities/lucknow" }, officials: wardOfficials("Aminabad", "lucknow") },
      ]},
      { id: "lmc-zone4", name: "Zone 4 (Gomti Nagar)", population: 320000, zonalOfficer: { name: "V.K. Tripathi", designation: "Zonal Officer", department: "Zone 4", link: "/municipalities/lucknow" }, wards: [
        { id: "lko-w40", name: "Gomti Nagar", number: 40, zone: "Zone 4", population: 45000, area: "5.2", councillor: { name: "Priya Singh", designation: "Ward Councillor", department: "Ward 40 - Gomti Nagar", link: "/municipalities/lucknow" }, officials: wardOfficials("Gomti Nagar", "lucknow") },
        { id: "lko-w41", name: "Vikas Nagar", number: 41, zone: "Zone 4", population: 42000, area: "4.0", councillor: { name: "Anil Kumar", designation: "Ward Councillor", department: "Ward 41 - Vikas Nagar", link: "/municipalities/lucknow" }, officials: wardOfficials("Vikas Nagar", "lucknow") },
      ]},
    ],
  },

  nagpur: {
    id: "nagpur", cityId: "nagpur", name: "Nagpur Municipal Corporation (NMC)", type: "Municipal Corporation", tier: "Tier 2",
    mayor: { name: "Dayashankar Tiwari", designation: "Mayor of Nagpur", department: "NMC", link: "/municipalities/nagpur" },
    commissioner: { name: "Radhakrishnan B.", designation: "Municipal Commissioner, IAS", department: "NMC", link: "/municipalities/nagpur" },
    description: "Orange City and geographical center of India. Winter capital of Maharashtra.",
    established: "1864", totalWards: 52, memberCount: 38000,
    departments: [
      { id: "nmc-swm", name: "Solid Waste Management", description: "Waste collection and processing", head: { name: "R.Z. Siddiqui", designation: "Head, SWM", department: "SWM", link: "/municipalities/nagpur" }, functions: ["Waste collection", "Bhandewadi processing plant", "Segregation", "Street sweeping", "Hazardous waste"] },
      { id: "nmc-water", name: "Water Supply", description: "24x7 water supply project", head: { name: "S.M. Deshpande", designation: "SE, Water", department: "Water Supply", link: "/municipalities/nagpur" }, functions: ["24x7 water supply zones", "Pipeline rehabilitation", "Meter installation", "Water quality", "NRW reduction"] },
      { id: "nmc-roads", name: "Roads & Civil Works", description: "Road network and infrastructure", head: { name: "M.K. Gupta", designation: "City Engineer", department: "Engineering", link: "/municipalities/nagpur" }, functions: ["Road construction", "Cement concrete roads", "Street lighting", "Nag river beautification", "Flyover maintenance"] },
      { id: "nmc-health", name: "Health", description: "Public health services", head: { name: "Dr. Sanjay Chilkar", designation: "Health Officer", department: "Health", link: "/municipalities/nagpur" }, functions: ["Dispensaries", "Malaria control", "Food licensing", "Birth/death registration", "Dog sterilization"] },
    ],
    zones: [
      { id: "nmc-dharampeth", name: "Dharampeth Zone", population: 180000, zonalOfficer: { name: "P.R. Korde", designation: "Asst. Commissioner", department: "Dharampeth Zone", link: "/municipalities/nagpur" }, wards: [
        { id: "nag-w1", name: "Dharampeth", number: 1, zone: "Dharampeth Zone", population: 28000, area: "2.5", councillor: { name: "Mohan Mate", designation: "Ward Councillor", department: "Ward 1 - Dharampeth", link: "/municipalities/nagpur" }, officials: wardOfficials("Dharampeth", "nagpur") },
        { id: "nag-w2", name: "Sitabuldi", number: 2, zone: "Dharampeth Zone", population: 32000, area: "1.8", councillor: { name: "Pragati Patil", designation: "Ward Councillor", department: "Ward 2 - Sitabuldi", link: "/municipalities/nagpur" }, officials: wardOfficials("Sitabuldi", "nagpur") },
      ]},
      { id: "nmc-laxmi", name: "Laxmi Nagar Zone", population: 220000, zonalOfficer: { name: "S.V. Bhagat", designation: "Asst. Commissioner", department: "Laxmi Nagar Zone", link: "/municipalities/nagpur" }, wards: [
        { id: "nag-w20", name: "Laxmi Nagar", number: 20, zone: "Laxmi Nagar Zone", population: 35000, area: "3.0", councillor: { name: "Darshan Lonare", designation: "Ward Councillor", department: "Ward 20 - Laxmi Nagar", link: "/municipalities/nagpur" }, officials: wardOfficials("Laxmi Nagar", "nagpur") },
      ]},
    ],
  },

  patna: {
    id: "patna", cityId: "patna", name: "Patna Municipal Corporation (PMC)", type: "Municipal Corporation", tier: "Tier 2",
    mayor: { name: "Sita Sahu", designation: "Mayor of Patna", department: "PMC", link: "/municipalities/patna" },
    commissioner: { name: "Animesh Parashar", designation: "Municipal Commissioner, IAS", department: "PMC", link: "/municipalities/patna" },
    description: "One of the oldest continuously inhabited cities in the world. Capital of Bihar.",
    established: "1952", totalWards: 75, memberCount: 34000,
    departments: [
      { id: "pmc-patna-swm", name: "Solid Waste Management", description: "Waste collection and disposal", head: { name: "R.K. Sinha", designation: "Director, SWM", department: "SWM", link: "/municipalities/patna" }, functions: ["Waste collection", "Composting", "Street sweeping", "Drain cleaning", "Open dumping prevention"] },
      { id: "pmc-patna-roads", name: "Roads & Drainage", description: "Road and drainage infrastructure", head: { name: "S. Prasad", designation: "Chief Engineer", department: "Roads", link: "/municipalities/patna" }, functions: ["Road repair", "Drain construction", "Street lighting", "Waterlogging prevention", "Bridge maintenance"] },
      { id: "pmc-patna-health", name: "Public Health", description: "Health services and sanitation", head: { name: "Dr. R.N. Jha", designation: "Health Officer", department: "Health", link: "/municipalities/patna" }, functions: ["Health camps", "Vector control", "Sanitation drives", "Birth/death registration", "Food safety"] },
      { id: "pmc-patna-revenue", name: "Revenue & Tax", description: "Property tax and licensing", head: { name: "A.K. Choudhary", designation: "Revenue Officer", department: "Revenue", link: "/municipalities/patna" }, functions: ["Property tax", "Trade license", "Holding tax", "Building plan approval", "Encroachment removal"] },
    ],
    zones: [
      { id: "pmc-patna-zone1", name: "Zone 1 (Patna City)", population: 240000, zonalOfficer: { name: "N.K. Yadav", designation: "Zonal Commissioner", department: "Zone 1", link: "/municipalities/patna" }, wards: [
        { id: "pat-w1", name: "Patna City", number: 1, zone: "Zone 1", population: 35000, area: "2.5", councillor: { name: "Munni Devi", designation: "Ward Councillor", department: "Ward 1 - Patna City", link: "/municipalities/patna" }, officials: wardOfficials("Patna City", "patna") },
        { id: "pat-w2", name: "Bankipur", number: 2, zone: "Zone 1", population: 38000, area: "3.0", councillor: { name: "Rajesh Kumar", designation: "Ward Councillor", department: "Ward 2 - Bankipur", link: "/municipalities/patna" }, officials: wardOfficials("Bankipur", "patna") },
      ]},
      { id: "pmc-patna-zone3", name: "Zone 3 (Kankarbagh)", population: 280000, zonalOfficer: { name: "S.K. Gupta", designation: "Zonal Commissioner", department: "Zone 3", link: "/municipalities/patna" }, wards: [
        { id: "pat-w30", name: "Kankarbagh", number: 30, zone: "Zone 3", population: 42000, area: "3.5", councillor: { name: "Sanjay Tiwari", designation: "Ward Councillor", department: "Ward 30 - Kankarbagh", link: "/municipalities/patna" }, officials: wardOfficials("Kankarbagh", "patna") },
      ]},
    ],
  },

  bhopal: {
    id: "bhopal", cityId: "bhopal", name: "Bhopal Municipal Corporation (BMC)", type: "Municipal Corporation", tier: "Tier 2",
    mayor: { name: "Malti Rai", designation: "Mayor of Bhopal", department: "BMC", link: "/municipalities/bhopal" },
    commissioner: { name: "K.V.S. Choudary", designation: "Municipal Commissioner, IAS", department: "BMC", link: "/municipalities/bhopal" },
    description: "City of Lakes. Capital of Madhya Pradesh known for its natural beauty and rich heritage.",
    established: "1907", totalWards: 85, memberCount: 31000,
    departments: [
      { id: "bmc-bhopal-swm", name: "Solid Waste Management", description: "Waste management and Swachh Bharat", head: { name: "S.K. Awasthi", designation: "CE, SWM", department: "SWM", link: "/municipalities/bhopal" }, functions: ["Waste collection", "Processing plant", "Segregation", "Street sweeping", "Construction waste"] },
      { id: "bmc-bhopal-water", name: "Water Supply", description: "Water distribution from Bhopal lakes", head: { name: "R.S. Rajput", designation: "SE, Water", department: "Water Supply", link: "/municipalities/bhopal" }, functions: ["Kolar dam water supply", "Pipeline maintenance", "Water treatment", "New connections", "Water quality monitoring"] },
      { id: "bmc-bhopal-roads", name: "Engineering & Roads", description: "Road construction and infrastructure", head: { name: "A.K. Sharma", designation: "City Engineer", department: "Engineering", link: "/municipalities/bhopal" }, functions: ["Road construction", "Street lighting", "Drain infrastructure", "Smart road", "Bridge maintenance"] },
      { id: "bmc-bhopal-health", name: "Public Health", description: "Health services and disease prevention", head: { name: "Dr. Prabhakar Tiwari", designation: "CMO", department: "Health", link: "/municipalities/bhopal" }, functions: ["Health centers", "Mosquito control", "Food licensing", "Birth/death registration", "Immunization"] },
      { id: "bmc-bhopal-lake", name: "Lake Conservation", description: "Conservation of Bhopal's lakes and wetlands", head: { name: "M.K. Jain", designation: "Director, Lake Cell", department: "Lake Conservation", link: "/municipalities/bhopal" }, functions: ["Upper Lake conservation", "Lower Lake cleaning", "Wetland protection", "Sewage diversion", "Lake beautification"] },
    ],
    zones: [
      { id: "bmc-zone1", name: "Zone 1 (Old Bhopal)", population: 220000, zonalOfficer: { name: "R.K. Patel", designation: "Zonal Officer", department: "Zone 1", link: "/municipalities/bhopal" }, wards: [
        { id: "bpl-w1", name: "Chowk Bazaar", number: 1, zone: "Zone 1", population: 28000, area: "1.5", councillor: { name: "Arif Khan", designation: "Ward Councillor", department: "Ward 1 - Chowk Bazaar", link: "/municipalities/bhopal" }, officials: wardOfficials("Chowk Bazaar", "bhopal") },
        { id: "bpl-w2", name: "Peer Gate", number: 2, zone: "Zone 1", population: 25000, area: "1.2", councillor: { name: "Nasreen Bano", designation: "Ward Councillor", department: "Ward 2 - Peer Gate", link: "/municipalities/bhopal" }, officials: wardOfficials("Peer Gate", "bhopal") },
      ]},
      { id: "bmc-zone8", name: "Zone 8 (Kolar)", population: 180000, zonalOfficer: { name: "S.L. Sharma", designation: "Zonal Officer", department: "Zone 8", link: "/municipalities/bhopal" }, wards: [
        { id: "bpl-w50", name: "Kolar Road", number: 50, zone: "Zone 8", population: 38000, area: "4.5", councillor: { name: "Dinesh Patel", designation: "Ward Councillor", department: "Ward 50 - Kolar Road", link: "/municipalities/bhopal" }, officials: wardOfficials("Kolar Road", "bhopal") },
      ]},
    ],
  },

  indore: {
    id: "indore", cityId: "indore", name: "Indore Municipal Corporation (IMC)", type: "Municipal Corporation", tier: "Tier 2",
    mayor: { name: "Pushyamitra Bhargav", designation: "Mayor of Indore", department: "IMC", link: "/municipalities/indore" },
    commissioner: { name: "Pratibha Pal", designation: "Municipal Commissioner, IAS", department: "IMC", link: "/municipalities/indore" },
    description: "India's cleanest city (multiple times). Commercial capital of Madhya Pradesh.",
    established: "1956", totalWards: 85, memberCount: 42000,
    departments: [
      { id: "imc-swm", name: "Solid Waste Management", description: "India's best SWM system — zero landfill city", head: { name: "Asad Warsi", designation: "In-charge, SWM", department: "SWM", link: "/municipalities/indore" }, functions: ["100% door-to-door collection", "Zero landfill operations", "Bio-CNG plant", "Wet waste composting", "Plastic recycling unit"] },
      { id: "imc-water", name: "Water Supply", description: "24x7 water supply project", head: { name: "R.K. Gupta", designation: "SE, Water", department: "Water Supply", link: "/municipalities/indore" }, functions: ["Narmada water supply", "Pipeline network", "Water meter installation", "Quality monitoring", "24x7 supply zones"] },
      { id: "imc-roads", name: "Engineering", description: "Road and infrastructure development", head: { name: "M.S. Bhandari", designation: "City Engineer", department: "Engineering", link: "/municipalities/indore" }, functions: ["Smart road construction", "Drain infrastructure", "Street lighting", "Public building maintenance", "Flyover upkeep"] },
      { id: "imc-health", name: "Public Health", description: "Health services", head: { name: "Dr. Tarun Gupta", designation: "CMO", department: "Health", link: "/municipalities/indore" }, functions: ["Health centers", "Dengue prevention", "Food safety", "Birth/death registration", "Anti-rabies program"] },
    ],
    zones: [
      { id: "imc-zone1", name: "Zone 1 (Central)", population: 200000, zonalOfficer: { name: "A.K. Jain", designation: "Zonal Officer", department: "Zone 1", link: "/municipalities/indore" }, wards: [
        { id: "ind-w1", name: "Rajwada", number: 1, zone: "Zone 1", population: 28000, area: "1.5", councillor: { name: "Rekha Jain", designation: "Ward Councillor", department: "Ward 1 - Rajwada", link: "/municipalities/indore" }, officials: wardOfficials("Rajwada", "indore") },
        { id: "ind-w2", name: "Sarafa Bazaar", number: 2, zone: "Zone 1", population: 25000, area: "1.2", councillor: { name: "Mohan Yadav", designation: "Ward Councillor", department: "Ward 2 - Sarafa Bazaar", link: "/municipalities/indore" }, officials: wardOfficials("Sarafa Bazaar", "indore") },
      ]},
      { id: "imc-zone7", name: "Zone 7 (Vijay Nagar)", population: 250000, zonalOfficer: { name: "S.P. Tiwari", designation: "Zonal Officer", department: "Zone 7", link: "/municipalities/indore" }, wards: [
        { id: "ind-w40", name: "Vijay Nagar", number: 40, zone: "Zone 7", population: 42000, area: "4.0", councillor: { name: "Neeta Sharma", designation: "Ward Councillor", department: "Ward 40 - Vijay Nagar", link: "/municipalities/indore" }, officials: wardOfficials("Vijay Nagar", "indore") },
        { id: "ind-w41", name: "Scheme 78", number: 41, zone: "Zone 7", population: 38000, area: "3.5", councillor: { name: "Vijay Gupta", designation: "Ward Councillor", department: "Ward 41 - Scheme 78", link: "/municipalities/indore" }, officials: wardOfficials("Scheme 78", "indore") },
      ]},
    ],
  },

  coimbatore: {
    id: "coimbatore", cityId: "coimbatore", name: "Coimbatore City Municipal Corporation (CCMC)", type: "Municipal Corporation", tier: "Tier 2",
    mayor: { name: "Kalpana Anandakumar", designation: "Mayor of Coimbatore", department: "CCMC", link: "/municipalities/coimbatore" },
    commissioner: { name: "M. Prathap", designation: "Municipal Commissioner, IAS", department: "CCMC", link: "/municipalities/coimbatore" },
    description: "Manchester of South India. Major textile and engineering hub of Tamil Nadu.",
    established: "1981", totalWards: 100, memberCount: 28000,
    departments: [
      { id: "ccmc-swm", name: "Solid Waste Management", description: "Waste management and recycling", head: { name: "K. Senthil", designation: "CE, SWM", department: "SWM", link: "/municipalities/coimbatore" }, functions: ["Waste collection", "Micro composting", "Recycling centers", "Street sweeping", "E-waste drives"] },
      { id: "ccmc-water", name: "Water & Drainage", description: "Water supply and underground drainage", head: { name: "R. Vijayakumar", designation: "SE, Water", department: "Water Supply", link: "/municipalities/coimbatore" }, functions: ["Siruvani water supply", "Underground drainage project", "Pipeline maintenance", "Water treatment", "Borewell management"] },
      { id: "ccmc-roads", name: "Engineering", description: "Roads, bridges, and infrastructure", head: { name: "S. Mohan", designation: "City Engineer", department: "Engineering", link: "/municipalities/coimbatore" }, functions: ["Road construction", "Storm water drain", "Street lighting", "Smart city projects", "Pedestrian plaza"] },
      { id: "ccmc-health", name: "Public Health", description: "Health services and sanitation", head: { name: "Dr. P. Aruna", designation: "City Health Officer", department: "Health", link: "/municipalities/coimbatore" }, functions: ["Corporation hospital", "Health posts", "Vector control", "Food safety", "Birth/death registration"] },
    ],
    zones: [
      { id: "ccmc-east", name: "East Zone", population: 280000, zonalOfficer: { name: "S. Chandrasekaran", designation: "Zonal Officer", department: "East Zone", link: "/municipalities/coimbatore" }, wards: [
        { id: "cbe-w1", name: "Gandhipuram", number: 1, zone: "East Zone", population: 32000, area: "2.5", councillor: { name: "K. Lakshmi", designation: "Ward Councillor", department: "Ward 1 - Gandhipuram", link: "/municipalities/coimbatore" }, officials: wardOfficials("Gandhipuram", "coimbatore") },
        { id: "cbe-w2", name: "RS Puram", number: 2, zone: "East Zone", population: 28000, area: "2.0", councillor: { name: "R. Selvam", designation: "Ward Councillor", department: "Ward 2 - RS Puram", link: "/municipalities/coimbatore" }, officials: wardOfficials("RS Puram", "coimbatore") },
      ]},
      { id: "ccmc-south", name: "South Zone", population: 250000, zonalOfficer: { name: "M. Kannan", designation: "Zonal Officer", department: "South Zone", link: "/municipalities/coimbatore" }, wards: [
        { id: "cbe-w50", name: "Singanallur", number: 50, zone: "South Zone", population: 45000, area: "4.2", councillor: { name: "P. Murugan", designation: "Ward Councillor", department: "Ward 50 - Singanallur", link: "/municipalities/coimbatore" }, officials: wardOfficials("Singanallur", "coimbatore") },
      ]},
    ],
  },

  // ── Tier 3 Cities ──────────────────────────────────────────────

  dehradun: {
    id: "dehradun", cityId: "dehradun", name: "Dehradun Municipal Corporation (DMC)", type: "Municipal Corporation", tier: "Tier 3",
    mayor: { name: "Sunil Uniyal 'Gama'", designation: "Mayor of Dehradun", department: "DMC", link: "/municipalities/dehradun" },
    commissioner: { name: "Manuj Goyal", designation: "Municipal Commissioner", department: "DMC", link: "/municipalities/dehradun" },
    description: "Capital of Uttarakhand nestled in the Doon Valley. Known for its pleasant climate and institutions.",
    established: "1998", totalWards: 60, memberCount: 18000,
    departments: [
      { id: "dmc-swm", name: "Solid Waste Management", description: "Waste collection and disposal", head: { name: "R.S. Negi", designation: "Director, SWM", department: "SWM", link: "/municipalities/dehradun" }, functions: ["Waste collection", "Composting", "Street sweeping", "Drain cleaning", "Plastic ban enforcement"] },
      { id: "dmc-water", name: "Water Supply", description: "Water distribution from natural springs", head: { name: "P.K. Rawat", designation: "SE, Water", department: "Water", link: "/municipalities/dehradun" }, functions: ["Spring-fed water supply", "Pipeline network", "Borewell management", "Water quality testing", "New connections"] },
      { id: "dmc-roads", name: "Roads & Infrastructure", description: "Road maintenance and drainage", head: { name: "M.S. Bisht", designation: "City Engineer", department: "Engineering", link: "/municipalities/dehradun" }, functions: ["Road repair", "Drain construction", "Street lighting", "Landslide prevention", "Footpath development"] },
      { id: "dmc-health", name: "Public Health", description: "Health services", head: { name: "Dr. A.K. Gupta", designation: "Health Officer", department: "Health", link: "/municipalities/dehradun" }, functions: ["Dispensaries", "Vector control", "Food safety", "Birth/death registration", "Sanitation"] },
    ],
    zones: [
      { id: "dmc-zone1", name: "Zone 1 (Clock Tower)", population: 85000, zonalOfficer: { name: "Seema Rawat", designation: "Zonal Officer", department: "Zone 1", link: "/municipalities/dehradun" }, wards: [
        { id: "ddn-w1", name: "Clock Tower", number: 1, zone: "Zone 1", population: 15000, area: "1.2", councillor: { name: "Amit Negi", designation: "Ward Councillor", department: "Ward 1 - Clock Tower", link: "/municipalities/dehradun" }, officials: wardOfficials("Clock Tower", "dehradun") },
        { id: "ddn-w2", name: "Paltan Bazaar", number: 2, zone: "Zone 1", population: 18000, area: "1.5", councillor: { name: "Kavita Sharma", designation: "Ward Councillor", department: "Ward 2 - Paltan Bazaar", link: "/municipalities/dehradun" }, officials: wardOfficials("Paltan Bazaar", "dehradun") },
      ]},
      { id: "dmc-zone3", name: "Zone 3 (Rajpur Road)", population: 95000, zonalOfficer: { name: "D.S. Chauhan", designation: "Zonal Officer", department: "Zone 3", link: "/municipalities/dehradun" }, wards: [
        { id: "ddn-w20", name: "Rajpur Road", number: 20, zone: "Zone 3", population: 22000, area: "3.5", councillor: { name: "Rajesh Thapa", designation: "Ward Councillor", department: "Ward 20 - Rajpur Road", link: "/municipalities/dehradun" }, officials: wardOfficials("Rajpur Road", "dehradun") },
      ]},
    ],
  },

  udaipur: {
    id: "udaipur", cityId: "udaipur", name: "Udaipur Municipal Corporation (UMC)", type: "Municipal Corporation", tier: "Tier 3",
    mayor: { name: "Govind Singh Tanwar", designation: "Mayor of Udaipur", department: "UMC", link: "/municipalities/udaipur" },
    commissioner: { name: "Rahul Gupta", designation: "Municipal Commissioner", department: "UMC", link: "/municipalities/udaipur" },
    description: "City of Lakes. Rajasthan's jewel known for its palaces, lakes, and cultural heritage.",
    established: "1969", totalWards: 55, memberCount: 15000,
    departments: [
      { id: "umc-swm", name: "Solid Waste Management", description: "Waste collection and Swachh Bharat", head: { name: "L.K. Vyas", designation: "Director, SWM", department: "SWM", link: "/municipalities/udaipur" }, functions: ["Waste collection", "Processing plant", "Street sweeping", "Lake area cleanup", "Tourist zone sanitation"] },
      { id: "umc-water", name: "Water Supply", description: "Lake-based water supply system", head: { name: "R.S. Chundawat", designation: "SE, Water", department: "Water", link: "/municipalities/udaipur" }, functions: ["Lake water treatment", "Pipeline network", "Rainwater harvesting", "Water conservation", "New connections"] },
      { id: "umc-roads", name: "Roads & Engineering", description: "Road network and infrastructure", head: { name: "M.L. Joshi", designation: "City Engineer", department: "Engineering", link: "/municipalities/udaipur" }, functions: ["Road construction", "Heritage area maintenance", "Street lighting", "Drain infrastructure", "Smart city projects"] },
      { id: "umc-heritage", name: "Heritage & Tourism", description: "Heritage conservation and tourism infrastructure", head: { name: "V.K. Purohit", designation: "Heritage Officer", department: "Heritage", link: "/municipalities/udaipur" }, functions: ["Heritage building conservation", "Lake beautification", "Tourist walkways", "Lighting of monuments", "Heritage zone management"] },
    ],
    zones: [
      { id: "umc-zone1", name: "Zone 1 (City Palace)", population: 65000, zonalOfficer: { name: "K.L. Mewar", designation: "Zonal Officer", department: "Zone 1", link: "/municipalities/udaipur" }, wards: [
        { id: "udr-w1", name: "City Palace Area", number: 1, zone: "Zone 1", population: 12000, area: "1.0", councillor: { name: "Mahendra Singh", designation: "Ward Councillor", department: "Ward 1 - City Palace", link: "/municipalities/udaipur" }, officials: wardOfficials("City Palace Area", "udaipur") },
        { id: "udr-w2", name: "Hathi Pol", number: 2, zone: "Zone 1", population: 15000, area: "1.2", councillor: { name: "Laxmi Devi", designation: "Ward Councillor", department: "Ward 2 - Hathi Pol", link: "/municipalities/udaipur" }, officials: wardOfficials("Hathi Pol", "udaipur") },
      ]},
      { id: "umc-zone3", name: "Zone 3 (Fatehsagar)", population: 80000, zonalOfficer: { name: "S.S. Rajpurohit", designation: "Zonal Officer", department: "Zone 3", link: "/municipalities/udaipur" }, wards: [
        { id: "udr-w20", name: "Fatehsagar", number: 20, zone: "Zone 3", population: 18000, area: "2.5", councillor: { name: "Prakash Agarwal", designation: "Ward Councillor", department: "Ward 20 - Fatehsagar", link: "/municipalities/udaipur" }, officials: wardOfficials("Fatehsagar", "udaipur") },
      ]},
    ],
  },

  mysore: {
    id: "mysore", cityId: "mysore", name: "Mysuru City Corporation (MCC)", type: "Municipal Corporation", tier: "Tier 3",
    mayor: { name: "Shivakumar", designation: "Mayor of Mysuru", department: "MCC", link: "/municipalities/mysore" },
    commissioner: { name: "G. Lakshmikantha Reddy", designation: "Commissioner, MCC", department: "MCC", link: "/municipalities/mysore" },
    description: "City of Palaces. Cultural capital of Karnataka famous for Dasara festival and heritage.",
    established: "1977", totalWards: 65, memberCount: 20000,
    departments: [
      { id: "mcc-swm", name: "Solid Waste Management", description: "Waste management and cleanliness", head: { name: "H.V. Rajeev", designation: "Health Officer", department: "SWM", link: "/municipalities/mysore" }, functions: ["Waste collection", "Decentralized composting", "Street sweeping", "Market cleaning", "Tourist area sanitation"] },
      { id: "mcc-water", name: "Water Supply", description: "Cauvery-based water supply", head: { name: "K. Nagendra", designation: "SE, Water", department: "Water", link: "/municipalities/mysore" }, functions: ["Cauvery water supply", "Pipeline extension", "24x7 water supply pilot", "Water quality", "New connections"] },
      { id: "mcc-roads", name: "Engineering", description: "Roads, drains, infrastructure", head: { name: "M.N. Shashidhara", designation: "City Engineer", department: "Engineering", link: "/municipalities/mysore" }, functions: ["Road asphalting", "Drain infrastructure", "Street lighting", "Smart city projects", "Heritage area upkeep"] },
      { id: "mcc-heritage", name: "Heritage & Culture", description: "Palace conservation, Dasara management, heritage sites", head: { name: "T.S. Srivatsa", designation: "Heritage Officer", department: "Heritage", link: "/municipalities/mysore" }, functions: ["Palace area maintenance", "Dasara infrastructure", "Heritage building conservation", "Tourist signage", "Cultural event management"] },
    ],
    zones: [
      { id: "mcc-zone1", name: "Zone 1 (Palace Area)", population: 75000, zonalOfficer: { name: "Basavaraju", designation: "Zonal Commissioner", department: "Zone 1", link: "/municipalities/mysore" }, wards: [
        { id: "mys-w1", name: "Devaraja Mohalla", number: 1, zone: "Zone 1", population: 18000, area: "1.5", councillor: { name: "Sunanda", designation: "Ward Councillor", department: "Ward 1 - Devaraja Mohalla", link: "/municipalities/mysore" }, officials: wardOfficials("Devaraja Mohalla", "mysore") },
        { id: "mys-w2", name: "Sayyaji Rao Road", number: 2, zone: "Zone 1", population: 15000, area: "1.2", councillor: { name: "Harish Gowda", designation: "Ward Councillor", department: "Ward 2 - Sayyaji Rao Road", link: "/municipalities/mysore" }, officials: wardOfficials("Sayyaji Rao Road", "mysore") },
      ]},
      { id: "mcc-zone5", name: "Zone 5 (Vijayanagar)", population: 95000, zonalOfficer: { name: "H.P. Manjunath", designation: "Zonal Commissioner", department: "Zone 5", link: "/municipalities/mysore" }, wards: [
        { id: "mys-w30", name: "Vijayanagar", number: 30, zone: "Zone 5", population: 25000, area: "3.0", councillor: { name: "Lakshminarayan", designation: "Ward Councillor", department: "Ward 30 - Vijayanagar", link: "/municipalities/mysore" }, officials: wardOfficials("Vijayanagar", "mysore") },
      ]},
    ],
  },

  varanasi: {
    id: "varanasi", cityId: "varanasi", name: "Varanasi Nagar Nigam (VNN)", type: "Municipal Corporation", tier: "Tier 3",
    mayor: { name: "Ashok Tiwari", designation: "Mayor of Varanasi", department: "VNN", link: "/municipalities/varanasi" },
    commissioner: { name: "Gaurang Rathi", designation: "Municipal Commissioner, IAS", department: "VNN", link: "/municipalities/varanasi" },
    description: "Spiritual capital of India. One of the oldest living cities, on the banks of the Ganges.",
    established: "1959", totalWards: 90, memberCount: 22000,
    departments: [
      { id: "vnn-swm", name: "Solid Waste Management", description: "Waste management under Swachh Kashi", head: { name: "A.K. Pandey", designation: "Director, SWM", department: "SWM", link: "/municipalities/varanasi" }, functions: ["Ghat cleaning", "Waste collection", "Composting", "Street sweeping", "Festival waste management"] },
      { id: "vnn-water", name: "Water & Sewerage", description: "Ganga-fed water supply and sewage treatment", head: { name: "R.P. Tiwari", designation: "SE, Water", department: "Water Supply", link: "/municipalities/varanasi" }, functions: ["Water supply", "Sewage treatment plants", "Ganga rejuvenation support", "Pipeline repair", "Water quality"] },
      { id: "vnn-roads", name: "Roads & Infrastructure", description: "Road and infrastructure in heritage city", head: { name: "S.N. Singh", designation: "City Engineer", department: "Engineering", link: "/municipalities/varanasi" }, functions: ["Road construction", "Ghat stairway repair", "Street lighting", "Drain construction", "Heritage area infrastructure"] },
      { id: "vnn-heritage", name: "Heritage & Ghat Management", description: "Ghat conservation, heritage sites, spiritual tourism", head: { name: "V.K. Mishra", designation: "Heritage Officer", department: "Heritage", link: "/municipalities/varanasi" }, functions: ["84 Ghat maintenance", "Heritage zone conservation", "Cremation ghat management", "Tourist infrastructure", "Dev Deepawali event management"] },
    ],
    zones: [
      { id: "vnn-zone1", name: "Zone 1 (Dashashwamedh)", population: 120000, zonalOfficer: { name: "R.K. Dubey", designation: "Zonal Officer", department: "Zone 1", link: "/municipalities/varanasi" }, wards: [
        { id: "vrn-w1", name: "Dashashwamedh", number: 1, zone: "Zone 1", population: 18000, area: "1.0", councillor: { name: "Poonam Jaiswal", designation: "Ward Councillor", department: "Ward 1 - Dashashwamedh", link: "/municipalities/varanasi" }, officials: wardOfficials("Dashashwamedh", "varanasi") },
        { id: "vrn-w2", name: "Vishwanath Gali", number: 2, zone: "Zone 1", population: 15000, area: "0.8", councillor: { name: "Ramji Pandey", designation: "Ward Councillor", department: "Ward 2 - Vishwanath Gali", link: "/municipalities/varanasi" }, officials: wardOfficials("Vishwanath Gali", "varanasi") },
      ]},
      { id: "vnn-zone5", name: "Zone 5 (Lanka)", population: 150000, zonalOfficer: { name: "S.P. Yadav", designation: "Zonal Officer", department: "Zone 5", link: "/municipalities/varanasi" }, wards: [
        { id: "vrn-w40", name: "Lanka (BHU)", number: 40, zone: "Zone 5", population: 35000, area: "3.5", councillor: { name: "Sanjay Sonkar", designation: "Ward Councillor", department: "Ward 40 - Lanka", link: "/municipalities/varanasi" }, officials: wardOfficials("Lanka", "varanasi") },
      ]},
    ],
  },
};
