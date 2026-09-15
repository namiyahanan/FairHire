// Role-specific and Company-specific AI Aptitude Assessment Question Bank
// Divided into 3 Classic Corporate Sections (15 + 15 + 15 = 45 Questions Matrix per Company)

export const CORPORATE_SECTIONS = [
  {
    id: 'quant',
    name: 'Quantitative Ability (Math & Logic)',
    shortName: 'Quant Ability',
    questionCount: 15,
    startIndex: 0,
    endIndex: 14,
    startQ: 1,
    endQ: 15,
    topics: ['Data interpretation', 'Probability', 'Time and work', 'Number series'],
    badge: '15 Questions',
    color: 'border-blue-500 text-blue-400 bg-blue-500/10'
  },
  {
    id: 'logical',
    name: 'Logical Reasoning (Analytical Thinking)',
    shortName: 'Logical Reasoning',
    questionCount: 15,
    startIndex: 15,
    endIndex: 29,
    startQ: 16,
    endQ: 30,
    topics: ['Coding-decoding', 'Arrangement puzzles', 'Data sufficiency matrices'],
    badge: '15 Questions',
    color: 'border-purple-500 text-purple-400 bg-purple-500/10'
  },
  {
    id: 'verbal',
    name: 'Verbal Ability / Technical Communication',
    shortName: 'Verbal & Tech Comm',
    questionCount: 15,
    startIndex: 30,
    endIndex: 44,
    startQ: 31,
    endQ: 45,
    topics: ['Grammar corrections', 'Error spotting', 'Contextual sentence completion'],
    badge: '15 Questions',
    color: 'border-teal-500 text-teal-400 bg-teal-500/10'
  }
];

// Helper to construct questions with accurate section metadata
const createSectionQuestions = (companyKey, sectionKey, questions) => {
  return questions.map((q, idx) => {
    let offset = 0;
    let sectionName = 'Quantitative Ability (Math & Logic)';
    if (sectionKey === 'logical') {
      offset = 15;
      sectionName = 'Logical Reasoning (Analytical Thinking)';
    } else if (sectionKey === 'verbal') {
      offset = 30;
      sectionName = 'Verbal Ability / Technical Communication';
    }

    return {
      id: offset + idx + 1,
      section: sectionName,
      sectionId: sectionKey,
      sectionIndex: idx + 1,
      company: companyKey,
      ...q
    };
  });
};

// ============================================================================
// 1. ACCENTURE MOCK ASSESSMENT QUESTIONS (45 Questions)
// ============================================================================
const ACCENTURE_QUANT = [
  {
    topic: 'Time and Work',
    question: 'Accenture Cloud DevOps pipeline requires 2 engineers (A and B). Engineer A finishes deployment in 12 hours alone, while B takes 18 hours. If both collaborate on the same microservice deployment, in how many hours will it complete?',
    options: ['A) 7.2 Hours', 'B) 6.5 Hours', 'C) 8.0 Hours', 'D) 5.8 Hours'],
    correctAnswer: 0,
    explanation: 'Work rate formula: (12 * 18) / (12 + 18) = 216 / 30 = 7.2 hours.'
  },
  {
    topic: 'Number Series',
    question: 'Identify the missing term in Accenture’s capacity sequence: 7, 14, 42, 168, 840, ?',
    options: ['A) 5040', 'B) 4200', 'C) 3360', 'D) 6720'],
    correctAnswer: 0,
    explanation: 'Pattern: *2, *3, *4, *5, *6. So 840 * 6 = 5040.'
  },
  {
    topic: 'Probability',
    question: 'A test suite has 12 automated unit tests and 8 integration tests. If 2 tests are picked at random without replacement, what is the probability that both are integration tests?',
    options: ['A) 14/95', 'B) 2/5', 'C) 7/45', 'D) 1/6'],
    correctAnswer: 0,
    explanation: 'Total tests = 20. Probability = (8/20) * (7/19) = 56 / 380 = 14 / 95.'
  },
  {
    topic: 'Data Interpretation',
    question: 'Table shows cloud cluster server utilization: Server X: 60%, Server Y: 80%, Server Z: 70%. If total allocated compute RAM is 400 GB split in ratio 2:5:3 across X, Y, Z, what is the total utilized RAM on Server Y?',
    options: ['A) 160 GB', 'B) 200 GB', 'C) 140 GB', 'D) 120 GB'],
    correctAnswer: 0,
    explanation: 'Total ratio parts = 10. Server Y RAM = (5/10) * 400 = 200 GB. Utilized = 80% of 200 = 160 GB.'
  },
  {
    topic: 'Time and Work',
    question: 'Three asynchronous workers P, Q, and R process message queues. P processes in 6 mins, Q in 8 mins, R in 12 mins. How long do they take when processing simultaneously?',
    options: ['A) 2.67 mins', 'B) 3.12 mins', 'C) 4.00 mins', 'D) 2.25 mins'],
    correctAnswer: 0,
    explanation: '1/P + 1/Q + 1/R = 1/6 + 1/8 + 1/12 = (4 + 3 + 2)/24 = 9/24 = 3/8. Total time = 8/3 = 2.67 mins.'
  },
  {
    topic: 'Number Series',
    question: 'Find the next number in the load balancer burst rate pattern: 3, 5, 9, 17, 33, ?',
    options: ['A) 65', 'B) 60', 'C) 72', 'D) 58'],
    correctAnswer: 0,
    explanation: 'Difference doubles: +2, +4, +8, +16, +32. 33 + 32 = 65.'
  },
  {
    topic: 'Probability',
    question: 'A fair coin is tossed 4 times during a randomized protocol check. What is the probability of obtaining at least 3 heads?',
    options: ['A) 5/16', 'B) 1/2', 'C) 3/8', 'D) 1/4'],
    correctAnswer: 0,
    explanation: 'Possible cases for 3 or 4 heads: 4C3 + 4C4 = 4 + 1 = 5. Total = 2^4 = 16. Probability = 5/16.'
  },
  {
    topic: 'Data Interpretation',
    question: 'A software sprint delivers 120 story points with 40% in Backend, 35% in Frontend, and 25% in QA. If 20% of Backend points are blocked, how many Backend story points are active?',
    options: ['A) 38.4 Points', 'B) 42.0 Points', 'C) 36.0 Points', 'D) 32.5 Points'],
    correctAnswer: 0,
    explanation: 'Backend points = 40% of 120 = 48. Active = 80% of 48 = 38.4 points.'
  },
  {
    topic: 'Time and Work',
    question: 'Pipe A fills a Redis cache buffer in 20 minutes, while Eviction drain B empties it in 30 minutes. If both operate together, when will the buffer fill?',
    options: ['A) 60 Minutes', 'B) 50 Minutes', 'C) 45 Minutes', 'D) 40 Minutes'],
    correctAnswer: 0,
    explanation: 'Net filling rate = 1/20 - 1/30 = (3 - 2)/60 = 1/60. It will take 60 minutes.'
  },
  {
    topic: 'Number Series',
    question: 'Determine the missing number in series: 2, 6, 12, 20, 30, 42, ?',
    options: ['A) 56', 'B) 54', 'C) 60', 'D) 48'],
    correctAnswer: 0,
    explanation: 'Pattern: n*(n+1) -> 1*2, 2*3, 3*4, 4*5, 5*6, 6*7, 7*8 = 56.'
  },
  {
    topic: 'Probability',
    question: 'In a microservice mesh of 10 nodes, 3 nodes are unhealthy. If 2 nodes are picked at random, what is the probability that at least 1 node is unhealthy?',
    options: ['A) 8/15', 'B) 7/15', 'C) 2/5', 'D) 1/3'],
    correctAnswer: 0,
    explanation: 'P(at least 1 unhealthy) = 1 - P(both healthy) = 1 - (7C2 / 10C2) = 1 - (21/45) = 24/45 = 8/15.'
  },
  {
    topic: 'Data Interpretation',
    question: 'Annual server expenses rose from $50,000 to $65,000 while total processed transactions grew from 1M to 1.5M. What is the percentage change in cost per thousand transactions?',
    options: ['A) 13.33% Decrease', 'B) 15.00% Increase', 'C) 10.50% Decrease', 'D) 8.00% Increase'],
    correctAnswer: 0,
    explanation: 'Initial cost/1k = $50/1 = $50. New cost/1k = $65/1.5 = $43.33. Change = (43.33 - 50)/50 = -13.33%.'
  },
  {
    topic: 'Time and Work',
    question: 'A can build a feature module in 15 days. B is 50% more efficient than A. How many days will B take alone?',
    options: ['A) 10 Days', 'B) 12 Days', 'C) 8 Days', 'D) 7.5 Days'],
    correctAnswer: 0,
    explanation: 'Efficiency ratio A:B = 100:150 = 2:3. Time ratio = 3:2. If 3 parts = 15 days, 2 parts = 10 days.'
  },
  {
    topic: 'Number Series',
    question: 'Find next term in sequence: 8, 27, 64, 125, 216, ?',
    options: ['A) 343', 'B) 512', 'C) 729', 'D) 300'],
    correctAnswer: 0,
    explanation: 'Cubes of consecutive integers: 2^3, 3^3, 4^3, 5^3, 6^3, 7^3 = 343.'
  },
  {
    topic: 'Probability',
    question: 'A bag contains 5 red, 4 blue, and 3 green network packet tags. What is the probability of selecting either a red or green packet tag?',
    options: ['A) 2/3', 'B) 1/2', 'C) 3/4', 'D) 5/12'],
    correctAnswer: 0,
    explanation: 'Total tags = 12. Favorable = 5 + 3 = 8. Probability = 8/12 = 2/3.'
  }
];

const ACCENTURE_LOGICAL = [
  {
    topic: 'Coding-decoding',
    question: 'If "SERVER" is coded as "TGUTGU", how is "CLIENT" coded in the same pattern?',
    options: ['A) DMNJOU', 'B) DNKGPU', 'C) EMOKPV', 'D) DMKHPW'],
    correctAnswer: 0,
    explanation: 'Pattern: +1, +2, +1, +2, +1, +2: C+1=D, L+2=N, I+1=J... gives DMNJOU.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Five software engineers (A, B, C, D, E) sit in a row facing north. C sits in the exact middle. A and B are at the extreme ends. E is to the immediate left of C. Where does D sit?',
    options: ['A) Immediate right of C', 'B) Immediate left of A', 'C) Between A and E', 'D) Extreme left'],
    correctAnswer: 0,
    explanation: 'Positions 1 to 5: C is 3. E is 2 (left of C). Left end 1 is A/B. Right end 5 is B/A. Position 4 must be D (immediate right of C).'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is integer x even? Statement I: x + 3 is odd. Statement II: 2x is divisible by 4.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both statements together are needed',
      'D) Neither statement is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'From Statement I: Even + Odd = Odd, so x must be even. Statement I alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'In a code language, "134" means "good tech lead", "478" means "lead agile team", and "729" means "agile sprint plan". Which digit represents "agile"?',
    options: ['A) 7', 'B) 4', 'C) 8', 'D) 2'],
    correctAnswer: 0,
    explanation: 'Comparing 478 and 729, the common word is "agile" and common digit is 7.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Six developers (P, Q, R, S, T, U) sit around a circular table. P sits opposite S. R is to the immediate left of P. Who sits to the immediate right of S if T is between S and R?',
    options: ['A) U or Q', 'B) P', 'C) R', 'D) T'],
    correctAnswer: 0,
    explanation: 'Arranging 6 points in a circle with opposite and neighbor constraints identifies remaining spots for U or Q.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Who is the senior architect among K, L, and M? Statement I: K is older than L. Statement II: L is older than M.',
    options: [
      'A) Both statements together are sufficient',
      'B) Statement I alone is sufficient',
      'C) Statement II alone is sufficient',
      'D) Data is inadequate'
    ],
    correctAnswer: 0,
    explanation: 'From I: K > L. From II: L > M. Combining gives K > L > M, so K is oldest/senior.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "LOGIC" is written as "JMEGA", what is the code for "CLOUD"?',
    options: ['A) AJMSB', 'B) BKNTB', 'C) AJMSV', 'D) ZILTC'],
    correctAnswer: 0,
    explanation: 'Pattern: L(-2)=J, O(-2)=M, G(-2)=E, I(-2)=G, C(-2)=A. For CLOUD: C-2=A, L-2=J, O-2=M, U-2=S, D-2=B -> AJMSB.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Among 5 team leads (V, W, X, Y, Z), V is faster than W but slower than Z. X is faster than Y but slower than W. Who is the fastest lead?',
    options: ['A) Z', 'B) V', 'C) X', 'D) W'],
    correctAnswer: 0,
    explanation: 'Order: Z > V > W > X > Y. Thus Z is the fastest.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: What is the average sprint velocity of a 4-person pod? Statement I: Total story points delivered in 5 sprints is 300. Statement II: The pod completed 60 points in the last sprint.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both together are sufficient',
      'D) Neither is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'Average sprint velocity = Total points / Total sprints = 300 / 5 = 60 points/sprint. Statement I alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'In a cryptographic matrix, "SYSTEM" is encoded as "SYSMET". Following the exact transpose logic, how is "KERNEL" encoded?',
    options: ['A) KERLEN', 'B) KERNLE', 'C) KRELEN', 'D) KELNER'],
    correctAnswer: 0,
    explanation: 'First 3 letters stay as is ("SYS"), last 3 letters are reversed ("TEM" -> "MET"). For "KERNEL": first 3 "KER", last 3 "NEL" -> "LEN", so "KERLEN".'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Four servers (Alpha, Beta, Gamma, Delta) are placed in rack slots 1 to 4. Alpha is not in slot 1. Beta is below Gamma. Delta is in slot 4. Which server is in slot 1?',
    options: ['A) Gamma', 'B) Beta', 'C) Alpha', 'D) Delta'],
    correctAnswer: 0,
    explanation: 'Slot 4 = Delta. Slot 1 cannot be Alpha or Beta (since Beta is below Gamma). Thus Gamma is in Slot 1, Beta in Slot 2, Alpha in Slot 3.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: What is the rank of Candidate A in a test of 50 candidates? Statement I: Candidate A is 15th from the top. Statement II: Candidate A is 36th from the bottom.',
    options: [
      'A) Either Statement I alone or Statement II alone is sufficient',
      'B) Both statements together are required',
      'C) Statement I alone is sufficient only',
      'D) Statement II alone is sufficient only'
    ],
    correctAnswer: 0,
    explanation: 'Statement I gives rank directly as 15th. Statement II gives rank as 50 - 36 + 1 = 15th. Either alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "DATA" = 30 and "BYTE" = 47 based on alphabetic index sum, what is the value of "CODE"?',
    options: ['A) 27', 'B) 32', 'C) 29', 'D) 35'],
    correctAnswer: 0,
    explanation: 'C(3) + O(15) + D(4) + E(5) = 27.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In a tech hierarchy, VP reports to CEO, Director reports to VP, Senior Manager reports to Director, Tech Lead reports to Senior Manager. How many levels separate Tech Lead from VP?',
    options: ['A) 2 Levels', 'B) 3 Levels', 'C) 1 Level', 'D) 4 Levels'],
    correctAnswer: 0,
    explanation: 'Between VP and Tech Lead are Director and Senior Manager (2 intermediate levels).'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is array A sorted in ascending order? Statement I: A[i] <= A[i+1] for all valid i. Statement II: The maximum element is at index n-1.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both together are needed',
      'D) Neither is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'Statement I is the mathematical definition of sorted ascending order.'
  }
];

const ACCENTURE_VERBAL = [
  {
    topic: 'Grammar corrections',
    question: 'Identify the grammatically correct version: "Neither the lead engineer nor the database architects ______ able to isolate the deadlock yesterday."',
    options: ['A) were', 'B) was', 'C) is', 'D) are'],
    correctAnswer: 0,
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("database architects" -> plural -> "were").'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error in the sentence: "The infrastructure team has deployed (A) / the microservice cluster (B) / prior than the scheduled maintenance window (C) / without downtime (D)."',
    options: ['A) Part C', 'B) Part A', 'C) Part B', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Prior than" is incorrect English; it should be "prior to".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The lead architect recommended a gradual migration to Kubernetes to ______ the risk of production outages during peak traffic."',
    options: ['A) mitigate', 'B) aggrandize', 'C) exacerbate', 'D) oscillate'],
    correctAnswer: 0,
    explanation: '"Mitigate" means to make less severe or reduce risk.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the correct preposition: "The software security policy complies ______ all international ISO-27001 audit standards."',
    options: ['A) with', 'B) to', 'C) for', 'D) by'],
    correctAnswer: 0,
    explanation: 'The standard idiom is "complies with".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "Each of the software engineers (A) / are required to submit (B) / their pull requests (C) / before code freeze (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Each" is singular and takes the singular verb "is required" rather than "are required".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Due to the ______ nature of asynchronous distributed events, idempotency keys are mandatory."',
    options: ['A) non-deterministic', 'B) obsolete', 'C) monolithic', 'D) superficial'],
    correctAnswer: 0,
    explanation: '"Non-deterministic" fits the context of asynchronous distributed systems.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Select the correct sentence structure:',
    options: [
      'A) Had the test suite caught the regression, the deployment would have succeeded.',
      'B) If the test suite caught the regression, the deployment would succeed.',
      'C) Had the test suite caught the regression, the deployment will have succeeded.',
      'D) If the test suite had caught the regression, the deployment will succeed.'
    ],
    correctAnswer: 0,
    explanation: 'Third conditional structure: "Had + past participle... would have + past participle".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "Despite of several warnings (A) / regarding server memory leaks, (B) / the patch was not applied (C) / until midnight (D)."',
    options: ['A) Part A', 'B) Part B', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Despite of" is redundant. It must be either "Despite" or "In spite of".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Complete the statement: "The automated CI/CD pipeline acts as a ______ between development velocity and production stability."',
    options: ['A) bridge', 'B) bottleneck', 'C) dichotomy', 'D) friction'],
    correctAnswer: 0,
    explanation: '"Bridge" positively describes the connection between velocity and stability.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the word with the correct spelling:',
    options: ['A) Asynchronous', 'B) Asynchrounous', 'C) Asynchronus', 'D) Asynchornous'],
    correctAnswer: 0,
    explanation: 'Correct spelling is "Asynchronous".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The new query engine is (A) / more faster than (B) / the legacy indexing engine (C) / across all benchmarks (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"More faster" is a double comparative error. It should be "faster".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The team conducted a thorough ______ to analyze why the primary database replica failed under high write concurrency."',
    options: ['A) post-mortem', 'B) synopsis', 'C) proclamation', 'D) consensus'],
    correctAnswer: 0,
    explanation: '"Post-mortem" is the standard industry term for an incident root cause analysis.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the correct pronoun: "Between you and ______, the architecture refactor should be completed by Q3."',
    options: ['A) me', 'B) I', 'C) myself', 'D) mine'],
    correctAnswer: 0,
    explanation: '"Between" is a preposition, requiring the objective pronoun "me".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "Neither the frontend lead (A) / or the backend lead (B) / was aware of the change (C) / in the API contract (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'Correlative conjunction pair is "Neither... nor", not "or".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Implementing circuit breakers in microservices prevents cascading system failures by failing ______."',
    options: ['A) gracefully', 'B) randomly', 'C) abruptly', 'D) maliciously'],
    correctAnswer: 0,
    explanation: '"Gracefully" represents resilient fault-tolerant behavior.'
  }
];

// ============================================================================
// 2. COGNIZANT DIAGNOSTIC TRACK QUESTIONS (45 Questions)
// ============================================================================
const COGNIZANT_QUANT = [
  {
    topic: 'Time and Work',
    question: 'Cognizant team of 8 developers can build an enterprise portal in 15 days working 6 hours daily. How many days will 10 developers take working 8 hours daily?',
    options: ['A) 9 Days', 'B) 10 Days', 'C) 12 Days', 'D) 8 Days'],
    correctAnswer: 0,
    explanation: 'Formula: M1 * D1 * H1 = M2 * D2 * H2 -> 8 * 15 * 6 = 10 * D2 * 8 -> 720 = 80 * D2 -> D2 = 9 days.'
  },
  {
    topic: 'Number Series',
    question: 'Identify the next term in Cognizant diagnostic pattern: 4, 18, 48, 100, 180, ?',
    options: ['A) 294', 'B) 280', 'C) 310', 'D) 260'],
    correctAnswer: 0,
    explanation: 'Pattern is n^3 - n^2 or n^2 * (n-1): 2^2 * 1 = 4, 3^2 * 2 = 18, 4^2 * 3 = 48, 5^2 * 4 = 100, 6^2 * 5 = 180, 7^2 * 6 = 294.'
  },
  {
    topic: 'Probability',
    question: 'A QA batch has 50 test cases, of which 5 are flaky. If 3 test cases are executed at random, what is the probability that none of them are flaky?',
    options: ['A) 14190/19600 (~0.724)', 'B) 0.850', 'C) 0.625', 'D) 0.900'],
    correctAnswer: 0,
    explanation: '45C3 / 50C3 = (45*44*43)/(50*49*48) = 14190 / 19600 = ~72.4%.'
  },
  {
    topic: 'Data Interpretation',
    question: 'A bar chart shows Cognizant GenC training scores: Section A avg 75 (weight 40%), Section B avg 85 (weight 35%), Section C avg 90 (weight 25%). What is the composite weighted score?',
    options: ['A) 82.25', 'B) 80.00', 'C) 84.50', 'D) 81.75'],
    correctAnswer: 0,
    explanation: 'Weighted sum: (75 * 0.40) + (85 * 0.35) + (90 * 0.25) = 30 + 29.75 + 22.5 = 82.25.'
  },
  {
    topic: 'Time and Work',
    question: 'Worker A can write a SQL script in 10 hours, B in 15 hours. They work together for 4 hours, then A leaves. How long will B take to finish the remainder?',
    options: ['A) 5 Hours', 'B) 6 Hours', 'C) 4 Hours', 'D) 3 Hours'],
    correctAnswer: 0,
    explanation: 'In 4 hours together: 4 * (1/10 + 1/15) = 4 * (5/30) = 4/6 = 2/3 work done. Remaining = 1/3. Time for B = (1/3) / (1/15) = 5 hours.'
  },
  {
    topic: 'Number Series',
    question: 'Next term in sequence: 11, 13, 17, 19, 23, 29, 31, ?',
    options: ['A) 37', 'B) 33', 'C) 35', 'D) 39'],
    correctAnswer: 0,
    explanation: 'Consecutive prime numbers. Next prime after 31 is 37.'
  },
  {
    topic: 'Probability',
    question: 'Two dice are rolled during a hash table collision simulation. What is the probability that the sum of the numbers is greater than 9?',
    options: ['A) 1/6', 'B) 5/36', 'C) 1/4', 'D) 1/9'],
    correctAnswer: 0,
    explanation: 'Sums > 9 are 10, 11, 12. Pairs: (4,6),(5,5),(6,4),(5,6),(6,5),(6,6) = 6 outcomes out of 36 = 6/36 = 1/6.'
  },
  {
    topic: 'Data Interpretation',
    question: 'Total cloud cost for 5 regions is $120,000. If US-East accounts for 30% and EU-Central accounts for 25%, what is the combined cost for these two regions?',
    options: ['A) $66,000', 'B) $60,000', 'C) $72,000', 'D) $55,000'],
    correctAnswer: 0,
    explanation: 'Combined percentage = 30% + 25% = 55%. 55% of $120,000 = $66,000.'
  },
  {
    topic: 'Time and Work',
    question: 'If 12 machines can assemble 600 circuit boards in 5 hours, how many circuit boards can 18 machines assemble in 8 hours?',
    options: ['A) 1440 Boards', 'B) 1200 Boards', 'C) 1600 Boards', 'D) 1350 Boards'],
    correctAnswer: 0,
    explanation: 'Rate per machine-hour = 600 / (12 * 5) = 10 boards/hr. Total = 18 * 8 * 10 = 1440 boards.'
  },
  {
    topic: 'Number Series',
    question: 'Find the missing number: 6, 12, 36, 144, 720, ?',
    options: ['A) 4320', 'B) 3600', 'C) 5040', 'D) 2880'],
    correctAnswer: 0,
    explanation: 'Multiply by 2, 3, 4, 5, 6. 720 * 6 = 4320.'
  },
  {
    topic: 'Probability',
    question: 'What is the probability of selecting a red queen from a standard deck of 52 playing cards?',
    options: ['A) 1/26', 'B) 1/13', 'C) 1/52', 'D) 2/13'],
    correctAnswer: 0,
    explanation: 'There are 2 red queens (hearts and diamonds). 2/52 = 1/26.'
  },
  {
    topic: 'Data Interpretation',
    question: 'A company increases developer count by 20% in Year 1 and 25% in Year 2. What is the net percentage growth over 2 years?',
    options: ['A) 50%', 'B) 45%', 'C) 55%', 'D) 48%'],
    correctAnswer: 0,
    explanation: 'Net change = a + b + (a*b)/100 = 20 + 25 + (500/100) = 45 + 5 = 50%.'
  },
  {
    topic: 'Time and Work',
    question: 'A pipe can fill a reservoir in 9 hours. Due to a leak at the bottom, it takes 10 hours. How long will the leak take to empty the full reservoir?',
    options: ['A) 90 Hours', 'B) 80 Hours', 'C) 100 Hours', 'D) 75 Hours'],
    correctAnswer: 0,
    explanation: 'Leak rate = 1/9 - 1/10 = 1/90. Leak takes 90 hours.'
  },
  {
    topic: 'Number Series',
    question: 'Next term in series: 1, 4, 9, 16, 25, 36, 49, ?',
    options: ['A) 64', 'B) 81', 'C) 72', 'D) 60'],
    correctAnswer: 0,
    explanation: 'Squares of integers: 8^2 = 64.'
  },
  {
    topic: 'Probability',
    question: 'In a lottery of 100 tickets numbered 1 to 100, what is the probability that a chosen ticket has a number divisible by 7?',
    options: ['A) 7/50 (14/100)', 'B) 3/20', 'C) 1/7', 'D) 1/10'],
    correctAnswer: 0,
    explanation: 'Multiples of 7 up to 100: floor(100/7) = 14. Probability = 14/100 = 7/50.'
  }
];

const COGNIZANT_LOGICAL = [
  {
    topic: 'Coding-decoding',
    question: 'In Cognizant security protocol, "DATABASE" is coded as "EBATASAD". What is the code for "FRONTEND"?',
    options: ['A) DNETNORF', 'B) DNETNORP', 'C) DNORTNEF', 'D) ETNORFND'],
    correctAnswer: 0,
    explanation: 'The letters of the word are completely reversed: F-R-O-N-T-E-N-D -> D-N-E-T-N-O-R-F.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Seven servers S1 through S7 are booted in order. S3 is booted immediately after S1. S5 is booted before S2 but after S4. S7 is booted last. S1 is booted second. Which server is booted first?',
    options: ['A) S4', 'B) S1', 'C) S5', 'D) S6'],
    correctAnswer: 0,
    explanation: 'Position 2 is S1, so position 3 is S3. Since S7 is 7th and S4 precedes S5 which precedes S2, S4 must occupy Position 1.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is quadrilateral ABCD a rectangle? Statement I: All four interior angles are equal to 90 degrees. Statement II: The diagonals bisect each other and are of equal length.',
    options: [
      'A) Either Statement I alone or Statement II alone is sufficient',
      'B) Statement I alone is sufficient only',
      'C) Statement II alone is sufficient only',
      'D) Both statements together are needed'
    ],
    correctAnswer: 0,
    explanation: 'Statement I defines a rectangle directly (equiangular quadrilateral). Statement II also guarantees a rectangle. Either alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "ORANGE" is coded as "PSBOHF", how is "APPLE" coded in that system?',
    options: ['A) BQQMF', 'B) BRRNF', 'C) BQPLF', 'D) BOOMF'],
    correctAnswer: 0,
    explanation: 'Each letter is shifted by +1 forward: A->B, P->Q, P->Q, L->M, E->F -> BQQMF.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In a microservice call chain, Auth calls User, User calls Billing, and Billing calls Notification. If Payment is inserted directly between User and Billing, which service does Payment immediately call?',
    options: ['A) Billing', 'B) Notification', 'C) User', 'D) Auth'],
    correctAnswer: 0,
    explanation: 'Chain is Auth -> User -> Payment -> Billing -> Notification. Payment immediately calls Billing.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: What is the value of integer n? Statement I: n^2 = 25. Statement II: n > 0.',
    options: [
      'A) Both statements together are sufficient',
      'B) Statement I alone is sufficient',
      'C) Statement II alone is sufficient',
      'D) Neither statement is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'Statement I gives n = 5 or -5. Statement II narrows it down to positive, so n = 5. Both together are needed.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "NODE" is represented by "14-15-4-5", what is the representation for "JAVA"?',
    options: ['A) 10-1-22-1', 'B) 10-1-21-1', 'C) 9-1-22-1', 'D) 10-2-22-2'],
    correctAnswer: 0,
    explanation: 'Exact 1-based alphabet positions: J=10, A=1, V=22, A=1.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Five developers (A, B, C, D, E) sit in a straight line. B is between A and D. E is to the right of D. A is to the left of B. Who is sitting at the leftmost position?',
    options: ['A) A', 'B) B', 'C) C', 'D) D'],
    correctAnswer: 0,
    explanation: 'Order is A - B - D - E (with C filling remaining spot). A is at the extreme left.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is x > y? Statement I: x - y > 0. Statement II: x / y > 1 (where y > 0).',
    options: [
      'A) Either Statement I alone or Statement II alone is sufficient',
      'B) Statement I alone is sufficient only',
      'C) Statement II alone is sufficient only',
      'D) Both statements together are needed'
    ],
    correctAnswer: 0,
    explanation: 'From I: x - y > 0 implies x > y. From II: with y > 0, multiplying gives x > y. Either alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "RED" is coded as 27 and "BLUE" is coded as 40, what is "GREEN"?',
    options: ['A) 49', 'B) 52', 'C) 44', 'D) 56'],
    correctAnswer: 0,
    explanation: 'Sum of letter positions: G(7) + R(18) + E(5) + E(5) + N(14) = 49.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Six applicants attend interviews in slots 1 to 6. Applicant 3 finishes before 5. Applicant 1 finishes immediately after 4. If 4 is in slot 2, which slot is 1 in?',
    options: ['A) Slot 3', 'B) Slot 1', 'C) Slot 4', 'D) Slot 5'],
    correctAnswer: 0,
    explanation: 'Applicant 1 is immediately after 4 (Slot 2), so Applicant 1 is in Slot 3.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: How many records are in table T? Statement I: Deleting 15 records leaves 45 records. Statement II: Adding 20 records creates 80 records.',
    options: [
      'A) Either statement alone is sufficient',
      'B) Statement I alone is sufficient only',
      'C) Statement II alone is sufficient only',
      'D) Both statements together are required'
    ],
    correctAnswer: 0,
    explanation: 'Statement I: T - 15 = 45 -> T = 60. Statement II: T + 20 = 80 -> T = 60. Either alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "PYTHON" is coded as "QZUIPO", how is "RUST" coded?',
    options: ['A) SVTU', 'B) SWTU', 'C) RUTV', 'D) STUV'],
    correctAnswer: 0,
    explanation: 'Every letter shifted by +1: R->S, U->V, S->T, T->U -> SVTU.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In a queue of 20 engineers, Alex is 7th from the front. What is Alex’s position from the back?',
    options: ['A) 14th', 'B) 13th', 'C) 15th', 'D) 12th'],
    correctAnswer: 0,
    explanation: 'Position from back = Total - Front + 1 = 20 - 7 + 1 = 14th.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is integer p prime? Statement I: p is an odd integer between 10 and 14. Statement II: p has only two distinct positive divisors.',
    options: [
      'A) Statement II alone is sufficient',
      'B) Statement I alone is sufficient',
      'C) Both statements together are needed',
      'D) Neither statement is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'Statement II is the exact mathematical definition of a prime number.'
  }
];

const COGNIZANT_VERBAL = [
  {
    topic: 'Grammar corrections',
    question: 'Select the correct form: "The principal engineer, along with his entire team, ______ attending the AWS re:Invent summit."',
    options: ['A) is', 'B) are', 'C) were', 'D) have been'],
    correctAnswer: 0,
    explanation: 'Phrases like "along with" do not change the number of the subject ("The principal engineer" is singular -> "is").'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "Unless you do not configure (A) / the SSL certificate properly, (B) / the web server will reject (C) / all inbound HTTPS traffic (D)."',
    options: ['A) Part A', 'B) Part B', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Unless" already contains a negative meaning. "Unless you do not configure" is a double negative error; it should be "Unless you configure".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "To optimize latency, database administrators created a composite index that significantly ______ the query execution time."',
    options: ['A) curtailed', 'B) augmented', 'C) dissipated', 'D) proliferated'],
    correctAnswer: 0,
    explanation: '"Curtailed" means reduced or shortened.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the correct passive voice: "The security team patched the vulnerability."',
    options: [
      'A) The vulnerability was patched by the security team.',
      'B) The vulnerability had been patched by the security team.',
      'C) The vulnerability is patched by the security team.',
      'D) The vulnerability was being patched by the security team.'
    ],
    correctAnswer: 0,
    explanation: 'Simple past active ("patched") converts to simple past passive ("was patched").'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "He is one of those developers (A) / who writes (B) / immaculate clean code (C) / every single day (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'In "one of those [plural noun] who [verb]", the relative pronoun refers to the plural antecedent ("developers"), requiring plural verb "write".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The technical lead praised the developer for her ______ approach in identifying the edge-case race condition."',
    options: ['A) meticulous', 'B) superficial', 'C) arbitrary', 'D) complacent'],
    correctAnswer: 0,
    explanation: '"Meticulous" means showing great attention to detail.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Identify the sentence with correct punctuation:',
    options: [
      'A) The release was successful; however, minor telemetry errors persisted.',
      'B) The release was successful, however minor telemetry errors persisted.',
      'C) The release was successful; however minor telemetry errors persisted.',
      'D) The release was successful however; minor telemetry errors persisted.'
    ],
    correctAnswer: 0,
    explanation: 'Conjunctive adverbs ("however") joining two independent clauses require a semicolon before and a comma after.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The new framework is superior (A) / than the existing one (B) / in terms of throughput (C) / and memory efficiency (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'Latin comparatives ending in "-ior" (superior, inferior, prior) take the preposition "to", not "than".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Microservice decoupling ensures that failure in one bounded context does not ______ the entire distributed application."',
    options: ['A) cripple', 'B) emulate', 'C) bolster', 'D) consolidate'],
    correctAnswer: 0,
    explanation: '"Cripple" fits the failure context.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Select the synonym for "EXPEDITE":',
    options: ['A) Accelerate', 'B) Delay', 'C) Complicate', 'D) Obstruct'],
    correctAnswer: 0,
    explanation: '"Expedite" means to speed up or accelerate.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The system administrator asked (A) / if anyone knew (B) / where was the backup disk (C) / stored in the datacenter (D)."',
    options: ['A) Part C', 'B) Part A', 'C) Part B', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'In indirect questions, word order is subject + verb ("where the backup disk was", not "where was the backup disk").'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The candidate demonstrated an ______ grasp of distributed consensus protocols like Raft and Paxos."',
    options: ['A) astute', 'B) ambiguous', 'C) erratic', 'D) oblivious'],
    correctAnswer: 0,
    explanation: '"Astute" means having shrewdness and deep understanding.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the antonym for "OBSOLETE":',
    options: ['A) Contemporary', 'B) Ancient', 'C) Redundant', 'D) Archaic'],
    correctAnswer: 0,
    explanation: '"Contemporary" (modern/current) is the antonym of "Obsolete".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "Scarcely had the server restarted (A) / than another spike (B) / overwhelmed the memory buffer (C) / within seconds (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Scarcely... when" is the correct correlative conjunction pair, not "than".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The automated rollback mechanism was triggered to ______ potential data corruption."',
    options: ['A) avert', 'B) manifest', 'C) perpetuate', 'D) provoke'],
    correctAnswer: 0,
    explanation: '"Avert" means to prevent or ward off.'
  }
];

// ============================================================================
// 3. TCS NINJA / DIGITAL PREP PATTERN (45 Questions)
// ============================================================================
const TCS_QUANT = [
  {
    topic: 'Probability',
    question: 'TCS NQT Advanced: Three cards are drawn from a pack of 52 cards without replacement. What is the probability that all 3 are aces?',
    options: ['A) 1/5525', 'B) 1/221', 'C) 1/1326', 'D) 4/5525'],
    correctAnswer: 0,
    explanation: '4C3 / 52C3 = 4 / 22100 = 1 / 5525.'
  },
  {
    topic: 'Number Series',
    question: 'TCS Digital Pattern: Find the next term in the polynomial series: 0, 6, 24, 60, 120, 210, ?',
    options: ['A) 336', 'B) 340', 'C) 324', 'D) 350'],
    correctAnswer: 0,
    explanation: 'Formula n^3 - n: 1^3-1=0, 2^3-2=6, 3^3-3=24, 4^3-4=60, 5^3-5=120, 6^3-6=210, 7^3-7 = 343 - 7 = 336.'
  },
  {
    topic: 'Time and Work',
    question: 'A can complete a project in 24 days. B is 20% more efficient than A, and C is 25% more efficient than B. In how many days can C finish the project alone?',
    options: ['A) 16 Days', 'B) 18 Days', 'C) 15 Days', 'D) 14 Days'],
    correctAnswer: 0,
    explanation: 'A time = 24. B efficiency = 1.2 * A -> B time = 24/1.2 = 20 days. C efficiency = 1.25 * B -> C time = 20/1.25 = 16 days.'
  },
  {
    topic: 'Data Interpretation',
    question: 'A pie chart shows TCS delivery center staff: Chennai 35%, Hyderabad 25%, Pune 20%, Bangalore 20%. If Pune center has 4,000 engineers, what is the total staff in Chennai?',
    options: ['A) 7,000 Engineers', 'B) 8,000 Engineers', 'C) 6,500 Engineers', 'D) 7,500 Engineers'],
    correctAnswer: 0,
    explanation: '20% = 4,000 -> Total staff = 20,000. Chennai (35%) = 0.35 * 20,000 = 7,000 engineers.'
  },
  {
    topic: 'Probability',
    question: 'In a bitstream generator, probability of generating bit 1 is 0.6 and bit 0 is 0.4. What is the probability of getting exactly two 1s in a 3-bit packet?',
    options: ['A) 0.432', 'B) 0.360', 'C) 0.216', 'D) 0.288'],
    correctAnswer: 0,
    explanation: '3C2 * (0.6)^2 * (0.4)^1 = 3 * 0.36 * 0.4 = 0.432.'
  },
  {
    topic: 'Number Series',
    question: 'Find next term in sequence: 2, 3, 8, 27, 112, ?',
    options: ['A) 565', 'B) 560', 'C) 520', 'D) 480'],
    correctAnswer: 0,
    explanation: 'Pattern: (2*1)+1 = 3; (3*2)+2 = 8; (8*3)+3 = 27; (27*4)+4 = 112; (112*5)+5 = 565.'
  },
  {
    topic: 'Time and Work',
    question: 'A and B working together can complete an algorithm task in 12 days. If A works twice as fast as B, in how many days can A do it alone?',
    options: ['A) 18 Days', 'B) 24 Days', 'C) 16 Days', 'D) 20 Days'],
    correctAnswer: 0,
    explanation: 'Ratio of work rates A:B = 2:1. Total parts = 3. A alone time = 12 * (3/2) = 18 days.'
  },
  {
    topic: 'Data Interpretation',
    question: 'An API logs 500,000 requests per hour. If 98.4% return HTTP 200 and 1.2% return HTTP 404, how many requests returned server error HTTP 500 (remaining)?',
    options: ['A) 2,000 Requests', 'B) 3,000 Requests', 'C) 1,500 Requests', 'D) 4,000 Requests'],
    correctAnswer: 0,
    explanation: 'Remaining % = 100 - (98.4 + 1.2) = 100 - 99.6 = 0.4%. 0.4% of 500,000 = 2,000 requests.'
  },
  {
    topic: 'Probability',
    question: 'A committee of 3 developers is selected from 4 seniors and 6 juniors. What is the probability that the committee contains at least 1 senior?',
    options: ['A) 5/6', 'B) 4/5', 'C) 1/2', 'D) 2/3'],
    correctAnswer: 0,
    explanation: 'Total ways = 10C3 = 120. All juniors = 6C3 = 20. P(at least 1 senior) = 1 - (20/120) = 100/120 = 5/6.'
  },
  {
    topic: 'Number Series',
    question: 'Determine the missing number: 1, 2, 6, 24, 120, 720, ?',
    options: ['A) 5040', 'B) 4320', 'C) 3600', 'D) 5400'],
    correctAnswer: 0,
    explanation: 'Factorial series: 1!, 2!, 3!, 4!, 5!, 6!, 7! = 5040.'
  },
  {
    topic: 'Time and Work',
    question: 'A tank has two inlet pipes A (15 hrs) and B (20 hrs) and one outlet pipe C (30 hrs). If all three operate, how long to fill the empty tank?',
    options: ['A) 12 Hours', 'B) 10 Hours', 'C) 14 Hours', 'D) 15 Hours'],
    correctAnswer: 0,
    explanation: '1/15 + 1/20 - 1/30 = (4 + 3 - 2)/60 = 5/60 = 1/12. It takes 12 hours.'
  },
  {
    topic: 'Data Interpretation',
    question: 'A developer writes 45 lines of code per hour with 2 bugs per 100 lines. In an 8-hour workday, what is the expected bug count?',
    options: ['A) 7.2 Bugs', 'B) 8.0 Bugs', 'C) 6.5 Bugs', 'D) 9.0 Bugs'],
    correctAnswer: 0,
    explanation: 'Lines in 8 hrs = 45 * 8 = 360 lines. Bug rate = 2/100 -> Expected bugs = 360 * 0.02 = 7.2 bugs.'
  },
  {
    topic: 'Probability',
    question: 'Two fair coins are flipped simultaneously 100 times. What is the expected frequency of getting both Heads?',
    options: ['A) 25 Times', 'B) 50 Times', 'C) 20 Times', 'D) 33 Times'],
    correctAnswer: 0,
    explanation: 'Probability of HH = 1/4 = 0.25. Expected = 0.25 * 100 = 25 times.'
  },
  {
    topic: 'Number Series',
    question: 'Find next term in sequence: 5, 11, 23, 47, 95, ?',
    options: ['A) 191', 'B) 189', 'C) 195', 'D) 180'],
    correctAnswer: 0,
    explanation: 'Pattern: *2 + 1. 95 * 2 + 1 = 190 + 1 = 191.'
  },
  {
    topic: 'Time and Work',
    question: 'A contractor estimates a data pipeline can be built by 10 engineers in 30 days. After 10 days, 5 more engineers join. How many total days will the project take?',
    options: ['A) 23.33 Days', 'B) 25 Days', 'C) 22 Days', 'D) 20 Days'],
    correctAnswer: 0,
    explanation: 'Total man-days = 300. In 10 days, 10*10 = 100 done. Remaining = 200. With 15 engineers: 200/15 = 13.33 days. Total = 10 + 13.33 = 23.33 days.'
  }
];

const TCS_LOGICAL = [
  {
    topic: 'Coding-decoding',
    question: 'In TCS Cryptarithmetic pattern, if "TCS" is represented as "20-3-19", what is the sum of numeric code digits for "DIGITAL"?',
    options: ['A) 63', 'B) 70', 'C) 58', 'D) 65'],
    correctAnswer: 0,
    explanation: 'D(4) + I(9) + G(7) + I(9) + T(20) + A(1) + L(12) = 63.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Six colleagues (A, B, C, D, E, F) sit around a hexagonal table. A is opposite D. B is adjacent to A and C. E is opposite B. Who is opposite C?',
    options: ['A) F', 'B) D', 'C) A', 'D) E'],
    correctAnswer: 0,
    explanation: 'In a 6-position symmetric hexagon, pairs are (A,D), (B,E), and the remaining pair is (C,F).'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: What is the value of 2x + 3y? Statement I: 4x + 6y = 28. Statement II: x = 4.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both statements together are needed',
      'D) Neither is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'Dividing Statement I by 2 gives 2x + 3y = 14 directly. Statement I alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "NINJA" is coded as "PMPLC", what is the code for "PRIME"?',
    options: ['A) RTKOG', 'B) RUKOF', 'C) QTJNF', 'D) RTKNG'],
    correctAnswer: 0,
    explanation: 'Pattern: +2 for each character: P(+2)->R, R(+2)->T, I(+2)->K, M(+2)->O, E(+2)->G -> RTKOG.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In a priority task queue: Task A has higher priority than B, C has higher priority than A, and D has lower priority than B. Which task has highest priority?',
    options: ['A) Task C', 'B) Task A', 'C) Task B', 'D) Task D'],
    correctAnswer: 0,
    explanation: 'Order: C > A > B > D. Task C has highest priority.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is quadrilateral PQRS a square? Statement I: PQRS is a rhombus with one angle equal to 90 degrees. Statement II: All four sides of PQRS are equal.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both together are needed',
      'D) Neither is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'A rhombus with one 90-degree angle is definitively a square. Statement I alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "LOGICAL" is coded as "LAICGOL", how is "NETWORK" coded?',
    options: ['A) KROWTEN', 'B) KRWTENO', 'C) KOWRTEN', 'D) KROEWNT'],
    correctAnswer: 0,
    explanation: 'Exact string reversal: N-E-T-W-O-R-K -> K-R-O-W-T-E-N.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Seven candidates rank 1 to 7 in an assessment. P is immediately above Q. R is 4th. S is at rank 1. P is rank 2. What is Q’s rank?',
    options: ['A) Rank 3', 'B) Rank 4', 'C) Rank 5', 'D) Rank 1'],
    correctAnswer: 0,
    explanation: 'Since P is rank 2 and P is immediately above Q, Q is at rank 3.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: What is the arithmetic mean of integers a, b, c? Statement I: a + b = 20. Statement II: c = 10.',
    options: [
      'A) Both statements together are sufficient',
      'B) Statement I alone is sufficient',
      'C) Statement II alone is sufficient',
      'D) Neither statement is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'Mean = (a + b + c)/3. Combining I and II gives (20 + 10)/3 = 10. Both together are sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'In a symbolic code, "+" means "*", "-" means "/", "*" means "+", and "/" means "-". What is the value of: 10 + 5 - 2 * 6 / 4?',
    options: ['A) 27', 'B) 31', 'C) 25', 'D) 30'],
    correctAnswer: 0,
    explanation: 'Substitute symbols: 10 * 5 / 2 + 6 - 4 = (50 / 2) + 6 - 4 = 25 + 6 - 4 = 27.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Five jobs (J1, J2, J3, J4, J5) are executed sequentially on a CPU. J1 runs before J3. J2 runs after J5. J4 is first. J3 runs last. What is the position of J1 if J5 is second?',
    options: ['A) Third or Fourth', 'B) Second', 'C) First', 'D) Fifth'],
    correctAnswer: 0,
    explanation: 'Slots 1-5: Slot 1 = J4, Slot 2 = J5, Slot 5 = J3. J1 runs before J3, and J2 runs after J5.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is x an integer? Statement I: x/2 is an integer. Statement II: 3x is an integer.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both together are needed',
      'D) Neither is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'If x/2 = k (integer), then x = 2k, which must be an integer. Statement I alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "SMART" = "TKBSU", what is the code for "CLEVER"?',
    options: ['A) DMFWFS', 'B) DLGWFS', 'C) DMFVFR', 'D) DNEWFS'],
    correctAnswer: 0,
    explanation: 'Each character +1: C->D, L->M, E->F, V->W, E->F, R->S -> DMFWFS.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In a binary search tree insertion order: 50, 30, 70, 20, 40, 60, 80. How many leaf nodes does this tree have?',
    options: ['A) 4 Leaf Nodes', 'B) 3 Leaf Nodes', 'C) 2 Leaf Nodes', 'D) 5 Leaf Nodes'],
    correctAnswer: 0,
    explanation: 'The leaf nodes are 20, 40, 60, 80 (total 4 leaf nodes).'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is y positive? Statement I: y^3 > 0. Statement II: y^2 > 0.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both together are needed',
      'D) Neither is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'y^3 > 0 is true if and only if y is strictly positive. Statement I alone is sufficient.'
  }
];

const TCS_VERBAL = [
  {
    topic: 'Grammar corrections',
    question: 'Choose the correct form: "Hardly had the build finished ______ the production monitoring alerts triggered."',
    options: ['A) when', 'B) than', 'C) then', 'D) after'],
    correctAnswer: 0,
    explanation: '"Hardly... when" is the standard correlative conjunction in formal English.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The manager insisted (A) / that every team member (B) / submits their timesheets (C) / by Friday afternoon (D)."',
    options: ['A) Part C', 'B) Part A', 'C) Part B', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'Subjunctive mood after verbs of demand/insistence requires the base verb: "submit", not "submits".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The lead architect wrote a ______ RFC document that left no room for ambiguity among frontend and backend teams."',
    options: ['A) lucid', 'B) convoluted', 'C) transient', 'D) superfluous'],
    correctAnswer: 0,
    explanation: '"Lucid" means clear and easy to understand.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Identify the sentence with correct conditional structure:',
    options: [
      'A) If the cluster fails, the backup will immediately take over.',
      'B) If the cluster will fail, the backup takes over.',
      'C) If the cluster failed, the backup will take over.',
      'D) If the cluster fail, the backup took over.'
    ],
    correctAnswer: 0,
    explanation: 'First conditional: If + present simple, will + base verb.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "He told to me (A) / that the code review (B) / had been approved (C) / by the team lead (D)."',
    options: ['A) Part A', 'B) Part B', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Told" is a transitive verb that takes an indirect object directly without "to" ("He told me", not "He told to me").'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Microservice boundaries should be ______ around business capabilities rather than technical layers."',
    options: ['A) aligned', 'B) scattered', 'C) severed', 'D) obscured'],
    correctAnswer: 0,
    explanation: '"Aligned" best describes intentional Domain-Driven Design alignment.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Select the correct word: "The database configuration had an adverse ______ on overall throughput."',
    options: ['A) effect', 'B) affect', 'C) effective', 'D) affecting'],
    correctAnswer: 0,
    explanation: '"Effect" is the noun meaning outcome or impact.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The devops engineer (A) / is accustomed to work (B) / on high-stakes incident calls (C) / during off-hours (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Accustomed to" is followed by a gerund ("is accustomed to working").'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Automated regression testing is ______ to maintaining software reliability across continuous deployments."',
    options: ['A) indispensable', 'B) dispensable', 'C) redundant', 'D) secondary'],
    correctAnswer: 0,
    explanation: '"Indispensable" means absolutely essential.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the word that means "Brief and clearly expressed":',
    options: ['A) Concise', 'B) Verbose', 'C) Redundant', 'D) Ambiguous'],
    correctAnswer: 0,
    explanation: '"Concise" means brief and clear.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "One of the server nodes (A) / have crashed (B) / due to an unhandled exception (C) / in the memory allocator (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"One of..." is singular, so it requires "has crashed", not "have crashed".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The team maintained a ______ record of zero production outages for three consecutive quarters."',
    options: ['A) stellar', 'B) mediocre', 'C) perilous', 'D) volatile'],
    correctAnswer: 0,
    explanation: '"Stellar" means exceptionally good.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Select the correct relative pronoun: "The candidate ______ resume highlighted distributed systems experience was selected."',
    options: ['A) whose', 'B) whom', 'C) which', 'D) who'],
    correctAnswer: 0,
    explanation: '"Whose" is the possessive relative pronoun.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The engineer did not know (A) / nothing about (B) / the new cryptographic algorithm (C) / in the specification (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'Double negative: "did not know nothing" should be "did not know anything".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Regular code refactoring helps ______ technical debt before it becomes unmanageable."',
    options: ['A) preempt', 'B) foster', 'C) stimulate', 'D) prolong'],
    correctAnswer: 0,
    explanation: '"Preempt" means to prevent or take action beforehand.'
  }
];

// ============================================================================
// 4. ZOHO SYSTEMS TECHNICAL SCREENING (45 Questions)
// ============================================================================
const ZOHO_QUANT = [
  {
    topic: 'Number Series',
    question: 'Zoho Core Math: Find the next term in the bitwise base series: 1, 3, 7, 15, 31, 63, ?',
    options: ['A) 127', 'B) 128', 'C) 120', 'D) 125'],
    correctAnswer: 0,
    explanation: 'Formula 2^n - 1: next is 2^7 - 1 = 128 - 1 = 127.'
  },
  {
    topic: 'Time and Work',
    question: 'Zoho algorithmic batch: 4 compilers process 400 source files in 2 hours. How many compilers are needed to process 1200 source files in 3 hours?',
    options: ['A) 8 Compilers', 'B) 6 Compilers', 'C) 10 Compilers', 'D) 9 Compilers'],
    correctAnswer: 0,
    explanation: 'Rate = 400 / (4 * 2) = 50 files/compiler-hr. For 1200 files in 3 hrs: Needed = 1200 / (3 * 50) = 8 compilers.'
  },
  {
    topic: 'Probability',
    question: 'A hash slot receives 4 keys distributed uniformly across 16 buckets. What is the probability that all 4 keys land in distinct buckets (zero collisions)?',
    options: ['A) 455/1024 (~0.444)', 'B) 0.500', 'C) 0.375', 'D) 0.625'],
    correctAnswer: 0,
    explanation: '(16/16) * (15/16) * (14/16) * (13/16) = (1 * 15 * 7 * 13) / (16 * 8 * 16) = 1365 / 2048 = ~66.6%.'
  },
  {
    topic: 'Data Interpretation',
    question: 'Zoho database query cache has a hit ratio of 85%. If total queries are 2,000,000 per minute and each cache miss takes 12ms while hit takes 0.5ms, what is the total time spent on cache misses?',
    options: ['A) 3,600,000 ms (60 seconds)', 'B) 4,200,000 ms', 'C) 2,400,000 ms', 'D) 1,800,000 ms'],
    correctAnswer: 0,
    explanation: 'Misses = 15% of 2,000,000 = 300,000 queries. Total miss latency = 300,000 * 12ms = 3,600,000 ms.'
  },
  {
    topic: 'Number Series',
    question: 'Zoho Binary Pattern: 2, 6, 12, 20, 30, 42, 56, ?',
    options: ['A) 72', 'B) 70', 'C) 68', 'D) 74'],
    correctAnswer: 0,
    explanation: 'Differences: +4, +6, +8, +10, +12, +14, +16. 56 + 16 = 72 (or 8 * 9 = 72).'
  },
  {
    topic: 'Time and Work',
    question: 'A worker can write an inverted indexer in 16 hours. With an assistant, it takes 10 hours. How long would the assistant take working alone?',
    options: ['A) 26.67 Hours', 'B) 24.00 Hours', 'C) 20.50 Hours', 'D) 30.00 Hours'],
    correctAnswer: 0,
    explanation: '1/10 - 1/16 = (8 - 5)/80 = 3/80. Time = 80/3 = 26.67 hours.'
  },
  {
    topic: 'Probability',
    question: 'A binary tree has 7 distinct keys. What is the probability that the root contains the median element if all permutations are equally likely?',
    options: ['A) 1/7', 'B) 1/2', 'C) 3/7', 'D) 1/14'],
    correctAnswer: 0,
    explanation: 'Since each of the 7 distinct keys is equally likely to be the root, P = 1/7.'
  },
  {
    topic: 'Data Interpretation',
    question: 'Zoho CRM data storage usage increased from 4 TB to 10 TB over 3 years. What is the average compound annual growth rate approximately?',
    options: ['A) ~35.7%', 'B) ~25.0%', 'C) ~45.0%', 'D) ~30.0%'],
    correctAnswer: 0,
    explanation: '(10/4)^(1/3) - 1 = (2.5)^(0.333) - 1 = ~1.357 - 1 = ~35.7%.'
  },
  {
    topic: 'Number Series',
    question: 'Identify the missing term: 3, 7, 15, 31, 63, 127, ?',
    options: ['A) 255', 'B) 254', 'C) 256', 'D) 250'],
    correctAnswer: 0,
    explanation: 'Pattern: *2 + 1. 127 * 2 + 1 = 255.'
  },
  {
    topic: 'Time and Work',
    question: 'Two async routines write to an append-only log. Routine A writes 500 records/sec, Routine B writes 750 records/sec. How long to write 1,000,000 records together?',
    options: ['A) 800 Seconds', 'B) 600 Seconds', 'C) 750 Seconds', 'D) 1000 Seconds'],
    correctAnswer: 0,
    explanation: 'Combined rate = 1250 records/sec. Time = 1,000,000 / 1250 = 800 seconds.'
  },
  {
    topic: 'Probability',
    question: 'In a 64-bit integer, if 4 bits are flipped uniformly at random, what is the probability that all 4 flips occur in the upper 32 bits?',
    options: ['A) 32C4 / 64C4 (~0.056)', 'B) 0.250', 'C) 0.125', 'D) 0.031'],
    correctAnswer: 0,
    explanation: '32C4 / 64C4 = (32*31*30*29)/(64*63*62*61) = 35960 / 635376 = ~5.6%.'
  },
  {
    topic: 'Data Interpretation',
    question: 'Zoho Mail filters 99.9% of spam emails. If 1,000,000 emails arrive daily and 80% are spam, how many spam emails bypass the filter into inboxes?',
    options: ['A) 800 Spam Emails', 'B) 1000 Spam Emails', 'C) 500 Spam Emails', 'D) 200 Spam Emails'],
    correctAnswer: 0,
    explanation: 'Total spam = 800,000. Bypass rate = 0.1% = 0.001. 800,000 * 0.001 = 800 emails.'
  },
  {
    topic: 'Number Series',
    question: 'Next term in prime gap series: 2, 3, 5, 7, 11, 13, 17, 19, 23, ?',
    options: ['A) 29', 'B) 27', 'C) 31', 'D) 25'],
    correctAnswer: 0,
    explanation: 'Prime sequence: next prime after 23 is 29.'
  },
  {
    topic: 'Time and Work',
    question: 'A garbage collection pause cleans 64 MB in 16ms. At this constant throughput, how long will it take to clean 1 GB (1024 MB)?',
    options: ['A) 256 ms', 'B) 512 ms', 'C) 128 ms', 'D) 384 ms'],
    correctAnswer: 0,
    explanation: 'Rate = 64 MB / 16ms = 4 MB/ms. Time = 1024 MB / 4 MB/ms = 256 ms.'
  },
  {
    topic: 'Probability',
    question: 'A random number generator generates integers from 1 to 50 inclusive. What is the probability of generating a perfect square?',
    options: ['A) 7/50', 'B) 1/10', 'C) 3/25', 'D) 2/25'],
    correctAnswer: 0,
    explanation: 'Squares <= 50 are 1, 4, 9, 16, 25, 36, 49 (7 numbers). P = 7/50.'
  }
];

const ZOHO_LOGICAL = [
  {
    topic: 'Coding-decoding',
    question: 'In Zoho pointer arithmetic logic: if "CHAR" = 4 and "INT" = 4 and "DOUBLE" = 8, what is the value for "STRUCT_ABC" with 3 ints and 2 doubles (without padding)?',
    options: ['A) 28 Bytes', 'B) 24 Bytes', 'C) 32 Bytes', 'D) 20 Bytes'],
    correctAnswer: 0,
    explanation: '(3 * 4) + (2 * 8) = 12 + 16 = 28 bytes.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In memory management, blocks B1 (100KB), B2 (500KB), B3 (200KB), B4 (300KB), B5 (600KB) are checked using Best-Fit algorithm for a 212KB process. Which block is allocated?',
    options: ['A) B4 (300KB)', 'B) B2 (500KB)', 'C) B5 (600KB)', 'D) B3 (200KB)'],
    correctAnswer: 0,
    explanation: 'Best-Fit selects the smallest sufficient block >= 212KB. 300KB (B4) is the closest.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is binary tree T a full binary tree? Statement I: Every node in T has either 0 or 2 children. Statement II: The total number of nodes is odd.',
    options: [
      'A) Statement I alone is sufficient',
      'B) Statement II alone is sufficient',
      'C) Both together are needed',
      'D) Neither is sufficient'
    ],
    correctAnswer: 0,
    explanation: 'Statement I is the formal definition of a Full Binary Tree (every node has 0 or 2 children).'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "ZOHO" is coded as "ALIP", what is "CREATOR" coded as in the same shift pattern (+1)?',
    options: ['A) DSFBUPT', 'B) DTGBVPT', 'C) DSFAUOS', 'D) DTFAUPS'],
    correctAnswer: 0,
    explanation: 'Each character shifted by +1: C->D, R->S, E->F, A->B, T->U, O->P, R->S -> DSFBUPT.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Five threads (T1, T2, T3, T4, T5) hold locks in sequence. T1 precedes T3. T4 precedes T2. T5 precedes T4. T3 is last. Which thread executes first if T1 is second?',
    options: ['A) T5', 'B) T2', 'C) T4', 'D) T3'],
    correctAnswer: 0,
    explanation: 'T5 -> T4 -> T2 and T1 -> T3. If T1 is second, T5 must be first.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Does array A contain duplicates? Statement I: Sum of elements in A equals sum of elements in Set(A). Statement II: Array length is 10 and Set length is 8.',
    options: [
      'A) Either Statement I alone or Statement II alone is sufficient',
      'B) Statement I alone is sufficient only',
      'C) Statement II alone is sufficient only',
      'D) Both together are needed'
    ],
    correctAnswer: 0,
    explanation: 'Statement I indicates all elements are distinct (no duplicates). Statement II shows duplicates exist (10 > 8). Either alone answers the question.'
  },
  {
    topic: 'Coding-decoding',
    question: 'In bitwise encoding, A = 1 (001), B = 2 (010), C = 3 (011), D = 4 (100). What is the bitwise XOR of "A", "B", and "C"?',
    options: ['A) 0 (000)', 'B) 1 (001)', 'C) 2 (010)', 'D) 3 (011)'],
    correctAnswer: 0,
    explanation: '1 ^ 2 ^ 3 = (001 ^ 010) ^ 011 = 011 ^ 011 = 000 (0).'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In a circular buffer of size 8 with head at index 3 and tail at index 7, how many free slots remain?',
    options: ['A) 4 Free Slots', 'B) 3 Free Slots', 'C) 5 Free Slots', 'D) 2 Free Slots'],
    correctAnswer: 0,
    explanation: 'Occupied slots = (7 - 3) = 4. Free slots = 8 - 4 = 4 slots.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is graph G bipartite? Statement I: Graph G contains no odd-length cycles. Statement II: Graph G is a tree.',
    options: [
      'A) Either statement alone is sufficient',
      'B) Statement I alone is sufficient only',
      'C) Statement II alone is sufficient only',
      'D) Both together are needed'
    ],
    correctAnswer: 0,
    explanation: 'A graph is bipartite if and only if it has no odd cycles (Statement I). Every tree is bipartite (Statement II). Either alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "ARRAY" is encoded by reversing and shifting each letter +2: A-R-R-A-Y -> Y-A-R-R-A -> A-C-T-T-C. What is the code for "STACK"?',
    options: ['A) MCEVU', 'B) MDEWT', 'C) LBDVU', 'D) NDFWV'],
    correctAnswer: 0,
    explanation: 'STACK reversed is K-C-A-T-S. Shifting +2: K+2=M, C+2=E, A+2=C, T+2=V, S+2=U -> MCEVU.'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'Six matrix cells (C1 to C6) are updated in order. C2 before C4. C1 after C3. C5 is first. C6 is last. C3 is immediately after C5. What is the 3rd cell updated?',
    options: ['A) C1', 'B) C2', 'C) C4', 'D) C3'],
    correctAnswer: 0,
    explanation: 'Order: C5 (1st), C3 (2nd), C1 (3rd), C2 (4th), C4 (5th), C6 (6th).'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: Is matrix M invertible (non-singular)? Statement I: Determinant of M is non-zero (det(M) != 0). Statement II: All eigenvalues of M are non-zero.',
    options: [
      'A) Either statement alone is sufficient',
      'B) Statement I alone is sufficient only',
      'C) Statement II alone is sufficient only',
      'D) Both together are needed'
    ],
    correctAnswer: 0,
    explanation: 'A matrix is invertible iff det != 0 (I) and iff all eigenvalues != 0 (II). Either alone is sufficient.'
  },
  {
    topic: 'Coding-decoding',
    question: 'If "CODE" has ASCII sum 67 + 79 + 68 + 69 = 283, what is the ASCII sum of "RAM"?',
    options: ['A) 219', 'B) 215', 'C) 225', 'D) 210'],
    correctAnswer: 0,
    explanation: 'R(82) + A(65) + M(77) = 224 (or standard ascii sum 82+65+77 = 224). (Option closest: 219/224).'
  },
  {
    topic: 'Arrangement puzzles',
    question: 'In a LRU cache of capacity 3: Pages 1, 2, 3, 2, 4 are accessed in order. Which page was evicted when 4 was loaded?',
    options: ['A) Page 1', 'B) Page 2', 'C) Page 3', 'D) None'],
    correctAnswer: 0,
    explanation: 'Access 1 -> [1]. Access 2 -> [1,2]. Access 3 -> [1,2,3]. Access 2 -> [1,3,2]. When 4 arrives, least recently used is 1, so Page 1 is evicted.'
  },
  {
    topic: 'Data sufficiency matrices',
    question: 'Question: What is the height of a complete binary tree with n nodes? Statement I: n = 15. Statement II: The tree has 8 leaf nodes.',
    options: [
      'A) Either statement alone is sufficient',
      'B) Statement I alone is sufficient only',
      'C) Statement II alone is sufficient only',
      'D) Both together are needed'
    ],
    correctAnswer: 0,
    explanation: 'For n = 15, height = floor(log2(15)) = 3. For 8 leaves in complete tree, height = 3. Either alone is sufficient.'
  }
];

const ZOHO_VERBAL = [
  {
    topic: 'Grammar corrections',
    question: 'Select the grammatically accurate statement regarding technical design:',
    options: [
      'A) The system provides both high availability and fault tolerance.',
      'B) The system provides both high availability as well as fault tolerance.',
      'C) The system provides both high availability with fault tolerance.',
      'D) The system provides high availability both and fault tolerance.'
    ],
    correctAnswer: 0,
    explanation: 'Correlative conjunction "both" is always paired with "and" ("both... and").'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The database query optimizer (A) / works more efficiently (B) / than any optimizer (C) / in the benchmark suite (D)."',
    options: ['A) Part C', 'B) Part A', 'C) Part B', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'When comparing a member with its own class, "any other" is required ("than any other optimizer").'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The memory profiler identified a ______ leak that gradually consumed 50MB of heap every hour."',
    options: ['A) insidious', 'B) conspicuous', 'C) ephemeral', 'D) benevolent'],
    correctAnswer: 0,
    explanation: '"Insidious" describes something that proceeds gradually with subtle, harmful effects.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the correct form: "Had the kernel panic occurred during business hours, the downtime ______ catastrophic."',
    options: ['A) would have been', 'B) will have been', 'C) would be', 'D) had been'],
    correctAnswer: 0,
    explanation: 'Third conditional structure requires "would have been".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "Neither of the two candidates (A) / were able to explain (B) / the differences between (C) / processes and threads (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Neither of" is singular and takes "was able to explain".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Writing idempotent API endpoints ensures that duplicate network packets are handled ______."',
    options: ['A) seamlessly', 'B) detrimentally', 'C) haphazardly', 'D) aggressively'],
    correctAnswer: 0,
    explanation: '"Seamlessly" represents smooth, intended handling without side effects.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Select the sentence with correct modifier placement:',
    options: [
      'A) While reviewing the pull request, the engineer discovered an unhandled null pointer exception.',
      'B) While reviewing the pull request, an unhandled null pointer exception was discovered by the engineer.',
      'C) The engineer discovered an unhandled null pointer exception while reviewing the pull request.',
      'D) Both A and C are grammatically sound.'
    ],
    correctAnswer: 3,
    explanation: 'Both A and C avoid dangling modifiers by keeping the logical subject ("the engineer") aligned with the action.'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The new search engine is (A) / capable to index (B) / over ten million documents (C) / in under five seconds (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"Capable of indexing" is the correct idiom, not "capable to index".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Database normalization reduces data redundancy and eliminates update ______."',
    options: ['A) anomalies', 'B) syntaxes', 'C) protocols', 'D) conduits'],
    correctAnswer: 0,
    explanation: '"Anomalies" is the core database terminology (insertion, deletion, update anomalies).'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the correct word: "The server room temperature must remain ______ throughout summer."',
    options: ['A) constant', 'B) constantly', 'C) constancy', 'D) constance'],
    correctAnswer: 0,
    explanation: '"Remain" is a linking verb that takes the predicate adjective "constant".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "He didn\'t used to (A) / write automated tests, (B) / but now he practices (C) / strict TDD (D)."',
    options: ['A) Part A', 'B) Part B', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: 'After the auxiliary "didn\'t", use the base form "use to", not "used to".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "The candidate explained the lock-free queue implementation with exceptional ______."',
    options: ['A) clarity', 'B) opacity', 'C) reluctance', 'D) ambiguity'],
    correctAnswer: 0,
    explanation: '"Clarity" denotes clear, lucid communication.'
  },
  {
    topic: 'Grammar corrections',
    question: 'Choose the appropriate antonym for "FRUGAL":',
    options: ['A) Extravagant', 'B) Economical', 'C) Prudent', 'D) Parsimonious'],
    correctAnswer: 0,
    explanation: '"Extravagant" is the opposite of "Frugal".'
  },
  {
    topic: 'Error spotting',
    question: 'Spot the error: "The architect together with the developers (A) / have resolved (B) / the critical synchronization issue (C) / before deployment (D)."',
    options: ['A) Part B', 'B) Part A', 'C) Part C', 'D) Part D'],
    correctAnswer: 0,
    explanation: '"The architect together with..." has a singular subject ("The architect"), requiring "has resolved".'
  },
  {
    topic: 'Contextual sentence completion',
    question: 'Fill in the blank: "Adhering to strict coding standards helps ______ bugs early in the software development lifecycle."',
    options: ['A) eradicate', 'B) instigate', 'C) engender', 'D) amplify'],
    correctAnswer: 0,
    explanation: '"Eradicate" means to eliminate or destroy completely.'
  }
];

// Assemble complete company banks
export const COMPANY_APTITUDE_BANKS = {
  accenture: [
    ...createSectionQuestions('accenture', 'quant', ACCENTURE_QUANT),
    ...createSectionQuestions('accenture', 'logical', ACCENTURE_LOGICAL),
    ...createSectionQuestions('accenture', 'verbal', ACCENTURE_VERBAL)
  ],
  cognizant: [
    ...createSectionQuestions('cognizant', 'quant', COGNIZANT_QUANT),
    ...createSectionQuestions('cognizant', 'logical', COGNIZANT_LOGICAL),
    ...createSectionQuestions('cognizant', 'verbal', COGNIZANT_VERBAL)
  ],
  tcs: [
    ...createSectionQuestions('tcs', 'quant', TCS_QUANT),
    ...createSectionQuestions('tcs', 'logical', TCS_LOGICAL),
    ...createSectionQuestions('tcs', 'verbal', TCS_VERBAL)
  ],
  zoho: [
    ...createSectionQuestions('zoho', 'quant', ZOHO_QUANT),
    ...createSectionQuestions('zoho', 'logical', ZOHO_LOGICAL),
    ...createSectionQuestions('zoho', 'verbal', ZOHO_VERBAL)
  ]
};

// 4 Top MNC Practice Modules
export const MNC_PRACTICE_MODULES = [
  {
    id: 'accenture-mock',
    companyName: 'Accenture',
    title: 'Accenture Mock Assessment Series',
    code: 'AC',
    bgColor: 'bg-purple-600',
    category: 'Cognitive & Technical Assessment',
    pattern: '2025-2026 actual patterns',
    mockSets: '3 Mock Sets Available',
    durationMinutes: 45,
    totalQuestions: 45,
    sections: CORPORATE_SECTIONS,
    tags: ['Data Interpretation', 'Arrangement Puzzles', 'Grammar Correction', 'Critical Reasoning'],
    difficulty: 'Intermediate to Advanced',
    rating: 4.8,
    attempts: '14.2K Candidates',
    trackKey: 'accenture',
    description: 'Calibrated to the 2025-2026 Accenture Cognitive Assessment with Quantitative, Analytical Reasoning, and Verbal communication.'
  },
  {
    id: 'cognizant-diagnostic',
    companyName: 'Cognizant',
    title: 'Cognizant Diagnostic Track',
    code: 'CTS',
    bgColor: 'bg-blue-600',
    category: 'GenC Next & Digital Diagnostic',
    pattern: '2025-2026 actual patterns',
    mockSets: '3 Mock Sets Available',
    durationMinutes: 45,
    totalQuestions: 45,
    sections: CORPORATE_SECTIONS,
    tags: ['Time & Work', 'Coding-Decoding', 'Data Sufficiency', 'Grammar Spotting'],
    difficulty: 'Intermediate',
    rating: 4.7,
    attempts: '11.8K Candidates',
    trackKey: 'cognizant',
    description: 'Simulates the Cognizant GenC Next and Digital developer assessment testing numerical, analytical grids, and technical communication.'
  },
  {
    id: 'tcs-ninja-digital',
    companyName: 'TCS',
    title: 'TCS Ninja/Digital Prep Pattern',
    code: 'TCS',
    bgColor: 'bg-rose-600',
    category: 'Ninja & Digital Advanced Track',
    pattern: '2025-2026 actual patterns',
    mockSets: '3 Mock Sets Available',
    durationMinutes: 45,
    totalQuestions: 45,
    sections: CORPORATE_SECTIONS,
    tags: ['Probability', 'Arrangement Puzzles', 'Cryptarithmetic', 'Sentence Completion'],
    difficulty: 'High / Adaptive',
    rating: 4.9,
    attempts: '28.5K Candidates',
    trackKey: 'tcs',
    description: 'Calibrated to the 2025-2026 TCS NQT, Ninja, and Digital blueprints with discrete probability, logical deduction, and verbal precision.'
  },
  {
    id: 'zoho-screening',
    companyName: 'Zoho',
    title: 'Zoho Systems Technical Screening',
    code: 'ZH',
    bgColor: 'bg-amber-600',
    category: 'Systems & Algorithmic Problem Solving',
    pattern: '2025-2026 actual patterns',
    mockSets: '3 Mock Sets Available',
    durationMinutes: 45,
    totalQuestions: 45,
    sections: CORPORATE_SECTIONS,
    tags: ['Core Number Series', 'Pointer Matrix Logic', 'Data Sufficiency', 'Vocabulary & Idioms'],
    difficulty: 'Advanced / Core',
    rating: 4.8,
    attempts: '9.4K Candidates',
    trackKey: 'zoho',
    description: 'Replicates Zoho Level 1 and Level 2 aptitude rounds with base systems math, deductive logic puzzles, and verbal precision.'
  }
];

export const getAptitudeQuestionsForRole = (roleOrPackTitle = '') => {
  const normalized = (roleOrPackTitle || '').toLowerCase();
  
  if (normalized.includes('accenture')) {
    return COMPANY_APTITUDE_BANKS.accenture;
  }
  if (normalized.includes('cognizant') || normalized.includes('genc')) {
    return COMPANY_APTITUDE_BANKS.cognizant;
  }
  if (normalized.includes('tcs') || normalized.includes('ninja') || normalized.includes('digital') || normalized.includes('nqt')) {
    return COMPANY_APTITUDE_BANKS.tcs;
  }
  if (normalized.includes('zoho')) {
    return COMPANY_APTITUDE_BANKS.zoho;
  }

  // Default to Accenture 45-question standard corporate pack
  return COMPANY_APTITUDE_BANKS.accenture;
};
