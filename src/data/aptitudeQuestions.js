// Role-specific AI Aptitude Assessment Question Bank
// 10 questions per assessment, timed at 60 seconds each

export const ROLE_APTITUDE_BANKS = {
  frontend: [
    {
      id: 1,
      topic: 'JavaScript Internals',
      question: 'What is the output of `console.log(typeof NaN)` in JavaScript?',
      options: [
        'A) "number"',
        'B) "NaN"',
        'C) "undefined"',
        'D) "object"'
      ],
      correctAnswer: 0,
      explanation: 'In JavaScript, NaN (Not-a-Number) is of numeric type according to IEEE 754 floating-point standard.'
    },
    {
      id: 2,
      topic: 'React Core & Lifecycles',
      question: 'Which React hook should be used to synchronously read layout measurements from the DOM and re-render before browser paint?',
      options: [
        'A) useEffect',
        'B) useLayoutEffect',
        'C) useInsertionEffect',
        'D) useTransition'
      ],
      correctAnswer: 1,
      explanation: 'useLayoutEffect fires synchronously after all DOM mutations, before the browser has a chance to paint.'
    },
    {
      id: 3,
      topic: 'CSS Flexbox & Layout',
      question: 'What is the initial default value of the `flex-direction` property in CSS Flexbox?',
      options: [
        'A) column',
        'B) row',
        'C) row-reverse',
        'D) wrap'
      ],
      correctAnswer: 1,
      explanation: 'The CSS initial value of flex-direction is "row", laying out items along the inline axis.'
    },
    {
      id: 4,
      topic: 'Browser Event Loop',
      question: 'Which task queue executes first immediately after the current synchronous call stack empties?',
      options: [
        'A) Microtask Queue (Promises, queueMicrotask)',
        'B) Macrotask Queue (setTimeout, setInterval)',
        'C) I/O Polling Queue',
        'D) RequestAnimationFrame Queue'
      ],
      correctAnswer: 0,
      explanation: 'Microtasks (Promises, MutationObserver callbacks) have higher priority and exhaust before macrotasks execute.'
    },
    {
      id: 5,
      topic: 'Web Performance Optimization',
      question: 'Which attribute on a `<script>` tag downloads the file asynchronously in parallel and executes it immediately upon download completion without blocking initial parsing?',
      options: [
        'A) defer',
        'B) async',
        'C) preload',
        'D) module'
      ],
      correctAnswer: 1,
      explanation: 'The async attribute downloads the script in the background and executes as soon as available, pausing HTML parsing only during execution.'
    },
    {
      id: 6,
      topic: 'React Virtual DOM',
      question: 'What is the primary architectural purpose of the `key` prop when rendering dynamic lists in React?',
      options: [
        'A) To bind unique CSS styling to each DOM node',
        'B) To help React identify which items have changed, added, or removed during Virtual DOM reconciliation',
        'C) To enforce cryptographic component verification',
        'D) To store component state in browser session cache'
      ],
      correctAnswer: 1,
      explanation: 'Keys give elements a stable identity, allowing React to match existing elements and reuse DOM nodes rather than re-creating them.'
    },
    {
      id: 7,
      topic: 'Modern CSS Standards',
      question: 'Which modern CSS rule allows styling an element based on its parent container dimensions rather than the global viewport?',
      options: [
        'A) Media Queries (@media)',
        'B) CSS Container Queries (@container)',
        'C) CSS Subgrid',
        'D) CSS Houdini Paint API'
      ],
      correctAnswer: 1,
      explanation: 'Container Queries (@container) allow components to adapt styles dynamically to the size of their parent container.'
    },
    {
      id: 8,
      topic: 'React State Architecture',
      question: 'How can you prevent an expensive computational calculation from re-running on every render when its inputs have not changed?',
      options: [
        'A) Wrap the calculation inside useMemo with a dependency array',
        'B) Store the calculation in a global let variable',
        'C) Wrap the component in a useEffect with no dependencies',
        'D) Use useCallback on the return value'
      ],
      correctAnswer: 0,
      explanation: 'useMemo caches the result of an expensive calculation between renders unless its dependencies change.'
    },
    {
      id: 9,
      topic: 'DOM Event Propagation',
      question: 'What does calling `event.stopPropagation()` on a DOM event do?',
      options: [
        'A) Prevents the browser default action (e.g. form submission, link navigation)',
        'B) Prevents further propagation of the event through capturing and bubbling phases',
        'C) Destroys the event listener permanently',
        'D) Cancels any active network fetch requests initiated by the handler'
      ],
      correctAnswer: 1,
      explanation: 'stopPropagation stops the dispatch of an event to other event targets along the DOM tree.'
    },
    {
      id: 10,
      topic: 'Web Security & Standards',
      question: 'Which HTTP response header is primarily used to mitigate Cross-Site Scripting (XSS) and data injection attacks by restricting source domains for scripts and assets?',
      options: [
        'A) X-Frame-Options',
        'B) Content-Security-Policy (CSP)',
        'C) Strict-Transport-Security (HSTS)',
        'D) Access-Control-Allow-Origin'
      ],
      correctAnswer: 1,
      explanation: 'Content-Security-Policy (CSP) allows server operators to restrict resources (JavaScript, CSS, Images) that the browser is allowed to load for that page.'
    }
  ],

  fullstack: [
    {
      id: 1,
      topic: 'RESTful API Architecture',
      question: 'Which HTTP method is defined as idempotent and used to replace an existing target resource with the uploaded payload?',
      options: [
        'A) POST',
        'B) PUT',
        'C) PATCH',
        'D) CONNECT'
      ],
      correctAnswer: 1,
      explanation: 'PUT is idempotent: multiple identical requests will produce the same result as a single request, replacing the target resource.'
    },
    {
      id: 2,
      topic: 'Database Systems',
      question: 'What is the primary characteristic of a Clustered Index in relational databases (SQL)?',
      options: [
        'A) It dictates the physical storage order of rows in the table, meaning a table can only have one clustered index',
        'B) It creates a secondary copy of all table columns in RAM',
        'C) It is only applicable to JSON data types',
        'D) It is discarded automatically at the end of each SQL transaction'
      ],
      correctAnswer: 0,
      explanation: 'A clustered index determines the physical order of data in a table; hence only one clustered index can exist per table.'
    },
    {
      id: 3,
      topic: 'Node.js Runtime',
      question: 'In Node.js, what is the default size of the libuv thread pool used for asynchronous operations like file I/O and crypto?',
      options: [
        'A) 1',
        'B) 4',
        'C) 8',
        'D) 16'
      ],
      correctAnswer: 1,
      explanation: 'By default, the libuv thread pool in Node.js contains 4 threads, configurable via UV_THREADPOOL_SIZE.'
    },
    {
      id: 4,
      topic: 'Authentication & Security',
      question: 'Which cryptographic algorithm family is recommended for password storage due to built-in salting and configurable computational work factor?',
      options: [
        'A) MD5',
        'B) SHA-256',
        'C) bcrypt / Argon2',
        'D) AES-256-CBC'
      ],
      correctAnswer: 2,
      explanation: 'bcrypt and Argon2 are adaptive key-derivation functions that incorporate salts and work factors resistant to brute-force and GPU cracking.'
    },
    {
      id: 5,
      topic: 'Web Security',
      question: 'What does the Same-Origin Policy (SOP) enforce in modern web browsers?',
      options: [
        'A) Prevents CSS files from being minified',
        'B) Restricts how a document or script loaded by one origin can interact with a resource from another origin',
        'C) Enforces two-factor authentication on all login routes',
        'D) Disables JavaScript execution on mobile devices'
      ],
      correctAnswer: 1,
      explanation: 'The Same-Origin Policy is a fundamental browser security model that isolates potentially malicious documents.'
    },
    {
      id: 6,
      topic: 'Distributed Systems',
      question: 'According to the CAP Theorem, which two properties can a distributed data store simultaneously guarantee in the presence of a network partition (P)?',
      options: [
        'A) Consistency (C) OR Availability (A)',
        'B) Concurrency (C) AND Performance (P)',
        'C) Durability (D) AND Atomicity (A)',
        'D) Scalability (S) AND Speed (S)'
      ],
      correctAnswer: 0,
      explanation: 'When a network partition (P) occurs, a distributed system must choose between Consistency (CP) or Availability (AP).'
    },
    {
      id: 7,
      topic: 'Data Structures & Algorithms',
      question: 'What is the average time complexity of finding a value in a hash table with a well-designed hash function?',
      options: [
        'A) O(1)',
        'B) O(log n)',
        'C) O(n)',
        'D) O(n log n)'
      ],
      correctAnswer: 0,
      explanation: 'Hash table lookups are O(1) constant time on average assuming uniform distribution of keys.'
    },
    {
      id: 8,
      topic: 'Networking Protocols',
      question: 'How does a WebSocket connection differ from a traditional HTTP/1.1 request-response pattern?',
      options: [
        'A) WebSockets are short-lived polling loops',
        'B) WebSockets provide a persistent, full-duplex TCP channel enabling real-time bidirectional message exchange',
        'C) WebSockets require sending HTTP headers with every single data frame',
        'D) WebSockets only support plain text and cannot transmit binary data'
      ],
      correctAnswer: 1,
      explanation: 'WebSockets establish a continuous, bidirectional communication channel over a single TCP socket.'
    },
    {
      id: 9,
      topic: 'Caching & Key-Value Stores',
      question: 'Which Redis data structure is optimal for maintaining a real-time leaderboard ranked by numerical scores?',
      options: [
        'A) Redis Hashes',
        'B) Redis Sorted Sets (ZSET)',
        'C) Redis Lists',
        'D) Redis Bitmaps'
      ],
      correctAnswer: 1,
      explanation: 'Redis Sorted Sets (ZSET) maintain elements ordered by a floating-point score with O(log N) addition and range queries.'
    },
    {
      id: 10,
      topic: 'Database Security',
      question: 'What is the most effective industry-standard mechanism to eliminate SQL Injection vulnerabilities in server applications?',
      options: [
        'A) Parameterized Queries (Prepared Statements)',
        'B) Client-side form input validation regex only',
        'C) String concatenation with quotes escaping',
        'D) Restricting database access to GET requests only'
      ],
      correctAnswer: 0,
      explanation: 'Parameterized queries separate SQL code from user data parameters, ensuring user inputs cannot alter query logic.'
    }
  ]
};

export const getAptitudeQuestionsForRole = (roleTitle = '') => {
  const normalized = (roleTitle || '').toLowerCase();
  if (normalized.includes('front') || normalized.includes('react') || normalized.includes('ui') || normalized.includes('web')) {
    return ROLE_APTITUDE_BANKS.frontend;
  }
  return ROLE_APTITUDE_BANKS.fullstack;
};
