import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Building2, MessageSquare, Radio, Bell, ChevronDown } from "lucide-react";
import { JoinGroupButton } from "@/components/JoinGroupButton";
import { MinistryCard } from "@/components/MinistryCard";
import { DiscussionPost } from "@/components/DiscussionPost";
import { TagBadge, type TagVariant } from "@/components/TagBadge";
import { OfficialsList } from "@/components/OfficialsList";
import { cityOfficials } from "@/data/officials";
import { motion } from "framer-motion";
import { useState } from "react";
import { getRallyCalendarUrl } from "@/services/rallyService";

const cityDatabase: Record<string, { name: string; state: string; description: string; memberCount: number; ministries: { id: string; name: string; memberCount: number; latestUpdate?: string }[] }> = {
  delhi: {
    name: "New Delhi", state: "Delhi (NCT)", description: "Capital territory of India. Hub of national politics and governance.", memberCount: 245000,
    ministries: [
      { id: "delhi-education", name: "Dept. of Education", memberCount: 34200, latestUpdate: "New school infrastructure upgrades announced" },
      { id: "delhi-health", name: "Dept. of Health & Family Welfare", memberCount: 28900, latestUpdate: "Free health check-up camps in 50 locations" },
      { id: "delhi-transport", name: "Dept. of Transport", memberCount: 22100, latestUpdate: "Electric bus fleet expansion by 2026" },
      { id: "delhi-pwd", name: "Public Works Department", memberCount: 15600 },
      { id: "delhi-water", name: "Delhi Jal Board", memberCount: 19800, latestUpdate: "24x7 water supply pilot in 3 zones" },
      { id: "delhi-revenue", name: "Dept. of Revenue", memberCount: 12300 },
    ],
  },
  mumbai: {
    name: "Mumbai", state: "Maharashtra", description: "Financial capital of India. Home to Bollywood, BSE, and diverse communities.", memberCount: 198000,
    ministries: [
      { id: "mh-urban", name: "Urban Development Dept.", memberCount: 28900, latestUpdate: "Mumbai Metro Phase 3 progress update" },
      { id: "mh-housing", name: "Housing Department", memberCount: 24500, latestUpdate: "Affordable housing scheme applications open" },
      { id: "mh-health", name: "Public Health Dept.", memberCount: 31200, latestUpdate: "Monsoon disease prevention advisory issued" },
      { id: "mh-education", name: "School Education Dept.", memberCount: 26700 },
      { id: "mh-transport", name: "Transport Dept.", memberCount: 18900 },
    ],
  },
  bangalore: {
    name: "Bangalore", state: "Karnataka", description: "India's Silicon Valley. Leading IT hub and startup ecosystem center.", memberCount: 167000,
    ministries: [
      { id: "ka-it", name: "IT & BT Department", memberCount: 42100, latestUpdate: "New startup incubation policy released" },
      { id: "ka-urban", name: "Urban Development Dept.", memberCount: 23400, latestUpdate: "Namma Metro Yellow Line progress" },
      { id: "ka-education", name: "Dept. of Public Instruction", memberCount: 19800 },
      { id: "ka-health", name: "Health & Family Welfare Dept.", memberCount: 21500, latestUpdate: "Free diagnostic centers in 8 taluks" },
      { id: "ka-revenue", name: "Revenue Department", memberCount: 14200 },
    ],
  },
  chennai: {
    name: "Chennai", state: "Tamil Nadu", description: "Cultural capital of South India. Major automobile and IT hub.", memberCount: 112000,
    ministries: [
      { id: "tn-education", name: "School Education Dept.", memberCount: 31700, latestUpdate: "Tamil medium digital content launched" },
      { id: "tn-health", name: "Health & Family Welfare Dept.", memberCount: 27800, latestUpdate: "108 ambulance fleet expanded" },
      { id: "tn-highways", name: "Highways & Minor Ports Dept.", memberCount: 15400 },
      { id: "tn-it", name: "IT Department", memberCount: 18900, latestUpdate: "TN Tech City Phase 2 announced" },
    ],
  },
  kolkata: {
    name: "Kolkata", state: "West Bengal", description: "City of Joy. Cultural and intellectual capital of eastern India.", memberCount: 95000,
    ministries: [
      { id: "wb-education", name: "Dept. of School Education", memberCount: 22300 },
      { id: "wb-health", name: "Dept. of Health & Family Welfare", memberCount: 19500, latestUpdate: "Swasthya Sathi coverage expanded" },
      { id: "wb-urban", name: "Urban Development Dept.", memberCount: 16800 },
      { id: "wb-transport", name: "Transport Department", memberCount: 12100, latestUpdate: "Kolkata Metro East-West corridor update" },
    ],
  },
  hyderabad: {
    name: "Hyderabad", state: "Telangana", description: "City of pearls and biryani. Major IT and pharmaceutical hub.", memberCount: 134000,
    ministries: [
      { id: "ts-it", name: "IT, Electronics & Communications Dept.", memberCount: 35600, latestUpdate: "New IT tower inaugurated in Kokapet" },
      { id: "ts-health", name: "Health, Medical & Family Welfare", memberCount: 21200 },
      { id: "ts-irrigation", name: "Irrigation Department", memberCount: 18400, latestUpdate: "Kaleshwaram project status report" },
      { id: "ts-education", name: "School Education Dept.", memberCount: 17800 },
    ],
  },
  pune: {
    name: "Pune", state: "Maharashtra", description: "Oxford of the East. Education hub with a thriving IT industry.", memberCount: 89000,
    ministries: [
      { id: "mh-pune-urban", name: "Urban Development Dept.", memberCount: 15600, latestUpdate: "Pune Metro Phase 1 operations begin" },
      { id: "mh-pune-education", name: "Higher & Technical Education", memberCount: 21300 },
      { id: "mh-pune-env", name: "Environment & Climate Change Dept.", memberCount: 8900 },
    ],
  },
  ahmedabad: {
    name: "Ahmedabad", state: "Gujarat", description: "Heritage city and economic capital of Gujarat. UNESCO World Heritage site.", memberCount: 76000,
    ministries: [
      { id: "gj-urban", name: "Urban Development Dept.", memberCount: 14500, latestUpdate: "Smart city projects Phase 3 underway" },
      { id: "gj-education", name: "Education Department", memberCount: 18200 },
      { id: "gj-health", name: "Health & Family Welfare Dept.", memberCount: 12800 },
    ],
  },
  jaipur: {
    name: "Jaipur", state: "Rajasthan", description: "Pink City. Capital of Rajasthan known for its rich heritage and tourism.", memberCount: 65000,
    ministries: [
      { id: "rj-tourism", name: "Dept. of Tourism", memberCount: 11200, latestUpdate: "Heritage walk circuits expanded to 12 routes" },
      { id: "rj-education", name: "School Education Dept.", memberCount: 15600 },
      { id: "rj-health", name: "Medical & Health Dept.", memberCount: 13400, latestUpdate: "Mobile health units deployed in rural areas" },
      { id: "rj-urban", name: "Urban Development & Housing Dept.", memberCount: 9800 },
    ],
  },
};

// City-wide discussions aggregated across ministries
interface CityDiscussion {
  author: string;
  tag: TagVariant;
  content: string;
  likes: number;
  replies: number;
  time: string;
  ministry: string;
  ministryId: string;
}

const cityDiscussions: Record<string, CityDiscussion[]> = {
  delhi: [
    { author: "Rekha M.", tag: "appreciation", content: "My child's government school in Dwarka now has smart boards and AC classrooms. Incredible transformation!", likes: 389, replies: 24, time: "1h ago", ministry: "Dept. of Education", ministryId: "delhi-education" },
    { author: "Arun K.", tag: "appreciation", content: "Mohalla Clinic near Sarojini Nagar is amazing. Got blood tests done in 20 minutes, completely free!", likes: 312, replies: 28, time: "1h ago", ministry: "Dept. of Health", ministryId: "delhi-health" },
    { author: "Manish A.", tag: "update", content: "New electric buses on Route 604 are so smooth and quiet. AC works perfectly even in summer!", likes: 234, replies: 16, time: "2h ago", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
    { author: "Suresh K.", tag: "announcement", content: "EWS admission results for 2025-26 are out on edudel.nic.in. Check your application status now.", likes: 234, replies: 45, time: "2h ago", ministry: "Dept. of Education", ministryId: "delhi-education" },
    { author: "Pooja S.", tag: "complaint", content: "Guest teachers haven't been regularized despite Supreme Court orders. When will Delhi Govt act?", likes: 178, replies: 31, time: "4h ago", ministry: "Dept. of Education", ministryId: "delhi-education" },
    { author: "Neha T.", tag: "complaint", content: "Water supply in East Delhi is irregular. Contaminated water is causing health issues in our area.", likes: 267, replies: 38, time: "4h ago", ministry: "Delhi Jal Board", ministryId: "delhi-water" },
    { author: "Aamir H.", tag: "suggestion", content: "Include coding and AI basics from class 6 itself. Other states are already doing this.", likes: 267, replies: 19, time: "6h ago", ministry: "Dept. of Education", ministryId: "delhi-education" },
    { author: "Sanjay M.", tag: "suggestion", content: "DTC app should show real-time bus locations. Currently the ETA feature is completely unreliable.", likes: 203, replies: 19, time: "5h ago", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
    { author: "Rakesh B.", tag: "question", content: "Our area in Shahdara gets water only for 1 hour daily. Pipeline upgrade was promised 2 years ago.", likes: 234, replies: 42, time: "5h ago", ministry: "Delhi Jal Board", ministryId: "delhi-water" },
    { author: "Nisha R.", tag: "discussion", content: "Should Delhi prioritize expanding the metro or improving bus connectivity? Both need investment.", likes: 345, replies: 67, time: "3h ago", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
  ],
  mumbai: [
    { author: "Pooja D.", tag: "appreciation", content: "Mumbai Metro Line 3 trial run was fantastic! This will change how millions commute daily.", likes: 456, replies: 34, time: "1h ago", ministry: "Urban Development", ministryId: "mh-urban" },
    { author: "Amit S.", tag: "announcement", content: "PMAY-Urban applications for MMR region reopened. 12,000 units available in Thane and Navi Mumbai.", likes: 389, replies: 56, time: "1h ago", ministry: "Housing Dept.", ministryId: "mh-housing" },
    { author: "Dr. Patil", tag: "update", content: "Mahatma Phule Jan Arogya now covers 50 new procedures including advanced cardiac surgeries.", likes: 234, replies: 18, time: "2h ago", ministry: "Public Health", ministryId: "mh-health" },
    { author: "Rajesh P.", tag: "complaint", content: "Coastal road project causing massive waterlogging in Worli. Drainage planning was clearly inadequate.", likes: 289, replies: 45, time: "6h ago", ministry: "Urban Development", ministryId: "mh-urban" },
    { author: "Kavita N.", tag: "suggestion", content: "Rural PHCs need 24/7 emergency services. Many deaths occur during night emergencies in villages.", likes: 345, replies: 28, time: "5h ago", ministry: "Public Health", ministryId: "mh-health" },
    { author: "Rashmi V.", tag: "question", content: "What's the income limit for EWS category under PMAY? The website shows conflicting information.", likes: 123, replies: 14, time: "6h ago", ministry: "Housing Dept.", ministryId: "mh-housing" },
    { author: "Siddharth J.", tag: "discussion", content: "Mumbai needs a unified transport authority. Metro, local trains, BEST buses all run independently.", likes: 278, replies: 52, time: "4h ago", ministry: "Transport Dept.", ministryId: "mh-transport" },
  ],
  bangalore: [
    { author: "Deepak R.", tag: "appreciation", content: "The new startup policy is exactly what Bangalore needed. Tax holidays will attract global companies.", likes: 378, replies: 26, time: "1h ago", ministry: "IT & BT Dept.", ministryId: "ka-it" },
    { author: "Sneha P.", tag: "update", content: "Karnataka Innovation Authority has approved 200 startups for seed funding under ELEVATE 2025.", likes: 234, replies: 19, time: "3h ago", ministry: "IT & BT Dept.", ministryId: "ka-it" },
    { author: "Lakshmi V.", tag: "complaint", content: "BBMP garbage collection in Whitefield is inconsistent. Bins overflow for days sometimes.", likes: 189, replies: 27, time: "3h ago", ministry: "Urban Development", ministryId: "ka-urban" },
    { author: "Ravi M.", tag: "discussion", content: "Should Karnataka invest in quantum computing infrastructure? China and US are way ahead of us.", likes: 145, replies: 42, time: "6h ago", ministry: "IT & BT Dept.", ministryId: "ka-it" },
    { author: "Karthik S.", tag: "question", content: "When will the Peripheral Ring Road project actually start? It's been delayed for over 5 years.", likes: 98, replies: 23, time: "8h ago", ministry: "Urban Development", ministryId: "ka-urban" },
    { author: "Meena T.", tag: "announcement", content: "BBMP property tax discount of 5% for early payment extended until March 31, 2025.", likes: 267, replies: 12, time: "1d ago", ministry: "Revenue Dept.", ministryId: "ka-revenue" },
  ],
  chennai: [
    { author: "Selvi R.", tag: "appreciation", content: "Naan Mudhalvan program got my son a job at TCS right after college. Thank you Tamil Nadu!", likes: 345, replies: 28, time: "2h ago", ministry: "School Education", ministryId: "tn-education" },
    { author: "Dr. Lakshmi", tag: "update", content: "New 108 ambulances equipped with ventilators deployed in 5 southern districts.", likes: 234, replies: 16, time: "3h ago", ministry: "Health Dept.", ministryId: "tn-health" },
    { author: "Kumar A.", tag: "announcement", content: "Class 10 public exam hall tickets available for download on dge.tn.gov.in from today.", likes: 189, replies: 15, time: "4h ago", ministry: "School Education", ministryId: "tn-education" },
    { author: "Priya N.", tag: "discussion", content: "Should Tamil Nadu follow NEET for medical admissions or push for state-level exams?", likes: 456, replies: 89, time: "6h ago", ministry: "School Education", ministryId: "tn-education" },
    { author: "Rajan P.", tag: "suggestion", content: "Chennai needs dedicated cycling lanes on major roads. Many cities globally have adopted this.", likes: 178, replies: 22, time: "5h ago", ministry: "Highways Dept.", ministryId: "tn-highways" },
  ],
  kolkata: [
    { author: "Sourav D.", tag: "appreciation", content: "Swasthya Sathi health insurance saved us ₹2 lakh on my mother's surgery. Great initiative!", likes: 312, replies: 24, time: "2h ago", ministry: "Health Dept.", ministryId: "wb-health" },
    { author: "Ananya B.", tag: "update", content: "Kolkata Metro East-West corridor Howrah station nearing completion. Expected launch in Q3 2025.", likes: 189, replies: 18, time: "3h ago", ministry: "Transport Dept.", ministryId: "wb-transport" },
    { author: "Ritika S.", tag: "complaint", content: "Waterlogging in Salt Lake after every rain. Drainage infrastructure needs urgent attention.", likes: 234, replies: 35, time: "5h ago", ministry: "Urban Development", ministryId: "wb-urban" },
    { author: "Prof. Das", tag: "question", content: "Will the new education policy affect Madhyamik exam pattern from 2026?", likes: 67, replies: 12, time: "6h ago", ministry: "School Education", ministryId: "wb-education" },
  ],
  hyderabad: [
    { author: "Srinivas R.", tag: "appreciation", content: "New IT Tower in Kokapet is world-class. Hyderabad is truly becoming a global tech hub.", likes: 345, replies: 22, time: "1h ago", ministry: "IT Dept.", ministryId: "ts-it" },
    { author: "Pradeep K.", tag: "update", content: "Kaleshwaram project has irrigated 18 lakh acres this season. Farmers seeing 40% yield increase.", likes: 278, replies: 28, time: "3h ago", ministry: "Irrigation Dept.", ministryId: "ts-irrigation" },
    { author: "Meera N.", tag: "complaint", content: "Traffic congestion on ORR is unbearable during peak hours. Need better public transport options.", likes: 189, replies: 34, time: "5h ago", ministry: "IT Dept.", ministryId: "ts-it" },
    { author: "Aditya V.", tag: "suggestion", content: "Hyderabad should build a dedicated pharma innovation hub like T-Hub for startups.", likes: 156, replies: 19, time: "6h ago", ministry: "IT Dept.", ministryId: "ts-it" },
  ],
  pune: [
    { author: "Snehal M.", tag: "appreciation", content: "Pune Metro Phase 1 has reduced my commute from 90 minutes to 30. Life-changing!", likes: 289, replies: 18, time: "2h ago", ministry: "Urban Development", ministryId: "mh-pune-urban" },
    { author: "Dr. Joshi", tag: "update", content: "Savitribai Phule University introduces 5 new interdisciplinary courses for 2025-26.", likes: 145, replies: 12, time: "4h ago", ministry: "Higher Education", ministryId: "mh-pune-education" },
    { author: "Vikram T.", tag: "complaint", content: "Pune's air quality is deteriorating rapidly. Construction dust and traffic fumes are major concerns.", likes: 234, replies: 29, time: "5h ago", ministry: "Environment Dept.", ministryId: "mh-pune-env" },
  ],
  ahmedabad: [
    { author: "Hardik P.", tag: "appreciation", content: "Smart city initiative has transformed the riverfront area. Beautiful walking paths and greenery!", likes: 234, replies: 16, time: "2h ago", ministry: "Urban Development", ministryId: "gj-urban" },
    { author: "Priti S.", tag: "question", content: "When will the Ahmedabad Metro Phase 2 construction start? Apparel Park area desperately needs it.", likes: 89, replies: 14, time: "5h ago", ministry: "Urban Development", ministryId: "gj-urban" },
    { author: "Jayesh K.", tag: "update", content: "New mid-day meal kitchen opened serving 50,000 students daily with improved nutrition.", likes: 178, replies: 11, time: "4h ago", ministry: "Education Dept.", ministryId: "gj-education" },
  ],
  jaipur: [
    { author: "Aakash R.", tag: "appreciation", content: "Night tourism circuit in Jaipur is magical. Amer Fort lit up at night is unforgettable!", likes: 312, replies: 22, time: "1h ago", ministry: "Tourism Dept.", ministryId: "rj-tourism" },
    { author: "Dr. Sharma", tag: "update", content: "Mobile health units now covering 200 villages in Jaipur district. Monthly check-ups for 50,000.", likes: 189, replies: 14, time: "3h ago", ministry: "Medical & Health", ministryId: "rj-health" },
    { author: "Kavita J.", tag: "suggestion", content: "Jaipur needs a heritage conservation fund. Many havelis in the walled city are crumbling.", likes: 267, replies: 31, time: "5h ago", ministry: "Tourism Dept.", ministryId: "rj-tourism" },
    { author: "Sunil M.", tag: "complaint", content: "Drinking water quality in old city areas is poor. Regular testing reports should be made public.", likes: 178, replies: 24, time: "6h ago", ministry: "Urban Development", ministryId: "rj-urban" },
  ],
};

// Live Q&A sessions per city
interface QASession {
  title: string;
  official: string;
  ministry: string;
  status: "live" | "upcoming" | "ended";
  participants: number;
  time: string;
}

const cityQASessions: Record<string, QASession[]> = {
  delhi: [
    { title: "Ask the Education Secretary", official: "Dr. Ashok Kumar, IAS", ministry: "Dept. of Education", status: "live", participants: 1240, time: "Started 45 min ago" },
    { title: "Delhi Water Supply Town Hall", official: "CEO, Delhi Jal Board", ministry: "Delhi Jal Board", status: "upcoming", participants: 0, time: "Today, 4:00 PM" },
    { title: "Metro Phase 4 Public Consultation", official: "MD, DMRC", ministry: "Dept. of Transport", status: "upcoming", participants: 0, time: "Tomorrow, 11:00 AM" },
  ],
  mumbai: [
    { title: "Mumbai Metro Update - Live Q&A", official: "MMRDA Commissioner", ministry: "Urban Development", status: "live", participants: 890, time: "Started 30 min ago" },
    { title: "Monsoon Preparedness Discussion", official: "BMC Commissioner", ministry: "Urban Development", status: "upcoming", participants: 0, time: "Today, 5:00 PM" },
  ],
  bangalore: [
    { title: "Startup Ecosystem Town Hall", official: "IT Secretary, Karnataka", ministry: "IT & BT Dept.", status: "live", participants: 2100, time: "Started 1h ago" },
    { title: "BBMP Ward Development Q&A", official: "BBMP Chief Commissioner", ministry: "Urban Development", status: "upcoming", participants: 0, time: "Tomorrow, 10:00 AM" },
  ],
  chennai: [
    { title: "Education Policy Open Forum", official: "School Education Secretary", ministry: "School Education", status: "upcoming", participants: 0, time: "Today, 3:00 PM" },
    { title: "Healthcare Access Discussion", official: "Health Secretary, TN", ministry: "Health Dept.", status: "upcoming", participants: 0, time: "Feb 25, 11:00 AM" },
  ],
  kolkata: [
    { title: "Metro Expansion Public Meeting", official: "GM, Kolkata Metro", ministry: "Transport Dept.", status: "upcoming", participants: 0, time: "Today, 4:30 PM" },
  ],
  hyderabad: [
    { title: "IT Corridor Development Q&A", official: "IT Secretary, Telangana", ministry: "IT Dept.", status: "live", participants: 1560, time: "Started 20 min ago" },
  ],
  pune: [
    { title: "Pune Metro Feedback Session", official: "PMC Commissioner", ministry: "Urban Development", status: "upcoming", participants: 0, time: "Feb 24, 2:00 PM" },
  ],
  ahmedabad: [
    { title: "Smart City Progress Review", official: "AMC Commissioner", ministry: "Urban Development", status: "upcoming", participants: 0, time: "Feb 25, 3:00 PM" },
  ],
  jaipur: [
    { title: "Heritage Tourism Strategy", official: "Tourism Secretary, RJ", ministry: "Tourism Dept.", status: "upcoming", participants: 0, time: "Today, 5:00 PM" },
  ],
};

// City-level announcements aggregated from ministries
interface CityAnnouncement {
  title: string;
  date: string;
  summary: string;
  tag: "update" | "announcement";
  ministry: string;
  ministryId: string;
}

const cityAnnouncements: Record<string, CityAnnouncement[]> = {
  delhi: [
    { title: "Delhi Schools Infrastructure Upgrade", date: "Feb 20, 2025", summary: "₹2,500 crore allocated for rebuilding 250 government school buildings.", tag: "announcement", ministry: "Dept. of Education", ministryId: "delhi-education" },
    { title: "50 New Mohalla Clinics Inaugurated", date: "Feb 19, 2025", summary: "Total reaches 550 clinics providing free primary healthcare across all districts.", tag: "announcement", ministry: "Dept. of Health", ministryId: "delhi-health" },
    { title: "500 Electric Buses Flagged Off", date: "Feb 18, 2025", summary: "DTC's electric fleet now covers 45 routes across South and East Delhi.", tag: "announcement", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
    { title: "24x7 Water Supply Pilot Results", date: "Feb 17, 2025", summary: "3 pilot zones in Malviya Nagar now receiving continuous water supply.", tag: "update", ministry: "Delhi Jal Board", ministryId: "delhi-water" },
    { title: "Online Admission Portal Live", date: "Feb 16, 2025", summary: "EWS/DG category admission portal for 2025-26 is now accepting applications.", tag: "update", ministry: "Dept. of Education", ministryId: "delhi-education" },
    { title: "Road Resurfacing Drive Complete", date: "Feb 15, 2025", summary: "450 km of roads resurfaced across Delhi before monsoon season.", tag: "update", ministry: "Public Works Dept.", ministryId: "delhi-pwd" },
  ],
  mumbai: [
    { title: "Mumbai Metro Line 3 Trial Run", date: "Feb 19, 2025", summary: "Colaba-Bandra-SEEPZ underground corridor begins passenger trial runs.", tag: "announcement", ministry: "Urban Development", ministryId: "mh-urban" },
    { title: "PMAY Applications Reopened", date: "Feb 18, 2025", summary: "12,000 new affordable housing units in MMR region open for application.", tag: "announcement", ministry: "Housing Dept.", ministryId: "mh-housing" },
    { title: "Mahatma Phule Jan Arogya Update", date: "Feb 16, 2025", summary: "Insurance coverage expanded to include 50 new surgical procedures.", tag: "update", ministry: "Public Health", ministryId: "mh-health" },
    { title: "Smart City Dashboard Live", date: "Feb 14, 2025", summary: "Real-time civic data for 10 cities now available on Maharashtra Smart City portal.", tag: "update", ministry: "Urban Development", ministryId: "mh-urban" },
    { title: "MSRTC Electric Bus Routes", date: "Feb 13, 2025", summary: "Electric bus service launched on Mumbai-Pune and Mumbai-Nashik expressways.", tag: "announcement", ministry: "Transport Dept.", ministryId: "mh-transport" },
  ],
  bangalore: [
    { title: "Karnataka Startup Policy 2025", date: "Feb 18, 2025", summary: "₹500 Cr fund for deep-tech, AI, and green energy startups with 5-year tax holidays.", tag: "announcement", ministry: "IT & BT Dept.", ministryId: "ka-it" },
    { title: "Namma Metro Yellow Line Progress", date: "Feb 17, 2025", summary: "RV Road to Bommasandra stretch testing complete, opens next month.", tag: "update", ministry: "Urban Development", ministryId: "ka-urban" },
    { title: "Free Diagnostic Centers in 8 Taluks", date: "Feb 14, 2025", summary: "CT scan, MRI, and blood testing available free at taluk-level hospitals.", tag: "announcement", ministry: "Health Dept.", ministryId: "ka-health" },
    { title: "BeyondBangalore IT Parks", date: "Feb 12, 2025", summary: "New IT parks in Mysuru and Hubli operational with 2,000 seats occupied.", tag: "update", ministry: "IT & BT Dept.", ministryId: "ka-it" },
  ],
  chennai: [
    { title: "Tamil Medium Digital Content Live", date: "Feb 17, 2025", summary: "Interactive e-learning platform with 8,000 lessons for classes 6-12.", tag: "announcement", ministry: "School Education", ministryId: "tn-education" },
    { title: "108 Ambulance Fleet Expanded", date: "Feb 15, 2025", summary: "200 new GPS-tracked ambulances deployed, reducing rural response time to 15 min.", tag: "update", ministry: "Health Dept.", ministryId: "tn-health" },
    { title: "Chennai-Salem Expressway Update", date: "Feb 14, 2025", summary: "Phase 1 land acquisition complete. Construction begins in Q2 2025.", tag: "update", ministry: "Highways Dept.", ministryId: "tn-highways" },
  ],
  kolkata: [
    { title: "Kanyashree Prakalpa Update", date: "Feb 16, 2025", summary: "Girl student scholarship program crossed 1 crore beneficiaries.", tag: "update", ministry: "School Education", ministryId: "wb-education" },
    { title: "Swasthya Sathi Coverage Expanded", date: "Feb 14, 2025", summary: "Health insurance now covers all residents with ₹5 lakh annual coverage.", tag: "announcement", ministry: "Health Dept.", ministryId: "wb-health" },
    { title: "Kolkata Metro East-West Update", date: "Feb 11, 2025", summary: "Howrah-Sector V stretch enters final testing phase.", tag: "update", ministry: "Transport Dept.", ministryId: "wb-transport" },
  ],
  hyderabad: [
    { title: "IT Tower Inaugurated in Kokapet", date: "Feb 15, 2025", summary: "50-storey tech hub with capacity for 20,000 professionals operational.", tag: "announcement", ministry: "IT Dept.", ministryId: "ts-it" },
    { title: "Kaleshwaram Project Status", date: "Feb 12, 2025", summary: "Water lifted to 45 TMC this season, irrigating 18 lakh acres across 13 districts.", tag: "update", ministry: "Irrigation Dept.", ministryId: "ts-irrigation" },
  ],
  pune: [
    { title: "Pune Metro Phase 1 Operational", date: "Feb 15, 2025", summary: "PCMC to Swargate corridor fully operational with 12-minute headways.", tag: "announcement", ministry: "Urban Development", ministryId: "mh-pune-urban" },
    { title: "5 New Interdisciplinary Courses", date: "Feb 12, 2025", summary: "Savitribai Phule University introduces AI, biotech, and data science programs.", tag: "update", ministry: "Higher Education", ministryId: "mh-pune-education" },
  ],
  ahmedabad: [
    { title: "Smart City Phase 3 Underway", date: "Feb 14, 2025", summary: "Riverfront development and smart traffic management systems being deployed.", tag: "update", ministry: "Urban Development", ministryId: "gj-urban" },
    { title: "Mid-Day Meal Kitchen Opened", date: "Feb 11, 2025", summary: "Centralized kitchen serving 50,000 students daily with improved nutrition.", tag: "announcement", ministry: "Education Dept.", ministryId: "gj-education" },
  ],
  jaipur: [
    { title: "Night Tourism Circuit Launched", date: "Feb 13, 2025", summary: "Illuminated heritage walks at Amer Fort, Hawa Mahal attract 5,000 visitors weekly.", tag: "announcement", ministry: "Tourism Dept.", ministryId: "rj-tourism" },
    { title: "Mobile Health Units Active", date: "Feb 10, 2025", summary: "200 villages now covered with monthly check-ups for 50,000 residents.", tag: "update", ministry: "Medical & Health", ministryId: "rj-health" },
  ],
};

const fallbackCity = { name: "City", state: "—", description: "", memberCount: 0, ministries: [] };

const allTags: TagVariant[] = ["appreciation", "complaint", "suggestion", "question", "discussion", "update", "announcement"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function CityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const city = cityDatabase[id || ""] || fallbackCity;
  const discussions = cityDiscussions[id || ""] || [];
  const qaSessions = cityQASessions[id || ""] || [];
  const announcements = cityAnnouncements[id || ""] || [];

  const [activeTag, setActiveTag] = useState<TagVariant | "all">("all");
  const [activeMinistry, setActiveMinistry] = useState<string>("all");
  const [showOfficials, setShowOfficials] = useState(false);

  const officials = cityOfficials[id || ""] || [];

  const ministryNames = [...new Set(discussions.map((d) => d.ministry))];
  const availableTags = allTags.filter((t) => discussions.some((d) => d.tag === t));

  const filtered = discussions.filter((d) => {
    const tagMatch = activeTag === "all" || d.tag === activeTag;
    const ministryMatch = activeMinistry === "all" || d.ministry === activeMinistry;
    return tagMatch && ministryMatch;
  });

  const liveSessions = qaSessions.filter((s) => s.status === "live");
  const upcomingSessions = qaSessions.filter((s) => s.status !== "live");

  return (
    <div className="container py-8 space-y-8">
      <Link to="/cities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Cities
      </Link>

      {/* City Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <MapPin className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-card-foreground">{city.name}</h1>
            <button
              onClick={() => setShowOfficials(!showOfficials)}
              className="text-sm text-muted-foreground mt-1 leading-relaxed text-left hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 group"
            >
              <span>{city.description}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground/50 group-hover:text-foreground ${showOfficials ? "rotate-180" : ""}`} />
            </button>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{city.memberCount.toLocaleString()} members</span>
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{city.state}</span>
              <JoinGroupButton group={{ id: id || "", name: city.name, type: "city", path: `/cities/${id}` }} />
              {officials.length > 0 && (
                <button onClick={() => setShowOfficials(!showOfficials)} className="flex items-center gap-1 text-primary hover:underline">
                  {officials.length} officials
                </button>
              )}
              <Link to={`/municipalities/${id}`} className="flex items-center gap-1 text-primary hover:underline font-medium">
                <Building2 className="h-3 w-3" /> Municipality & Wards
              </Link>
            </div>
          </div>
        </div>
        <OfficialsList officials={officials} isOpen={showOfficials} />
      </motion.div>

      {/* Live Q&A Sessions */}
      {qaSessions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Radio className="h-4 w-4 text-rally" /> Live Q&A Sessions
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {liveSessions.map((session, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-rally/40 bg-rally/5 p-4 relative"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-rally opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rally" />
                  </span>
                  <span className="text-xs font-semibold text-rally">LIVE</span>
                </div>
                <h3 className="font-semibold text-card-foreground pr-16">{session.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{session.official} · {session.ministry}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />{session.participants.toLocaleString()} participating · {session.time}
                  </span>
                  <button 
                    onClick={() => navigate(`/qa/${id}-${i}`)}
                    className="rounded-full bg-rally px-4 py-1.5 text-xs font-semibold text-rally-foreground hover:opacity-90 transition-opacity"
                  >
                    Join Q&A
                  </button>
                </div>
              </motion.div>
            ))}
            {upcomingSessions.map((session, i) => (
              <motion.div
                key={`upcoming-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (liveSessions.length + i) * 0.1 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Upcoming</span>
                </div>
                <h3 className="font-semibold text-card-foreground">{session.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{session.official} · {session.ministry}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{session.time}</span>
                  <a 
                    href={getRallyCalendarUrl(session.title, session.ministry, id + "-qa-" + i)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Remind Me
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {discussions.length > 0 && (() => {
        const trending = [...discussions].sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies)).slice(0, 3);
        return (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🔥 Trending in {city.name}
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {trending.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="rounded-lg border bg-card p-4 hover:border-accent/50 transition-colors h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <TagBadge variant={d.tag} label={d.tag.charAt(0).toUpperCase() + d.tag.slice(1)} />
                      <span className="text-xs text-muted-foreground ml-auto">{d.time}</span>
                    </div>
                    <p className="text-sm text-card-foreground leading-relaxed line-clamp-2 mb-2">{d.content}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-medium text-card-foreground">{d.author}</span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>👍 {d.likes}</span>
                        <span>💬 {d.replies}</span>
                      </div>
                    </div>
                    <Link to={`/ministries/${d.ministryId}`} className="text-xs text-accent hover:underline flex items-center gap-1 mt-2">
                      <Building2 className="h-3 w-3" />{d.ministry}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* City Announcements Feed */}
      {announcements.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" /> City Announcements
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Latest updates from all departments in {city.name}.</p>
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-accent/20 bg-accent/5 p-4 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <TagBadge variant={a.tag} label={a.tag.charAt(0).toUpperCase() + a.tag.slice(1)} />
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-1">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.summary}</p>
                  </div>
                  <Link
                    to={`/ministries/${a.ministryId}`}
                    className="shrink-0 text-xs text-accent hover:underline flex items-center gap-1 mt-1"
                  >
                    <Building2 className="h-3 w-3" />{a.ministry}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* State-Level Ministries */}
      <section>
        <h2 className="text-lg font-semibold mb-1">State-Level Ministries & Departments</h2>
        <p className="text-sm text-muted-foreground mb-4">Engage with {city.state} government departments operating in {city.name}.</p>
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {city.ministries.map((m) => (
            <motion.div key={m.id} variants={item}>
              <MinistryCard id={m.id} name={m.name} level="state" memberCount={m.memberCount} latestUpdate={m.latestUpdate} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* City-Wide Discussion Hub */}
      {discussions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent" /> City Discussion Hub
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Cross-ministry conversations from across {city.name}.</p>

          {/* Filters */}
          <div className="space-y-3 mb-4">
            {/* Ministry filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveMinistry("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeMinistry === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                All Departments
              </button>
              {ministryNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setActiveMinistry(name)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeMinistry === name ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {name}
                </button>
              ))}
            </div>
            {/* Tag filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeTag === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                All Tags
              </button>
              {availableTags.map((t) => (
                <button key={t} onClick={() => setActiveTag(t)}>
                  <TagBadge variant={t} label={t.charAt(0).toUpperCase() + t.slice(1)} className={`cursor-pointer ${activeTag === t ? "ring-2 ring-ring ring-offset-1" : "opacity-70 hover:opacity-100"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Discussion Posts */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No discussions match the current filters.</p>
            ) : (
              filtered.map((d, i) => {
                const pId = `${id}-${d.ministryId}-${d.author.replace(/[^a-zA-Z0-9]/g, '')}-${i}`;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <DiscussionPost
                      postId={pId}
                      author={d.author}
                      tag={d.tag}
                      content={d.content}
                      likes={d.likes}
                      replies={d.replies}
                      time={d.time}
                    >
                      <Link to={`/ministries/${d.ministryId}`} className="text-xs text-accent hover:underline inline-flex items-center gap-1">
                        <Building2 className="h-3 w-3" />{d.ministry}
                      </Link>
                    </DiscussionPost>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
