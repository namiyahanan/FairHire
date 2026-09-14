// Software Engineering Roles — Complete Preparation Guide & Interview Playbook Data

export const GENERAL_PREPARATION_CHECKLIST = [
  {
    step: 1,
    action: 'Build a strong GitHub portfolio with 3–5 well-documented projects',
    details: 'Ensure clean README files, live demo links, architecture diagrams, and clean code documentation.',
    category: 'Portfolio'
  },
  {
    step: 2,
    action: 'Practice DSA on LeetCode/HackerRank (varies in intensity by role)',
    details: 'Focus on arrays, strings, hashmaps, trees, and dynamic programming based on your target engineering track.',
    category: 'Algorithms'
  },
  {
    step: 3,
    action: 'Prepare a clear, structured resume with quantified achievements',
    details: 'Highlight metrics (e.g. reduced load time by 35%, handled 10k requests/sec) and EEOC-compliant skill tags.',
    category: 'Resume'
  },
  {
    step: 4,
    action: 'Practice behavioral/HR questions using the STAR method',
    details: 'Structure your answers using Situation, Task, Action, and Result for conflict resolution and leadership questions.',
    category: 'Behavioral'
  },
  {
    step: 5,
    action: 'Do mock interviews (Pramp, Interviewing.io, or with peers)',
    details: 'Simulate high-pressure live coding and system design whiteboard defense with real-time feedback.',
    category: 'Mocks'
  },
  {
    step: 6,
    action: "Research the company's tech stack and recent products before interviews",
    details: 'Read engineering blogs (Netflix TechBlog, Uber Engineering) and tailor your system design trade-offs.',
    category: 'Research'
  },
  {
    step: 7,
    action: 'Prepare questions to ask interviewers (shows genuine interest)',
    details: 'Ask thoughtful questions on deployment velocity, team on-call culture, architectural roadmap, and scalability challenges.',
    category: 'Engagement'
  }
];

export const PREPARATION_GUIDE_ROLES = [
  // ================= 1. FRONTEND ENGINEER =================
  {
    id: 'role-frontend',
    title: 'Frontend Engineer',
    icon: '🌐',
    trackId: 'WEB',
    trackBadge: 'Web & App Dev',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    salary: '₹22 - 32 LPA ($125k)',
    location: 'Coimbatore, Tamil Nadu',
    postedTime: '1d ago',
    description: 'Responsible for building what users see on screen. Their resume text will be screened for user interface layouts, responsiveness, and performance.',
    screeningCriteria: 'User interface layouts, responsiveness, and performance.',
    tags: ['React 18', 'Responsive Design', 'Core Web Vitals', 'TypeScript', 'CSS3 Layouts'],
    mandatoryKnowledge: [
      'HTML5, CSS3 (Flexbox, Grid), JavaScript (ES6+)',
      'DOM manipulation, browser rendering, event loop basics',
      'Responsive & mobile-first design principles',
      'Web accessibility (WCAG basics)'
    ],
    requiredSkills: [
      'A modern framework: React (most in-demand), Vue, or Angular',
      'State management: Redux, Zustand, Context API',
      'CSS frameworks: Tailwind, Bootstrap, or styled-components',
      'Version control: Git/GitHub',
      'Basic build tools: Webpack/Vite, npm/yarn',
      'API integration (REST, sometimes GraphQL)',
      'Browser DevTools debugging & performance profiling',
      'Testing: Jest, React Testing Library, Cypress (nice-to-have)'
    ],
    interviewRounds: [
      { round: 1, name: 'Resume/HR screening call', description: 'Cultural fit, communication skills, and compensation expectations.' },
      { round: 2, name: 'Online coding assessment', description: 'DSA fundamentals (arrays, strings, hashmaps) + JS-specific questions.' },
      { round: 3, name: 'Technical round 1 — Live Coding', description: 'Build an interactive UI component, state management, or fix a frontend bug.' },
      { round: 4, name: 'Technical round 2 — Frontend System Design', description: 'Frontend architecture, component modularity, performance profiling, and deep-dive on projects.' },
      { round: 5, name: 'HR / Engineering Managerial round', description: 'Team fit, past conflict resolution, and architectural leadership.' }
    ],
    recommendedCourses: [
      { title: 'Responsive Web Design & JavaScript Algorithms', provider: 'freeCodeCamp', type: 'Free', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
      { title: 'Meta Front-End Developer Certificate', provider: 'Coursera', type: 'Certified', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
      { title: 'The Odin Project', provider: 'Open Source', type: 'Free & Project-Based', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
      { title: 'Frontend Masters: Advanced Web Development', provider: 'Frontend Masters', type: 'Advanced Paid', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' }
    ],
    stepsToPrepare: [
      'Master HTML/CSS/JS fundamentals before jumping to frameworks',
      'Build 3–4 real projects (portfolio site, e-commerce UI, dashboard, clone of a popular app)',
      'Learn one framework deeply rather than several shallowly',
      'Practice DSA basics (arrays, strings, hashmaps — frontend rounds are lighter on DSA than backend)',
      'Learn browser performance concepts (lazy loading, reflow/repaint, bundle size)',
      'Keep a GitHub portfolio with clean, documented code'
    ]
  },

  // ================= 2. BACKEND ENGINEER =================
  {
    id: 'role-backend',
    title: 'Backend Engineer',
    icon: '🖥️',
    trackId: 'WEB',
    trackBadge: 'Web & App Dev',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    salary: '₹25 - 35 LPA ($135k)',
    location: 'Coimbatore, Tamil Nadu',
    postedTime: 'Just now',
    description: 'Manages the server, data pipelines, and internal business logic. Evaluated for server stability, data security, and efficient processing logic.',
    screeningCriteria: 'Server stability, data security, and efficient processing logic.',
    tags: ['Node.js', 'Go', 'Data Pipelines', 'Data Security', 'Microservices', 'PostgreSQL', 'Redis'],
    mandatoryKnowledge: [
      'One backend language: Node.js, Python, Java, or Go',
      'HTTP protocol, REST API design principles',
      'Relational & NoSQL databases (SQL, MongoDB)',
      'Authentication/authorization (JWT, OAuth, sessions)',
      'Data structures & algorithms (strong emphasis)'
    ],
    requiredSkills: [
      'Framework: Express/NestJS (Node), Django/FastAPI (Python), Spring Boot (Java)',
      'Database design & query optimization',
      'Caching (Redis), message queues (Kafka, RabbitMQ) — for mid/senior roles',
      'API security (rate limiting, input validation, encryption basics)',
      'Unit/integration testing',
      'Basic cloud/server deployment (AWS/GCP basics)',
      'Version control: Git'
    ],
    interviewRounds: [
      { round: 1, name: 'Resume/HR screening', description: 'Recruiter screen, domain review, and role timeline alignment.' },
      { round: 2, name: 'Online DSA assessment', description: 'Timed algorithmic challenges on trees, graphs, sorting, and dynamic programming.' },
      { round: 3, name: 'Technical round 1 — DSA / Coding', description: 'Live coding with algorithm complexity analysis (Time & Space complexity).' },
      { round: 4, name: 'Technical round 2 — System Design', description: 'Design a scalable API/service, caching layers, and database schema design.' },
      { round: 5, name: 'Technical round 3 — Project Deep-Dive', description: 'Language/framework internals, connection pooling, and concurrency management.' },
      { round: 6, name: 'HR / Managerial round', description: 'Engineering culture, cross-team collaboration, and career roadmap.' }
    ],
    recommendedCourses: [
      { title: 'CS50: Introduction to Computer Science', provider: 'Harvard (edX)', type: 'Free Fundamentals', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { title: 'Official Node.js / Django Mastery & Bootcamp', provider: 'Official Docs / Udemy', type: 'Practical Hands-on', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
      { title: 'Grokking the System Design Interview', provider: 'Educative.io', type: 'Industry Standard', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { title: 'AWS Certified Cloud Practitioner', provider: 'Amazon Web Services', type: 'Cloud Certification', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' }
    ],
    stepsToPrepare: [
      'Get comfortable with DSA — this is heavily tested for backend roles (LeetCode 150–200 problems)',
      'Build a full backend service with authentication, database, and API documentation (Swagger)',
      'Learn database indexing, normalization, and query optimization',
      'Study basic system design (load balancing, caching, database sharding)',
      'Understand security fundamentals (SQL injection, XSS, CSRF)',
      'Deploy at least one project on a cloud platform'
    ]
  },

  // ================= 3. FULL STACK ENGINEER =================
  {
    id: 'role-fullstack',
    title: 'Full Stack Engineer',
    icon: '🔄',
    trackId: 'WEB',
    trackBadge: 'Web & App Dev',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    salary: '₹30 - 42 LPA ($150k)',
    location: 'Coimbatore, Tamil Nadu',
    postedTime: '2d ago',
    description: 'A versatile developer who understands both frontend layouts and backend server systems.',
    screeningCriteria: 'Versatile understanding of frontend layouts and backend server architectures.',
    tags: ['React 18', 'Node.js / Express', 'PostgreSQL', 'Full Stack Architecture', 'REST & GraphQL'],
    mandatoryKnowledge: [
      'Everything from Frontend + Backend tracks (lighter depth, wider breadth)',
      'Understanding of client-server architecture end-to-end'
    ],
    requiredSkills: [
      'One frontend framework (React is most common) + one backend stack (Node/Express is a common pairing)',
      'Database basics (SQL + NoSQL)',
      'REST API design & consumption',
      'Git, deployment basics (Vercel, Netlify, Heroku, AWS)',
      'Understanding of the full software development lifecycle (SDLC)'
    ],
    interviewRounds: [
      { round: 1, name: 'Resume/HR screening', description: 'Initial alignment on broad stack experience and availability.' },
      { round: 2, name: 'Coding assessment', description: 'DSA challenge of moderate algorithmic difficulty + full stack logic.' },
      { round: 3, name: 'Technical round 1 — Frontend Coding', description: 'Interactive client-side implementation and state management.' },
      { round: 4, name: 'Technical round 2 — Backend Coding', description: 'API contracts, database mutations, and server-side validation.' },
      { round: 5, name: 'System design round', description: 'End-to-end app architecture, hydration, data flow, and load balancing.' },
      { round: 6, name: 'HR / Managerial round', description: 'Product mindset, ownership, and stakeholder collaboration.' }
    ],
    recommendedCourses: [
      { title: 'The Odin Project — Full Stack JavaScript Path', provider: 'Open Source', type: 'Free Full-Stack', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
      { title: 'Full Stack Open (Deep Dive to Modern Web)', provider: 'University of Helsinki', type: 'Accredited Free', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
      { title: 'Meta Full-Stack Developer Certificate', provider: 'Coursera / Meta', type: 'Professional Cert', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' }
    ],
    stepsToPrepare: [
      'Build 2–3 complete end-to-end applications (frontend + backend + database + deployment)',
      'Practice DSA moderately (not as intense as pure backend roles, but still needed)',
      'Learn to explain trade-offs between frontend and backend design decisions',
      'Get comfortable with at least one cloud deployment platform',
      'Document your projects well — full stack interviews rely heavily on project deep-dives'
    ]
  },

  // ================= 4. DATABASE ADMINISTRATOR (DBA) =================
  {
    id: 'role-dba',
    title: 'Database Administrator (DBA)',
    icon: '🗄️',
    trackId: 'DATA',
    trackBadge: 'Data & Infra',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    salary: '₹22 - 32 LPA',
    location: 'Coimbatore, Tamil Nadu',
    postedTime: '4d ago',
    description: 'Focuses entirely on storage systems. Their track screens for structural organization, query execution speeds, and user partition safety.',
    screeningCriteria: 'Structural organization, query execution speeds, and user partition safety.',
    tags: ['PostgreSQL', 'Query Optimization', 'Partition Safety', 'Indexing', 'Storage Systems'],
    mandatoryKnowledge: [
      'SQL (advanced level) — joins, subqueries, window functions',
      'Database design & normalization (1NF–3NF, BCNF)',
      'Indexing strategies & query optimization',
      'Transactions, ACID properties, concurrency control'
    ],
    requiredSkills: [
      'RDBMS expertise: MySQL, PostgreSQL, Oracle, or SQL Server',
      'Backup & recovery strategies',
      'User access control & partition/security management',
      'Performance tuning & monitoring tools',
      'Basic scripting (Python/Bash) for automation',
      'Familiarity with NoSQL (MongoDB) is a plus'
    ],
    interviewRounds: [
      { round: 1, name: 'Resume/HR screening', description: 'Database technologies, RDBMS certifications, and on-call willingness.' },
      { round: 2, name: 'Technical assessment', description: 'Advanced SQL query writing, CTEs, window functions, and schema design.' },
      { round: 3, name: 'Technical round — Query Tuning', description: 'Query optimization, indexing strategies, EXPLAIN execution plans, and slow query diagnostics.' },
      { round: 4, name: 'Scenario-based round', description: 'Disaster recovery planning, WAL archiving, replication topologies, and high availability.' },
      { round: 5, name: 'HR / Managerial round', description: 'Incident defense, security compliance, and maintenance window planning.' }
    ],
    recommendedCourses: [
      { title: 'Oracle Certified Professional (OCP) — DBA', provider: 'Oracle University', type: 'Industry Standard', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
      { title: 'Azure Database Administrator Associate (DP-300)', provider: 'Microsoft Learn', type: 'Cloud DBA Cert', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
      { title: 'PostgreSQL / MySQL Official Certification Tracks', provider: 'PostgreSQL Org', type: 'Professional Track', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
      { title: 'Database Design & Relational Modeling', provider: 'Univ of Colorado (Coursera)', type: 'Academic Theory', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' }
    ],
    stepsToPrepare: [
      'Practice writing complex SQL queries (joins, window functions, CTEs)',
      'Learn to read and interpret query execution plans',
      'Set up a local database and practice indexing/performance tuning',
      'Study backup/restore procedures and simulate failure recovery',
      'Understand user roles, permissions, and partitioning for data safety'
    ]
  },

  // ================= 5. DEVOPS ENGINEER =================
  {
    id: 'role-devops',
    title: 'DevOps Engineer',
    icon: '☁️',
    trackId: 'DATA',
    trackBadge: 'Data & Infra',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    salary: '₹26 - 36 LPA ($140k)',
    location: 'Coimbatore, Tamil Nadu',
    postedTime: '3d ago',
    description: 'Manages cloud deployment, system stability, and automatic server scaling. Ensures environments support high traffic without freezing.',
    screeningCriteria: 'Cloud deployment, system stability, and automatic server scaling for high simultaneous user traffic.',
    tags: ['Kubernetes', 'Docker', 'Auto-Scaling', 'Terraform', 'CI/CD Pipelines', 'AWS'],
    mandatoryKnowledge: [
      'Linux fundamentals & shell scripting',
      'Networking basics (DNS, load balancing, firewalls)',
      'CI/CD pipeline concepts',
      'Containerization & orchestration concepts'
    ],
    requiredSkills: [
      'Docker & Kubernetes',
      'CI/CD tools: Jenkins, GitHub Actions, GitLab CI',
      'Infrastructure as Code: Terraform, Ansible',
      'Cloud platforms: AWS, Azure, or GCP (pick one deeply)',
      'Monitoring/logging: Prometheus, Grafana, ELK stack',
      'Scripting: Bash, Python'
    ],
    interviewRounds: [
      { round: 1, name: 'Resume/HR screening', description: 'Infrastructure tooling background and cloud deployment experience.' },
      { round: 2, name: 'Technical assessment', description: 'Linux system administration, shell scripting tasks, and container troubleshooting.' },
      { round: 3, name: 'Technical round 1 — CI/CD & Containers', description: 'CI/CD pipeline design, Docker multi-stage builds, and Kubernetes manifests.' },
      { round: 4, name: 'Technical round 2 — System Architecture & Chaos', description: 'High availability, multi-region failovers, IaC modularity, and traffic spike defense.' },
      { round: 5, name: 'HR / Managerial round', description: 'SRE culture, blameless post-mortems, and release governance.' }
    ],
    recommendedCourses: [
      { title: 'AWS Certified Solutions Architect / DevOps Engineer', provider: 'AWS Training', type: 'Elite Cloud Cert', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
      { title: 'Certified Kubernetes Administrator (CKA)', provider: 'Linux Foundation / CNCF', type: 'Hands-on Performance', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
      { title: 'Docker Certified Associate (DCA)', provider: 'Docker Inc.', type: 'Containerization Cert', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
      { title: 'DevOps Bootcamp & Hands-on Labs', provider: 'KodeKloud / Udemy', type: 'Practical Projects', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' }
    ],
    stepsToPrepare: [
      'Get hands-on with Docker — containerize a real application',
      'Learn Kubernetes basics (pods, deployments, services)',
      'Build a CI/CD pipeline for a personal project (GitHub Actions is a good free start)',
      'Learn one cloud platform deeply and get certified',
      'Practice troubleshooting scenarios (server down, traffic spike, deployment failure)'
    ]
  },

  // ================= 6. DATA SCIENTIST =================
  {
    id: 'role-datascientist',
    title: 'Data Scientist',
    icon: '🧠',
    trackId: 'ADVANCED',
    trackBadge: 'Advanced Eng',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    salary: '₹28 - 38 LPA',
    location: 'Coimbatore, Tamil Nadu',
    postedTime: '5d ago',
    description: 'Analyzes large datasets to find patterns. Their resume evaluation tracks mathematical modeling and statistical analysis.',
    screeningCriteria: 'Mathematical modeling and statistical analysis on large datasets to discover patterns.',
    tags: ['Mathematical Modeling', 'Statistical Analysis', 'Python / Pandas', 'Pattern Discovery', 'Machine Learning'],
    mandatoryKnowledge: [
      'Statistics & probability (hypothesis testing, distributions)',
      'Linear algebra & calculus fundamentals',
      'Python (or R) for data analysis',
      'SQL for data extraction'
    ],
    requiredSkills: [
      'Libraries: Pandas, NumPy, Matplotlib/Seaborn, Scikit-learn',
      'Data cleaning & exploratory data analysis (EDA)',
      'Statistical modeling & hypothesis testing',
      'Data visualization & storytelling (Tableau/Power BI is a plus)',
      'Basic machine learning algorithms (regression, classification, clustering)'
    ],
    interviewRounds: [
      { round: 1, name: 'Resume/HR screening', description: 'Academic background, research publications, and data project review.' },
      { round: 2, name: 'Online assessment', description: 'Statistics, probability calculations, advanced SQL queries, and Python data structures.' },
      { round: 3, name: 'Technical round 1 — Case Study / Take-Home', description: 'Take-home dataset analysis, exploratory data analysis, and feature hypothesis report.' },
      { round: 4, name: 'Technical round 2 — Stats & Live ML Coding', description: 'Live coding on Scikit-learn algorithms, model evaluation metrics, and p-value derivation.' },
      { round: 5, name: 'Business / Product Sense round', description: 'Communicating data insights and model trade-offs to non-technical executive stakeholders.' },
      { round: 6, name: 'HR / Managerial round', description: 'Ethics in AI, data privacy compliance, and team alignment.' }
    ],
    recommendedCourses: [
      { title: 'Google Data Analytics Professional Certificate', provider: 'Coursera / Google', type: 'Industry Recognized', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
      { title: 'IBM Data Science Professional Certificate', provider: 'Coursera / IBM', type: 'Hands-on Labs', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { title: 'Statistics with Python Specialization', provider: 'University of Michigan', type: 'Mathematical Theory', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
      { title: 'Kaggle Micro-Courses & Competitions', provider: 'Kaggle', type: 'Free & Practical', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' }
    ],
    stepsToPrepare: [
      'Build a strong foundation in statistics before jumping to ML',
      'Practice SQL query writing extensively (this is asked in nearly every interview)',
      'Work on 3–4 end-to-end data projects (EDA → modeling → visualization → insights)',
      'Participate in Kaggle competitions to build a portfolio',
      'Practice explaining technical findings in simple, business-friendly language'
    ]
  },

  // ================= 7. AI/ML ENGINEER =================
  {
    id: 'role-aiml',
    title: 'AI/ML Engineer',
    icon: '🤖',
    trackId: 'ADVANCED',
    trackBadge: 'Advanced Eng',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    salary: '₹35 - 50 LPA ($165k)',
    location: 'Coimbatore, Tamil Nadu',
    postedTime: 'Just now',
    description: 'Builds and deploys intelligent models. Focuses heavily on machine learning model design and data preparation pipelines.',
    screeningCriteria: 'Machine learning model design and robust data preparation pipelines.',
    tags: ['Machine Learning Model Design', 'Data Preparation Pipelines', 'PyTorch', 'Vector Embeddings', 'MLOps'],
    mandatoryKnowledge: [
      'Strong Python programming',
      'Linear algebra, probability, calculus (for understanding model internals)',
      'Machine learning fundamentals (supervised/unsupervised learning)',
      'Deep learning basics (neural networks, backpropagation)'
    ],
    requiredSkills: [
      'Frameworks: TensorFlow, PyTorch',
      'ML libraries: Scikit-learn, XGBoost',
      'Data preprocessing & feature engineering pipelines',
      'Model deployment: Flask/FastAPI, Docker, cloud ML services (SageMaker, Vertex AI)',
      'MLOps basics: model versioning, monitoring, retraining pipelines',
      'NLP/Computer Vision specialization (depending on target role)'
    ],
    interviewRounds: [
      { round: 1, name: 'Resume/HR screening', description: 'Screening on ML framework background, model training experience, and publications.' },
      { round: 2, name: 'Online assessment', description: 'Python algorithms, matrix calculus, probability, and foundational ML questions.' },
      { round: 3, name: 'Technical round 1 — ML Theory & Math', description: 'Bias-variance trade-off, gradient descent variants, loss function formulation, and metric evaluation.' },
      { round: 4, name: 'Technical round 2 — Live Coding', description: 'Implement an algorithm from scratch (e.g. attention, backprop, k-means) and debug a pipeline.' },
      { round: 5, name: 'Technical round 3 — ML System Design & MLOps', description: 'Design a large-scale real-time recommendation or RAG system, model serving latency, and drift detection.' },
      { round: 6, name: 'HR / Managerial round', description: 'AI safety, ethical fairness considerations, and enterprise roadmap.' }
    ],
    recommendedCourses: [
      { title: 'Machine Learning Specialization', provider: 'DeepLearning.AI / Andrew Ng', type: 'Gold Standard', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
      { title: 'Deep Learning Specialization', provider: 'DeepLearning.AI', type: 'Neural Net Mastery', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
      { title: 'Practical Deep Learning for Coders', provider: 'Fast.ai', type: 'Free & Code-First', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
      { title: 'TensorFlow Developer / AWS ML Specialty', provider: 'Google / AWS', type: 'Official Industry Cert', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' }
    ],
    stepsToPrepare: [
      'Build strong math foundations (linear algebra, probability, optimization)',
      'Implement classic ML algorithms from scratch at least once (not just using libraries)',
      'Build 3–4 projects covering different domains (NLP, computer vision, tabular data)',
      'Learn to deploy a model as an API — this is increasingly asked in interviews',
      'Stay updated with recent papers/trends (read summaries on arXiv, follow ML newsletters)',
      'Practice explaining model decisions and trade-offs (interpretability matters)'
    ]
  }
];
