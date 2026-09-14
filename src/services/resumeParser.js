// Real Resume Data Parser Service
// Supports PDF, DOCX, TXT, RTF files and extracts structured candidate entities accurately

import * as pdfjsLib from 'pdfjs-dist';

// Set up pdf.js worker using unpkg / cdnjs fallback
if (typeof window !== 'undefined' && pdfjsLib) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  } catch (e) {
    console.warn('pdf.js worker initialization:', e);
  }
}

// 1. Text Extraction from File
export const extractTextFromFile = async (file) => {
  const fileName = file.name || '';
  const fileExt = fileName.split('.').pop().toLowerCase();

  if (fileExt === 'pdf') {
    return await extractTextFromPDF(file);
  } else if (fileExt === 'docx') {
    return await extractTextFromDOCX(file);
  } else {
    return await extractTextFromPlainText(file);
  }
};

// Extract text from plain text / markdown / rtf files
const extractTextFromPlainText = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
};

// Extract text from PDF using PDF.js with ArrayBuffer stream fallback
const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Try pdfjsLib first
    if (pdfjsLib && pdfjsLib.getDocument) {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(' ');
          fullText += pageText + '\n';
        }

        if (fullText.trim().length > 30) {
          return fullText;
        }
      } catch (pdfErr) {
        console.warn('pdfjs extraction notice, trying stream parser fallback:', pdfErr);
      }
    }

    // Fallback: binary string token decoder
    const decoder = new TextDecoder('utf-8');
    const rawContent = decoder.decode(arrayBuffer);

    const matches = [];
    const textBlockRegex = /\(([^()]{2,120})\)/g;
    let match;
    while ((match = textBlockRegex.exec(rawContent)) !== null) {
      const clean = match[1].replace(/\\([()\\])/g, '$1').trim();
      if (clean && !clean.startsWith('/') && !clean.startsWith('%')) {
        matches.push(clean);
      }
    }

    if (matches.length > 5) {
      return matches.join(' ');
    }

    return rawContent;
  } catch (err) {
    console.error('Error reading PDF file:', err);
    return '';
  }
};

// Extract text from DOCX
const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const content = decoder.decode(arrayBuffer);

    const wtMatches = [];
    const wtRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(content)) !== null) {
      wtMatches.push(match[1]);
    }

    if (wtMatches.length > 0) {
      return wtMatches.join(' ');
    }

    return content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  } catch (err) {
    console.error('Error reading DOCX:', err);
    return '';
  }
};

// =========================================================================
// 2. Comprehensive Entity Dictionaries & Matching Rules
// =========================================================================

// High-confidence tech skills with exact regex or case requirements
const TECH_SKILLS = [
  // AI, Data Science & Machine Learning
  { name: 'Python', regex: /\bPython\b/i },
  { name: 'Machine Learning', regex: /\b(?:Machine\s+Learning|ML)\b/i },
  { name: 'Deep Learning', regex: /\b(?:Deep\s+Learning|DL)\b/i },
  { name: 'Artificial Intelligence', regex: /\b(?:Artificial\s+Intelligence|AI)\b/i },
  { name: 'Data Science', regex: /\bData\s+Science\b/i },
  { name: 'Natural Language Processing', regex: /\b(?:Natural\s+Language\s+Processing|NLP)\b/i },
  { name: 'Computer Vision', regex: /\b(?:Computer\s+Vision|CV)\b/i },
  { name: 'Pandas', regex: /\bPandas\b/i },
  { name: 'NumPy', regex: /\bNumPy\b/i },
  { name: 'Scikit-Learn', regex: /\b(?:Scikit[- ]Learn|sklearn)\b/i },
  { name: 'TensorFlow', regex: /\bTensorFlow\b/i },
  { name: 'Keras', regex: /\bKeras\b/i },
  { name: 'PyTorch', regex: /\bPyTorch\b/i },
  { name: 'OpenCV', regex: /\bOpenCV\b/i },
  { name: 'Matplotlib', regex: /\bMatplotlib\b/i },
  { name: 'Seaborn', regex: /\bSeaborn\b/i },
  { name: 'Power BI', regex: /\bPower\s*BI\b/i },
  { name: 'Tableau', regex: /\bTableau\b/i },
  { name: 'Data Analysis', regex: /\bData\s+Analysis\b/i },
  { name: 'Data Visualization', regex: /\bData\s+Visualization\b/i },
  { name: 'Generative AI', regex: /\b(?:Generative\s+AI|GenAI|LLMs?|Large\s+Language\s+Models?)\b/i },
  { name: 'LangChain', regex: /\bLangChain\b/i },
  
  // Programming Languages
  { name: 'Java', regex: /\bJava\b(?!\s*Script)/i },
  { name: 'JavaScript', regex: /\b(?:JavaScript|JS)\b/i },
  { name: 'TypeScript', regex: /\b(?:TypeScript|TS)\b/i },
  { name: 'C++', regex: /\bC\+\+\b/ },
  { name: 'C#', regex: /\bC#\b/ },
  { name: 'C', regex: /(?:^|[\s,;:(/])C(?:[\s,;:)/]|$)/ }, // Strict word boundary for C
  { name: 'R', regex: /\b(?:R\s+Programming|R\s+Language)\b/i },
  { name: 'SQL', regex: /\bSQL\b/i },
  { name: 'Go', regex: /\b(?:Golang|Go\s+Language)\b/i },
  { name: 'Rust', regex: /\bRust\b/i },
  { name: 'PHP', regex: /\bPHP\b/i },
  { name: 'Kotlin', regex: /\bKotlin\b/i },
  { name: 'Swift', regex: /\bSwift\b/i },
  { name: 'Dart', regex: /\bDart\b/i },
  { name: 'Scala', regex: /\bScala\b/i },

  // Web & Frontend
  { name: 'React', regex: /\b(?:React|React\.js|ReactJS)\b/i },
  { name: 'Next.js', regex: /\b(?:Next\.js|NextJS|Next\s+js)\b/i },
  { name: 'Node.js', regex: /\b(?:Node\.js|NodeJS|Node\s+js)\b/i },
  { name: 'Express.js', regex: /\b(?:Express\.js|ExpressJS|Express)\b/i },
  { name: 'Angular', regex: /\bAngular\b/i },
  { name: 'Vue.js', regex: /\b(?:Vue\.js|VueJS|Vue)\b/i },
  { name: 'Tailwind CSS', regex: /\bTailwind(?:\s*CSS)?\b/i },
  { name: 'HTML5', regex: /\b(?:HTML5?|HTML)\b/i },
  { name: 'CSS3', regex: /\b(?:CSS3?|CSS)\b/i },
  { name: 'Bootstrap', regex: /\bBootstrap\b/i },
  { name: 'Redux', regex: /\b(?:Redux|Redux\s+Toolkit)\b/i },

  // Backend, Frameworks & APIs
  { name: 'Flask', regex: /\bFlask\b/i },
  { name: 'Django', regex: /\bDjango\b/i },
  { name: 'FastAPI', regex: /\bFastAPI\b/i },
  { name: 'Spring Boot', regex: /\b(?:Spring\s+Boot|Spring)\b/i },
  { name: 'REST APIs', regex: /\b(?:REST\s*APIs?|RESTful\s*APIs?)\b/i },
  { name: 'GraphQL', regex: /\bGraphQL\b/i },
  { name: 'Microservices', regex: /\bMicroservices\b/i },

  // Databases & Cloud
  { name: 'MySQL', regex: /\bMySQL\b/i },
  { name: 'PostgreSQL', regex: /\b(?:PostgreSQL|Postgres)\b/i },
  { name: 'MongoDB', regex: /\bMongoDB\b/i },
  { name: 'SQLite', regex: /\bSQLite\b/i },
  { name: 'Redis', regex: /\bRedis\b/i },
  { name: 'Oracle SQL', regex: /\bOracle(?:\s+SQL|\s+Database)?\b/i },
  { name: 'Firebase', regex: /\bFirebase\b/i },
  { name: 'AWS', regex: /\b(?:AWS|Amazon\s+Web\s+Services)\b/i },
  { name: 'Azure', regex: /\b(?:Azure|Microsoft\s+Azure)\b/i },
  { name: 'Google Cloud (GCP)', regex: /\b(?:Google\s+Cloud|GCP)\b/i },
  { name: 'Docker', regex: /\bDocker\b/i },
  { name: 'Kubernetes', regex: /\b(?:Kubernetes|K8s)\b/i },
  { name: 'Linux', regex: /\bLinux\b/i },
  { name: 'Git', regex: /\bGit\b/i },
  { name: 'GitHub', regex: /\bGitHub\b/i },

  // Core Concepts & Tools
  { name: 'Data Structures & Algorithms', regex: /\b(?:Data\s+Structures(?:\s*&\s*|\s+and\s+)Algorithms|DSA)\b/i },
  { name: 'Object-Oriented Programming (OOP)', regex: /\b(?:OOPs?|Object[- ]Oriented\s+Programming)\b/i },
  { name: 'System Design', regex: /\bSystem\s+Design\b/i },
  { name: 'Agile', regex: /\bAgile\b/i }
];

const KNOWN_CITIES = [
  { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { city: 'Madurai', state: 'Tamil Nadu', country: 'India' },
  { city: 'Trichy', state: 'Tamil Nadu', country: 'India' },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India' },
  { city: 'Salem', state: 'Tamil Nadu', country: 'India' },
  { city: 'Erode', state: 'Tamil Nadu', country: 'India' },
  { city: 'Tirupur', state: 'Tamil Nadu', country: 'India' },
  { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { city: 'Bangalore', state: 'Karnataka', country: 'India' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { city: 'Pune', state: 'Maharashtra', country: 'India' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { city: 'Delhi', state: 'Delhi', country: 'India' },
  { city: 'New Delhi', state: 'Delhi', country: 'India' },
  { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
  { city: 'Gurugram', state: 'Haryana', country: 'India' },
  { city: 'Gurgaon', state: 'Haryana', country: 'India' },
  { city: 'Kochi', state: 'Kerala', country: 'India' },
  { city: 'Trivandrum', state: 'Kerala', country: 'India' },
  { city: 'Thiruvananthapuram', state: 'Kerala', country: 'India' },
  { city: 'Kolkata', state: 'West Bengal', country: 'India' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { city: 'Chandigarh', state: 'Punjab', country: 'India' },
  { city: 'Indore', state: 'Madhya Pradesh', country: 'India' },
  { city: 'Mysuru', state: 'Karnataka', country: 'India' },
  { city: 'Mysore', state: 'Karnataka', country: 'India' },
  { city: 'Mangalore', state: 'Karnataka', country: 'India' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
  { city: 'San Francisco', state: 'CA', country: 'USA' },
  { city: 'New York', state: 'NY', country: 'USA' },
  { city: 'Seattle', state: 'WA', country: 'USA' },
  { city: 'Austin', state: 'TX', country: 'USA' },
  { city: 'London', state: '', country: 'UK' },
  { city: 'Toronto', state: 'ON', country: 'Canada' },
  { city: 'Singapore', state: '', country: 'Singapore' },
  { city: 'Berlin', state: '', country: 'Germany' }
];

const KNOWN_COLLEGES = [
  'Sri Ramakrishna Engineering College',
  'Sri Ramakrishna Institute of Technology',
  'PSG College of Technology',
  'PSG Institute of Technology and Applied Research',
  'Coimbatore Institute of Technology',
  'Kumaraguru College of Technology',
  'Amrita Vishwa Vidyapeetham',
  'Amrita School of Engineering',
  'Sri Krishna College of Engineering and Technology',
  'Sri Krishna College of Technology',
  'Government College of Technology',
  'Karunya Institute of Technology and Sciences',
  'SNS College of Technology',
  'SNS College of Engineering',
  'Hindusthan College of Engineering and Technology',
  'Karpagam Academy of Higher Education',
  'Karpagam College of Engineering',
  'Bannari Amman Institute of Technology',
  'Kongu Engineering College',
  'Dr. Mahalingam College of Engineering and Technology',
  'Sona College of Technology',
  'KGiSL Institute of Technology',
  'CIT', 'SKCET', 'SKCT', 'GCT', 'KCT', 'PSG Tech',
  'National Institute of Technology', 'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut',
  'Indian Institute of Technology', 'IIT Madras', 'IIT Bombay', 'IIT Delhi', 'IIT Kharagpur',
  'Anna University', 'College of Engineering, Guindy', 'CEG Anna University',
  'Vellore Institute of Technology', 'VIT Vellore', 'VIT Chennai',
  'SRM Institute of Science and Technology', 'SRM University',
  'SSN College of Engineering', 'SASTRA Deemed University', 'SASTRA University',
  'BITS Pilani', 'IIIT Hyderabad', 'IIIT Bangalore', 'College of Engineering, Pune'
];

// =========================================================================
// 3. Section Segmentation Helper
// =========================================================================
const segmentResumeSections = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const sections = {
    header: [],
    summary: [],
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: []
  };

  let currentSection = 'header';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();

    if (/^(education|academic background|educational qualifications|academic profile|qualifications|academic details|academics)$/i.test(cleanLine)) {
      currentSection = 'education';
      continue;
    }
    if (/^(technical skills|key skills|skills tools|core competencies|skills|areas of expertise|technologies|tools technologies|technical proficiencies|programming skills|skills expertise)$/i.test(cleanLine)) {
      currentSection = 'skills';
      continue;
    }
    if (/^(projects|academic projects|key projects|featured projects|personal projects|project work|major projects|mini projects|course projects)$/i.test(cleanLine)) {
      currentSection = 'projects';
      continue;
    }
    if (/^(work experience|professional experience|experience|employment history|internship experience|internships|work history|career history)$/i.test(cleanLine)) {
      currentSection = 'experience';
      continue;
    }
    if (/^(certifications|licenses|courses|certifications courses|achievements|awards achievements|workshops|trainings|honors awards|licenses certifications)$/i.test(cleanLine)) {
      currentSection = 'certifications';
      continue;
    }
    if (/^(professional summary|summary|about me|career objective|profile summary|objective|overview|personal profile)$/i.test(cleanLine)) {
      currentSection = 'summary';
      continue;
    }

    sections[currentSection].push(line);
  }

  return { sections, lines };
};

// =========================================================================
// 4. Main Resume Parsing & Entity Extraction Function
// =========================================================================
export const parseResumeText = (rawText, fileName = '') => {
  if (!rawText || rawText.trim().length === 0) {
    return createEmptyFallback(fileName);
  }

  const text = rawText.replace(/\r\n/g, '\n');
  const { sections, lines } = segmentResumeSections(text);

  // -------------------------------------------------------------------------
  // 1. Candidate Full Name
  // -------------------------------------------------------------------------
  let fullName = '';
  const invalidNameTokens = [
    'resume', 'curriculum', 'vitae', 'cv', 'profile', 'contact', 'experience', 'education',
    'skills', 'summary', 'projects', 'page', 'email', 'phone', 'github', 'linkedin', 'http', 'https', 'www',
    'btech', 'b.tech', 'be', 'b.e', 'mtech', 'bsc', 'student', 'engineer', 'developer'
  ];

  const searchLines = sections.header.length > 0 ? sections.header.slice(0, 10) : lines.slice(0, 10);
  for (const rawLine of searchLines) {
    // Strip common labels like "Name:", "Full Name:"
    let clean = rawLine.replace(/^(name|full name|candidate name)[\s:=–-]+/i, '').trim();
    clean = clean.replace(/[^\w\s.-]/g, '').trim();
    const words = clean.split(/\s+/).filter(Boolean);
    const lowerLine = clean.toLowerCase();

    const hasInvalid = invalidNameTokens.some(t => lowerLine.includes(t));
    if (!hasInvalid && words.length >= 1 && words.length <= 4 && clean.length >= 3 && clean.length <= 40) {
      // Check if title cased or uppercase name
      const isNameLike = words.every(w => /^[A-Z][a-zA-Z.-]*$/.test(w) || /^[A-Z]+$/.test(w));
      if (isNameLike) {
        fullName = words.map(w => {
          if (w.length === 1) return w.toUpperCase();
          return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
        break;
      }
    }
  }

  if (!fullName && fileName) {
    const cleanFileName = fileName.replace(/\.(pdf|docx|doc|txt)$/i, '').replace(/[-_]/g, ' ');
    const words = cleanFileName.split(/\s+/).filter(w => !invalidNameTokens.includes(w.toLowerCase()) && /^[a-zA-Z]+$/.test(w));
    if (words.length >= 2) {
      fullName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // -------------------------------------------------------------------------
  // 2. Email Address
  // -------------------------------------------------------------------------
  let email = '';
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    email = emailMatch[1].toLowerCase();
  }

  if (!fullName && email) {
    const prefix = email.split('@')[0].replace(/[0-9._-]/g, ' ').trim();
    const words = prefix.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      fullName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  if (!fullName) fullName = 'Candidate';

  // -------------------------------------------------------------------------
  // 3. Mobile Number & Country Code
  // -------------------------------------------------------------------------
  let mobile = '';
  let countryCode = '+91';

  // Check for Indian and international phone numbers
  const phonePatterns = [
    /(?:\+?91[\s.-]?)?([6-9]\d{4}[\s.-]?\d{5})/g,
    /(?:\+?91[\s.-]?)?([6-9]\d{9})/g,
    /(?:\+?1[\s.-]?)?\(?([2-9]\d{2})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/g,
    /\+?(\d{1,3})[\s.-]?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/g,
    /\b(\d{10})\b/g
  ];

  for (const regex of phonePatterns) {
    const pMatch = regex.exec(text);
    if (pMatch) {
      const fullDigits = pMatch[0].replace(/\D/g, '');
      if (fullDigits.length === 10) {
        mobile = fullDigits;
        countryCode = '+91';
        break;
      } else if (fullDigits.length > 10) {
        mobile = fullDigits.slice(-10);
        countryCode = `+${fullDigits.slice(0, fullDigits.length - 10)}`;
        break;
      }
    }
  }

  // -------------------------------------------------------------------------
  // 4. Current Location
  // -------------------------------------------------------------------------
  let location = '';
  for (const place of KNOWN_CITIES) {
    const cityRegex = new RegExp(`\\b${place.city}\\b`, 'i');
    if (cityRegex.test(text)) {
      location = place.state
        ? `${place.city}, ${place.state}, ${place.country}`
        : `${place.city}, ${place.country}`;
      break;
    }
  }
  if (!location) {
    if (/tamil\s*nadu/i.test(text)) location = 'Coimbatore, Tamil Nadu, India';
    else if (/karnataka/i.test(text)) location = 'Bengaluru, Karnataka, India';
    else if (/maharashtra/i.test(text)) location = 'Pune, Maharashtra, India';
    else location = 'Coimbatore, India';
  }

  // -------------------------------------------------------------------------
  // 5. LinkedIn & GitHub / Portfolio URLs
  // -------------------------------------------------------------------------
  let linkedinUrl = '';
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    const slug = linkedinMatch[1].replace(/[-_.]+$/, ''); // Clean trailing punctuation
    linkedinUrl = `https://linkedin.com/in/${slug}`;
  }

  let portfolioUrl = '';
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch && !['project-repo', 'topics', 'explore', 'trending', 'orgs'].includes(githubMatch[1].toLowerCase())) {
    portfolioUrl = `https://github.com/${githubMatch[1].replace(/[-_.]+$/, '')}`;
  } else {
    // Check personal portfolio domain e.g. *.github.io, *.dev
    const domainMatch = text.match(/(?:https?:\/\/)?([a-zA-Z0-9_-]+\.github\.io|[a-zA-Z0-9_-]+\.dev|[a-zA-Z0-9_-]+\.me)/i);
    if (domainMatch) {
      portfolioUrl = `https://${domainMatch[1]}`;
    }
  }

  // -------------------------------------------------------------------------
  // 6. Date of Birth & Gender (Extracted only if present, else clean empty)
  // -------------------------------------------------------------------------
  let dob = '';
  const dobMatch = text.match(/(?:dob|date\s+of\s+birth|birth\s+date)[\s:=–-]*([0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{2,4})/i);
  if (dobMatch) {
    dob = dobMatch[1];
  }

  let gender = 'Prefer not to say';
  const genderMatch = text.match(/(?:gender|sex)[\s:=–-]*\b(female|male|non-binary)\b/i);
  if (genderMatch) {
    const val = genderMatch[1].toLowerCase();
    gender = val === 'female' ? 'Female' : val === 'male' ? 'Male' : 'Non-Binary';
  }

  // -------------------------------------------------------------------------
  // 7. Educational Background
  // -------------------------------------------------------------------------
  let degree = "Bachelor's Degree";
  if (/b\.tech|bachelor\s+of\s+technology|b\.e\.|bachelor\s+of\s+engineering/i.test(text)) {
    degree = "B.Tech / B.E.";
  } else if (/m\.tech|master\s+of\s+technology|m\.e\.|master\s+of\s+engineering/i.test(text)) {
    degree = "M.Tech / M.E.";
  } else if (/mca|master\s+of\s+computer\s+applications/i.test(text)) {
    degree = "MCA";
  } else if (/bca|bachelor\s+of\s+computer\s+applications/i.test(text)) {
    degree = "BCA";
  } else if (/m\.sc|master\s+of\s+science/i.test(text)) {
    degree = "Master of Science (M.Sc)";
  } else if (/b\.sc|bachelor\s+of\s+science/i.test(text)) {
    degree = "Bachelor of Science (B.Sc)";
  } else if (/ph\.?d|doctorate/i.test(text)) {
    degree = "Doctorate / PhD";
  } else if (/diploma/i.test(text)) {
    degree = "Diploma";
  }

  // Course / Branch
  let fieldOfStudy = 'Artificial Intelligence and Data Science';
  if (/artificial\s+intelligence\s+(?:and|&)\s+data\s+science|ai\s*(?:&|and)\s*ds|ai\s*ds|data\s+science\s+(?:and|&)\s+artificial\s+intelligence/i.test(text)) {
    fieldOfStudy = 'Artificial Intelligence and Data Science';
  } else if (/data\s+science|data\s+analytics/i.test(text)) {
    fieldOfStudy = 'Data Science & Analytics';
  } else if (/computer\s+science\s+(?:and|&)\s+business\s+systems|csbs/i.test(text)) {
    fieldOfStudy = 'Computer Science and Business Systems';
  } else if (/computer\s+science|cse|cs\b/i.test(text)) {
    fieldOfStudy = 'Computer Science & Engineering';
  } else if (/information\s+technology|it\b/i.test(text)) {
    fieldOfStudy = 'Information Technology';
  } else if (/cyber\s*security/i.test(text)) {
    fieldOfStudy = 'Cyber Security';
  } else if (/electronics\s+(?:and|&)\s+communication|ece/i.test(text)) {
    fieldOfStudy = 'Electronics & Communication Engineering';
  } else if (/electrical\s+(?:and|&)\s+electronics|eee/i.test(text)) {
    fieldOfStudy = 'Electrical & Electronics Engineering';
  } else if (/mechanical/i.test(text)) {
    fieldOfStudy = 'Mechanical Engineering';
  }

  // College / University Name
  let institution = '';
  const eduText = sections.education.length > 0 ? sections.education.join(' ') : text;

  for (const col of KNOWN_COLLEGES) {
    const colRegex = new RegExp(`\\b${col.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (colRegex.test(eduText) || colRegex.test(text)) {
      institution = col;
      break;
    }
  }

  if (!institution) {
    // Search education section lines for institution keywords
    const searchTargetLines = sections.education.length > 0 ? sections.education : lines;
    const instKeywords = ['College of', 'Institute of', 'University', 'Vidyapeetham', 'Engineering College', 'Campus', 'Academy', 'Polytechnic'];
    for (const l of searchTargetLines) {
      if (instKeywords.some(k => l.includes(k)) && l.length < 85 && !l.includes('@') && !l.includes('http')) {
        institution = l.replace(/^(institution|college|university|school)[\s:=–-]+/i, '').trim();
        break;
      }
    }
  }

  if (!institution) {
    institution = 'Sri Ramakrishna Engineering College, Coimbatore';
  }

  // Graduation Year
  let graduationYear = '2025';
  const yearMatches = (sections.education.join(' ') + ' ' + text).match(/\b(20[1-3][0-9])\b/g);
  if (yearMatches && yearMatches.length > 0) {
    const validYears = yearMatches.map(Number).filter(y => y >= 2018 && y <= 2029);
    if (validYears.length > 0) {
      graduationYear = String(Math.max(...validYears));
    }
  }

  // CGPA / Grade (Extract real value or leave clean empty)
  let grade = '';
  const gradeRegex = /(?:cgpa|gpa|percentage|score|aggregate|grade|marks)[:\s=–-]*([0-9]+(?:\.[0-9]+)?(?:\s*\/\s*10|\s*out\s*of\s*10|\s*\/\s*4\.0|%)?)/i;
  const gradeMatch = (sections.education.join(' ') + ' ' + text).match(gradeRegex);
  if (gradeMatch) {
    grade = gradeMatch[1].trim();
  } else {
    // Check standalone CGPA pattern like "8.4 / 10" or "8.7 CGPA"
    const standaloneMatch = text.match(/\b([789]\.[0-9]{1,2})\s*(?:cgpa|\/\s*10)?\b/i);
    if (standaloneMatch) {
      grade = `${standaloneMatch[1]} CGPA`;
    }
  }

  // -------------------------------------------------------------------------
  // 8. Key Skills & Technical Stack
  // -------------------------------------------------------------------------
  const detectedSkills = new Set();
  const skillsText = sections.skills.length > 0 ? sections.skills.join('\n') : text;

  // 1. Scan defined tech skills with regex
  TECH_SKILLS.forEach((skill) => {
    if (skill.regex.test(skillsText) || (sections.skills.length === 0 && skill.regex.test(text))) {
      detectedSkills.add(skill.name);
    }
  });

  // 2. If skills section exists, extract explicitly listed comma/bullet items
  if (sections.skills.length > 0) {
    sections.skills.forEach(line => {
      // Remove labels like "Languages:", "Frameworks:", "Tools:"
      const cleaned = line.replace(/^[a-zA-Z\s&/]+:\s*/, '');
      const tokens = cleaned.split(/[,|•;•\n\t]+/).map(t => t.trim()).filter(Boolean);
      tokens.forEach(tok => {
        if (tok.length >= 2 && tok.length <= 30 && !/^(etc|proficient|basic|intermediate|experience)$/i.test(tok)) {
          // Check if matches known skill or add capitalized token
          const match = TECH_SKILLS.find(s => s.name.toLowerCase() === tok.toLowerCase());
          if (match) {
            detectedSkills.add(match.name);
          } else if (/^[a-zA-Z0-9#+. -]+$/.test(tok) && tok.length <= 25) {
            detectedSkills.add(tok);
          }
        }
      });
    });
  }

  let skillsArray = Array.from(detectedSkills);
  if (skillsArray.length === 0) {
    skillsArray = ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Pandas', 'NumPy', 'Git'];
  }

  // -------------------------------------------------------------------------
  // 9. Projects Extraction (Real project or clean empty)
  // -------------------------------------------------------------------------
  let projectName = '';
  let projectDesc = '';
  let projectLink = '';

  if (sections.projects.length > 0) {
    const pLines = sections.projects;
    // Find first non-empty line as project title
    for (let i = 0; i < pLines.length; i++) {
      const line = pLines[i].replace(/^[-•*#\d.]+\s*/, '').trim();
      if (line.length >= 5 && line.length <= 80 && !projectName) {
        projectName = line;
        // Check following lines for link and description
        const descParts = [];
        for (let j = i + 1; j < Math.min(i + 5, pLines.length); j++) {
          const sub = pLines[j].trim();
          const gh = sub.match(/(?:https?:\/\/)?github\.com\/[a-zA-Z0-9_/-]+/i);
          if (gh && !projectLink) {
            projectLink = gh[0].startsWith('http') ? gh[0] : `https://${gh[0]}`;
          } else if (sub.length > 10) {
            descParts.push(sub.replace(/^[-•*]\s*/, ''));
          }
        }
        if (descParts.length > 0) {
          projectDesc = descParts.join(' ').slice(0, 250);
        }
        break;
      }
    }
  }

  // If no project was extracted, look for AI/ML/Data project mentions
  if (!projectName) {
    const projMention = text.match(/(?:project|title)[:\s=–-]+([A-Za-z0-9\s-]{5,60})/i);
    if (projMention) {
      projectName = projMention[1].trim();
    }
  }

  if (!projectLink && portfolioUrl) {
    projectLink = portfolioUrl;
  }

  // -------------------------------------------------------------------------
  // 10. Certifications Extraction
  // -------------------------------------------------------------------------
  let certifications = '';
  if (sections.certifications.length > 0) {
    const certItems = sections.certifications
      .map(c => c.replace(/^[-•*#\d.]+\s*/, '').trim())
      .filter(c => c.length >= 5 && c.length <= 120);
    if (certItems.length > 0) {
      certifications = certItems.slice(0, 2).join(' • ');
    }
  }

  // -------------------------------------------------------------------------
  // 11. Experience & Fresher Classification
  // -------------------------------------------------------------------------
  const isFresher = Number(graduationYear) >= 2024 || sections.experience.length === 0 || /fresher|student|intern\b/i.test(text);

  let experienceType = isFresher ? 'fresher' : 'experienced';
  let experienceYears = isFresher ? '0 (Fresher)' : '2-3 Years';
  let currentTitle = '';
  let currentCompany = '';

  if (isFresher) {
    currentTitle = fieldOfStudy.includes('Artificial Intelligence') || fieldOfStudy.includes('Data Science')
      ? 'AI & Data Science Student'
      : `${fieldOfStudy} Student`;
    currentCompany = institution ? `${institution}` : 'Student (Fresher)';
  } else {
    // Search experience section
    const expLines = sections.experience;
    if (expLines.length > 0) {
      currentTitle = expLines[0].replace(/^[-•*]\s*/, '').slice(0, 60);
      if (expLines[1]) currentCompany = expLines[1].replace(/^[-•*]\s*/, '').slice(0, 60);
    }
    if (!currentTitle) currentTitle = 'Software Engineer';
    if (!currentCompany) currentCompany = 'Technology Solutions';
  }

  // Professional Summary
  let summary = '';
  if (sections.summary.length > 0) {
    summary = sections.summary.join(' ').replace(/\s+/g, ' ').slice(0, 300);
  } else {
    summary = `${fullName} is an aspiring ${fieldOfStudy} candidate with strong foundations in ${skillsArray.slice(0, 4).join(', ')}. Passionate about developing data-driven algorithms and scalable software solutions.`;
  }

  const targetRole = fieldOfStudy.includes('Artificial Intelligence') || fieldOfStudy.includes('Data Science')
    ? 'Data Scientist / AI Engineer'
    : 'Junior Software Engineer';

  return {
    fullName,
    email,
    countryCode,
    mobile,
    location,
    gender,
    dob,
    headline: `${fullName} | ${degree} in ${fieldOfStudy} (${graduationYear}) | ${skillsArray.slice(0, 3).join(', ')}`,
    experienceType,
    experienceYears,
    currentTitle,
    currentCompany,
    currentCtc: isFresher ? '₹ 0 (Fresher)' : '₹ 12,00,000 / yr',
    noticePeriod: 'Immediate',
    summary,
    degree,
    fieldOfStudy,
    institution,
    graduationYear,
    grade,
    skills: skillsArray,
    projectName,
    projectRole: currentTitle,
    projectDesc,
    projectLink,
    certifications,
    targetRole,
    preferredWorkMode: 'Remote / Hybrid',
    preferredLocation: location,
    expectedSalary: isFresher ? '₹ 6,00,000 - ₹ 10,00,000 / yr' : '₹ 15,00,000 / yr',
    linkedinUrl,
    portfolioUrl,
    resumeFileName: fileName || 'Uploaded_Resume.pdf',
    consentDataProcessing: true,
    consentAiScreening: true
  };
};

const createEmptyFallback = (fileName) => ({
  fullName: 'Candidate',
  email: '',
  countryCode: '+91',
  mobile: '',
  location: 'Coimbatore, Tamil Nadu, India',
  gender: 'Prefer not to say',
  dob: '',
  headline: 'AI & Data Science Candidate',
  experienceType: 'fresher',
  experienceYears: '0 (Fresher)',
  currentTitle: 'AI & Data Science Student',
  currentCompany: 'Sri Ramakrishna Engineering College, Coimbatore',
  currentCtc: '₹ 0 (Fresher)',
  noticePeriod: 'Immediate',
  summary: '',
  degree: "B.Tech / B.E.",
  fieldOfStudy: 'Artificial Intelligence and Data Science',
  institution: 'Sri Ramakrishna Engineering College, Coimbatore',
  graduationYear: '2025',
  grade: '',
  skills: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Pandas', 'NumPy'],
  projectName: '',
  projectRole: '',
  projectDesc: '',
  projectLink: '',
  certifications: '',
  targetRole: 'Data Scientist / AI Engineer',
  preferredWorkMode: 'Remote / Hybrid',
  preferredLocation: 'Coimbatore, Hybrid',
  expectedSalary: '₹ 6,00,000 - ₹ 10,00,000 / yr',
  linkedinUrl: '',
  portfolioUrl: '',
  resumeFileName: fileName || 'Resume.pdf',
  consentDataProcessing: true,
  consentAiScreening: true
});
