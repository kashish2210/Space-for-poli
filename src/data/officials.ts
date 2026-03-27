import { type Official } from "@/components/OfficialsList";

export const cityOfficials: Record<string, Official[]> = {
  delhi: [
    { name: "Vinai Kumar Saxena", designation: "Lt. Governor of Delhi", phone: "011-23963013", link: "/states/delhi" },
    { name: "Atishi Marlena", designation: "Chief Minister", department: "Govt. of NCT Delhi", email: "cm@delhi.gov.in", link: "/states/delhi" },
    { name: "Dr. Ashok Kumar", designation: "Education Secretary, IAS", department: "Dept. of Education", email: "secy-edu@delhi.gov.in", link: "/ministries/delhi-education" },
    { name: "Sanjay Kumar", designation: "Health Secretary, IAS", department: "Dept. of Health & Family Welfare", link: "/ministries/delhi-health" },
    { name: "Ashish Kundra", designation: "Transport Commissioner", department: "Dept. of Transport", email: "tc@delhi.gov.in", link: "/ministries/delhi-transport" },
    { name: "Saurabh Jain", designation: "CEO, Delhi Jal Board", department: "Delhi Jal Board", link: "/ministries/delhi-water" },
  ],
  mumbai: [
    { name: "Iqbal Singh Chahal", designation: "Municipal Commissioner", department: "MCGM", email: "mc@mcgm.gov.in", link: "/cities/mumbai" },
    { name: "Sanjay Mukherjee", designation: "Commissioner, MMRDA", department: "Mumbai Metropolitan Region", link: "/states/maharashtra" },
    { name: "Dr. Sanjeev Kumar", designation: "Secretary, Urban Development", department: "Urban Development Dept.", link: "/ministries/mh-urban" },
    { name: "Shivaji Daundkar", designation: "Director, Public Health", department: "Public Health Dept.", link: "/ministries/mh-health" },
  ],
  bangalore: [
    { name: "Tushar Giri Nath", designation: "BBMP Chief Commissioner", department: "Bruhat Bengaluru Mahanagara Palike", link: "/cities/bangalore" },
    { name: "Dr. E.V. Ramana Reddy", designation: "Additional Chief Secretary", department: "IT & BT Department", email: "acs-it@karnataka.gov.in", link: "/ministries/ka-it" },
    { name: "Rakesh Singh", designation: "MD, BMRCL", department: "Namma Metro", link: "/ministries/ka-urban" },
  ],
  chennai: [
    { name: "Gagandeep Singh Bedi", designation: "Commissioner, GCC", department: "Greater Chennai Corporation", link: "/cities/chennai" },
    { name: "Dr. T.S. Selvavinayagam", designation: "Director of Public Health", department: "Health & Family Welfare", link: "/ministries/tn-health" },
    { name: "Neeraj Mittal", designation: "Secretary, IT Dept.", department: "IT Department", email: "secy-it@tn.gov.in", link: "/ministries/tn-it" },
  ],
  kolkata: [
    { name: "Firhad Hakim", designation: "Mayor of Kolkata", department: "Kolkata Municipal Corporation", link: "/cities/kolkata" },
    { name: "Binod Kumar", designation: "Municipal Commissioner", department: "KMC", link: "/states/west-bengal" },
  ],
  hyderabad: [
    { name: "Dana Kishore", designation: "Commissioner, GHMC", department: "Greater Hyderabad Municipal Corp.", link: "/cities/hyderabad" },
    { name: "Jayesh Ranjan", designation: "Principal Secretary, IT", department: "IT, Electronics & Communications", email: "ps-it@telangana.gov.in", link: "/ministries/ts-it" },
  ],
  pune: [
    { name: "Vikram Kumar", designation: "Municipal Commissioner", department: "Pune Municipal Corporation", link: "/cities/pune" },
    { name: "Dr. Rajesh Deshmukh", designation: "District Collector", department: "Revenue Department", link: "/states/maharashtra" },
  ],
  ahmedabad: [
    { name: "M. Thennarasan", designation: "Municipal Commissioner", department: "Ahmedabad Municipal Corporation", link: "/cities/ahmedabad" },
  ],
  jaipur: [
    { name: "Sudhansh Pant", designation: "Commissioner, JMC", department: "Jaipur Municipal Corporation", link: "/cities/jaipur" },
    { name: "Ravi Jain", designation: "Director, Tourism", department: "Dept. of Tourism", email: "dir-tourism@rajasthan.gov.in", link: "/ministries/rj-tourism" },
  ],
};

export const ministryOfficials: Record<string, Official[]> = {
  health: [
    { name: "Apurva Chandra", designation: "Secretary, Health", department: "Ministry of Health & Family Welfare", email: "secy-health@gov.in", link: "/ministries/health" },
    { name: "Dr. Atul Goel", designation: "Director General of Health Services", department: "DGHS", link: "/ministries/health" },
    { name: "Dr. Rajiv Bahl", designation: "DG, ICMR", department: "Indian Council of Medical Research", link: "/ministries/health" },
  ],
  education: [
    { name: "K. Sanjay Murthy", designation: "Secretary, Education", department: "Ministry of Education", email: "secy-edu@gov.in", link: "/ministries/education" },
    { name: "Prof. M. Jagadesh Kumar", designation: "Chairman, UGC", department: "University Grants Commission", link: "/ministries/education" },
  ],
  finance: [
    { name: "T.V. Somanathan", designation: "Finance Secretary", department: "Ministry of Finance", email: "fs@gov.in", link: "/ministries/finance" },
    { name: "Vivek Joshi", designation: "Secretary, Financial Services", department: "Dept. of Financial Services", link: "/ministries/finance" },
    { name: "Sanjay Malhotra", designation: "Revenue Secretary", department: "Dept. of Revenue", link: "/ministries/finance" },
  ],
  it: [
    { name: "S. Krishnan", designation: "Secretary, MeitY", department: "Ministry of Electronics & IT", email: "secy-meity@gov.in", link: "/ministries/it" },
    { name: "Abhishek Singh", designation: "CEO, NeGD", department: "National e-Governance Division", link: "/ministries/it" },
  ],
  defence: [
    { name: "Giridhar Aramane", designation: "Defence Secretary", department: "Ministry of Defence", link: "/ministries/defence" },
    { name: "Gen. Anil Chauhan", designation: "Chief of Defence Staff", department: "Integrated Defence Staff", link: "/ministries/defence" },
  ],
  agriculture: [
    { name: "Manoj Ahuja", designation: "Secretary, Agriculture", department: "Ministry of Agriculture", email: "secy-agri@gov.in", link: "/ministries/agriculture" },
  ],
  railways: [
    { name: "Jaya Varma Sinha", designation: "Chairman, Railway Board", department: "Ministry of Railways", link: "/ministries/railways" },
  ],
  home: [
    { name: "Ajay Kumar Bhalla", designation: "Home Secretary", department: "Ministry of Home Affairs", link: "/ministries/home" },
  ],
  "delhi-education": [
    { name: "Dr. Ashok Kumar", designation: "Education Secretary, IAS", department: "Dept. of Education, Delhi", email: "secy-edu@delhi.gov.in", link: "/cities/delhi" },
    { name: "Himanshu Gupta", designation: "Director of Education", department: "Directorate of Education", link: "/cities/delhi" },
  ],
  "delhi-health": [
    { name: "Sanjay Kumar", designation: "Health Secretary, IAS", department: "Dept. of Health, Delhi", link: "/cities/delhi" },
    { name: "Dr. Vandana Bagga", designation: "Director, Health Services", department: "DGHS Delhi", link: "/cities/delhi" },
  ],
  "delhi-transport": [
    { name: "Ashish Kundra", designation: "Transport Commissioner", department: "Dept. of Transport, Delhi", email: "tc@delhi.gov.in", link: "/cities/delhi" },
  ],
  "delhi-water": [
    { name: "Saurabh Jain", designation: "CEO, Delhi Jal Board", department: "Delhi Jal Board", link: "/cities/delhi" },
  ],
};

export const stateOfficials: Record<string, Official[]> = {
  maharashtra: [
    { name: "Devendra Fadnavis", designation: "Chief Minister", department: "Govt. of Maharashtra", email: "cm@maharashtra.gov.in", link: "/states/maharashtra" },
    { name: "Nitin Kareer", designation: "Chief Secretary", department: "Govt. of Maharashtra", link: "/states/maharashtra" },
    { name: "Iqbal Singh Chahal", designation: "ACS, Urban Development", department: "Urban Development Dept.", link: "/cities/mumbai" },
  ],
  karnataka: [
    { name: "Siddaramaiah", designation: "Chief Minister", department: "Govt. of Karnataka", email: "cm@karnataka.gov.in", link: "/states/karnataka" },
    { name: "Rajneesh Goel", designation: "Chief Secretary", department: "Govt. of Karnataka", link: "/states/karnataka" },
    { name: "Dr. E.V. Ramana Reddy", designation: "ACS, IT & BT", department: "IT & BT Department", link: "/ministries/ka-it" },
  ],
  "tamil-nadu": [
    { name: "M.K. Stalin", designation: "Chief Minister", department: "Govt. of Tamil Nadu", email: "cm@tn.gov.in", link: "/states/tamil-nadu" },
    { name: "Shiv Das Meena", designation: "Chief Secretary", department: "Govt. of Tamil Nadu", link: "/states/tamil-nadu" },
  ],
  "uttar-pradesh": [
    { name: "Yogi Adityanath", designation: "Chief Minister", department: "Govt. of Uttar Pradesh", email: "cm@up.gov.in", link: "/states/uttar-pradesh" },
    { name: "Durga Shanker Mishra", designation: "Chief Secretary", department: "Govt. of UP", link: "/states/uttar-pradesh" },
  ],
  "west-bengal": [
    { name: "Mamata Banerjee", designation: "Chief Minister", department: "Govt. of West Bengal", email: "cm@wb.gov.in", link: "/cities/kolkata" },
  ],
  rajasthan: [
    { name: "Bhajan Lal Sharma", designation: "Chief Minister", department: "Govt. of Rajasthan", link: "/cities/jaipur" },
  ],
  gujarat: [
    { name: "Bhupendra Patel", designation: "Chief Minister", department: "Govt. of Gujarat", email: "cm@gujarat.gov.in", link: "/cities/ahmedabad" },
  ],
  delhi: [
    { name: "Atishi Marlena", designation: "Chief Minister", department: "Govt. of NCT Delhi", email: "cm@delhi.gov.in", link: "/cities/delhi" },
    { name: "Vinai Kumar Saxena", designation: "Lt. Governor", department: "Govt. of NCT Delhi", link: "/cities/delhi" },
  ],
  punjab: [
    { name: "Bhagwant Mann", designation: "Chief Minister", department: "Govt. of Punjab", email: "cm@punjab.gov.in", link: "/states/punjab" },
  ],
  kerala: [
    { name: "Pinarayi Vijayan", designation: "Chief Minister", department: "Govt. of Kerala", email: "cm@kerala.gov.in", link: "/states/kerala" },
  ],
  bihar: [
    { name: "Nitish Kumar", designation: "Chief Minister", department: "Govt. of Bihar", link: "/states/bihar" },
  ],
  "madhya-pradesh": [
    { name: "Mohan Yadav", designation: "Chief Minister", department: "Govt. of Madhya Pradesh", link: "/states/madhya-pradesh" },
  ],
};
