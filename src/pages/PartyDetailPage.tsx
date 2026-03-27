import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, MapPin, ChevronRight } from "lucide-react";
import { JoinGroupButton } from "@/components/JoinGroupButton";
import { TagBadge } from "@/components/TagBadge";
import { RoleBadge, type RoleVariant } from "@/components/RoleBadge";
import { DiscussionPost } from "@/components/DiscussionPost";
import { motion } from "framer-motion";
import { useState } from "react";

interface Leader {
  name: string;
  roles: { variant: RoleVariant; label: string }[];
  constituency?: string;
  description: string;
  avatar: string;
}

interface Subgroup {
  id: string;
  name: string;
  type: string;
  members: Leader[];
}

const partyDatabase: Record<string, { name: string; description: string; founded: string; headquarters: string; memberCount: number; subgroups: Subgroup[] }> = {
  bjp: {
    name: "Bharatiya Janata Party",
    description: "One of India's two major political parties, founded in 1980. The party's ideology is based on integral humanism and cultural nationalism.",
    founded: "1980",
    headquarters: "New Delhi",
    memberCount: 320000,
    subgroups: [
      {
        id: "parliamentary", name: "Parliamentary Board", type: "Leadership",
        members: [
          { name: "Narendra Modi", roles: [{ variant: "mp", label: "MP" }, { variant: "minister", label: "Prime Minister" }], constituency: "Varanasi, UP", description: "Prime Minister of India since 2014. Previously served as Chief Minister of Gujarat for over 12 years.", avatar: "NM" },
          { name: "Amit Shah", roles: [{ variant: "mp", label: "MP" }, { variant: "minister", label: "Union Minister" }], constituency: "Gandhinagar, Gujarat", description: "Union Minister of Home Affairs and former BJP President. Key strategist behind the party's electoral successes.", avatar: "AS" },
          { name: "Rajnath Singh", roles: [{ variant: "mp", label: "MP" }, { variant: "minister", label: "Defence Minister" }], constituency: "Lucknow, UP", description: "Union Minister of Defence. Former Chief Minister of Uttar Pradesh and former BJP President.", avatar: "RS" },
        ],
      },
      {
        id: "state-up", name: "Uttar Pradesh Unit", type: "State Unit",
        members: [
          { name: "Yogi Adityanath", roles: [{ variant: "mla", label: "MLA" }, { variant: "minister", label: "Chief Minister" }], constituency: "Gorakhpur Urban, UP", description: "Chief Minister of Uttar Pradesh since 2017. Head priest of the Gorakhnath Math.", avatar: "YA" },
          { name: "Keshav Prasad Maurya", roles: [{ variant: "mla", label: "MLA" }], constituency: "Sirathu, UP", description: "Deputy Chief Minister of Uttar Pradesh and senior party leader in the state.", avatar: "KM" },
        ],
      },
      {
        id: "state-mh", name: "Maharashtra Unit", type: "State Unit",
        members: [
          { name: "Devendra Fadnavis", roles: [{ variant: "mla", label: "MLA" }, { variant: "minister", label: "Chief Minister" }], constituency: "Nagpur South West, MH", description: "Chief Minister of Maharashtra. Previously served as CM from 2014 to 2019.", avatar: "DF" },
          { name: "Nitin Gadkari", roles: [{ variant: "mp", label: "MP" }, { variant: "minister", label: "Union Minister" }], constituency: "Nagpur, MH", description: "Senior BJP leader and Union Minister. Known for infrastructure development initiatives.", avatar: "NG" },
        ],
      },
      {
        id: "workers", name: "Party Workers & Karyakartas", type: "Grassroots",
        members: [
          { name: "Suresh Patel", roles: [{ variant: "worker", label: "District President" }], constituency: "Surat, Gujarat", description: "Active party worker since 2005. Leads grassroots mobilization in Surat district.", avatar: "SP" },
          { name: "Meena Sharma", roles: [{ variant: "worker", label: "Mahila Morcha" }], constituency: "Jaipur, Rajasthan", description: "Women's wing leader organizing community welfare programs across Rajasthan.", avatar: "MS" },
        ],
      },
    ],
  },
  inc: {
    name: "Indian National Congress",
    description: "Founded in 1885, one of the oldest political parties in the world. Played a pivotal role in India's independence movement.",
    founded: "1885",
    headquarters: "New Delhi",
    memberCount: 280000,
    subgroups: [
      {
        id: "cwc", name: "Congress Working Committee", type: "Leadership",
        members: [
          { name: "Mallikarjun Kharge", roles: [{ variant: "mp", label: "MP" }, { variant: "leader", label: "Party President" }], constituency: "Rajya Sabha, Karnataka", description: "President of the Indian National Congress. Veteran leader with decades of parliamentary experience.", avatar: "MK" },
          { name: "Rahul Gandhi", roles: [{ variant: "mp", label: "MP" }, { variant: "leader", label: "LoP" }], constituency: "Rae Bareli, UP", description: "Leader of Opposition in Lok Sabha. Former President of the Indian National Congress.", avatar: "RG" },
          { name: "Sonia Gandhi", roles: [{ variant: "former-mp", label: "Former MP" }, { variant: "leader", label: "UPA Chairperson" }], constituency: "Former - Rae Bareli, UP", description: "Former Congress President for over two decades. Led the party to two consecutive general election victories.", avatar: "SG" },
        ],
      },
      {
        id: "state-raj", name: "Rajasthan Unit", type: "State Unit",
        members: [
          { name: "Ashok Gehlot", roles: [{ variant: "former-mp", label: "Former CM" }, { variant: "leader", label: "Senior Leader" }], constituency: "Sardarpura, Rajasthan", description: "Three-time Chief Minister of Rajasthan. One of the most experienced Congress leaders.", avatar: "AG" },
        ],
      },
      {
        id: "youth", name: "Indian Youth Congress", type: "Youth Wing",
        members: [
          { name: "Srinivas B.V.", roles: [{ variant: "leader", label: "IYC President" }], description: "Heads the youth wing of Congress. Known for organizing relief work during COVID-19.", avatar: "SB" },
        ],
      },
    ],
  },
  aap: {
    name: "Aam Aadmi Party",
    description: "Founded in 2012, born out of the anti-corruption movement. Known for focus on education, healthcare, and public utilities.",
    founded: "2012",
    headquarters: "New Delhi",
    memberCount: 195000,
    subgroups: [
      {
        id: "pac", name: "Political Affairs Committee", type: "Leadership",
        members: [
          { name: "Arvind Kejriwal", roles: [{ variant: "mla", label: "MLA" }, { variant: "leader", label: "National Convenor" }], constituency: "New Delhi, Delhi", description: "National Convenor of AAP. Former Chief Minister of Delhi known for education and healthcare reforms.", avatar: "AK" },
          { name: "Bhagwant Mann", roles: [{ variant: "mla", label: "MLA" }, { variant: "minister", label: "Chief Minister" }], constituency: "Dhuri, Punjab", description: "Chief Minister of Punjab since 2022. Former MP and popular public figure.", avatar: "BM" },
        ],
      },
      {
        id: "delhi", name: "Delhi Unit", type: "State Unit",
        members: [
          { name: "Atishi", roles: [{ variant: "mla", label: "MLA" }, { variant: "minister", label: "Minister" }], constituency: "Kalkaji, Delhi", description: "Education Minister in Delhi. Rhodes Scholar credited with transforming Delhi government schools.", avatar: "AT" },
          { name: "Saurabh Bharadwaj", roles: [{ variant: "mla", label: "MLA" }, { variant: "minister", label: "Minister" }], constituency: "Greater Kailash, Delhi", description: "Health Minister in Delhi. Key spokesperson of the party.", avatar: "SB" },
        ],
      },
    ],
  },
  tmc: {
    name: "All India Trinamool Congress",
    description: "Founded in 1998 by Mamata Banerjee. Dominant party in West Bengal state politics.",
    founded: "1998", headquarters: "Kolkata", memberCount: 112000,
    subgroups: [{ id: "leadership", name: "National Leadership", type: "Leadership", members: [
      { name: "Mamata Banerjee", roles: [{ variant: "mla", label: "MLA" }, { variant: "minister", label: "Chief Minister" }], constituency: "Bhowanipore, WB", description: "Founder and Chairperson of TMC. Chief Minister of West Bengal since 2011.", avatar: "MB" },
    ]}],
  },
  dmk: {
    name: "Dravida Munnetra Kazhagam",
    description: "Founded in 1949, a major political party in Tamil Nadu. Rooted in Dravidian ideology and social justice.",
    founded: "1949", headquarters: "Chennai", memberCount: 89000,
    subgroups: [{ id: "leadership", name: "Party Leadership", type: "Leadership", members: [
      { name: "M. K. Stalin", roles: [{ variant: "mla", label: "MLA" }, { variant: "minister", label: "Chief Minister" }], constituency: "Kolathur, TN", description: "Chief Minister of Tamil Nadu and DMK President. Son of party founder M. Karunanidhi.", avatar: "MS" },
    ]}],
  },
  sp: {
    name: "Samajwadi Party",
    description: "Founded in 1992 by Mulayam Singh Yadav. Major political party in Uttar Pradesh advocating democratic socialism.",
    founded: "1992", headquarters: "Lucknow", memberCount: 78000,
    subgroups: [{ id: "leadership", name: "National Leadership", type: "Leadership", members: [
      { name: "Akhilesh Yadav", roles: [{ variant: "mp", label: "MP" }, { variant: "leader", label: "Party President" }], constituency: "Kannauj, UP", description: "National President of Samajwadi Party. Youngest Chief Minister of UP, serving from 2012-2017.", avatar: "AY" },
    ]}],
  },
};

const fallbackParty = {
  name: "Political Party",
  description: "A political party.",
  founded: "—",
  headquarters: "—",
  memberCount: 0,
  subgroups: [],
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function PartyDetailPage() {
  const { id } = useParams();
  const party = partyDatabase[id || ""] || fallbackParty;
  const [expandedGroup, setExpandedGroup] = useState<string | null>(party.subgroups[0]?.id || null);

  return (
    <div className="container py-8 space-y-8">
      <Link to="/parties" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Parties
      </Link>

      {/* Party Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Users className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-card-foreground">{party.name}</h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{party.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{party.memberCount.toLocaleString()} members</span>
              <span>Founded: {party.founded}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{party.headquarters}</span>
              <JoinGroupButton group={{ id: id || "", name: party.name, type: "party", path: `/parties/${id}` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trending */}
      {(() => {
        const trendingTopics: { content: string; tag: string; author: string; likes: number; replies: number; time: string }[] = {
          bjp: [
            { content: "PM Modi's vision for Viksit Bharat 2047 is setting clear development goals. Manufacturing sector response is incredible.", tag: "appreciation", author: "Vikram S.", likes: 567, replies: 89, time: "1h ago" },
            { content: "What is the party's stance on lateral entry into bureaucracy? Mixed reactions from the ground.", tag: "discussion", author: "Ankit M.", likes: 345, replies: 56, time: "3h ago" },
            { content: "BJP IT cell should focus more on policy communication rather than social media trends.", tag: "suggestion", author: "Priya K.", likes: 289, replies: 42, time: "5h ago" },
          ],
          inc: [
            { content: "Rahul Gandhi's Bharat Jodo Nyay Yatra is connecting directly with rural communities. Real impact!", tag: "appreciation", author: "Suresh R.", likes: 423, replies: 67, time: "2h ago" },
            { content: "Congress needs a clearer economic policy position. The current messaging is inconsistent.", tag: "suggestion", author: "Deepak N.", likes: 312, replies: 45, time: "4h ago" },
            { content: "Will Congress support the Women's Reservation Bill implementation timeline?", tag: "question", author: "Kavita J.", likes: 234, replies: 38, time: "6h ago" },
          ],
          aap: [
            { content: "Delhi's education model is being studied by 5 other states. Proof that governance works!", tag: "appreciation", author: "Neha T.", likes: 489, replies: 72, time: "1h ago" },
            { content: "AAP should expand its free electricity model to Punjab more aggressively.", tag: "suggestion", author: "Gurpreet S.", likes: 267, replies: 34, time: "3h ago" },
            { content: "When will AAP announce candidates for upcoming municipal elections?", tag: "question", author: "Rajesh K.", likes: 189, replies: 28, time: "5h ago" },
          ],
          tmc: [
            { content: "Lakshmir Bhandar scheme is helping rural women across Bengal. Direct cash transfer works.", tag: "appreciation", author: "Ananya B.", likes: 345, replies: 45, time: "2h ago" },
          ],
          dmk: [
            { content: "DMK's breakfast scheme for government school children is reducing malnutrition significantly.", tag: "appreciation", author: "Selvi M.", likes: 378, replies: 52, time: "2h ago" },
          ],
          sp: [
            { content: "Akhilesh Yadav's focus on youth employment resonates strongly with UP's young population.", tag: "discussion", author: "Amit Y.", likes: 234, replies: 38, time: "3h ago" },
          ],
        }[id || ""] || [];
        if (trendingTopics.length === 0) return null;
        return (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🔥 Trending in {party.name}
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {trendingTopics.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="h-full flex flex-col">
                    <DiscussionPost
                      postId={`party-${id}-${i}`}
                      author={d.author}
                      tag={d.tag as any}
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

      {/* Subgroups */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Subgroups & Leadership</h2>
        {party.subgroups.map((group) => {
          const isOpen = expandedGroup === group.id;
          return (
            <motion.div key={group.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedGroup(isOpen ? null : group.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors text-left"
              >
                <div>
                  <h3 className="font-semibold text-card-foreground">{group.name}</h3>
                  <p className="text-xs text-muted-foreground">{group.type} · {group.members.length} members</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>

              {isOpen && (
                <motion.div variants={container} initial="hidden" animate="show" className="border-t divide-y">
                  {group.members.map((member, i) => (
                    <motion.div key={i} variants={item} className="p-4 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-card-foreground">{member.name}</span>
                            {member.roles.map((role, j) => (
                              <RoleBadge key={j} variant={role.variant} label={role.label} />
                            ))}
                          </div>
                          {member.constituency && (
                            <p className="text-xs text-accent font-medium mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{member.constituency}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{member.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
