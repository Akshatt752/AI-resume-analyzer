// Canonical skill name → lowercase spellings that count as a match.
// Matching uses word boundaries, so "java" does not match inside "javascript".
export const SKILLS = {
  // Languages
  JavaScript: ["javascript", "js", "es6", "ecmascript"],
  TypeScript: ["typescript"],
  Python: ["python"],
  Java: ["java"],
  "C++": ["c++", "cpp"],
  SQL: ["sql"],
  Bash: ["bash", "shell scripting", "shell script"],

  // Frontend
  HTML: ["html", "html5"],
  CSS: ["css", "css3"],
  React: ["react", "react.js", "reactjs"],
  "Next.js": ["next.js", "nextjs"],
  Redux: ["redux", "redux toolkit"],
  "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
  Bootstrap: ["bootstrap"],
  "Responsive Design": ["responsive", "mobile-first", "mobile first"],
  Accessibility: ["accessibility", "a11y", "wcag"],
  Figma: ["figma"],
  Vite: ["vite"],

  // Backend
  "Node.js": ["node.js", "nodejs", "node js", "node"],
  "Express.js": ["express", "express.js", "expressjs"],
  "REST APIs": ["rest api", "rest apis", "restful", "rest-api", "restful api"],
  GraphQL: ["graphql"],
  "Socket.IO": ["socket.io", "socketio", "websocket", "websockets"],
  Microservices: ["microservice", "microservices"],
  "Spring Boot": ["spring boot", "springboot"],
  Hibernate: ["hibernate", "jpa"],
  Django: ["django"],
  Flask: ["flask"],
  FastAPI: ["fastapi"],

  // Databases
  MongoDB: ["mongodb", "mongo"],
  Mongoose: ["mongoose"],
  MySQL: ["mysql"],
  PostgreSQL: ["postgresql", "postgres"],
  Redis: ["redis"],
  Firebase: ["firebase"],

  // Auth & security
  JWT: ["jwt", "json web token", "json web tokens"],
  Authentication: ["authentication", "auth", "oauth", "clerk"],

  // DevOps & tools
  Git: ["git"],
  GitHub: ["github"],
  Docker: ["docker"],
  Kubernetes: ["kubernetes", "k8s"],
  AWS: ["aws", "amazon web services", "ec2", "s3"],
  "CI/CD": ["ci/cd", "ci cd", "github actions", "jenkins", "continuous integration"],
  Linux: ["linux", "ubuntu"],
  Nginx: ["nginx"],
  Terraform: ["terraform"],
  Monitoring: ["prometheus", "grafana", "monitoring"],
  Postman: ["postman"],
  Deployment: ["deployed", "deployment", "vercel", "render", "netlify", "heroku"],
  Testing: ["jest", "mocha", "unit testing", "unit tests", "testing", "junit", "pytest"],

  // Data & ML
  Pandas: ["pandas"],
  NumPy: ["numpy"],
  "Scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
  TensorFlow: ["tensorflow", "keras"],
  PyTorch: ["pytorch"],
  "Machine Learning": ["machine learning", "ml"],
  "Deep Learning": ["deep learning", "neural network", "neural networks", "cnn", "rnn"],
  NLP: ["nlp", "natural language processing"],
  Excel: ["excel", "ms excel", "spreadsheets"],
  "Power BI": ["power bi", "powerbi"],
  Tableau: ["tableau"],
  Statistics: ["statistics", "statistical"],
  "Data Visualization": ["data visualization", "data visualisation", "matplotlib", "seaborn", "dashboards"],
  "Data Cleaning": ["data cleaning", "data wrangling", "data preprocessing"],

  // CS fundamentals
  "Data Structures & Algorithms": ["data structures", "algorithms", "dsa", "leetcode"],
  OOP: ["oop", "oops", "object oriented", "object-oriented"],
  DBMS: ["dbms", "database management"],
  "System Design": ["system design", "low level design", "high level design", "lld", "hld"],
  Agile: ["agile", "scrum", "jira"],
};
