import { useParams, Link, useSearchParams } from "react-router-dom";
import { Building2, ArrowLeft, Users, Bell, MapPin, ChevronDown } from "lucide-react";
import { JoinGroupButton } from "@/components/JoinGroupButton";
import { DiscussionPost } from "@/components/DiscussionPost";
import { TagBadge, type TagVariant } from "@/components/TagBadge";
import { OfficialsList } from "@/components/OfficialsList";
import { ministryOfficials } from "@/data/officials";
import { motion } from "framer-motion";
import { useState } from "react";

interface MinistryInfo {
  name: string;
  level: string;
  memberCount: number;
  description: string;
  city?: string;
  cityId?: string;
}

const ministryData: Record<string, MinistryInfo> = {
  // Central
  health: { name: "Ministry of Health & Family Welfare", level: "Central", memberCount: 124500, description: "Responsible for health policy, disease prevention, and family welfare programs." },
  education: { name: "Ministry of Education", level: "Central", memberCount: 98200, description: "Overseeing national education policy, school standards, and higher education." },
  finance: { name: "Ministry of Finance", level: "Central", memberCount: 156000, description: "Managing national budget, taxation, and economic policy." },
  it: { name: "Ministry of Electronics & IT", level: "Central", memberCount: 87400, description: "Driving digital transformation and IT infrastructure." },
  defence: { name: "Ministry of Defence", level: "Central", memberCount: 67800, description: "Responsible for national defence and armed forces coordination." },
  agriculture: { name: "Ministry of Agriculture", level: "Central", memberCount: 91200, description: "Overseeing agricultural policy, farmer welfare, and food security." },
  railways: { name: "Ministry of Railways", level: "Central", memberCount: 145000, description: "Managing India's railway network and transportation infrastructure." },
  home: { name: "Ministry of Home Affairs", level: "Central", memberCount: 78300, description: "Internal security, border management, and law enforcement." },
  // State - Delhi
  "delhi-education": { name: "Dept. of Education", level: "State (Delhi)", memberCount: 34200, description: "Managing school education, curriculum, and teacher training in Delhi.", city: "New Delhi", cityId: "delhi" },
  "delhi-health": { name: "Dept. of Health & Family Welfare", level: "State (Delhi)", memberCount: 28900, description: "Public healthcare services, hospitals, and health programs in Delhi.", city: "New Delhi", cityId: "delhi" },
  "delhi-transport": { name: "Dept. of Transport", level: "State (Delhi)", memberCount: 22100, description: "Public transport, licensing, and traffic management in Delhi.", city: "New Delhi", cityId: "delhi" },
  "delhi-pwd": { name: "Public Works Department", level: "State (Delhi)", memberCount: 15600, description: "Road construction, maintenance, and public infrastructure in Delhi.", city: "New Delhi", cityId: "delhi" },
  "delhi-water": { name: "Delhi Jal Board", level: "State (Delhi)", memberCount: 19800, description: "Water supply, sewage treatment, and water resource management.", city: "New Delhi", cityId: "delhi" },
  "delhi-revenue": { name: "Dept. of Revenue", level: "State (Delhi)", memberCount: 12300, description: "Tax collection, land records, and revenue administration.", city: "New Delhi", cityId: "delhi" },
  // State - Maharashtra
  "mh-urban": { name: "Urban Development Dept.", level: "State (Maharashtra)", memberCount: 28900, description: "Urban planning, smart cities, and municipal governance.", city: "Mumbai", cityId: "mumbai" },
  "mh-housing": { name: "Housing Department", level: "State (Maharashtra)", memberCount: 24500, description: "Affordable housing schemes and housing policy.", city: "Mumbai", cityId: "mumbai" },
  "mh-health": { name: "Public Health Dept.", level: "State (Maharashtra)", memberCount: 31200, description: "Public health services and disease prevention programs.", city: "Mumbai", cityId: "mumbai" },
  "mh-education": { name: "School Education Dept.", level: "State (Maharashtra)", memberCount: 26700, description: "School education policy and administration.", city: "Mumbai", cityId: "mumbai" },
  "mh-transport": { name: "Transport Dept.", level: "State (Maharashtra)", memberCount: 18900, description: "State transport services and road safety.", city: "Mumbai", cityId: "mumbai" },
  // State - Karnataka
  "ka-it": { name: "IT & BT Department", level: "State (Karnataka)", memberCount: 42100, description: "Information technology, biotechnology policy and startup ecosystem.", city: "Bangalore", cityId: "bangalore" },
  "ka-urban": { name: "Urban Development Dept.", level: "State (Karnataka)", memberCount: 23400, description: "Urban infrastructure and metropolitan development.", city: "Bangalore", cityId: "bangalore" },
  "ka-education": { name: "Dept. of Public Instruction", level: "State (Karnataka)", memberCount: 19800, description: "Primary and secondary education administration.", city: "Bangalore", cityId: "bangalore" },
  "ka-health": { name: "Health & Family Welfare Dept.", level: "State (Karnataka)", memberCount: 21500, description: "Healthcare delivery and public health infrastructure.", city: "Bangalore", cityId: "bangalore" },
  "ka-revenue": { name: "Revenue Department", level: "State (Karnataka)", memberCount: 14200, description: "Land records, taxation, and revenue collection.", city: "Bangalore", cityId: "bangalore" },
  // State - Tamil Nadu
  "tn-education": { name: "School Education Dept.", level: "State (Tamil Nadu)", memberCount: 31700, description: "Tamil medium and English medium school education policy.", city: "Chennai", cityId: "chennai" },
  "tn-health": { name: "Health & Family Welfare Dept.", level: "State (Tamil Nadu)", memberCount: 27800, description: "Public health, government hospitals, and medical services.", city: "Chennai", cityId: "chennai" },
  "tn-highways": { name: "Highways & Minor Ports Dept.", level: "State (Tamil Nadu)", memberCount: 15400, description: "State highway development and port management.", city: "Chennai", cityId: "chennai" },
  "tn-it": { name: "IT Department", level: "State (Tamil Nadu)", memberCount: 18900, description: "IT industry promotion and digital governance.", city: "Chennai", cityId: "chennai" },
  // West Bengal
  "wb-education": { name: "Dept. of School Education", level: "State (West Bengal)", memberCount: 22300, description: "School education policy and administration.", city: "Kolkata", cityId: "kolkata" },
  "wb-health": { name: "Dept. of Health & Family Welfare", level: "State (West Bengal)", memberCount: 19500, description: "Healthcare services and public health programs.", city: "Kolkata", cityId: "kolkata" },
  "wb-urban": { name: "Urban Development Dept.", level: "State (West Bengal)", memberCount: 16800, description: "Urban planning and municipal development.", city: "Kolkata", cityId: "kolkata" },
  "wb-transport": { name: "Transport Department", level: "State (West Bengal)", memberCount: 12100, description: "Public transport and Kolkata Metro operations.", city: "Kolkata", cityId: "kolkata" },
  // Telangana
  "ts-it": { name: "IT, Electronics & Communications", level: "State (Telangana)", memberCount: 35600, description: "IT sector growth and electronics manufacturing.", city: "Hyderabad", cityId: "hyderabad" },
  "ts-health": { name: "Health, Medical & Family Welfare", level: "State (Telangana)", memberCount: 21200, description: "Healthcare and medical education administration.", city: "Hyderabad", cityId: "hyderabad" },
  "ts-irrigation": { name: "Irrigation Department", level: "State (Telangana)", memberCount: 18400, description: "Water resource management and irrigation projects.", city: "Hyderabad", cityId: "hyderabad" },
  "ts-education": { name: "School Education Dept.", level: "State (Telangana)", memberCount: 17800, description: "School education policy in Telangana.", city: "Hyderabad", cityId: "hyderabad" },
  // Pune
  "mh-pune-urban": { name: "Urban Development Dept.", level: "State (Maharashtra)", memberCount: 15600, description: "Urban planning and metro development in Pune.", city: "Pune", cityId: "pune" },
  "mh-pune-education": { name: "Higher & Technical Education", level: "State (Maharashtra)", memberCount: 21300, description: "Higher education institutions and technical training.", city: "Pune", cityId: "pune" },
  "mh-pune-env": { name: "Environment & Climate Change", level: "State (Maharashtra)", memberCount: 8900, description: "Environmental protection and climate action initiatives.", city: "Pune", cityId: "pune" },
  // Gujarat
  "gj-urban": { name: "Urban Development Dept.", level: "State (Gujarat)", memberCount: 14500, description: "Smart city and urban infrastructure projects.", city: "Ahmedabad", cityId: "ahmedabad" },
  "gj-education": { name: "Education Department", level: "State (Gujarat)", memberCount: 18200, description: "School and higher education administration.", city: "Ahmedabad", cityId: "ahmedabad" },
  "gj-health": { name: "Health & Family Welfare", level: "State (Gujarat)", memberCount: 12800, description: "Public healthcare and medical services.", city: "Ahmedabad", cityId: "ahmedabad" },
  // Rajasthan
  "rj-tourism": { name: "Dept. of Tourism", level: "State (Rajasthan)", memberCount: 11200, description: "Tourism promotion and heritage conservation.", city: "Jaipur", cityId: "jaipur" },
  "rj-education": { name: "School Education Dept.", level: "State (Rajasthan)", memberCount: 15600, description: "Primary and secondary education in Rajasthan.", city: "Jaipur", cityId: "jaipur" },
  "rj-health": { name: "Medical & Health Dept.", level: "State (Rajasthan)", memberCount: 13400, description: "Healthcare delivery and rural health programs.", city: "Jaipur", cityId: "jaipur" },
  "rj-urban": { name: "Urban Development & Housing", level: "State (Rajasthan)", memberCount: 9800, description: "Urban planning and affordable housing.", city: "Jaipur", cityId: "jaipur" },
  // UP
  "up-health": { name: "Dept. of Health", level: "State (Uttar Pradesh)", memberCount: 34500, description: "Public health services across Uttar Pradesh." },
};

// Per-ministry announcements with tags
interface AnnouncementItem {
  title: string;
  date: string;
  summary: string;
  tag: "update" | "announcement";
}

const ministryAnnouncements: Record<string, AnnouncementItem[]> = {
  // Central
  health: [
    { title: "Ayushman Bharat Coverage Expanded", date: "Feb 20, 2025", summary: "50 crore additional citizens now eligible under the national health insurance scheme.", tag: "announcement" },
    { title: "Mental Health Helpline Goes 24/7", date: "Feb 15, 2025", summary: "National mental health helpline 1800-599-0019 now operational round the clock.", tag: "update" },
  ],
  education: [
    { title: "NEP 2025 Draft Open for Feedback", date: "Feb 18, 2025", summary: "Public consultation period for National Education Policy amendments opens until March 31.", tag: "announcement" },
    { title: "Digital Classroom Initiative Phase 2", date: "Feb 12, 2025", summary: "Smart boards and tablets deployed in 25,000 additional government schools.", tag: "update" },
  ],
  finance: [
    { title: "Union Budget 2025-26 Highlights", date: "Feb 18, 2025", summary: "Key allocations: ₹7.5L Cr for infrastructure, tax relief for middle class, and startup incentives.", tag: "announcement" },
    { title: "GST Portal Maintenance Complete", date: "Feb 14, 2025", summary: "New features include auto-populated returns and faster refund processing.", tag: "update" },
  ],
  it: [
    { title: "Digital India 3.0 Roadmap", date: "Feb 17, 2025", summary: "AI-first governance framework and digital public infrastructure expansion announced.", tag: "announcement" },
    { title: "DigiLocker Integration Update", date: "Feb 11, 2025", summary: "15 new document types now available on DigiLocker including vehicle insurance.", tag: "update" },
  ],
  // Delhi
  "delhi-education": [
    { title: "Delhi Schools Infrastructure Upgrade", date: "Feb 20, 2025", summary: "₹2,500 crore allocated for rebuilding 250 government school buildings with modern facilities.", tag: "announcement" },
    { title: "Online Admission Portal Live", date: "Feb 16, 2025", summary: "EWS/DG category admission portal for 2025-26 session is now accepting applications.", tag: "update" },
    { title: "Teacher Training Program Results", date: "Feb 12, 2025", summary: "12,000 teachers completed the advanced pedagogy certification program.", tag: "update" },
  ],
  "delhi-health": [
    { title: "50 New Mohalla Clinics Inaugurated", date: "Feb 19, 2025", summary: "Taking the total to 550 clinics providing free primary healthcare across all districts.", tag: "announcement" },
    { title: "Free Dengue Testing Extended", date: "Feb 14, 2025", summary: "All government hospitals and mohalla clinics now offer free rapid dengue testing.", tag: "update" },
  ],
  "delhi-transport": [
    { title: "500 Electric Buses Flagged Off", date: "Feb 18, 2025", summary: "DTC's electric fleet now covers 45 routes across South and East Delhi.", tag: "announcement" },
    { title: "DMRC Phase 4 Progress", date: "Feb 13, 2025", summary: "Janakpuri West-RK Ashram corridor 60% complete, expected operational by Dec 2025.", tag: "update" },
  ],
  "delhi-water": [
    { title: "24x7 Water Supply Pilot Results", date: "Feb 17, 2025", summary: "3 pilot zones in Malviya Nagar now receiving continuous water supply successfully.", tag: "update" },
    { title: "Yamuna Cleaning Phase 3 Launched", date: "Feb 10, 2025", summary: "New interceptor sewers and STPs to reduce pollutant discharge by 80%.", tag: "announcement" },
  ],
  "delhi-pwd": [
    { title: "Road Resurfacing Drive Complete", date: "Feb 15, 2025", summary: "450 km of roads resurfaced across Delhi before monsoon season.", tag: "update" },
  ],
  "delhi-revenue": [
    { title: "Property Tax Online System Upgrade", date: "Feb 12, 2025", summary: "New portal with GPS-mapped properties for easier self-assessment.", tag: "update" },
  ],
  // Maharashtra
  "mh-urban": [
    { title: "Mumbai Metro Line 3 Trial Run", date: "Feb 19, 2025", summary: "Colaba-Bandra-SEEPZ underground corridor begins passenger trial runs.", tag: "announcement" },
    { title: "Smart City Dashboard Live", date: "Feb 14, 2025", summary: "Real-time civic data for 10 cities now available on Maharashtra Smart City portal.", tag: "update" },
  ],
  "mh-housing": [
    { title: "PMAY Applications Reopened", date: "Feb 18, 2025", summary: "12,000 new affordable housing units in MMR region open for application.", tag: "announcement" },
    { title: "Dharavi Redevelopment Phase 1", date: "Feb 11, 2025", summary: "First batch of 5,000 families to be relocated to transit housing.", tag: "update" },
  ],
  "mh-health": [
    { title: "Mahatma Phule Jan Arogya Update", date: "Feb 16, 2025", summary: "Insurance coverage expanded to include 50 new surgical procedures.", tag: "update" },
    { title: "Monsoon Disease Preparedness Plan", date: "Feb 10, 2025", summary: "Pre-positioned medical supplies and rapid response teams in flood-prone districts.", tag: "announcement" },
  ],
  "mh-education": [
    { title: "Marathi Medium Digital Content", date: "Feb 15, 2025", summary: "10,000 interactive lessons launched for classes 1-8 in Marathi medium.", tag: "update" },
  ],
  "mh-transport": [
    { title: "MSRTC Electric Bus Routes", date: "Feb 13, 2025", summary: "Electric bus service launched on Mumbai-Pune and Mumbai-Nashik expressways.", tag: "announcement" },
  ],
  // Karnataka
  "ka-it": [
    { title: "Karnataka Startup Policy 2025", date: "Feb 18, 2025", summary: "₹500 Cr fund for deep-tech, AI, and green energy startups with 5-year tax holidays.", tag: "announcement" },
    { title: "BeyondBangalore IT Parks", date: "Feb 12, 2025", summary: "New IT parks in Mysuru and Hubli operational with 2,000 seats occupied.", tag: "update" },
  ],
  "ka-urban": [
    { title: "Namma Metro Yellow Line Progress", date: "Feb 17, 2025", summary: "RV Road to Bommasandra stretch testing complete, opens next month.", tag: "update" },
    { title: "BBMP Ward Reorganization", date: "Feb 10, 2025", summary: "243 new ward boundaries finalized for upcoming municipal elections.", tag: "announcement" },
  ],
  "ka-health": [
    { title: "Free Diagnostic Centers in 8 Taluks", date: "Feb 14, 2025", summary: "CT scan, MRI, and blood testing available free at taluk-level hospitals.", tag: "announcement" },
  ],
  "ka-education": [
    { title: "Vidyagama 2.0 Launch", date: "Feb 11, 2025", summary: "Community-based learning program expanded to cover 15,000 villages.", tag: "update" },
  ],
  "ka-revenue": [
    { title: "Bhoomi 2.0 Land Records Portal", date: "Feb 9, 2025", summary: "Digitized mutation process now completes in 15 days vs 45 days earlier.", tag: "update" },
  ],
  // Tamil Nadu
  "tn-education": [
    { title: "Tamil Medium Digital Content Live", date: "Feb 17, 2025", summary: "Interactive e-learning platform with 8,000 lessons for classes 6-12.", tag: "announcement" },
    { title: "Naan Mudhalvan Skill Program", date: "Feb 12, 2025", summary: "5 lakh college students enrolled in industry-relevant certification courses.", tag: "update" },
  ],
  "tn-health": [
    { title: "108 Ambulance Fleet Expanded", date: "Feb 15, 2025", summary: "200 new GPS-tracked ambulances deployed, reducing rural response time to 15 minutes.", tag: "update" },
    { title: "Makkalai Thedi Maruthuvam Results", date: "Feb 9, 2025", summary: "Door-to-door healthcare scheme has screened 2 crore residents for chronic diseases.", tag: "announcement" },
  ],
  "tn-highways": [
    { title: "Chennai-Salem Expressway Update", date: "Feb 14, 2025", summary: "Phase 1 land acquisition complete. Construction begins in Q2 2025.", tag: "update" },
  ],
  "tn-it": [
    { title: "TN Tech City Phase 2 Opens", date: "Feb 11, 2025", summary: "10 new tech companies set up operations in Coimbatore IT corridor.", tag: "announcement" },
  ],
  // Other states - default per-ministry
  "wb-education": [
    { title: "Kanyashree Prakalpa Update", date: "Feb 16, 2025", summary: "Girl student scholarship program crossed 1 crore beneficiaries.", tag: "update" },
  ],
  "wb-health": [
    { title: "Swasthya Sathi Coverage Expanded", date: "Feb 14, 2025", summary: "Health insurance now covers all residents with ₹5 lakh annual coverage.", tag: "announcement" },
  ],
  "wb-transport": [
    { title: "Kolkata Metro East-West Update", date: "Feb 11, 2025", summary: "Howrah-Sector V stretch enters final testing phase.", tag: "update" },
  ],
  "ts-it": [
    { title: "IT Tower Inaugurated in Kokapet", date: "Feb 15, 2025", summary: "50-storey tech hub with capacity for 20,000 professionals operational.", tag: "announcement" },
  ],
  "ts-irrigation": [
    { title: "Kaleshwaram Project Status", date: "Feb 12, 2025", summary: "Water lifted to 45 TMC this season, irrigating 18 lakh acres across 13 districts.", tag: "update" },
  ],
  "rj-tourism": [
    { title: "Night Tourism Circuit Launched", date: "Feb 13, 2025", summary: "Illuminated heritage walks in Jaipur, Jodhpur, and Udaipur attract 5,000 visitors weekly.", tag: "announcement" },
  ],
};

// Per-ministry discussions
interface DiscussionItem {
  author: string;
  tag: TagVariant;
  content: string;
  likes: number;
  replies: number;
  time: string;
}

const ministryDiscussions: Record<string, DiscussionItem[]> = {
  // Central
  health: [
    { author: "Priya S.", tag: "appreciation", content: "Ayushman Bharat saved my family ₹3 lakhs on my father's heart surgery. Truly life-changing!", likes: 456, replies: 32, time: "1h ago" },
    { author: "Dr. Meera R.", tag: "update", content: "AIIMS recruitment portal is finally updated with the 2025 vacancy list. Apply before March 15.", likes: 234, replies: 18, time: "3h ago" },
    { author: "Rahul M.", tag: "complaint", content: "PHC in my village has been without a doctor for 6 months. Who do we escalate this to?", likes: 189, replies: 42, time: "5h ago" },
    { author: "Ananya K.", tag: "suggestion", content: "Can we integrate ABHA health IDs with private hospital systems? Currently only government hospitals accept it.", likes: 156, replies: 24, time: "6h ago" },
    { author: "Vikram D.", tag: "announcement", content: "Free health camps announced in all district hospitals this weekend. Spread the word!", likes: 312, replies: 15, time: "8h ago" },
  ],
  education: [
    { author: "Kavita T.", tag: "appreciation", content: "The new NCERT textbooks are much better designed. My kids actually enjoy reading them now.", likes: 298, replies: 21, time: "2h ago" },
    { author: "Prof. Singh", tag: "discussion", content: "NEP 2025 draft has interesting multilingual education proposals. What do teachers think about implementation?", likes: 167, replies: 56, time: "4h ago" },
    { author: "Deepa N.", tag: "complaint", content: "CBSE board exam date sheet keeps changing. Students are anxious and can't plan revision.", likes: 234, replies: 38, time: "6h ago" },
    { author: "Amit J.", tag: "question", content: "When will the national scholarship portal open for 2025-26? Last year it was delayed by 2 months.", likes: 89, replies: 12, time: "1d ago" },
  ],
  finance: [
    { author: "CA Sharma", tag: "update", content: "New ITR forms for AY 2025-26 published. Key change: crypto reporting is now mandatory in Schedule VDA.", likes: 567, replies: 89, time: "1h ago" },
    { author: "Sunita M.", tag: "appreciation", content: "The new tax slab under new regime is really helpful for middle class. Saved ₹25,000 this year!", likes: 345, replies: 28, time: "3h ago" },
    { author: "Rajesh K.", tag: "complaint", content: "GST portal still crashes during filing deadlines. It's 2025 and the infrastructure hasn't improved.", likes: 456, replies: 67, time: "5h ago" },
    { author: "Neha P.", tag: "question", content: "Is the ₹50,000 standard deduction available under both old and new tax regimes now?", likes: 123, replies: 15, time: "8h ago" },
  ],
  // Delhi per-ministry
  "delhi-education": [
    { author: "Rekha M.", tag: "appreciation", content: "My child's government school in Dwarka now has smart boards and AC classrooms. Incredible transformation!", likes: 389, replies: 24, time: "1h ago" },
    { author: "Suresh K.", tag: "update", content: "EWS admission results for 2025-26 are out on edudel.nic.in. Check your application status now.", likes: 234, replies: 45, time: "2h ago" },
    { author: "Pooja S.", tag: "complaint", content: "Guest teachers haven't been regularized despite Supreme Court orders. When will Delhi Govt act?", likes: 178, replies: 31, time: "4h ago" },
    { author: "Aamir H.", tag: "suggestion", content: "Include coding and AI basics from class 6 itself. Other states are already doing this.", likes: 267, replies: 19, time: "6h ago" },
    { author: "Nisha R.", tag: "announcement", content: "Delhi Govt offering free IAS coaching at 15 centers. Registration opens Feb 25.", likes: 456, replies: 52, time: "8h ago" },
  ],
  "delhi-health": [
    { author: "Arun K.", tag: "appreciation", content: "Mohalla Clinic near Sarojini Nagar is amazing. Got blood tests done in 20 minutes, completely free!", likes: 312, replies: 28, time: "1h ago" },
    { author: "Dr. Gupta", tag: "update", content: "LNJP Hospital has opened a new 200-bed critical care wing. State-of-the-art equipment installed.", likes: 189, replies: 14, time: "3h ago" },
    { author: "Neha T.", tag: "complaint", content: "Water supply in East Delhi is irregular. Contaminated water is causing health issues in our area.", likes: 267, replies: 38, time: "4h ago" },
    { author: "Ravi S.", tag: "question", content: "Are COVID booster doses still free at Delhi government hospitals? The website doesn't clarify.", likes: 78, replies: 9, time: "7h ago" },
  ],
  "delhi-transport": [
    { author: "Manish A.", tag: "appreciation", content: "New electric buses on Route 604 are so smooth and quiet. AC works perfectly even in summer!", likes: 234, replies: 16, time: "2h ago" },
    { author: "Priti K.", tag: "update", content: "DMRC has extended Purple Line timings till midnight on weekends starting next month.", likes: 345, replies: 23, time: "3h ago" },
    { author: "Sanjay M.", tag: "suggestion", content: "DTC app should show real-time bus locations. Currently the ETA feature is completely unreliable.", likes: 203, replies: 19, time: "5h ago" },
    { author: "Amit R.", tag: "complaint", content: "Last-mile connectivity from Metro stations is terrible. Auto drivers refuse to use meters.", likes: 189, replies: 34, time: "8h ago" },
  ],
  "delhi-water": [
    { author: "Sunita D.", tag: "discussion", content: "The 24x7 water supply pilot in Malviya Nagar is working great. When will it expand to other areas?", likes: 156, replies: 21, time: "3h ago" },
    { author: "Rakesh B.", tag: "complaint", content: "Our area in Shahdara gets water only for 1 hour daily. Pipeline upgrade was promised 2 years ago.", likes: 234, replies: 42, time: "5h ago" },
    { author: "Fatima S.", tag: "question", content: "How do I apply for a new water connection? DJB office redirects me to the website which doesn't work.", likes: 67, replies: 11, time: "1d ago" },
  ],
  // Maharashtra per-ministry
  "mh-urban": [
    { author: "Pooja D.", tag: "appreciation", content: "Mumbai Metro Line 3 trial run was fantastic! This will change how millions commute daily.", likes: 456, replies: 34, time: "1h ago" },
    { author: "Siddharth J.", tag: "update", content: "MMRDA has published the revised development plan for 2025-35. Public comments accepted until March.", likes: 178, replies: 22, time: "4h ago" },
    { author: "Rajesh P.", tag: "complaint", content: "Coastal road project causing massive waterlogging in Worli. Drainage planning was clearly inadequate.", likes: 289, replies: 45, time: "6h ago" },
  ],
  "mh-health": [
    { author: "Dr. Patil", tag: "update", content: "Mahatma Phule Jan Arogya now covers 50 new procedures including advanced cardiac surgeries.", likes: 234, replies: 18, time: "2h ago" },
    { author: "Kavita N.", tag: "suggestion", content: "Rural PHCs need 24/7 emergency services. Many deaths occur during night emergencies in villages.", likes: 345, replies: 28, time: "5h ago" },
  ],
  "mh-housing": [
    { author: "Amit S.", tag: "announcement", content: "PMAY-Urban applications for MMR region reopened. 12,000 units available in Thane and Navi Mumbai.", likes: 389, replies: 56, time: "1h ago" },
    { author: "Rashmi V.", tag: "question", content: "What's the income limit for EWS category under PMAY? The website shows conflicting information.", likes: 123, replies: 14, time: "6h ago" },
  ],
  // Karnataka per-ministry
  "ka-it": [
    { author: "Deepak R.", tag: "appreciation", content: "The new startup policy is exactly what Bangalore needed. Tax holidays will attract global companies.", likes: 378, replies: 26, time: "1h ago" },
    { author: "Sneha P.", tag: "update", content: "Karnataka Innovation Authority has approved 200 startups for seed funding under ELEVATE 2025.", likes: 234, replies: 19, time: "3h ago" },
    { author: "Ravi M.", tag: "discussion", content: "Should Karnataka invest in quantum computing infrastructure? China and US are way ahead of us.", likes: 145, replies: 42, time: "6h ago" },
  ],
  "ka-urban": [
    { author: "Lakshmi V.", tag: "complaint", content: "BBMP garbage collection in Whitefield is inconsistent. Bins overflow for days sometimes.", likes: 189, replies: 27, time: "3h ago" },
    { author: "Karthik S.", tag: "question", content: "When will the Peripheral Ring Road project actually start? It's been delayed for over 5 years.", likes: 98, replies: 23, time: "8h ago" },
    { author: "Meena T.", tag: "announcement", content: "BBMP property tax discount of 5% for early payment extended until March 31, 2025.", likes: 267, replies: 12, time: "1d ago" },
  ],
  // Tamil Nadu
  "tn-education": [
    { author: "Selvi R.", tag: "appreciation", content: "Naan Mudhalvan program got my son a job at TCS right after college. Thank you Tamil Nadu!", likes: 345, replies: 28, time: "2h ago" },
    { author: "Kumar A.", tag: "update", content: "Class 10 public exam hall tickets available for download on dge.tn.gov.in from today.", likes: 189, replies: 15, time: "4h ago" },
    { author: "Priya N.", tag: "discussion", content: "Should Tamil Nadu follow NEET for medical admissions or push for state-level exams?", likes: 456, replies: 89, time: "6h ago" },
  ],
  "tn-health": [
    { author: "Dr. Lakshmi", tag: "update", content: "New 108 ambulances equipped with ventilators deployed in 5 southern districts.", likes: 234, replies: 16, time: "3h ago" },
    { author: "Rajan P.", tag: "appreciation", content: "Makkalai Thedi Maruthuvam visited our village and detected my diabetes early. Lifesaving initiative.", likes: 278, replies: 22, time: "5h ago" },
  ],
};

// Fallback discussions
const defaultDiscussions: DiscussionItem[] = [
  { author: "Citizen", tag: "discussion", content: "What improvements would you like to see in this department's services?", likes: 45, replies: 12, time: "2h ago" },
  { author: "Local Resident", tag: "suggestion", content: "We need better digital infrastructure for government services. Online portals should be mobile-friendly.", likes: 89, replies: 8, time: "5h ago" },
  { author: "Community Member", tag: "question", content: "How can we participate in local governance decisions? Are there any public consultation forums?", likes: 34, replies: 6, time: "1d ago" },
  { author: "Active Voter", tag: "update", content: "Department website has been redesigned with new service tracking features. Check it out.", likes: 67, replies: 4, time: "1d ago" },
];

const defaultAnnouncements: AnnouncementItem[] = [
  { title: "Public Feedback Portal Open", date: "Feb 15, 2025", summary: "Citizens can submit suggestions and grievances through the new integrated feedback system.", tag: "announcement" },
  { title: "Service Delivery Improvement", date: "Feb 10, 2025", summary: "Average processing time for applications reduced by 40% through digital transformation.", tag: "update" },
];

const allTags: TagVariant[] = ["appreciation", "complaint", "suggestion", "question", "discussion", "update", "announcement"];

function getAnnouncementTagColor(tag: "update" | "announcement") {
  if (tag === "announcement") return "text-accent";
  return "text-tag-update";
}

export default function MinistryDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fromCity = searchParams.get("from");
  const ministry = ministryData[id || ""] || { name: "Ministry", level: "Central", memberCount: 0, description: "" };
  const isState = ministry.level !== "Central";

  const announcements = ministryAnnouncements[id || ""] || defaultAnnouncements;
  const discussions = ministryDiscussions[id || ""] || defaultDiscussions;

  const [activeTag, setActiveTag] = useState<TagVariant | "all">("all");
  const [showOfficials, setShowOfficials] = useState(false);
  const officials = ministryOfficials[id || ""] || [];
  const filtered = activeTag === "all" ? discussions : discussions.filter((d) => d.tag === activeTag);

  // Available tags for this ministry's discussions
  const availableTags = allTags.filter((t) => discussions.some((d) => d.tag === t));

  const backLink = isState && ministry.cityId
    ? `/cities/${ministry.cityId}`
    : fromCity
      ? `/cities/${fromCity}`
      : "/ministries";

  const backLabel = isState && ministry.cityId
    ? `Back to ${ministry.city}`
    : fromCity
      ? "Back to City"
      : "Back to Ministries";

  return (
    <div className="container py-8 space-y-8">
      <Link to={backLink} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{ministry.name}</h1>
            <button
              onClick={() => setShowOfficials(!showOfficials)}
              className="text-sm text-muted-foreground mt-1 text-left hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 group"
            >
              <span>{ministry.description}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground/50 group-hover:text-foreground ${showOfficials ? "rotate-180" : ""}`} />
            </button>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ministry.memberCount.toLocaleString()} members</span>
              <span>{ministry.level} Government</span>
              <JoinGroupButton group={{ id: id || "", name: ministry.name, type: "ministry", path: `/ministries/${id}` }} />
              {isState && ministry.city && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ministry.city}</span>
              )}
              {officials.length > 0 && (
                <button onClick={() => setShowOfficials(!showOfficials)} className="text-primary hover:underline">
                  {officials.length} officials
                </button>
              )}
            </div>
          </div>
        </div>
        <OfficialsList officials={officials} isOpen={showOfficials} />
      </motion.div>

      {/* Trending */}
      {discussions.length > 0 && (() => {
        const trending = [...discussions].sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies)).slice(0, 3);
        return (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🔥 Trending
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {trending.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="h-full flex flex-col">
                    <DiscussionPost
                      postId={`ministry-trending-${id}-${i}`}
                      author={d.author}
                      tag={d.tag}
                      content={d.content}
                      likes={d.likes}
                      replies={d.replies}
                      time={d.time}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Announcements */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent" /> Latest Announcements
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {announcements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-accent/30 bg-accent/5 p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-xs font-medium ${getAnnouncementTagColor(a.tag)}`}>{a.date}</p>
                <TagBadge variant={a.tag} label={a.tag.charAt(0).toUpperCase() + a.tag.slice(1)} />
              </div>
              <h3 className="font-semibold text-card-foreground mb-1">{a.title}</h3>
              <p className="text-sm text-muted-foreground">{a.summary}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Discussions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Community Discussions</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTag("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeTag === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            All
          </button>
          {availableTags.map((t) => (
            <button key={t} onClick={() => setActiveTag(t)}>
              <TagBadge variant={t} label={t.charAt(0).toUpperCase() + t.slice(1)} className={`cursor-pointer ${activeTag === t ? "ring-2 ring-ring ring-offset-1" : "opacity-70 hover:opacity-100"}`} />
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No discussions with this tag yet.</p>
          ) : (
            filtered.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <DiscussionPost postId={`ministry-${id}-${i}`} {...d} />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
