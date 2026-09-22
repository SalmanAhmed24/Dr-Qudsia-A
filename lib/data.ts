export type RegionKey =
  | "middle-east"
  | "south-asia"
  | "indian-ocean"
  | "eurasia"
  | "africa";
export type FilterKey = "all" | RegionKey | "theory";

type Pin = [label: string, lat: number, lon: number];

export const HOME: [number, number] = [31.55, 74.35]; // Lahore
export const HOME_COUNTRY = "586"; // Pakistan

export const REGIONS: Record<
  RegionKey,
  {
    name: string;
    center: [number, number];
    zoom: number;
    color: string;
    countries: string[];
    pins: Pin[];
  }
> = {
  "middle-east": {
    name: "the Middle East",
    center: [31, 42],
    zoom: 1.7,
    color: "#FF9F6E",
    countries: ["760", "368", "364", "422", "376", "275"], // Syria, Iraq, Iran, Lebanon, Israel, Palestine
    pins: [
      ["Syria", 35, 38.5],
      ["Iraq", 33.3, 44.4],
      ["Iran", 32.4, 53.7],
      ["Lebanon", 33.9, 35.9],
      ["Israel", 31.5, 34.9],
    ],
  },
  "south-asia": {
    name: "South Asia",
    center: [24, 78],
    zoom: 1.5,
    color: "#3FD3A0",
    countries: ["004", "356", "050", "144"], // Afghanistan, India, Bangladesh, Sri Lanka
    pins: [
      ["Afghanistan", 34.5, 69.2],
      ["India", 22, 79],
      ["Bangladesh", 23.7, 90.4],
      ["Sri Lanka", 7.9, 80.7],
    ],
  },
  "indian-ocean": {
    name: "the Indian Ocean",
    center: [8, 80],
    zoom: 1.25,
    color: "#43B5F5",
    countries: ["262", "458", "360"], // Djibouti, Malaysia, Indonesia
    pins: [
      ["Strait of Malacca", 2.5, 101.5],
      ["Indian Ocean", -8, 76],
      ["Djibouti", 11.6, 43.1],
      ["South China Sea", 12, 114],
    ],
  },
  eurasia: {
    name: "Russia and Eurasia",
    center: [52, 48],
    zoom: 1.3,
    color: "#9B84FF",
    countries: ["643", "804", "031", "051", "398", "860", "795", "762", "417"], // Russia, Ukraine, Caucasus, Central Asia
    pins: [
      ["Moscow", 55.75, 37.6],
      ["Ukraine", 49, 32],
      ["Nagorno-Karabakh", 39.8, 46.7],
      ["Central Asia", 41.3, 64.5],
      ["Arctic", 76, 40],
    ],
  },
  africa: {
    name: "Africa",
    center: [6, 22],
    zoom: 1.35,
    color: "#F2B500",
    countries: ["566", "404"], // Nigeria, Kenya
    pins: [
      ["Nigeria", 9.1, 7.4],
      ["Kenya", -1.3, 36.8],
    ],
  },
};

export const isRegion = (k: FilterKey | null | undefined): k is RegionKey =>
  !!k && Object.prototype.hasOwnProperty.call(REGIONS, k);

export const FILTERS: {
  key: FilterKey;
  label: string;
  long: string;
  color: string;
}[] = [
  {
    key: "all",
    label: "All regions",
    long: "all regions",
    color: "var(--sky)",
  },
  {
    key: "middle-east",
    label: "Middle East",
    long: "the Middle East",
    color: "var(--peach)",
  },
  {
    key: "south-asia",
    label: "South Asia",
    long: "South Asia",
    color: "var(--mint)",
  },
  {
    key: "indian-ocean",
    label: "Indian Ocean",
    long: "the Indian Ocean",
    color: "var(--sky)",
  },
  {
    key: "eurasia",
    label: "Russia and Eurasia",
    long: "Russia and Eurasia",
    color: "var(--lilac)",
  },
  { key: "africa", label: "Africa", long: "Africa", color: "var(--sun)" },
  { key: "theory", label: "Theory", long: "theory", color: "var(--pink)" },
];

export const filterColor = (k: FilterKey) =>
  FILTERS.find((f) => f.key === k)?.color ?? "var(--sky)";
export const filterLabel = (k: FilterKey) =>
  FILTERS.find((f) => f.key === k)?.label ?? k;

export type Publication = {
  title: string;
  year: number;
  coauthors: string;
  venue: string;
  regions: Exclude<FilterKey, "all">[];
  category: "X" | "Y";
};

export const PUBLICATIONS: Publication[] = [
  {
    title:
      "Russian foreign policy ideas and principles in the post-Cold War era and the geo-strategic approach under President Vladimir Putin",
    year: 2025,
    coauthors: "with Sayeba Sagheer",
    venue: "The Journal of Political Science, XLII",
    regions: ["eurasia"],
    category: "Y",
  },
  {
    title: "Islamic State Khorasan (ISIS-K) in post-US-withdrawal Afghanistan",
    year: 2024,
    coauthors: "with N. Asif",
    venue: "Journal of Professional Research in Social Sciences 11(1), 215–242",
    regions: ["south-asia"],
    category: "Y",
  },
  {
    title:
      "Decoding the operational latitude of Russian private military companies: the Wagner Group in Syria",
    year: 2024,
    coauthors: "with Ayesha Ashraf",
    venue: "NUST Journal of International Peace & Stability 7(2), 32–43",
    regions: ["middle-east", "eurasia"],
    category: "Y",
  },
  {
    title: "Sino-Indian port politics in the Indian Ocean region",
    year: 2024,
    coauthors: "with M. Butt",
    venue: "Journal of Nautical Eye and Strategic Studies 4(1), 182–208",
    regions: ["indian-ocean"],
    category: "Y",
  },
  {
    title:
      "Indo-Israel strategic cooperation: challenges and implications for Pakistan",
    year: 2021,
    coauthors: "with Laila Ahmed and Summaya Shahid",
    venue: "Pakistan Journal of Social Research 3(3), 290–300",
    regions: ["south-asia", "middle-east"],
    category: "Y",
  },
  {
    title:
      "Terrorism and counter-terrorism in Africa: Boko Haram and Al-Qaeda in Nigeria",
    year: 2021,
    coauthors: "with Arusha Siddique and Fatima Afzal",
    venue: "Pakistan Journal of International Affairs, 13–30",
    regions: ["africa"],
    category: "Y",
  },
  {
    title:
      "From extremism to terrorism: threat implications of saffron terrorism for South Asia",
    year: 2021,
    coauthors: "with Arusha Siddique",
    venue: "Pakistan Journal of International Affairs",
    regions: ["south-asia"],
    category: "Y",
  },
  {
    title:
      "Strategic culture and nuclear arms: an action–reaction model between India and Pakistan",
    year: 2020,
    coauthors: "with Syeda Freena Naqvi",
    venue: "Journal of Research and Reviews in Social Sciences",
    regions: ["south-asia"],
    category: "Y",
  },
  {
    title:
      "Theoretical conceptualization of the migration–security nexus in International Relations theory",
    year: 2020,
    coauthors: "with Najam ud Din Farani",
    venue: "Journal of Politics and International Studies, 105–120",
    regions: ["theory"],
    category: "Y",
  },
  {
    title: "China’s Malacca dilemma: power politics in the Indian Ocean",
    year: 2019,
    coauthors: "with Munazza Fareed",
    venue: "Journal of Politics and International Studies 5(2)",
    regions: ["indian-ocean"],
    category: "X",
  },
  {
    title:
      "Islamic State of Iraq and the Levant and the Syrian crisis: challenge or opportunity for major powers in the Middle East",
    year: 2018,
    coauthors: "",
    venue: "The Journal of Political Science, 33–54",
    regions: ["middle-east"],
    category: "Y",
  },
];

export const FACTS = [
  { value: 11, label: "journal articles" },
  { value: 19, label: "conference papers" },
  { value: 40, label: "theses supervised" },
  { value: 13, label: "years teaching" },
];

export const TIMELINE = [
  {
    year: "2006",
    label: "2006",
    color: "var(--sky)",
    title: "BS (Hons) International Relations",
    body: "Lahore College for Women University. Thesis on the civil bureaucracy’s role in Pakistan’s Afghanistan policy, 1993–1996.",
  },
  {
    year: "2011",
    label: "2011",
    color: "var(--mint)",
    title: "M.Phil. at Quaid-i-Azam University",
    body: "Islamabad. Thesis on U.S. sanctions on Iran, read through a legal lens.",
  },
  {
    year: "2012",
    label: "2012",
    color: "var(--pink)",
    title: "Delegate for Pakistan",
    body: "Represented Pakistan at the International Women Awakening Conference in Iran.",
  },
  {
    year: "2013",
    label: "2013",
    color: "var(--sun)",
    title: "Lecturer, College of Law",
    body: "Permanent faculty at the University of Lahore, teaching research methodology and the history of South Asia.",
  },
  {
    year: "2015",
    label: "2015",
    color: "var(--lilac)",
    title: "PhD begins",
    body: "University of the Punjab, under Dr Iram Khalid, while continuing as a visiting lecturer in law.",
  },
  {
    year: "2017",
    label: "2017",
    color: "var(--peach)",
    title: "Lecturer, Kinnaird College",
    body: "Joins the Department of International Relations, teaching theory, foreign policy and area studies.",
  },
  {
    year: "2019",
    label: "2019",
    color: "var(--sky)",
    title: "Doctorate and Assistant Professor",
    body: "PhD on ISIS and major-power politics in the Middle East, 2006–2016. Appointed Assistant Professor and British Council Facilitator.",
  },
  {
    year: "2026",
    label: "Now",
    color: "var(--mint)",
    title: "Building the department",
    body: "Led the launch of the department’s PhD programme and its HEC programme review, and moderates sessions on AI and global security.",
  },
];

export const COURSES = [
  {
    level: "PhD",
    note: "Doctoral",
    items: ["Advanced Research Methodology", "Foreign Policy Analysis"],
  },
  {
    level: "M.Phil.",
    note: "Postgraduate",
    items: [
      "Advanced Research Methodology",
      "Advanced Theories in IR",
      "Global Order and the Muslim World",
      "Politics of the Middle East and Gulf",
    ],
  },
  {
    level: "BS",
    note: "Undergraduate",
    items: [
      "Research Methodology",
      "Foreign Policy of Pakistan",
      "Area Studies: East, Central and South Asia",
      "Area Studies: Latin America",
    ],
  },
];

export type Thesis = { title: string; by: string; color: string };

export const THESES_MPHIL: Thesis[] = [
  {
    title: "Securitization of AI: Sino-US fifth-generation warfare in Taiwan",
    by: "Sayeba Sagheer, M.Phil. 2025",
    color: "var(--lilac)",
  },
  {
    title: "Türkiye’s Blue Homeland doctrine in the Eastern Mediterranean",
    by: "Alisha Shams, M.Phil. 2025",
    color: "var(--sky)",
  },
  {
    title: "Propaganda in the Middle Eastern security complex: Iran and Israel",
    by: "Zainab, M.Phil. 2025",
    color: "var(--pink)",
  },
  {
    title: "Sino-Japanese strategies in the Indo-Pacific",
    by: "Maha Tayyab, M.Phil. 2025",
    color: "var(--mint)",
  },
  {
    title: "Securitization of India’s regional ambitions in the BJP era",
    by: "Areesha Ahmed, M.Phil. 2026",
    color: "var(--sun)",
  },
  {
    title: "Russo-Ukraine war: regional and global implications",
    by: "Attiya, M.Phil. 2023",
    color: "var(--peach)",
  },
  {
    title: "ISIS-K in Afghanistan: security implications for Pakistan",
    by: "Naureen Asif, M.Phil. 2023",
    color: "var(--lilac)",
  },
  {
    title: "Sino-Indian economic competition in Africa",
    by: "Afseh Asif, M.Phil. 2023",
    color: "var(--sky)",
  },
  {
    title: "Russian private military companies in Syria",
    by: "Ayesha Ashraf, M.Phil. 2021",
    color: "var(--pink)",
  },
  {
    title: "China’s Malacca dilemma and Indian Ocean maritime politics",
    by: "Munazza Fareed, M.Phil. 2018",
    color: "var(--mint)",
  },
];

export const THESES_BS: Thesis[] = [
  {
    title: "Russo-US power politics in the Arctic and climate change",
    by: "Hiba Ahsan and Ezza Tariq, BS 2025",
    color: "var(--sun)",
  },
  {
    title: "Climate-induced migration among Kenya’s pastoralists",
    by: "Areeba Afzal, Komal Fatima and Zainab Anwar, BS 2025",
    color: "var(--mint)",
  },
  {
    title: "Qatar’s soft power diplomacy in the GCC",
    by: "Laiba Asad and Areeha Chaudhry, BS 2024",
    color: "var(--pink)",
  },
  {
    title: "Russia’s new-generation warfare in Nagorno-Karabakh",
    by: "Mehrunissa Khan Tareen and Fizza Abbas, BS 2024",
    color: "var(--lilac)",
  },
  {
    title: "China’s interests in East Africa: Kenya and Djibouti",
    by: "Maryam Tahir and Abiha Gul, BS 2024",
    color: "var(--sky)",
  },
  {
    title: "Water security and Indian hydro-aggression on Bangladesh",
    by: "Harram Akhtar and Hamna Dogar, BS 2023",
    color: "var(--peach)",
  },
  {
    title: "Chinese soft power in Central Asia under the BRI",
    by: "Hamda Iqbal and Mahum Fatima, BS 2022",
    color: "var(--sun)",
  },
  {
    title: "Indo-China competition in the South China Sea",
    by: "Faryal Shahid and Yemeen Hassan, BS 2022",
    color: "var(--mint)",
  },
  {
    title: "The Saudi-Iranian rivalry and its impact on Syria and Yemen",
    by: "Sana Butt, Fatima Safdar and Ayesha Ashraf, BS 2020",
    color: "var(--pink)",
  },
];

export type Talk = {
  date: string;
  year: string;
  title: string;
  where: string;
  featured?: boolean;
};

export const TALKS: Talk[] = [
  {
    date: "2025-11",
    year: "2025",
    featured: true,
    title:
      "The emerging security architecture in the Eastern Mediterranean: Blue Homeland doctrine vs trilateral partnership",
    where:
      "International Conference on Re-Thinking Security, University of Management and Technology, with Alisha Shams",
  },
  {
    date: "2025-04",
    year: "2025",
    featured: true,
    title:
      "Harnessing cultural diversity for tourism: lessons from India for Pakistan’s economic growth",
    where:
      "Conference on Culture and Economic Growth, Beaconhouse National University, with Ramsha Tariq",
  },
  {
    date: "2024-10",
    year: "2024",
    featured: true,
    title:
      "Nuclearization of Central Asia: power politics, challenges and implications, 2009–2024",
    where: "Central Asia in the Changing World, ICWAS, University of Karachi",
  },
  {
    date: "2024-02",
    year: "2024",
    featured: true,
    title:
      "Instability in Lebanon: assessing the role of Hezbollah since the Cold War",
    where:
      "International Conference on Social Sciences and Humanities, Kinnaird College, with Warda Badar",
  },
  {
    date: "2024-02",
    year: "2024",
    featured: true,
    title:
      "Populist leadership and global relations: Trumpian populism and US foreign policy",
    where:
      "International Conference on Social Sciences and Humanities, Kinnaird College, with Hamna Dogar",
  },
  {
    date: "2023-02",
    year: "2023",
    featured: true,
    title: "Impediments to trade connectivity through OBOR within the region",
    where:
      "Belt & Road Initiative in Regional Connectivity, University of the Punjab",
  },
  {
    date: "2024-02",
    year: "2024",
    title: "Water security and climate change in India–Bangladesh relations",
    where:
      "International Conference on Social Sciences and Humanities, Kinnaird College, with Harram Akhtar",
  },
  {
    date: "2022-07",
    year: "2022",
    title:
      "Complex security and connectivity between Central Asia and Pakistan under OBOR",
    where:
      "Belt & Road Initiative in Regional Connectivity, University of the Punjab",
  },
  {
    date: "2022-05",
    year: "2022",
    title:
      "External and violent non-state actors in civil war: the Syrian conflict",
    where:
      "3rd International Conference on Social Sciences and Humanities, Kinnaird College, with Arusha Siddique",
  },
  {
    date: "2022-05",
    year: "2022",
    title: "Iran–Israel relations: implications for Middle Eastern politics",
    where:
      "3rd International Conference on Social Sciences and Humanities, Kinnaird College, with Izza Khawar and Vaneeza Khalid",
  },
  {
    date: "2022-05",
    year: "2022",
    title: "Indo-China strategic competition in the South China Sea, 2013–2020",
    where:
      "3rd International Conference on Social Sciences and Humanities, Kinnaird College, with Yemeen Hasan",
  },
  {
    date: "2022-05",
    year: "2022",
    title:
      "Societal implications of socio-economic problems in Africa, 2000–2021",
    where:
      "3rd International Conference on Social Sciences and Humanities, Kinnaird College, with Saleha Safdar and Jannat Naseeb",
  },
  {
    date: "2022-03",
    year: "2022",
    title: "Chinese foreign policy and the South Asian regional order",
    where:
      "Deciphering Global Security Architecture in the 21st Century, University of the Punjab and CGSS",
  },
  {
    date: "2021-12",
    year: "2021",
    title: "Food insecurity and agriculture policy ramifications for Pakistan",
    where: "University of the Punjab and CGSS, Al Razi Hall",
  },
  {
    date: "2021-07",
    year: "2021",
    title:
      "Communication and miscommunication in the Covid-19 era: challenges for Pakistan",
    where: "National Conference, University of the Punjab",
  },
  {
    date: "2020-06",
    year: "2020",
    title: "ISIL: the role of Turkey and Russia in the Middle East",
    where: "International Conference of Political Economy",
  },
  {
    date: "2019-10",
    year: "2019",
    title:
      "A critical analysis of U.S. irregular warfare policy towards Islamic State",
    where:
      "2nd International Conference on Social Sciences and Humanities, Kinnaird College, with Ayesha Ashraf",
  },
  {
    date: "2014-08",
    year: "2014",
    title: "Gordian knots in access to facts: a hurdle for legal research",
    where: "University of Swat Conference, HEC sponsored",
  },
  {
    date: "2014-08",
    year: "2014",
    title: "Paucity of information and the law of torts in Pakistan",
    where: "University of Swat Conference, HEC sponsored, with Uneeb Mumtaz",
  },
];

export const PANELS = [
  {
    title:
      "What would Mearsheimer do? Reviewing Mearsheimer.ai as a teaching tool",
    where: "Moderator, Kinnaird College, February 2026",
  },
  {
    title: "AI-enabled terrorism: emerging threats and countermeasures",
    where: "Moderator, Kinnaird College, February 2026",
  },
  {
    title: "Global security challenges: from terrorism to cyber threats",
    where: "Guest lecture, Riphah Institute, November 2024",
  },
  {
    title:
      "Botanical and environmental resilience through IR in achieving the SDGs",
    where: "Panel, Kinnaird College, April 2024",
  },
  {
    title: "Promoting sustainable practices in the maritime sector",
    where: "3rd Winter School, Minhaj University, December 2023",
  },
];

export const DUTIES = [
  {
    title: "Launched the PhD programme",
    body: "Led academic planning, approvals and implementation for the department’s PhD in International Relations.",
  },
  {
    title: "Programme review for HEC",
    body: "Coordinated the Program Review and Enhancement Exercise, from data collection to quality assurance.",
  },
  {
    title: "British Council Facilitator since 2019",
    body: "Manages partnerships, programme delivery and capacity building at Kinnaird College.",
  },
  {
    title: "Board of Studies",
    body: "Shapes curriculum design and review as a member of the departmental board.",
  },
  {
    title: "Research partnerships",
    body: "Primary liaison with national research bodies, including the Institute of Public Diplomacy.",
  },
];
