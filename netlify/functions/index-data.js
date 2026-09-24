'use strict';
/* index-data.js — the real search corpus: 300+ hand-written documents,
   knowledge entities, suggestions, trending queries. Shared by rank.js. */

const DOCS = [];
let _n = 0;

function add(topic, type, site, name, path, title, snippet, keywords, imgTag) {
  _n++;
  const slug = String(path).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 42) || 'doc';
  DOCS.push({
    id: 'd' + _n,
    topic: topic,
    type: type || 'web',
    site: site,
    name: name,
    url: 'https://' + site + path,
    crumb: 'https://' + site + ' \u203a ' + slug.split('-').slice(0, 3).join(' \u203a '),
    title: title,
    snippet: snippet,
    keywords: (keywords || []).map(k => String(k).toLowerCase()),
    imgSeed: ((imgTag || slug) + '-' + _n).replace(/[^a-z0-9-]/gi, '').slice(0, 48)
  });
}

/* T(topic, type, site, name, docs[]) — docs are [path, title, snippet, keywords[]] */
function T(topic, type, site, name, docs) {
  for (const d of docs) add(topic, type, site, name, d[0], d[1], d[2], d[3], d[4]);
}

/* ================= 1. python (14) ================= */
T('programming', 'web', 'docs.python.org', 'Python Documentation', [
  ['/3/tutorial/', 'Python Tutorial: The Official Beginner\u2019s Guide',
    'The official Python tutorial walks new programmers through data structures, control flow, functions and classes. It assumes no prior programming experience and mirrors the current stable Python release.',
    ['python', 'tutorial', 'beginner', 'guide', 'learn']],
  ['/3/tutorial/venv.html', 'Python Virtual Environments: venv and pip Explained',
    'The official docs explain how to isolate project dependencies with venv and manage them using pip. Covers creating environments, installing packages and sharing requirements files across machines.',
    ['python', 'virtual', 'environment', 'venv', 'pip', 'dependencies']],
  ['/3/library/asyncio.html', 'asyncio \u2014 Asynchronous I/O in Python',
    'The asyncio reference documents coroutines, event loops, tasks and streams for writing concurrent Python code. Includes patterns for timeouts, cancellation and running blocking code in executors.',
    ['python', 'asyncio', 'async', 'await', 'concurrency']],
]);
T('programming', 'web', 'realpython.com', 'Real Python', [
  ['/list-comprehension-python/', 'Python List Comprehensions: The Ultimate Guide',
    'Real Python\u2019s deep dive shows how list, set and dict comprehensions replace verbose loops with readable one-liners. Benchmarks and style advice help you know when a comprehension improves code and when it hurts.',
    ['python', 'list', 'comprehension', 'tutorial']],
  ['/python-decorators/', 'Primer on Python Decorators',
    'Decorators let you wrap functions with reusable behavior. This primer builds from closures to the @ syntax, with real recipes for caching, logging and access control.',
    ['python', 'decorators', 'functions', 'advanced']],
  ['/python-virtual-environments-a-primer/', 'Python Virtual Environments: A Primer',
    'Why every Python project deserves its own environment. Compares venv, virtualenv, pipenv and poetry with setup commands you can copy-paste.',
    ['python', 'virtual', 'environment', 'venv', 'poetry']],
]);
T('programming', 'web', 'pandas.pydata.org', 'pandas', [
  ['/docs/getting_started/', 'Pandas: 10 Minutes to pandas',
    'The fastest route from zero to useful data analysis in Python. Covers DataFrames, reading CSVs, filtering, grouping and quick plots \u2014 the core workflow behind most pandas code.',
    ['python', 'pandas', 'data', 'analysis', 'dataframe']],
]);
T('programming', 'web', 'stackoverflow.com', 'Stack Overflow', [
  ['/questions/2612802', 'How do I list all files of a directory in Python?',
    'The canonical Q&A on listing directory contents with os.listdir, os.scandir and pathlib. Top answers compare performance and show recursive glob patterns.',
    ['python', 'files', 'directory', 'list', 'os']],
  ['/questions/394809', 'Does Python have a ternary conditional operator?',
    'Yes \u2014 Python\u2019s conditional expression is x if cond else y. The thread covers evaluation order, nesting, and why it differs from C-style ternaries.',
    ['python', 'ternary', 'conditional', 'operator']],
]);
T('programming', 'web', 'codecademy.com', 'Codecademy', [
  ['/resources/blog/python-vs-javascript', 'Python vs JavaScript: Which Language Should You Learn First?',
    'Codecademy compares Python and JavaScript on syntax, job-market demand, web vs data-science use cases and learning curve, helping beginners pick the right first language.',
    ['python', 'javascript', 'compare', 'beginner', 'which']],
]);
T('programming', 'web', 'towardsdatascience.com', 'Towards Data Science', [
  ['/python-web-scraping-guide', 'Web Scraping with Python: BeautifulSoup and Requests',
    'A practical guide to scraping responsibly: requests for fetching, BeautifulSoup for parsing, plus rate limiting, robots.txt and handling JavaScript-heavy pages with Playwright.',
    ['python', 'scraping', 'beautifulsoup', 'requests', 'web']],
]);
T('programming', 'web', 'peps.python.org', 'Python Enhancement Proposals', [
  ['/pep-0008/', 'PEP 8 \u2014 Style Guide for Python Code',
    'The official style guide: naming conventions, line length, imports and whitespace. The document every Python linter enforces, explained with rationale for each rule.',
    ['python', 'pep8', 'style', 'guide', 'conventions']],
]);

/* ================= 2. javascript (14) ================= */
T('programming', 'web', 'developer.mozilla.org', 'MDN Web Docs', [
  ['/en-US/docs/Web/JavaScript', 'JavaScript Array Methods: map, filter, reduce Explained',
    'MDN\u2019s reference covers the core array methods every JavaScript developer uses daily, with examples of map, filter, reduce, find and forEach \u2014 plus callback signatures and chaining patterns.',
    ['javascript', 'array', 'map', 'filter', 'reduce', 'methods']],
  ['/en-US/docs/Web/JavaScript/Guide', 'JavaScript Guide: Closures, Prototypes and Modules',
    'The in-depth MDN guide to the language\u2019s trickiest parts: lexical closures, the prototype chain, classes and ES modules, each with runnable examples.',
    ['javascript', 'closure', 'prototype', 'guide', 'tutorial']],
]);
T('programming', 'web', 'javascript.info', 'The Modern JavaScript Tutorial', [
  ['/async', 'Async JavaScript: Promises, async/await and the Event Loop',
    'A visual walkthrough of asynchronous JavaScript, from callbacks to promises and async/await. Event-loop diagrams and runnable examples make promise chaining and error handling intuitive.',
    ['javascript', 'async', 'await', 'promise', 'event loop']],
  ['/fetch', 'Fetch API: Downloading and Uploading with JavaScript',
    'Everything about fetch(): GET/POST requests, headers, error handling, aborting requests and posting FormData \u2014 with comparisons to the old XMLHttpRequest.',
    ['javascript', 'fetch', 'api', 'ajax', 'http']],
]);
T('programming', 'web', 'v8.dev', 'V8 JavaScript Engine', [
  ['/features', 'ES2024: What\u2019s New in Modern JavaScript',
    'The V8 team documents the newest ECMAScript features shipping in Chrome and Node, with spec links, usage samples and browser compatibility notes.',
    ['javascript', 'es2024', 'ecmascript', 'features', 'v8']],
]);
T('programming', 'web', 'nodejs.org', 'Node.js', [
  ['/en/docs', 'Node.js Documentation: Getting Started Guide',
    'Official Node.js docs: installing, the event loop, modules, npm and building your first HTTP server. The starting point for server-side JavaScript.',
    ['javascript', 'nodejs', 'node', 'server', 'docs']],
  ['/en/learn', 'Learn Node.js: Asynchronous Work and Streams',
    'Node\u2019s learning guides explain non-blocking I/O, streams, buffers and the module system with short focused lessons and code you can run immediately.',
    ['nodejs', 'node', 'streams', 'async', 'tutorial']],
]);
T('programming', 'web', 'freecodecamp.org', 'freeCodeCamp', [
  ['/news/js-type-coercion-explained/', 'JavaScript Type Coercion: == vs === Explained',
    'A guide to implicit type coercion \u2014 when JavaScript converts strings to numbers and why == differs from ===. Dozens of annotated REPL examples make the edge cases stick.',
    ['javascript', 'coercion', 'equality', 'types', 'tutorial']],
  ['/news/learn-javascript-full-course/', 'Learn JavaScript: Full 8-Hour Beginner Course',
    'freeCodeCamp\u2019s complete video course takes you from variables to DOM projects. Includes challenges on every section so you learn by building, not just watching.',
    ['javascript', 'course', 'beginner', 'tutorial', 'learn']],
]);
T('programming', 'web', 'dev.to', 'DEV Community', [
  ['/javascript-best-practices', 'JavaScript Best Practices 2026: Clean Code Patterns',
    'Community-curated modern practices: naming, guard clauses, avoiding callback hell. Each pattern includes bad-vs-good comparisons drawn from real code reviews.',
    ['javascript', 'best', 'practices', 'clean', 'code']],
]);
T('programming', 'web', 'eloquentjavascript.net', 'Eloquent JavaScript', [
  ['/', 'Eloquent JavaScript, 4th Edition (Free Online Book)',
    'Marijn Haverbeke\u2019s beloved free book teaches programming through JavaScript \u2014 from values and functions to Node, with exercises and an interactive sandbox.',
    ['javascript', 'book', 'eloquent', 'learn', 'free']],
]);
T('programming', 'web', 'caniuse.com', 'Can I use', [
  ['/', 'Can I Use: JavaScript and Web API Browser Support Tables',
    'Up-to-date browser support tables for every JavaScript feature and Web API. Search any API to see exactly which browsers and versions support it.',
    ['javascript', 'browser', 'support', 'compatibility', 'caniuse']],
]);

/* ================= 3. react (10) ================= */
T('programming', 'web', 'react.dev', 'React', [
  ['/', 'React: The Library for Web and Native User Interfaces',
    'The official React documentation. Learn components, hooks, state and effects with the new interactive docs \u2014 the canonical starting point for React developers.',
    ['react', 'javascript', 'library', 'docs', 'tutorial']],
  ['/learn', 'Learn React: Describing the UI and Adding Interactivity',
    'React\u2019s official learning path: rendering lists, conditional UI, responding to events, managing state and sharing data between components.',
    ['react', 'hooks', 'tutorial', 'learn', 'components']],
  ['/reference/react/useEffect', 'useEffect Reference: Synchronizing with Effects',
    'The complete useEffect reference: when effects run, the dependency array, cleanup functions and the common pitfalls that cause infinite loops.',
    ['react', 'useeffect', 'hooks', 'effects', 'reference']],
]);
T('programming', 'web', 'nextjs.org', 'Next.js', [
  ['/docs', 'Next.js Documentation: The React Framework for the Web',
    'Official Next.js docs covering App Router, server components, data fetching, routing and deployment. The framework behind most production React sites.',
    ['react', 'nextjs', 'framework', 'docs', 'ssr']],
]);
T('programming', 'web', 'kentcdodds.com', 'Kent C. Dodds', [
  ['/blog', 'State Management in React: When You Don\u2019t Need Redux',
    'Kent C. Dodds argues most apps can manage state with useState, useReducer and context. A decision framework for choosing the simplest tool that works.',
    ['react', 'state', 'redux', 'hooks', 'management']],
]);
T('programming', 'web', 'stackoverflow.com', 'Stack Overflow', [
  ['/questions/62336340', 'React useEffect dependency array: exhaustive-deps warning explained',
    'Why the exhaustive-deps lint rule exists, what it\u2019s protecting you from, and how to restructure effects instead of disabling the warning.',
    ['react', 'useeffect', 'hooks', 'warning', 'dependencies']],
]);
T('programming', 'web', 'ui.dev', 'ui.dev', [
  ['/react-router-tutorial', 'React Router Tutorial: Nested Routes and Data Loading',
    'A complete React Router v6 tutorial: nested layouts, dynamic params, loaders and error boundaries for real-world app navigation.',
    ['react', 'router', 'routing', 'tutorial']],
]);
T('programming', 'web', 'vitejs.dev', 'Vite', [
  ['/guide/', 'Vite: Next Generation Frontend Tooling for React',
    'Vite\u2019s guide to instant dev servers and lightning builds for React projects. Covers plugins, env variables and migrating from Create React App.',
    ['react', 'vite', 'build', 'tooling', 'bundler']],
]);
T('programming', 'web', 'npmjs.com', 'npm', [
  ['/package/react', 'react \u2014 npm package page',
    'The official react npm package: version history, weekly downloads and dependency info. Install with npm install react react-dom.',
    ['react', 'npm', 'package', 'install']],
]);

/* ================= 4. css / html / web (10) ================= */
T('programming', 'web', 'developer.mozilla.org', 'MDN Web Docs', [
  ['/en-US/docs/Web/CSS/CSS_grid_layout', 'CSS Grid Layout: The Complete Guide',
    'MDN\u2019s grid guide: tracks, areas, alignment and responsive patterns. The definitive reference for two-dimensional CSS layouts.',
    ['css', 'grid', 'layout', 'tutorial']],
  ['/en-US/docs/Web/CSS/flex', 'CSS Flexbox: A Visual Introduction',
    'Learn flexbox through diagrams: containers, items, justify-content and align-items. The fastest way to stop fighting centering.',
    ['css', 'flexbox', 'layout', 'center', 'tutorial']],
  ['/en-US/docs/Web/CSS/Using_CSS_custom_properties', 'CSS Variables (Custom Properties) Explained',
    'How custom properties enable theming, cascading values and runtime style changes from JavaScript \u2014 with dark-mode examples.',
    ['css', 'variables', 'custom', 'properties', 'theming']],
]);
T('programming', 'web', 'css-tricks.com', 'CSS-Tricks', [
  ['/snippets/css/a-guide-to-flexbox/', 'A Complete Guide to Flexbox',
    'The famous visual cheatsheet: every flexbox property with diagrams for parent and child. Bookmark it \u2014 every developer does.',
    ['css', 'flexbox', 'cheatsheet', 'guide']],
  ['/snippets/css/complete-guide-grid/', 'A Complete Guide to Grid',
    'The companion grid cheatsheet covering all properties with visual examples. The two guides together answer 95% of CSS layout questions.',
    ['css', 'grid', 'cheatsheet', 'guide']],
]);
T('programming', 'web', 'tailwindcss.com', 'Tailwind CSS', [
  ['/docs', 'Tailwind CSS Documentation: Utility-First Styling',
    'Official Tailwind docs: installation, the utility classes, responsive design and customization via the config file.',
    ['css', 'tailwind', 'utility', 'framework', 'docs']],
]);
T('programming', 'web', 'web.dev', 'web.dev', [
  ['/animations/', 'CSS Animations and Transitions: web.dev Guide',
    'Google\u2019s guide to performant animations: transitions, keyframes, and the FLIP technique \u2014 plus what to avoid for 60fps motion.',
    ['css', 'animation', 'transitions', 'keyframes']],
  ['/responsive-web-design-basics/', 'Responsive Web Design Basics',
    'Viewport meta, fluid grids, flexible images and media queries \u2014 the foundations of sites that work on every screen size.',
    ['css', 'responsive', 'mobile', 'media', 'queries']],
]);
T('programming', 'web', 'html.spec.whatwg.org', 'WHATWG', [
  ['/', 'HTML Living Standard',
    'The authoritative HTML specification maintained by WHATWG. The source of truth for every element, attribute and parsing rule.',
    ['html', 'spec', 'standard', 'reference']],
]);

/* ================= 5. git (8) ================= */
T('programming', 'web', 'git-scm.com', 'Git', [
  ['/book/en/v2', 'Pro Git Book (Free): The Complete Git Reference',
    'Scott Chacon\u2019s free book covers everything from git init to rebasing workflows and internals. The definitive Git text, readable online.',
    ['git', 'book', 'tutorial', 'free', 'reference']],
  ['/docs/git-rebase', 'git-rebase Documentation',
    'Official docs for rebasing: rewriting history, interactive rebase, and the golden rule of never rebasing public branches.',
    ['git', 'rebase', 'docs', 'history']],
]);
T('programming', 'web', 'github.com', 'GitHub Docs', [
  ['/en/get-started', 'GitHub: Get Started with Git and GitHub',
    'GitHub\u2019s onboarding: creating repos, pull requests, code review and merging. The workflow most teams use daily.',
    ['git', 'github', 'tutorial', 'pull', 'request']],
]);
T('programming', 'web', 'stackoverflow.com', 'Stack Overflow', [
  ['/questions/927358', 'How do I undo the most recent local commits in Git?',
    'The definitive thread on git reset --soft/--mixed/--hard, git revert and recovering with reflog. Read before rewriting history.',
    ['git', 'undo', 'commit', 'reset', 'revert']],
  ['/questions/15868148', 'Git rebase vs merge: what\u2019s the difference?',
    'A clear explanation of linear vs merge-commit history, when each is appropriate, and how teams typically choose.',
    ['git', 'rebase', 'merge', 'compare', 'workflow']],
]);
T('programming', 'web', 'ohshitgit.com', 'Oh Shit, Git!?!', [
  ['/', 'Oh Shit, Git!? \u2014 Fixing Common Git Disasters',
    'A friendly field guide to escaping Git messes: wrong branch commits, botched merges, deleted branches. Plain-language rescue recipes.',
    ['git', 'fix', 'mistakes', 'guide', 'help']],
]);
T('programming', 'web', 'learngitbranching.js.org', 'Learn Git Branching', [
  ['/', 'Learn Git Branching: Interactive Visual Tutorial',
    'The best way to build Git intuition: an interactive playground that visualizes branches, rebases and merges as you type commands.',
    ['git', 'branching', 'interactive', 'tutorial', 'visual']],
]);
T('programming', 'web', 'git-scm.com', 'Git', [
  ['/docs/git-stash', 'git-stash Documentation',
    'Official reference for stashing: saving work in progress, named stashes, partial stashes and applying across branches.',
    ['git', 'stash', 'docs', 'wip']],
]);

/* ================= 6. linux (8) ================= */
T('programming', 'web', 'ubuntu.com', 'Ubuntu', [
  ['/tutorials/install-ubuntu-desktop', 'Install Ubuntu Desktop: Step-by-Step Tutorial',
    'Canonical\u2019s official installer walkthrough: creating bootable USB media, partitioning, and first-boot setup for the world\u2019s most popular Linux desktop.',
    ['linux', 'ubuntu', 'install', 'tutorial', 'desktop']],
]);
T('programming', 'web', 'linuxcommand.org', 'LinuxCommand.org', [
  ['/lc3_learning_the_shell.php', 'Learning the Shell: A Linux Command-Line Primer',
    'The classic free tutorial: navigation, file manipulation, redirection, permissions and pipes. The fastest path to terminal comfort.',
    ['linux', 'terminal', 'shell', 'commands', 'tutorial']],
]);
T('programming', 'web', 'ss64.com', 'SS64', [
  ['/bash/', 'Bash Command Reference (chmod, grep, ssh, tar\u2026)',
    'An A\u2013Z bash reference with syntax and examples for the commands you use daily \u2014 chmod, grep, ssh, tar, rsync and more.',
    ['linux', 'bash', 'commands', 'reference', 'cheatsheet']],
]);
T('programming', 'web', 'stackoverflow.com', 'Stack Overflow', [
  ['/questions/10863659', 'Permission denied when running script in Linux \u2014 how to fix?',
    'Why ./script.sh fails with permission denied and how chmod +x, shebangs and ownership fix it. Includes the security reasoning behind execute bits.',
    ['linux', 'permission', 'denied', 'chmod', 'fix']],
]);
T('programming', 'web', 'digitalocean.com', 'DigitalOcean', [
  ['/community/tutorials/initial-server-setup-with-ubuntu', 'Initial Server Setup with Ubuntu',
    'DigitalOcean\u2019s hardening checklist: non-root user, SSH keys, firewall and fail2ban. Do this before anything else on a fresh VPS.',
    ['linux', 'ubuntu', 'server', 'setup', 'ssh']],
  ['/community/tutorials/linux-terminal-shortcuts', 'Linux Terminal Shortcuts You Should Know',
    'Ctrl+R history search, Ctrl+W word delete, Alt+. last argument \u2014 the keyboard shortcuts that make terminal veterans fast.',
    ['linux', 'terminal', 'shortcuts', 'bash', 'productivity']],
]);
T('programming', 'web', 'kernel.org', 'Linux Kernel', [
  ['/doc/html/latest/', 'The Linux Kernel Documentation',
    'Official kernel docs: process management, filesystems, networking internals and driver development. For when you need the ground truth.',
    ['linux', 'kernel', 'docs', 'internals']],
]);
T('programming', 'web', 'archlinux.org', 'ArchWiki', [
  ['/', 'ArchWiki: The Finest Linux Documentation on Earth',
    'Arch\u2019s legendary wiki covers everything from Wi-Fi drivers to window managers with unusual depth. Useful on any distribution, not just Arch.',
    ['linux', 'arch', 'wiki', 'docs', 'troubleshooting']],
]);

/* ================= 7. docker (6) ================= */
T('programming', 'web', 'docs.docker.com', 'Docker Docs', [
  ['/get-started/', 'Docker Get Started: Containers in 10 Minutes',
    'Official Docker onboarding: images vs containers, your first Dockerfile, and running a multi-container app with Compose.',
    ['docker', 'containers', 'tutorial', 'get started']],
  ['/compose/', 'Docker Compose: Multi-Container Applications',
    'Define app, database and cache in one YAML file. The Compose reference covers services, networks, volumes and production patterns.',
    ['docker', 'compose', 'containers', 'yaml', 'tutorial']],
]);
T('programming', 'web', 'stackoverflow.com', 'Stack Overflow', [
  ['/questions/21553353', 'What is the difference between Docker and Kubernetes?',
    'Docker packages apps into containers; Kubernetes orchestrates them at scale. The thread explains when each is enough on its own.',
    ['docker', 'kubernetes', 'compare', 'containers', 'vs']],
]);
T('programming', 'web', 'nodejs.org', 'Node.js', [
  ['/en/docs/guides/nodejs-docker-webapp', 'Dockerizing a Node.js Web App: Official Guide',
    'Node\u2019s official Dockerfile walkthrough: slim base images, layer caching, .dockerignore and running as a non-root user.',
    ['docker', 'nodejs', 'dockerfile', 'node', 'tutorial']],
]);
T('programming', 'web', 'hub.docker.com', 'Docker Hub', [
  ['/', 'Docker Hub: Container Image Library',
    'The public registry of container images: official images for postgres, redis, node and thousands of community images with pull commands.',
    ['docker', 'hub', 'images', 'registry', 'pull']],
]);
T('programming', 'web', 'vscode.dev', 'VS Code Docs', [
  ['/docs/devcontainers/tutorial', 'Dev Containers Tutorial: Docker-Powered Dev Environments',
    'Run your editor inside a Docker container for reproducible environments. The tutorial wires up Node, extensions and port forwarding.',
    ['docker', 'devcontainers', 'vscode', 'tutorial']],
]);

/* ================= 8. sql / databases (8) ================= */
T('programming', 'web', 'postgresql.org', 'PostgreSQL', [
  ['/docs/current/tutorial.html', 'PostgreSQL Tutorial: The World\u2019s Most Advanced Open-Source DB',
    'Official Postgres tutorial: creating databases, SQL basics, joins, indexes and transactions. The starting point for serious relational work.',
    ['sql', 'postgres', 'postgresql', 'tutorial', 'database']],
]);
T('programming', 'web', 'mysql.com', 'MySQL', [
  ['/doc/', 'MySQL Reference Manual',
    'The complete MySQL reference: SQL syntax, storage engines, replication and optimization. Searchable and versioned per release.',
    ['sql', 'mysql', 'database', 'reference', 'docs']],
]);
T('programming', 'web', 'sqlbolt.com', 'SQLBolt', [
  ['/', 'SQLBolt: Learn SQL with Interactive Exercises',
    'Free interactive SQL lessons in your browser: SELECT, WHERE, JOINs, GROUP BY and subqueries, each with exercises that run instantly.',
    ['sql', 'tutorial', 'interactive', 'learn', 'join']],
]);
T('programming', 'web', 'use-the-index-luke.com', 'Use The Index, Luke', [
  ['/', 'Use The Index, Luke: A Guide to Database Performance',
    'The essential free book on SQL indexing: B-trees, composite indexes and why some queries ignore your indexes. Required reading before \u201cthe database is slow\u201d.',
    ['sql', 'index', 'performance', 'optimization', 'database']],
]);
T('programming', 'web', 'stackoverflow.com', 'Stack Overflow', [
  ['/questions/38549', 'SQL JOIN types explained: INNER, LEFT, RIGHT, FULL',
    'Venn-diagram explanations of every JOIN type with examples. The most-bookmarked SQL answer on the site.',
    ['sql', 'join', 'inner', 'left', 'tutorial']],
  ['/questions/12744', 'PostgreSQL vs MySQL: which should I choose?',
    'A balanced comparison of features, licensing, JSON support and ecosystem. The consensus: Postgres for most new projects.',
    ['sql', 'postgres', 'mysql', 'compare', 'vs']],
]);
T('programming', 'web', 'redis.io', 'Redis', [
  ['/docs/', 'Redis Documentation: In-Memory Data Structures',
    'Official Redis docs: strings, hashes, streams and pub/sub, plus persistence and clustering. The playbook for caching and real-time features.',
    ['redis', 'cache', 'database', 'nosql', 'docs']],
]);
T('programming', 'web', 'mongodb.com', 'MongoDB', [
  ['/docs/manual/', 'MongoDB Manual: Document Database Guide',
    'The MongoDB manual: documents, aggregation pipelines, indexing and sharding. For when your data doesn\u2019t fit tables.',
    ['mongodb', 'nosql', 'database', 'docs', 'documents']],
]);

/* ================= 9. machine learning (10) ================= */
T('ai', 'web', 'developers.google.com', 'Google for Developers', [
  ['/machine-learning/intro-to-ml', 'Introduction to Machine Learning: Google\u2019s Free Course',
    'Google\u2019s crash course: supervised learning, loss functions, gradient descent and neural nets \u2014 with Colab exercises. The standard first course.',
    ['machine', 'learning', 'ml', 'course', 'ai', 'tutorial']],
]);
T('ai', 'web', 'coursera.org', 'Coursera', [
  ['/specializations/machine-learning-introduction', 'Machine Learning Specialization by Andrew Ng',
    'Andrew Ng\u2019s legendary specialization, rebuilt for 2026: regression, classification, neural networks and decision trees with Python labs.',
    ['machine', 'learning', 'andrew', 'ng', 'course', 'coursera']],
]);
T('ai', 'web', 'scikit-learn.org', 'scikit-learn', [
  ['/', 'scikit-learn: Machine Learning in Python',
    'The workhorse ML library: classification, regression, clustering with a consistent API. The user guide\u2019s model-selection chapter is gold.',
    ['machine', 'learning', 'scikit', 'python', 'ml', 'library']],
]);
T('ai', 'web', 'pytorch.org', 'PyTorch', [
  ['/tutorials/', 'PyTorch Tutorials: Deep Learning from Basics',
    'Official PyTorch tutorials: tensors, autograd, training loops and deploying models. The framework behind most published research.',
    ['deep', 'learning', 'pytorch', 'neural', 'network', 'tutorial']],
]);
T('ai', 'web', 'tensorflow.org', 'TensorFlow', [
  ['/tutorials', 'TensorFlow Tutorials: Keras and Beyond',
    'Google\u2019s TensorFlow guides: Keras quickstart, custom training, TFX pipelines and Lite deployment to phones.',
    ['deep', 'learning', 'tensorflow', 'keras', 'neural', 'tutorial']],
]);
T('ai', 'web', 'karpathy.ai', 'Andrej Karpathy', [
  ['/zero-to-hero.html', 'Neural Networks: Zero to Hero (Free Video Series)',
    'Karpathy builds GPT from scratch in a legendary lecture series \u2014 tokenizers, transformers, training. The single best deep-learning resource online.',
    ['neural', 'network', 'gpt', 'transformer', 'karpathy', 'deep', 'learning']],
]);
T('ai', 'web', 'arxiv.org', 'arXiv', [
  ['/abs/1706.03762', 'Attention Is All You Need (Transformer Paper)',
    'The 2017 paper that launched the LLM era: the Transformer architecture, self-attention and the end of recurrence. Eight pages that changed computing.',
    ['transformer', 'attention', 'paper', 'nlp', 'deep', 'learning']],
]);
T('ai', 'web', 'huggingface.co', 'Hugging Face', [
  ['/docs', 'Hugging Face Docs: Transformers, Datasets, Diffusers',
    'The hub\u2019s documentation: fine-tuning LLMs, running Stable Diffusion, and sharing models. The center of gravity for open AI.',
    ['ai', 'huggingface', 'llm', 'transformers', 'fine', 'tuning']],
]);
T('ai', 'web', 'kaggle.com', 'Kaggle', [
  ['/learn', 'Kaggle Learn: Free Micro-Courses in ML and Data Science',
    'Hands-on micro-courses: Python, pandas, machine learning, deep learning \u2014 each with in-browser notebooks and real datasets.',
    ['machine', 'learning', 'kaggle', 'course', 'data', 'science']],
]);
T('ai', 'web', 'distill.pub', 'Distill', [
  ['/', 'Distill: Interactive Machine Learning Research',
    'Beautiful interactive explanations of attention, t-SNE and neural net internals. The rare journal where you play with the figures.',
    ['machine', 'learning', 'visual', 'interactive', 'neural', 'network']],
]);

/* ================= 10. ai tools (8) ================= */
T('ai', 'web', 'openai.com', 'OpenAI', [
  ['/', 'ChatGPT: Conversational AI by OpenAI',
    'ChatGPT\u2019s official page: capabilities, pricing tiers and API access. The product that brought LLMs to a hundred million users.',
    ['ai', 'chatgpt', 'openai', 'llm', 'chatbot']],
]);
T('ai', 'web', 'anthropic.com', 'Anthropic', [
  ['/claude', 'Claude: AI Assistant by Anthropic',
    'Claude\u2019s official page: the model family known for long context, careful reasoning and coding ability. API and app access details.',
    ['ai', 'claude', 'anthropic', 'llm', 'assistant']],
]);
T('ai', 'web', 'midjourney.com', 'Midjourney', [
  ['/', 'Midjourney: AI Image Generation',
    'The leading AI image generator: prompting guide, parameters and gallery. Where \u201cAI art\u201d stopped looking like AI art.',
    ['ai', 'image', 'generator', 'midjourney', 'art']],
]);
T('ai', 'web', 'runwayml.com', 'Runway', [
  ['/', 'Runway: AI Video Generation Tools',
    'Text-to-video and video editing with AI: Gen-3 models, inpainting and motion brushes. The toolkit behind viral AI shorts.',
    ['ai', 'video', 'generator', 'runway']],
]);
T('ai', 'web', 'elevenlabs.io', 'ElevenLabs', [
  ['/', 'ElevenLabs: AI Voice Generation',
    'Lifelike text-to-speech and voice cloning in 30+ languages. The standard for AI narration, dubbing and audiobooks.',
    ['ai', 'voice', 'tts', 'speech', 'elevenlabs']],
]);
T('ai', 'web', 'perplexity.ai', 'Perplexity', [
  ['/', 'Perplexity: AI-Powered Answer Engine',
    'Ask questions, get cited answers from the live web. The product rethinking search as conversation with sources.',
    ['ai', 'search', 'perplexity', 'answers', 'engine']],
]);
T('ai', 'web', 'github.com', 'GitHub', [
  ['/features/copilot', 'Muse: AI Pair Programmer',
    'Copilot\u2019s official page: code completion in your editor, chat, and the models behind it. The tool that changed how code gets written.',
    ['ai', 'copilot', 'coding', 'github', 'assistant']],
]);
T('ai', 'web', 'notion.so', 'Notion', [
  ['/product/ai', 'Notion AI: Writing Help Inside Your Workspace',
    'Notion\u2019s AI features: drafting, summarizing and autofill inside docs and databases. Where note-taking meets language models.',
    ['ai', 'notion', 'writing', 'productivity']],
]);

/* ================= 11. space (10) ================= */
T('science', 'web', 'nasa.gov', 'NASA', [
  ['/', 'NASA: Space Exploration, Missions and Discoveries',
    'NASA\u2019s official portal: Artemis moon missions, Mars rovers, the James Webb telescope and live launch coverage.',
    ['space', 'nasa', 'missions', 'exploration']],
  ['/webb', 'James Webb Space Telescope: First Images and Science',
    'Webb\u2019s official hub: the deepest infrared views of the early universe, exoplanet atmospheres and stellar nurseries.',
    ['space', 'james', 'webb', 'telescope', 'nasa']],
  ['/perseverance', 'Mars Perseverance Rover: Mission Updates',
    'Follow Perseverance\u2019s hunt for ancient life in Jezero Crater: sample caching, Ingenuity\u2019s flights and raw image feeds.',
    ['space', 'mars', 'rover', 'perseverance', 'nasa']],
]);
T('science', 'web', 'spacex.com', 'SpaceX', [
  ['/vehicles/starship/', 'Starship: SpaceX\u2019s Fully Reusable Mars Rocket',
    'Starship\u2019s official page: specs, flight-test recaps and the Mars architecture. The largest flying object ever built.',
    ['space', 'spacex', 'starship', 'rocket', 'mars', 'launch']],
  ['/launches/', 'SpaceX Launches: Manifest and Live Streams',
    'Upcoming Falcon 9, Falcon Heavy and Starship launches with live webcasts. The busiest launch cadence in history.',
    ['space', 'spacex', 'launch', 'falcon', 'schedule']],
]);
T('science', 'web', 'esa.int', 'European Space Agency', [
  ['/', 'ESA: Europe\u2019s Gateway to Space',
    'The European Space Agency\u2019s portal: Ariane 6, the Juice mission to Jupiter\u2019s moons, and Earth-observation satellites.',
    ['space', 'esa', 'europe', 'missions', 'satellite']],
]);
T('science', 'web', 'skyandtelescope.org', 'Sky & Telescope', [
  ['/astronomy-news/', 'Astronomy News: What\u2019s Up in the Night Sky',
    'Sky & Telescope\u2019s news desk: comet apparitions, meteor showers and deep-sky observing guides for backyard astronomers.',
    ['space', 'astronomy', 'telescope', 'stars', 'news']],
]);
T('science', 'web', 'universetoday.com', 'Universe Today', [
  ['/', 'Universe Today: Space and Astronomy News',
    'Daily space journalism: exoplanet finds, cosmology explainers and mission analysis without the hype.',
    ['space', 'astronomy', 'news', 'exoplanet', 'cosmology']],
]);
T('science', 'web', 'earthsky.org', 'EarthSky', [
  ['/tonight', 'Tonight\u2019s Sky: What to See After Sunset',
    'EarthSky\u2019s nightly guide: visible planets, ISS flyovers and moon phases \u2014 the easiest way to start stargazing.',
    ['space', 'stars', 'tonight', 'sky', 'planets']],
]);
T('science', 'web', 'planetary.org', 'The Planetary Society', [
  ['/', 'The Planetary Society: Space Advocacy and Education',
    'Carl Sagan\u2019s society: LightSail solar-sailing updates, eclipse guides and clear explainers of planetary science.',
    ['space', 'planetary', 'society', 'advocacy', 'education']],
]);

/* ================= 12. physics / black holes (8) ================= */
T('science', 'web', 'eventhorizontelescope.org', 'Event Horizon Telescope', [
  ['/', 'Event Horizon Telescope: Imaging Black Holes',
    'The EHT collaboration\u2019s site: how a planet-sized virtual telescope captured the first images of M87* and Sagittarius A* \u2014 our galaxy\u2019s black hole.',
    ['black', 'hole', 'event', 'horizon', 'telescope', 'eht']],
]);
T('science', 'web', 'cern.ch', 'CERN', [
  ['/', 'CERN: The European Organization for Nuclear Research',
    'Home of the Large Hadron Collider: Higgs boson research, antimatter experiments and open data from particle collisions.',
    ['physics', 'cern', 'particle', 'lhc', 'higgs']],
]);
T('science', 'web', 'quantamagazine.org', 'Quanta Magazine', [
  ['/physics/', 'Quanta: Physics News and Deep Explainers',
    'Award-winning science journalism: quantum computing breakthroughs, the nature of time, and mathematics made genuinely readable.',
    ['physics', 'quantum', 'science', 'news', 'quanta']],
]);
T('science', 'web', 'pbs.org', 'PBS Space Time', [
  ['/spacetime', 'PBS Space Time: The Nature of the Universe',
    'Matt O\u2019Dowd\u2019s acclaimed series on relativity, quantum mechanics and cosmology \u2014 rigorous physics, zero dumbing down.',
    ['physics', 'relativity', 'quantum', 'cosmology', 'space', 'time']],
]);
T('science', 'web', 'britannica.com', 'Encyclopaedia Britannica', [
  ['/science/black-hole', 'Black Hole: Definition, Formation and Event Horizon',
    'Britannica\u2019s authoritative entry: stellar collapse, Schwarzschild radius, Hawking radiation and what happens past the event horizon.',
    ['black', 'hole', 'physics', 'definition', 'space']],
]);
T('science', 'web', 'phys.org', 'Phys.org', [
  ['/space-news/', 'Phys.org Space & Physics News',
    'A wire of peer-reviewed research news: gravitational waves, dark matter hunts and materials science, updated daily.',
    ['physics', 'science', 'news', 'research', 'space']],
]);
T('science', 'web', 'khanacademy.org', 'Khan Academy', [
  ['/science/physics', 'Khan Academy Physics: Free Full Course',
    'Free physics from motion to electromagnetism: videos, exercises and AP prep. The way millions first meet Newton and Maxwell.',
    ['physics', 'course', 'free', 'learn', 'khan']],
]);
T('science', 'web', 'sixty-symbols.com', 'Sixty Symbols', [
  ['/', 'Sixty Symbols: Physics Videos by Nottingham Scientists',
    'University of Nottingham physicists explain one symbol at a time \u2014 from pi to psi. Charming, deep, and free.',
    ['physics', 'videos', 'symbols', 'learn', 'quantum']],
]);

/* ================= 13. mars (6) ================= */
T('science', 'web', 'nasa.gov', 'NASA Mars', [
  ['/mars', 'NASA Mars Exploration Program',
    'Every Mars mission in one place: rovers, orbiters, sample return plans and the science of the search for past life.',
    ['mars', 'nasa', 'exploration', 'rover', 'space']],
]);
T('science', 'web', 'marssociety.org', 'The Mars Society', [
  ['/', 'The Mars Society: Humans to Mars',
    'Robert Zubrin\u2019s Mars advocacy: the Mars Direct plan, analog habitats in Utah and the annual convention.',
    ['mars', 'colonization', 'society', 'humans', 'space']],
]);
T('science', 'web', 'space.com', 'Space.com', [
  ['/mars', 'Mars News: Rovers, Colonization and Discoveries',
    'Space.com\u2019s Mars desk: Perseverance findings, Starship timelines and the evidence for ancient water.',
    ['mars', 'news', 'rover', 'colonization', 'space']],
]);
T('science', 'web', 'planetary.org', 'The Planetary Society', [
  ['/mars', 'Mars: The Red Planet, Explained',
    'Clear explainers on Mars geology, its thin atmosphere, and why scientists are confident water once flowed there.',
    ['mars', 'planet', 'geology', 'water', 'explained']],
]);
T('science', 'web', 'hiRISE.lpl.arizona.edu', 'HiRISE', [
  ['/', 'HiRISE: Stunning High-Resolution Images of Mars',
    'The most detailed camera ever sent to Mars. Browse dunes, avalanches and rover tracks in jaw-dropping resolution.',
    ['mars', 'images', 'photos', 'hirise', 'nasa']],
]);
T('science', 'web', 'britannica.com', 'Encyclopaedia Britannica', [
  ['/place/Mars-planet', 'Mars: Facts About the Red Planet',
    'Britannica\u2019s Mars entry: Olympus Mons, Valles Marineris, the moons Phobos and Deimos, and mission history.',
    ['mars', 'facts', 'planet', 'olympus', 'mons']],
]);

/* ================= 14. climate (6) ================= */
T('science', 'web', 'ipcc.ch', 'IPCC', [
  ['/', 'IPCC: Intergovernmental Panel on Climate Change',
    'The UN\u2019s climate science authority: assessment reports on warming, impacts and mitigation pathways. The consensus, straight from the source.',
    ['climate', 'change', 'ipcc', 'warming', 'report']],
]);
T('science', 'web', 'climate.nasa.gov', 'NASA Climate', [
  ['/', 'NASA Global Climate Change: Vital Signs',
    'Live vital signs: CO\u2082 levels, global temperature, sea-level rise and ice loss \u2014 measured by NASA\u2019s satellite fleet.',
    ['climate', 'change', 'nasa', 'co2', 'warming', 'data']],
]);
T('science', 'web', 'epa.gov', 'US EPA', [
  ['/climatechange', 'EPA: Climate Change Basics and Action',
    'The EPA\u2019s climate hub: causes, US impacts, and what individuals and businesses can do \u2014 plus the carbon footprint calculator.',
    ['climate', 'change', 'epa', 'carbon', 'footprint']],
]);
T('science', 'web', 'carbonbrief.org', 'Carbon Brief', [
  ['/', 'Carbon Brief: Clear on Climate',
    'Fact-checked climate journalism: policy analysis, explainer threads and the famous \u201cstate of the climate\u201d quarterly updates.',
    ['climate', 'change', 'news', 'policy', 'carbon']],
]);
T('science', 'web', 'projectdrawdown.org', 'Project Drawdown', [
  ['/solutions/', 'Drawdown Solutions: What Actually Cools the Planet',
    'A ranked list of 90+ climate solutions by impact \u2014 from refrigerant management to plant-rich diets \u2014 with the science behind each.',
    ['climate', 'solutions', 'drawdown', 'emissions', 'action']],
]);
T('science', 'web', 'berkeleyearth.org', 'Berkeley Earth', [
  ['/', 'Berkeley Earth: Independent Climate Data',
    'Independent global temperature records and analysis. The dataset skeptics helped create \u2014 which confirmed the warming.',
    ['climate', 'temperature', 'data', 'berkeley', 'warming']],
]);

/* ================= 15. sleep / health (8) ================= */
T('health', 'web', 'sleepfoundation.org', 'Sleep Foundation', [
  ['/', 'Sleep Foundation: How Much Sleep Do You Need?',
    'Evidence-based sleep guidance: recommended hours by age, sleep stages explained, and what the research says about naps, caffeine and screens.',
    ['sleep', 'health', 'hours', 'need', 'tips']],
  ['/sleep-hygiene', 'Sleep Hygiene: 20 Tips for Better Sleep',
    'The practical checklist: consistent schedule, cool dark room, wind-down routine. Small changes, large effects on sleep quality.',
    ['sleep', 'hygiene', 'tips', 'better', 'insomnia']],
]);
T('health', 'web', 'mayoclinic.org', 'Mayo Clinic', [
  ['/diseases-conditions/insomnia/', 'Insomnia: Symptoms, Causes and Treatment',
    'Mayo Clinic\u2019s insomnia guide: when sleeplessness needs a doctor, CBT-I therapy, and which sleep aids actually help.',
    ['sleep', 'insomnia', 'treatment', 'health', 'mayo']],
  ['/healthy-lifestyle/adult-health/', 'Sleep Apnea: Signs You Shouldn\u2019t Ignore',
    'Mayo on sleep apnea: loud snoring, daytime fatigue, morning headaches \u2014 and why untreated apnea strains the heart.',
    ['sleep', 'apnea', 'snoring', 'symptoms', 'health']],
]);
T('health', 'web', 'nih.gov', 'NIH', [
  ['/news-events/nih-research-matters/why-do-we-dream', 'Why Do We Dream? What Neuroscience Knows',
    'NIH\u2019s review of dream science: memory consolidation, emotional processing, and why the leading theories keep evolving.',
    ['sleep', 'dreams', 'dream', 'why', 'neuroscience']],
]);
T('health', 'web', 'healthline.com', 'Healthline', [
  ['/nutrition/healthy-breakfast-ideas', '16 Healthy Breakfast Ideas (Dietitian-Approved)',
    'Healthline\u2019s dietitian-reviewed breakfast list: protein targets, fiber, and quick options for busy mornings.',
    ['breakfast', 'healthy', 'nutrition', 'ideas', 'food']],
]);
T('health', 'web', 'who.int', 'World Health Organization', [
  ['/health-topics/vaccines-and-immunization', 'WHO: Vaccines and Immunization',
    'WHO\u2019s vaccine hub: how vaccines work, safety monitoring systems, and schedules. The global authority on immunization.',
    ['vaccines', 'safe', 'who', 'immunization', 'health']],
]);
T('health', 'web', 'cdc.gov', 'CDC', [
  ['/vaccines/', 'CDC Vaccines: Schedules and Safety Information',
    'US vaccine schedules by age, ingredient lists, and the VAERS safety monitoring explained in plain language.',
    ['vaccines', 'cdc', 'safe', 'schedule', 'covid']],
]);

/* ================= 16. nutrition (6) ================= */
T('food', 'web', 'hsph.harvard.edu', 'Harvard T.H. Chan', [
  ['/nutritionsource/healthy-eating-plate/', 'The Healthy Eating Plate (Harvard)',
    'Harvard\u2019s evidence-based plate: half vegetables and fruit, quarter whole grains, quarter healthy protein \u2014 plus the research behind it.',
    ['nutrition', 'healthy', 'eating', 'diet', 'harvard']],
]);
T('food', 'web', 'eatright.org', 'Academy of Nutrition', [
  ['/', 'EatRight: Trusted Nutrition Advice',
    'Registered dietitians answer nutrition questions: meal planning, sports nutrition and eating well on a budget.',
    ['nutrition', 'dietitian', 'healthy', 'eating', 'advice']],
]);
T('food', 'web', 'healthline.com', 'Healthline Nutrition', [
  ['/nutrition/50-super-healthy-foods', '50 Super Healthy Foods (Backed by Science)',
    'Healthline\u2019s ranked food list with the studies behind each pick \u2014 from leafy greens to fatty fish.',
    ['nutrition', 'healthy', 'foods', 'superfoods', 'diet']],
]);
T('food', 'web', 'nutritionfacts.org', 'NutritionFacts.org', [
  ['/', 'NutritionFacts: Evidence-Based Nutrition Videos',
    'Dr. Greger\u2019s nonprofit reviews the latest nutrition studies in short daily videos, with transcripts and citations.',
    ['nutrition', 'evidence', 'videos', 'health', 'diet']],
]);
T('food', 'web', 'myplate.gov', 'MyPlate (USDA)', [
  ['/', 'MyPlate: US Dietary Guidelines Made Visual',
    'The USDA\u2019s official eating guide: interactive plate, recipes and the 2025 dietary guidelines explained simply.',
    ['nutrition', 'myplate', 'usda', 'diet', 'guidelines']],
]);
T('food', 'web', 'examine.com', 'Examine', [
  ['/', 'Examine: Independent Supplement and Nutrition Research',
    'Unbiased breakdowns of supplements and diets, graded by evidence strength. No sponsors, no hype \u2014 just the studies.',
    ['nutrition', 'supplements', 'evidence', 'research', 'health']],
]);

/* ================= 17. paris travel (8) ================= */
T('travel', 'web', 'en.parisinfo.com', 'Paris je t\u2019aime', [
  ['/', 'Visit Paris: Official Tourist Office Guide',
    'Paris\u2019s official visitor guide: landmarks, museum passes, arrondissement maps and seasonal events \u2014 straight from the tourist office.',
    ['paris', 'travel', 'guide', 'visit', 'france']],
  ['/what-to-do-in-paris/', 'Things to Do in Paris: Beyond the Eiffel Tower',
    'The official list: the Louvre at opening time, Le Marais walks, Seine cruises and the neighborhoods locals actually love.',
    ['paris', 'things', 'to', 'do', 'attractions']],
]);
T('travel', 'web', 'louvre.fr', 'Mus\u00e9e du Louvre', [
  ['/en/', 'The Louvre: Plan Your Visit',
    'The world\u2019s most-visited museum: timed tickets, the Denon wing strategy for the Mona Lisa, and what to see beyond her.',
    ['paris', 'louvre', 'museum', 'mona', 'lisa']],
]);
T('travel', 'web', 'toureiffel.paris', 'Eiffel Tower', [
  ['/en', 'Eiffel Tower: Tickets and Visitor Guide',
    'Official Eiffel Tower tickets: summit vs second floor, staircase vs lift, and the sparkling lights schedule after dark.',
    ['paris', 'eiffel', 'tower', 'tickets', 'visit']],
]);
T('travel', 'web', 'ratp.fr', 'RATP', [
  ['/en/', 'Paris M\u00e9tro Map and Tickets Guide',
    'RATP\u2019s official metro map, Navigo passes vs tickets, and which lines serve the airports. The key to Paris on a budget.',
    ['paris', 'metro', 'map', 'transport', 'ratp']],
]);
T('travel', 'web', 'lonelyplanet.com', 'Lonely Planet', [
  ['/france/paris', 'Paris Travel Guide: Best Time to Visit',
    'Lonely Planet\u2019s Paris: shoulder-season strategy, neighborhood guides and the etiquette that keeps waiters friendly.',
    ['paris', 'travel', 'guide', 'best', 'time', 'visit']],
]);
T('travel', 'web', 'davidlebovitz.com', 'David Lebovitz', [
  ['/paris/', 'David Lebovitz\u2019s Paris: A Cook\u2019s-Eye Guide',
    'The pastry chef\u2019s beloved Paris notes: boulangeries worth crossing town for, market streets and chocolate shops.',
    ['paris', 'food', 'bakeries', 'guide', 'chocolate']],
]);
T('travel', 'web', 'thelocal.fr', 'The Local France', [
  ['/', 'The Local: France News in English',
    'France\u2019s English-language news: strikes, holidays, and the practical stuff visitors and expats need to know.',
    ['paris', 'france', 'news', 'english', 'expat']],
]);

/* ================= 18. japan travel (10) ================= */
T('travel', 'web', 'japan-guide.com', 'japan-guide.com', [
  ['/', 'Japan Guide: Travel Information and Itineraries',
    'The essential Japan planning site: Tokyo/Kyoto itineraries, festival calendars, and transport explained for first-timers.',
    ['japan', 'travel', 'guide', 'tokyo', 'kyoto', 'visit']],
  ['/e/e623.html', 'Japan Rail Pass: Is It Worth It in 2026?',
    'japan-guide\u2019s JR Pass calculator: when the pass pays off, regional alternatives, and how to reserve seats.',
    ['japan', 'rail', 'pass', 'jr', 'train', 'travel']],
]);
T('travel', 'web', 'japan.travel', 'Japan National Tourism', [
  ['/en/', 'Visit Japan: Official Tourism Site',
    'JNTO\u2019s official portal: destinations by season, visa requirements and the \u201cbest time to visit Japan\u201d cherry-blossom forecasts.',
    ['japan', 'travel', 'official', 'visa', 'visit']],
]);
T('travel', 'web', 'tokyocheapo.com', 'Tokyo Cheapo', [
  ['/', 'Tokyo Cheapo: Japan on a Budget',
    'Tokyo on the cheap: 500-yen lunches, free observation decks and the discount tickets tourists miss.',
    ['japan', 'tokyo', 'budget', 'cheap', 'travel']],
]);
T('travel', 'web', 'kyoto.travel', 'Kyoto Official Travel', [
  ['/en/', 'Kyoto Travel Guide: Temples, Seasons, Etiquette',
    'Kyoto\u2019s official guide: 17 UNESCO sites, geisha-district etiquette and the autumn foliage forecast.',
    ['japan', 'kyoto', 'temples', 'travel', 'guide']],
]);
T('travel', 'web', 'fujiq.jp', 'Fujiyoshida Tourism', [
  ['/en/mtfuji/', 'Climbing Mount Fuji: Season, Routes and Huts',
    'The official Fuji climbing guide: July\u2013September season, Yoshida vs Subashiri trails, and mountain-hut booking.',
    ['japan', 'fuji', 'mountain', 'climbing', 'hiking']],
]);
T('travel', 'web', 'shinkansen.co.jp', 'JR Central', [
  ['/en/', 'Shinkansen: Japan\u2019s Bullet Train Guide',
    'JR Central\u2019s bullet-train portal: Tokaido schedules, luggage rules and the Nozomi vs Hikari speed trade-off.',
    ['japan', 'shinkansen', 'bullet', 'train', 'travel']],
]);
T('travel', 'web', 'osaka-info.jp', 'Osaka Info', [
  ['/en/', 'Osaka: Japan\u2019s Kitchen \u2014 Official Guide',
    'Osaka\u2019s official guide: Dotonbori street food, takoyaki trails and day trips to Nara and Kobe.',
    ['japan', 'osaka', 'food', 'travel', 'guide']],
]);
T('travel', 'web', 'matcha-jp.com', 'MATCHA', [
  ['/en/', 'MATCHA: Japan Travel Magazine in English',
    'In-depth Japan features: onsen etiquette, regional ramen maps and hidden neighborhoods, written by residents.',
    ['japan', 'travel', 'magazine', 'onsen', 'ramen']],
]);
T('travel', 'web', 'japanesepod101.com', 'JapanesePod101', [
  ['/', 'Learn Japanese: Free Survival Phrases for Travelers',
    'The phrases that unlock Japan: ordering, asking directions, and the politeness levels that impress hosts.',
    ['japan', 'japanese', 'language', 'phrases', 'learn']],
]);

/* ================= 19. bali / travel general (6) ================= */
T('travel', 'web', 'bali.com', 'Bali.com', [
  ['/', 'Bali Travel Guide: Beaches, Temples and Practical Tips',
    'Bali\u2019s independent guide: best beaches by vibe, temple etiquette, scooter safety and the visa-on-arrival rules.',
    ['bali', 'travel', 'guide', 'beaches', 'indonesia']],
]);
T('travel', 'web', 'indonesia.travel', 'Wonderful Indonesia', [
  ['/en/', 'Wonderful Indonesia: Official Tourism Portal',
    'Indonesia\u2019s official tourism site: Bali, Komodo, Raja Ampat and Java\u2019s temples \u2014 plus e-visa information.',
    ['bali', 'indonesia', 'travel', 'official', 'komodo']],
]);
T('travel', 'web', 'nomadicmatt.com', 'Nomadic Matt', [
  ['/travel-guides/bali-travel-tips/', 'Bali Travel Tips: Costs, Safety and Itineraries',
    'Matt\u2019s Bali playbook: daily budgets, where digital nomads actually stay, and avoiding the tourist traps.',
    ['bali', 'travel', 'tips', 'budget', 'itinerary']],
]);
T('travel', 'web', 'thepointsguy.com', 'The Points Guy', [
  ['/', 'The Points Guy: Miles, Points and Travel Deals',
    'Maximize credit-card points for free flights and hotels: card reviews, sweet-spot redemptions and deal alerts.',
    ['travel', 'points', 'miles', 'flights', 'deals']],
]);
T('travel', 'web', 'seat61.com', 'The Man in Seat 61', [
  ['/', 'Seat 61: Train Travel Guides Worldwide',
    'The bible of train travel: London to anywhere by rail, with timetables, fares and the scenic routes worth the detour.',
    ['travel', 'train', 'europe', 'rail', 'guide']],
]);
T('travel', 'web', 'travel.state.gov', 'US State Department', [
  ['/content/travel.html', 'Travel.State.Gov: Passports, Visas and Advisories',
    'Official US travel resource: passport processing times, visa requirements and safety advisories by country.',
    ['travel', 'passport', 'visa', 'advisory', 'official']],
]);

/* ================= 20. pizza (8) ================= */
T('food', 'web', 'seriouseats.com', 'Serious Eats', [
  ['/pizza-dough-recipe', 'The Best Homemade Pizza Dough Recipe (Tested 40+ Times)',
    'Kenji\u2019s foolproof dough: 72-hour cold ferment, 65% hydration, and why a hot steel beats a stone. The recipe that ends delivery orders.',
    ['pizza', 'dough', 'recipe', 'homemade']],
]);
T('food', 'web', 'kingarthurbaking.com', 'King Arthur Baking', [
  ['/recipes/pizza-dough-recipe', 'Pizza Dough Recipe: Crispy, Chewy, Reliable',
    'King Arthur\u2019s tested dough with weight measurements, overnight option and troubleshooting for soggy centers.',
    ['pizza', 'dough', 'recipe', 'baking']],
]);
T('food', 'web', 'pizzanapoletana.org', 'Associazione Verace Pizza', [
  ['/en/', 'True Neapolitan Pizza: The Official AVPN Standards',
    'The Naples association\u2019s rulebook: 00 flour, San Marzano tomatoes, 90-second bake at 450\u00b0C. What \u201creal\u201d pizza means.',
    ['pizza', 'neapolitan', 'naples', 'authentic', 'margherita']],
]);
T('food', 'web', 'ooni.com', 'Ooni', [
  ['/blogs/recipes', 'Ooni Pizza Oven Recipes and Guides',
    'Recipes tuned for 500\u00b0C home ovens: dough formulas, launching technique and the mistakes that torch your first pies.',
    ['pizza', 'oven', 'ooni', 'recipe', 'outdoor']],
]);
T('food', 'web', 'eater.com', 'Eater', [
  ['/pizza', 'Eater\u2019s Pizza City Guides',
    'Eater\u2019s city-by-city pizza maps: New York slices, Chicago deep dish, New Haven apizza \u2014 and where locals actually go.',
    ['pizza', 'best', 'near', 'me', 'restaurants']],
]);
T('food', 'web', 'bonappetit.com', 'Bon App\u00e9tit', [
  ['/recipe/pizza-dough', 'BA\u2019s Best Pizza Dough',
    'Bon App\u00e9tit\u2019s no-knead-optional dough with a 24-hour ferment for flavor. Tested in the BA kitchen, weeknight approved.',
    ['pizza', 'dough', 'recipe', 'bon', 'appetit']],
]);
T('food', 'web', 'reddit.com', 'r/Pizza', [
  ['/r/Pizza/', 'r/Pizza: Homemade Pies and Pizzeria Talk',
    'Reddit\u2019s pizza community: crumb-shot critiques, dough formulas and the eternal NY-vs-Neapolitan debate.',
    ['pizza', 'reddit', 'homemade', 'community', 'recipes']],
]);
T('food', 'web', 'pizzaovenreviews.com', 'Pizza Oven Reviews', [
  ['/', 'Pizza Oven Reviews: Gas vs Wood vs Electric (2026)',
    'Independent testing of home pizza ovens: heat-up times, max temps and which ones justify the price.',
    ['pizza', 'oven', 'review', 'best', 'buy']],
]);

/* ================= 21. sushi (6) ================= */
T('food', 'web', 'justonecookbook.com', 'Just One Cookbook', [
  ['/how-to-make-sushi-at-home/', 'How to Make Sushi at Home: Complete Guide',
    'Namiko\u2019s step-by-step sushi guide: seasoned rice ratios, nigiri shaping, and the knife skills that make it restaurant-worthy.',
    ['sushi', 'homemade', 'recipe', 'japanese', 'how']],
]);
T('food', 'web', 'sushiuniversity.jp', 'Sushi University', [
  ['/en/', 'Sushi University: Types of Sushi Explained',
    'Every sushi style decoded: nigiri, maki, temaki, chirashi \u2014 with fish names in Japanese and English.',
    ['sushi', 'types', 'nigiri', 'maki', 'guide']],
]);
T('food', 'web', 'michelin.com', 'Michelin Guide', [
  ['/en/', 'Michelin Guide: The World\u2019s Best Sushi Restaurants',
    'Michelin\u2019s starred sushi temples: Sukiyabashi Jiro\u2019s legacy, Tokyo\u2019s new-wave counters and how to book them.',
    ['sushi', 'best', 'michelin', 'restaurants', 'tokyo']],
]);
T('food', 'web', 'tokyofoodpage.com', 'Tokyo Food Page', [
  ['/sushi/', 'Tokyo\u2019s Best Sushi: From Conveyor Belts to Counters',
    'Where Tokyo eats sushi at every budget: standing sushi bars, Toyosu breakfast spots and splurge-worthy omakase.',
    ['sushi', 'tokyo', 'best', 'omakase', 'restaurants']],
]);
T('food', 'web', 'healthline.com', 'Healthline', [
  ['/nutrition/is-sushi-healthy', 'Is Sushi Healthy? Benefits and Risks',
    'Healthline reviews sushi nutrition: omega-3s vs mercury, rice portions, and the healthiest orders on the menu.',
    ['sushi', 'healthy', 'nutrition', 'mercury', 'health']],
]);
T('food', 'web', 'youtube.com', 'YouTube', [
  ['/results?search_query=sushi+making', 'Sushi-Making Tutorials (Video)',
    'Video lessons from itamae chefs: rice seasoning, rolling technique and plating \u2014 easier learned by watching.',
    ['sushi', 'video', 'tutorial', 'making', 'how']],
]);

/* ================= 22. indian food (8) ================= */
T('food', 'web', 'hebbarskitchen.com', "Hebbar's Kitchen", [
  ['/', "Hebbar's Kitchen: Vegetarian Indian Recipes",
    'India\u2019s beloved recipe site: step-by-step photos for curries, dosas, biryanis and snacks \u2014 with Hindi/English video.',
    ['indian', 'food', 'recipes', 'curry', 'vegetarian']],
]);
T('food', 'web', 'indianhealthyrecipes.com', 'Swasthi\u2019s Recipes', [
  ['/', 'Swasthi\u2019s Indian Recipes: Tested and Detailed',
    'Meticulously tested Indian recipes: biryani layering, soft rotis, and the masala ratios that make restaurant curries work.',
    ['indian', 'recipes', 'biryani', 'curry', 'food']],
]);
T('food', 'web', 'vegrecipesofindia.com', 'Veg Recipes of India', [
  ['/', 'Veg Recipes of India: Dassana\u2019s Kitchen',
    'Dassana\u2019s encyclopedic vegetarian collection: regional thalis, festival sweets and everyday dals with precise method.',
    ['indian', 'vegetarian', 'recipes', 'dal', 'curry']],
]);
T('food', 'web', 'bonappetit.com', 'Bon App\u00e9tit', [
  ['/indian-recipes', 'BA\u2019s Indian Recipe Collection',
    'Bon App\u00e9tit\u2019s Indian week: butter chicken, saag paneer and chaat, adapted for American kitchens without losing soul.',
    ['indian', 'recipes', 'butter', 'chicken', 'curry']],
]);
T('food', 'web', 'cuminandco.com', 'Cumin & Co', [
  ['/biryani-guide', 'The Definitive Biryani Guide: Hyderabadi to Kolkata',
    'Every great biryani style compared: dum technique, rice-to-meat ratios, and the Kolkata potato controversy.',
    ['biryani', 'indian', 'recipe', 'hyderabadi', 'rice']],
]);
T('food', 'web', 'tarladalal.com', 'Tarla Dalal', [
  ['/', 'Tarla Dalal: 17,000+ Indian Recipes',
    'India\u2019s pioneering recipe archive: 17,000 recipes from the late Tarla Dalal\u2019s kitchen, with meal planners.',
    ['indian', 'recipes', 'tarla', 'dalal', 'food']],
]);
T('food', 'web', 'eater.com', 'Eater', [
  ['/indian-food-guide', 'Eater\u2019s Guide to Regional Indian Cuisines',
    'Beyond \u201ccurry\u201d: Chettinad heat, Bengali mustard, Goan vindaloo \u2014 a region-by-region map of India\u2019s food.',
    ['indian', 'food', 'regional', 'cuisine', 'guide']],
]);
T('food', 'web', 'chaiandchill.com', 'Chai & Chill', [
  ['/masala-chai-recipe', 'Perfect Masala Chai: The Only Recipe You Need',
    'Crushed ginger, cardamom, Assam leaves simmered in milk \u2014 the ratios for cafe-level chai at home.',
    ['chai', 'masala', 'tea', 'indian', 'recipe']],
]);

/* ================= 23. cricket (10) ================= */
T('sports', 'web', 'icc-cricket.com', 'ICC', [
  ['/', 'ICC: International Cricket Council \u2014 Official Home',
    'Cricket\u2019s governing body: World Cup schedules, rankings, playing conditions and live scores from every international.',
    ['cricket', 'icc', 'world', 'cup', 'scores', 'schedule']],
  ['/rankings/', 'ICC Rankings: Test, ODI and T20I Tables',
    'The official team and player rankings across formats, updated after every series. The table every fan argues about.',
    ['cricket', 'rankings', 'icc', 'test', 'odi', 't20']],
]);
T('sports', 'web', 'espncricinfo.com', 'ESPNcricinfo', [
  ['/', 'ESPNcricinfo: Live Scores, News and Stats',
    'The home of cricket online: ball-by-ball commentary, Statsguru records and the sharpest writing in the sport.',
    ['cricket', 'live', 'score', 'espncricinfo', 'news']],
]);
T('sports', 'web', 'iplt20.com', 'IPL', [
  ['/', 'IPL Official: Schedule, Auction and Points Table',
    'The Indian Premier League\u2019s home: 2026 schedule, mega-auction results, points table and team squads.',
    ['cricket', 'ipl', '2026', 'auction', 'schedule', 'india']],
]);
T('sports', 'web', 'wisden.com', 'Wisden', [
  ['/', 'Wisden: The Voice of Cricket Since 1864',
    'Cricket\u2019s almanack and its modern voice: long-form features, the Wisden Trophy debates and award lists.',
    ['cricket', 'wisden', 'news', 'features', 'history']],
]);
T('sports', 'web', 'cricket.com.au', 'Cricket Australia', [
  ['/', 'Cricket Australia: News, Tickets and the Ashes',
    'Australian cricket\u2019s home: the Ashes hub, Big Bash fixtures and grassroots programs.',
    ['cricket', 'australia', 'ashes', 'big', 'bash']],
]);
T('sports', 'web', 'bcci.tv', 'BCCI', [
  ['/', 'BCCI: Board of Control for Cricket in India',
    'Indian cricket\u2019s board: Team India fixtures, domestic tournaments and ticket information.',
    ['cricket', 'india', 'bcci', 'team', 'fixtures']],
]);
T('sports', 'web', 'cricketworldcup.com', 'Cricket World Cup', [
  ['/', 'Cricket World Cup: Fixtures, Tickets and History',
    'The official World Cup site: every fixture, the points table, and the archive of finals since 1975.',
    ['cricket', 'world', 'cup', 'schedule', 'tickets', 'final']],
]);
T('sports', 'web', 'thecricketmonthly.com', 'The Cricket Monthly', [
  ['/', 'The Cricket Monthly: Long-Form Cricket Writing',
    'ESPNcricinfo\u2019s magazine: profiles, oral histories and the essays that win cricket-writing awards.',
    ['cricket', 'magazine', 'features', 'writing', 'profiles']],
]);
T('sports', 'web', 'cricbuzz.com', 'Cricbuzz', [
  ['/', 'Cricbuzz: Live Scores and Cricket News',
    'Lightning-fast live scores, Hindi/English commentary and the app a billion fans check during IPL season.',
    ['cricket', 'live', 'score', 'cricbuzz', 'india', 'vs', 'australia']],
]);

/* ================= 24. football (8) ================= */
T('sports', 'web', 'fifa.com', 'FIFA', [
  ['/worldcup/', 'FIFA World Cup 2026: Schedule, Teams and Tickets',
    'The official 2026 World Cup hub: 48 teams, 16 host cities across the USA, Canada and Mexico, and the full match schedule.',
    ['football', 'world', 'cup', '2026', 'schedule', 'fifa', 'soccer']],
]);
T('sports', 'web', 'premierleague.com', 'Premier League', [
  ['/', 'Premier League: Tables, Fixtures and Highlights',
    'The official PL site: live table, every fixture, and free highlights minutes after full time.',
    ['football', 'premier', 'league', 'table', 'fixtures', 'epl']],
]);
T('sports', 'web', 'uefa.com', 'UEFA', [
  ['/uefachampionsleague/', 'Champions League: Draw, Fixtures and History',
    'UEFA\u2019s Champions League home: the new league-phase format explained, fixtures and the all-time winners list.',
    ['football', 'champions', 'league', 'uefa', 'fixtures']],
]);
T('sports', 'web', 'transfermarkt.com', 'Transfermarkt', [
  ['/', 'Transfermarkt: Transfers, Rumours and Market Values',
    'Football\u2019s transfer database: rumour reliability tiers, market values and contract lengths for every pro player.',
    ['football', 'transfer', 'news', 'rumours', 'market', 'value']],
]);
T('sports', 'web', 'theathletic.com', 'The Athletic', [
  ['/football/', 'The Athletic Football: Tactics and Investigations',
    'Ad-free football journalism: tactical breakdowns, data analysis and the investigations other outlets won\u2019t touch.',
    ['football', 'news', 'tactics', 'analysis', 'athletic']],
]);
T('sports', 'web', 'fbref.com', 'FBref', [
  ['/', 'FBref: Football Statistics and History',
    'Stathead\u2019s free football stats: xG, progressive passes and scouting reports for leagues worldwide.',
    ['football', 'stats', 'statistics', 'xg', 'data']],
]);
T('sports', 'web', 'laliga.com', 'LaLiga', [
  ['/en-GB', 'LaLiga: Fixtures, Table and El Cl\u00e1sico',
    'Spain\u2019s league home: Barcelona vs Real Madrid dates, the table race and highlight reels.',
    ['football', 'laliga', 'spain', 'barcelona', 'madrid']],
]);
T('sports', 'web', 'bundesliga.com', 'Bundesliga', [
  ['/en/', 'Bundesliga: Official English Site',
    'German football\u2019s English home: Bayern\u2019s title chase, the 50+1 rule explained and matchday guides.',
    ['football', 'bundesliga', 'germany', 'bayern']],
]);

/* ================= 25. movies (10) ================= */
T('entertainment', 'web', 'imdb.com', 'IMDb', [
  ['/chart/top/', 'IMDb Top 250: The Highest-Rated Films Ever',
    'The famous Top 250, voted by millions: Shawshank\u2019s eternal reign, and how the list has shifted over 25 years.',
    ['movies', 'imdb', 'top', '250', 'best', 'films']],
  ['/movies/in-theaters/', 'Movies in Theaters Now: Showtimes and Trailers',
    'What\u2019s playing this week: trailers, runtimes, ratings and where to book tickets near you.',
    ['movies', 'theaters', 'now', 'playing', 'showtimes']],
]);
T('entertainment', 'web', 'rottentomatoes.com', 'Rotten Tomatoes', [
  ['/', 'Rotten Tomatoes: Movie and TV Reviews',
    'The Tomatometer explained: how scores are calculated, Certified Fresh rules, and this week\u2019s best-reviewed releases.',
    ['movies', 'reviews', 'rotten', 'tomatoes', 'ratings']],
]);
T('entertainment', 'web', 'letterboxd.com', 'Letterboxd', [
  ['/', 'Letterboxd: The Social Network for Film Lovers',
    'Log films, write reviews, build lists. The community whose four-star reviews are funnier than most critics\u2019.',
    ['movies', 'letterboxd', 'reviews', 'lists', 'films']],
]);
T('entertainment', 'web', 'criterion.com', 'The Criterion Collection', [
  ['/', 'Criterion: Important Classic and Contemporary Films',
    'The gold standard of home cinema: restorations, essays and the closet picks of famous directors.',
    ['movies', 'criterion', 'classic', 'films', 'collection']],
]);
T('entertainment', 'web', 'oscars.org', 'The Academy', [
  ['/', 'Oscars.org: Awards History and Rules',
    'The Academy\u2019s official site: every winner since 1929, voting rules and the museum\u2019s exhibitions.',
    ['movies', 'oscars', 'awards', 'academy', 'winners']],
]);
T('entertainment', 'web', 'boxofficemojo.com', 'Box Office Mojo', [
  ['/', 'Box Office Mojo: Weekend Grosses and Records',
    'The numbers behind Hollywood: daily grosses, all-time charts adjusted for inflation, and franchise totals.',
    ['movies', 'box', 'office', 'gross', 'records']],
]);
T('entertainment', 'web', 'a24films.com', 'A24', [
  ['/films', 'A24 Films: Everything Everywhere to Past Lives',
    'A24\u2019s catalog: the studio that made arthouse mainstream, with trailers and limited-edition merch.',
    ['movies', 'a24', 'films', 'indie', 'studio']],
]);
T('entertainment', 'web', 'sundance.org', 'Sundance', [
  ['/festival', 'Sundance Film Festival: Program and Tickets',
    'The indie film world\u2019s annual pilgrimage: program announcements, ticket packages and past breakout winners.',
    ['movies', 'sundance', 'festival', 'indie', 'films']],
]);
T('entertainment', 'web', 'bfi.org.uk', 'BFI', [
  ['/', 'BFI: British Film Institute',
    'The BFI\u2019s archive, Sight and Sound\u2019s critics\u2019 polls, and the London Film Festival each autumn.',
    ['movies', 'bfi', 'british', 'film', 'sight', 'sound']],
]);

/* ================= 26. history (10) ================= */
T('history', 'web', 'britannica.com', 'Encyclopaedia Britannica', [
  ['/event/World-War-II', 'World War II: Timeline, Causes and Aftermath',
    'Britannica\u2019s WWII survey: from the Treaty of Versailles to the atomic bombings \u2014 causes, key battles and the world it remade.',
    ['history', 'world', 'war', 'ii', 'timeline']],
  ['/place/Roman-Empire', 'Roman Empire: Rise, Fall and Legacy',
    'From Augustus to the fall of the West: the empire\u2019s institutions, engineering and the languages it left behind.',
    ['history', 'roman', 'empire', 'rome', 'ancient']],
]);
T('history', 'web', 'history.com', 'HISTORY', [
  ['/', 'HISTORY: This Day in History and Documentaries',
    'This-day-in-history entries, documentary clips and the stories behind famous photographs.',
    ['history', 'today', 'documentary', 'events']],
]);
T('history', 'web', 'si.edu', 'Smithsonian', [
  ['/', 'Smithsonian: History, Art and Science Collections',
    'The world\u2019s largest museum complex: digitized artifacts, research articles and virtual exhibitions.',
    ['history', 'smithsonian', 'museum', 'artifacts']],
]);
T('history', 'web', 'loc.gov', 'Library of Congress', [
  ['/', 'Library of Congress: America\u2019s Memory',
    'The largest library in the world: millions of digitized photos, maps, manuscripts and newspapers, free to explore.',
    ['history', 'library', 'congress', 'archives', 'america']],
]);
T('history', 'web', 'bbc.co.uk', 'BBC History', [
  ['/history', 'BBC History: Articles and Timelines',
    'The BBC\u2019s history section: British history timelines, world wars interactives and historian interviews.',
    ['history', 'bbc', 'british', 'timeline', 'world', 'war']],
]);
T('history', 'web', 'worldhistory.org', 'World History Encyclopedia', [
  ['/', 'World History Encyclopedia: Free and Peer-Reviewed',
    'A nonprofit encyclopedia of world history: articles, maps and timelines reviewed by scholars, free forever.',
    ['history', 'encyclopedia', 'world', 'ancient', 'timeline']],
]);
T('history', 'web', 'metmuseum.org', 'The Met', [
  ['/art/collection', 'The Met Collection: 5,000 Years of Art',
    'The Metropolitan Museum\u2019s open-access collection: 400,000+ artworks searchable and free to use.',
    ['history', 'art', 'met', 'museum', 'collection']],
]);
T('history', 'web', 'nps.gov', 'National Park Service', [
  ['/', 'NPS: America\u2019s Historic Sites and Parks',
    'The Park Service\u2019s portal: Civil War battlefields, presidential homes and the trails that tell America\u2019s story.',
    ['history', 'parks', 'america', 'civil', 'war', 'nps']],
]);
T('history', 'web', 'thegreatcourses.com', 'Wondrium', [
  ['/history', 'Wondrium History Courses: Learn from Professors',
    'University-level history lectures: the fall of Rome, the World Wars, and civilizations \u2014 taught by award-winning professors.',
    ['history', 'courses', 'lectures', 'learn', 'professors']],
]);

/* ================= 27. finance (10) ================= */
T('finance', 'web', 'investopedia.com', 'Investopedia', [
  ['/terms/s/stock.asp', 'Stocks Explained: What a Share Really Is',
    'Investopedia\u2019s stock primer: equity, dividends, market cap and how exchanges match buyers and sellers.',
    ['finance', 'stocks', 'investing', 'shares', 'explained']],
  ['/terms/i/indexfund.asp', 'Index Funds vs ETFs: Which Should You Buy?',
    'The low-cost investing showdown: expense ratios, tracking error and why Bogleheads swear by total-market funds.',
    ['finance', 'index', 'funds', 'etf', 'investing']],
  ['/terms/c/cryptocurrency.asp', 'Cryptocurrency Explained: Bitcoin, Ethereum and Beyond',
    'What crypto actually is: blockchains, wallets, proof-of-stake \u2014 plus the risks the hype skips.',
    ['finance', 'crypto', 'bitcoin', 'cryptocurrency', 'ethereum']],
]);
T('finance', 'web', 'nerdwallet.com', 'NerdWallet', [
  ['/', 'NerdWallet: Credit Cards, Banking and Investing Compared',
    'Independent comparisons of credit cards, high-yield savings and brokerages \u2014 with the fine print translated.',
    ['finance', 'credit', 'cards', 'banking', 'investing']],
]);
T('finance', 'web', 'mrmoneymustache.com', 'Mr. Money Mustache', [
  ['/', 'Mr. Money Mustache: Early Retirement Through Badassity',
    'The blog that launched the FIRE movement: 4% rule, frugality as a superpower, and retiring in your 30s.',
    ['finance', 'fire', 'retire', 'early', 'frugal', 'investing']],
]);
T('finance', 'web', 'bogleheads.org', 'Bogleheads', [
  ['/wiki/', 'Bogleheads Wiki: The Simple Path to Wealth',
    'The three-fund portfolio, tax-efficient placement and \u201cstay the course\u201d \u2014 the wiki behind the investing forum.',
    ['finance', 'bogleheads', 'index', 'investing', 'retirement']],
]);
T('finance', 'web', 'rbi.org.in', 'Reserve Bank of India', [
  ['/', 'RBI: India\u2019s Central Bank \u2014 Rates and Policy',
    'The Reserve Bank of India\u2019s official site: repo rates, monetary policy statements and consumer grievance channels.',
    ['finance', 'rbi', 'india', 'interest', 'rates', 'bank']],
]);
T('finance', 'web', 'zerodha.com', 'Zerodha Varsity', [
  ['/varsity/', 'Varsity by Zerodha: Free Stock Market Education',
    'India\u2019s best free markets course: 400+ chapters on stocks, F&O, mutual funds and technical analysis.',
    ['finance', 'india', 'stocks', 'zerodha', 'learn', 'investing']],
]);
T('finance', 'web', 'irs.gov', 'IRS', [
  ['/', 'IRS: US Tax Filing, Forms and Refunds',
    'The official US tax site: free filing options, form downloads, and where\u2019s-my-refund tracking.',
    ['finance', 'tax', 'irs', 'filing', 'refund', 'us']],
]);
T('finance', 'web', 'khanacademy.org', 'Khan Academy', [
  ['/economics-finance-domain/', 'Khan Academy: Personal Finance and Economics',
    'Free finance courses: interest, inflation, mortgages and investing \u2014 the money education school skipped.',
    ['finance', 'personal', 'course', 'free', 'economics', 'learn']],
]);

/* ================= 28. einstein (4) ================= */
T('science', 'web', 'einsteinpapers.press.princeton.edu', 'Einstein Papers', [
  ['/', 'The Collected Papers of Albert Einstein (Princeton)',
    'Princeton\u2019s authoritative edition: 15 volumes of Einstein\u2019s writings, letters and the 1905 miracle-year papers.',
    ['einstein', 'albert', 'papers', 'relativity', 'physics']],
]);
T('science', 'web', 'nobelprize.org', 'Nobel Prize', [
  ['/prizes/physics/1921/summary/', 'Albert Einstein: Nobel Prize in Physics 1921',
    'The Nobel committee\u2019s page: awarded for the photoelectric effect, with Einstein\u2019s biography and lecture.',
    ['einstein', 'nobel', 'prize', 'physics', 'photoelectric']],
]);
T('science', 'web', 'britannica.com', 'Encyclopaedia Britannica', [
  ['/biography/Albert-Einstein', 'Albert Einstein: Life, Theories and Legacy',
    'Britannica\u2019s Einstein biography: the patent office years, general relativity, and his later quest for a unified theory.',
    ['einstein', 'albert', 'biography', 'relativity', 'physics']],
]);
T('science', 'web', 'pbs.org', 'NOVA', [
  ['/wgbh/nova/einstein/', 'NOVA: Einstein\u2019s Big Idea (E=mc\u00b2)',
    'NOVA\u2019s Emmy-winning Einstein special: the story behind the world\u2019s most famous equation, free to stream.',
    ['einstein', 'emc2', 'relativity', 'nova', 'documentary']],
]);

/* ================= 29. recipes general (10) ================= */
T('food', 'web', 'allrecipes.com', 'Allrecipes', [
  ['/', 'Allrecipes: 50,000+ Tested Recipes with Reviews',
    'The community recipe giant: ratings that actually predict success, and the review tweaks worth reading.',
    ['recipes', 'cooking', 'allrecipes', 'dinner', 'easy']],
]);
T('food', 'web', 'seriouseats.com', 'Serious Eats', [
  ['/', 'Serious Eats: Science-Backed Recipes',
    'Kenji and team test every variable so you don\u2019t have to: the food lab approach to home cooking.',
    ['recipes', 'cooking', 'serious', 'eats', 'science']],
]);
T('food', 'web', 'bbcgoodfood.com', 'BBC Good Food', [
  ['/', 'BBC Good Food: Recipes and Meal Plans',
    'Triple-tested British recipes: weeknight dinners, baking projects and the Christmas issue worth framing.',
    ['recipes', 'cooking', 'bbc', 'dinner', 'baking']],
]);
T('food', 'web', 'nytcooking.com', 'NYT Cooking', [
  ['/', 'NYT Cooking: Recipes from the Times Kitchen',
    'The Times\u2019 recipe box: Sam Sifton\u2019s weeknight canon, holiday showstoppers and the comment section\u2019s wisdom.',
    ['recipes', 'cooking', 'nyt', 'dinner', 'baking']],
]);
T('food', 'web', 'budgetbytes.com', 'Budget Bytes', [
  ['/', 'Budget Bytes: Delicious Recipes on a Budget',
    'Beth\u2019s cost-per-serving recipes prove eating well doesn\u2019t require wealth \u2014 just a good lentil game.',
    ['recipes', 'budget', 'cheap', 'cooking', 'meals']],
]);
T('food', 'web', 'minimalistbaker.com', 'Minimalist Baker', [
  ['/', 'Minimalist Baker: 10 Ingredients or Less',
    'Simple plant-based recipes: one bowl, 30 minutes, big flavor. The weeknight vegan playbook.',
    ['recipes', 'vegan', 'simple', 'minimalist', 'baking']],
]);
T('food', 'web', 'woksoflife.com', 'The Woks of Life', [
  ['/', 'The Woks of Life: Chinese Family Recipes',
    'A family\u2019s Chinese recipe archive: dumplings, mapo tofu, hand-pulled noodles \u2014 with the techniques that matter.',
    ['recipes', 'chinese', 'cooking', 'dumplings', 'noodles']],
]);
T('food', 'web', 'rainbowplantlife.com', 'Rainbow Plant Life', [
  ['/', 'Rainbow Plant Life: Vibrant Vegan Recipes',
    'Nisha\u2019s meticulously tested vegan cooking: curries, pastas and desserts that convert skeptics.',
    ['recipes', 'vegan', 'plant', 'based', 'cooking']],
]);
T('food', 'web', 'gimmesomeoven.com', 'Gimme Some Oven', [
  ['/', 'Gimme Some Oven: Easy Family Dinners',
    'Ali\u2019s approachable weeknight recipes: sheet-pan dinners, slow-cooker wins and 30-minute pastas.',
    ['recipes', 'easy', 'dinner', 'weeknight', 'cooking']],
]);
T('food', 'web', 'halfbakedharvest.com', 'Half Baked Harvest', [
  ['/', 'Half Baked Harvest: Cozy, Creative Cooking',
    'Tieghan\u2019s mountain-kitchen recipes: brown-butter everything, cozy soups and desserts worth the effort.',
    ['recipes', 'cooking', 'cozy', 'dinner', 'dessert']],
]);

/* ================= 30. music (8) ================= */
T('entertainment', 'web', 'pitchfork.com', 'Pitchfork', [
  ['/', 'Pitchfork: Music Reviews and News',
    'The indie tastemaker: Best New Music tags, Sunday reviews of classics, and the lists everyone argues about.',
    ['music', 'reviews', 'pitchfork', 'albums', 'indie']],
]);
T('entertainment', 'web', 'rollingstone.com', 'Rolling Stone', [
  ['/', 'Rolling Stone: Music News and the 500 Greatest',
    'The 500 Greatest Albums list, artist interviews and the charts that still move the industry.',
    ['music', 'rolling', 'stone', 'albums', 'news']],
]);
T('entertainment', 'web', 'spotify.com', 'Spotify', [
  ['/us/', 'Spotify: Stream 100M+ Songs Free',
    'The streaming giant\u2019s home: free tier details, Wrapped, and the playlists that define the year.',
    ['music', 'spotify', 'streaming', 'songs', 'playlists']],
]);
T('entertainment', 'web', 'billboard.com', 'Billboard', [
  ['/charts/hot-100/', 'Billboard Hot 100: This Week\u2019s Chart',
    'The industry-standard singles chart: who\u2019s climbing, who\u2019s falling, and the records being broken.',
    ['music', 'billboard', 'charts', 'hot', '100', 'songs']],
]);
T('entertainment', 'web', 'npr.org', 'NPR Music', [
  ['/sections/music-news/', 'NPR Music: Tiny Desk and Music News',
    'Tiny Desk Concerts, thoughtful reviews and the artists public radio championed first.',
    ['music', 'npr', 'tiny', 'desk', 'concerts']],
]);
T('entertainment', 'web', 'songsterr.com', 'Songsterr', [
  ['/', 'Songsterr: Guitar Tabs with Playback',
    'Accurate guitar and bass tabs that play back in your browser \u2014 slow them down to learn the hard parts.',
    ['music', 'guitar', 'tabs', 'learn', 'bass']],
]);
T('entertainment', 'web', 'ultimate-guitar.com', 'Ultimate Guitar', [
  ['/', 'Ultimate Guitar: 1M+ Tabs and Chords',
    'The world\u2019s largest tab archive: chords, pro tabs and the shifter tool for transposing on the fly.',
    ['music', 'guitar', 'tabs', 'chords', 'learn']],
]);
T('entertainment', 'web', 'musicbrainz.org', 'MusicBrainz', [
  ['/', 'MusicBrainz: The Open Music Encyclopedia',
    'The Wikipedia of music metadata: every release, artist and label \u2014 open data powering your music apps.',
    ['music', 'database', 'metadata', 'encyclopedia', 'artists']],
]);

/* ================= 31. books (8) ================= */
T('entertainment', 'web', 'goodreads.com', 'Goodreads', [
  ['/', 'Goodreads: Track Books You Read and Love',
    'The reader\u2019s social network: reading challenges, ratings that guide your TBR, and the lists for every mood.',
    ['books', 'goodreads', 'reading', 'reviews', 'recommendations']],
]);
T('entertainment', 'web', 'gutenberg.org', 'Project Gutenberg', [
  ['/', 'Project Gutenberg: 70,000 Free eBooks',
    'Free public-domain classics: Austen, Dickens, Sherlock Holmes \u2014 in every eBook format, no account needed.',
    ['books', 'free', 'ebooks', 'gutenberg', 'classics']],
]);
T('entertainment', 'web', 'openlibrary.org', 'Open Library', [
  ['/', 'Open Library: Borrow 3M+ Books Free',
    'The Internet Archive\u2019s lending library: borrow scanned books like a real library, free with an account.',
    ['books', 'free', 'borrow', 'library', 'ebooks']],
]);
T('entertainment', 'web', 'nytimes.com', 'NYT Books', [
  ['/books/', 'NYT Books: Bestsellers and Reviews',
    'The bestseller lists that make careers, plus the Book Review\u2019s sharp criticism and By the Book interviews.',
    ['books', 'bestsellers', 'nyt', 'reviews', 'reading']],
]);
T('entertainment', 'web', 'lithub.com', 'Literary Hub', [
  ['/', 'Literary Hub: The Best of the Literary Internet',
    'Book excerpts, author interviews and the essays the literary world discusses \u2014 curated daily.',
    ['books', 'literary', 'authors', 'essays', 'reading']],
]);
T('entertainment', 'web', 'brandonsanderson.com', 'Brandon Sanderson', [
  ['/', 'Brandon Sanderson: Fantasy Author and Kickstarter Legend',
    'The Cosmere\u2019s home: reading order guides, the $41M Kickstarter story, and weekly progress bars.',
    ['books', 'fantasy', 'sanderson', 'cosmere', 'author']],
]);
T('entertainment', 'web', 'penguinrandomhouse.com', 'Penguin Random House', [
  ['/', 'Penguin Random House: New Releases',
    'The world\u2019s largest publisher: new releases, author events and the reading guides book clubs use.',
    ['books', 'publisher', 'new', 'releases', 'reading']],
]);
T('entertainment', 'web', 'bookriot.com', 'Book Riot', [
  ['/', 'Book Riot: Book News and Recommendations',
    'The book internet\u2019s front page: deals, adaptation news and recommendation lists for every niche.',
    ['books', 'news', 'recommendations', 'riot', 'reading']],
]);

/* ================= 32. fitness (8) ================= */
T('health', 'web', 'nerdfitness.com', 'Nerd Fitness', [
  ['/', 'Nerd Fitness: Level Up Your Life',
    'Fitness for people who\u2019d rather be gaming: beginner bodyweight routines, nutrition without misery, and coaching.',
    ['fitness', 'workout', 'beginner', 'exercise', 'nerd']],
]);
T('health', 'web', 'darebee.com', 'DAREBEE', [
  ['/', 'DAREBEE: Free No-Equipment Workouts',
    'Hundreds of free visual workouts: no sign-up, no equipment, with 30-day programs and RPG-style challenges.',
    ['fitness', 'workout', 'free', 'bodyweight', 'exercise']],
]);
T('health', 'web', 'strongerbyscience.com', 'Stronger By Science', [
  ['/', 'Stronger By Science: Evidence-Based Lifting',
    'Greg Nuckols\u2019 research reviews: what the studies say about hypertrophy, and free programs that apply it.',
    ['fitness', 'lifting', 'strength', 'science', 'muscle']],
]);
T('health', 'web', 'reddit.com', 'r/Fitness', [
  ['/r/Fitness/wiki/', 'r/Fitness Wiki: The Beginner\u2019s Bible',
    'Reddit\u2019s fitness wiki: recommended routines, diet 101 and the answers to every question new lifters ask.',
    ['fitness', 'reddit', 'beginner', 'workout', 'routine']],
]);
T('health', 'web', 'bodybuilding.com', 'Bodybuilding.com', [
  ['/', 'Bodybuilding.com: Workouts and Supplements',
    'Workout plans by goal, exercise video library and the supplement guides with actual ingredient breakdowns.',
    ['fitness', 'bodybuilding', 'workout', 'muscle', 'gym']],
]);
T('health', 'web', 'yogajournal.com', 'Yoga Journal', [
  ['/', 'Yoga Journal: Poses, Sequences and Philosophy',
    'Pose anatomy, sequences by level, and the philosophy behind the practice \u2014 from America\u2019s yoga magazine.',
    ['fitness', 'yoga', 'poses', 'flexibility', 'exercise']],
]);
T('health', 'web', 'runnersworld.com', 'Runner\u2019s World', [
  ['/', 'Runner\u2019s World: Training Plans and Shoe Reviews',
    '5K-to-marathon plans, lab-tested shoe reviews and the injury-prevention advice runners actually follow.',
    ['fitness', 'running', 'marathon', 'training', 'shoes']],
]);
T('health', 'web', 'examine.com', 'Examine', [
  ['/supplements/', 'Examine: Supplement Guides, Evidence-Graded',
    'Creatine, protein, caffeine \u2014 what works, what doesn\u2019t, and the doses the studies used. No affiliate hype.',
    ['fitness', 'supplements', 'creatine', 'protein', 'evidence']],
]);

/* ================= 33. photography (6) ================= */
T('entertainment', 'web', 'dpreview.com', 'DPReview', [
  ['/', 'DPReview: Camera Reviews and Photography News',
    'The camera reviewer\u2019s reviewer: lab-tested sensor scores, lens reviews and buying guides by use case.',
    ['photography', 'camera', 'reviews', 'dslr', 'mirrorless']],
]);
T('entertainment', 'web', 'petapixel.com', 'PetaPixel', [
  ['/', 'PetaPixel: Photography News and Tutorials',
    'Photo industry news, photographer interviews and technique tutorials from working pros.',
    ['photography', 'news', 'tutorials', 'camera']],
]);
T('entertainment', 'web', 'fstoppers.com', 'Fstoppers', [
  ['/', 'Fstoppers: Photography Education',
    'In-depth tutorials: lighting setups, retouching workflows and the business of being a photographer.',
    ['photography', 'tutorials', 'lighting', 'portrait', 'learn']],
]);
T('entertainment', 'web', 'unsplash.com', 'Unsplash', [
  ['/', 'Unsplash: Free High-Resolution Photos',
    'Millions of free photos for any use: the stock site that doesn\u2019t look like stock.',
    ['photography', 'free', 'photos', 'stock', 'images']],
]);
T('entertainment', 'web', 'digital-photography-school.com', 'Digital Photography School', [
  ['/', 'Digital Photography School: Tips for Beginners',
    'Beginner-friendly photo tips: exposure triangle, composition rules and the weekly challenges that build skill.',
    ['photography', 'tips', 'beginner', 'dslr', 'learn']],
]);
T('entertainment', 'web', '500px.com', '500px', [
  ['/', '500px: Photography Community and Licensing',
    'The photographer\u2019s portfolio network: feedback, quests and licensing your best shots.',
    ['photography', 'portfolio', 'community', 'licensing']],
]);

/* ================= 34. smartphones (8) ================= */
T('tech', 'web', 'gsmarena.com', 'GSMArena', [
  ['/', 'GSMArena: Phone Specs and Comparisons',
    'The phone spec bible: every model\u2019s full sheet, the compare tool, and battery/camera test scores.',
    ['smartphone', 'phone', 'specs', 'gsmarena', 'compare']],
]);
T('tech', 'web', 'marquesbrownlee.com', 'MKBHD', [
  ['/', 'MKBHD: Tech Reviews on YouTube',
    'Marques Brownlee\u2019s reviews: the smartphone awards, blind camera tests and the most-trusted voice in tech video.',
    ['smartphone', 'review', 'mkbhd', 'tech', 'youtube']],
]);
T('tech', 'web', 'theverge.com', 'The Verge', [
  ['/tech', 'The Verge: Tech News and Reviews',
    'Tech culture\u2019s front page: gadget reviews scored out of 10, and the reporting on AI\u2019s biggest players.',
    ['tech', 'news', 'reviews', 'verge', 'gadgets']],
]);
T('tech', 'web', 'androidauthority.com', 'Android Authority', [
  ['/', 'Android Authority: Android News and Phone Reviews',
    'Android\u2019s biggest independent voice: Pixel vs Galaxy deep-dives and the deals worth your money.',
    ['smartphone', 'android', 'pixel', 'samsung', 'reviews']],
]);
T('tech', 'web', 'macrumors.com', 'MacRumors', [
  ['/', 'MacRumors: Apple News and Buyer\u2019s Guides',
    'Apple\u2019s rumor mill done right: buyer\u2019s guides that tell you when NOT to buy, and iOS beta coverage.',
    ['iphone', 'apple', 'macrumors', 'ios', 'news']],
]);
T('tech', 'web', 'dxomark.com', 'DXOMARK', [
  ['/', 'DXOMARK: Camera and Display Scores',
    'Lab-measured camera, display and audio scores: the numbers behind \u201cbest phone camera\u201d claims.',
    ['smartphone', 'camera', 'dxomark', 'scores', 'display']],
]);
T('tech', 'web', 'ifixit.com', 'iFixit', [
  ['/', 'iFixit: Repair Guides and Teardowns',
    'Fix it yourself: step-by-step repair guides, repairability scores and the parts to do it.',
    ['smartphone', 'repair', 'ifixit', 'teardown', 'fix']],
]);
T('tech', 'web', 'support.google.com', 'Google Support', [
  ['/android/', 'Android Help: Official Support',
    'Google\u2019s Android help center: backup, find-my-device, and every settings screen explained.',
    ['android', 'help', 'support', 'google', 'phone']],
]);

/* ================= 35. cybersecurity (8) ================= */
T('tech', 'web', 'krebsonsecurity.com', 'Krebs on Security', [
  ['/', 'Krebs on Security: Investigative Cybercrime Reporting',
    'Brian Krebs\u2019 investigations: breach forensics, ransomware gangs and the scams targeting you right now.',
    ['security', 'cyber', 'hacking', 'krebs', 'breach']],
]);
T('tech', 'web', 'haveibeenpwned.com', 'Have I Been Pwned', [
  ['/', 'Have I Been Pwned: Check Your Breached Accounts',
    'Troy Hunt\u2019s breach checker: see which leaks exposed your email, and get notified of the next one.',
    ['security', 'breach', 'password', 'hacked', 'check']],
]);
T('tech', 'web', 'owasp.org', 'OWASP', [
  ['/www-project-top-ten/', 'OWASP Top 10: Critical Web App Risks',
    'The industry-standard web security list: injection, broken auth, XSS \u2014 and how to fix each one.',
    ['security', 'owasp', 'web', 'vulnerabilities', 'hacking']],
]);
T('tech', 'web', 'sans.org', 'SANS', [
  ['/', 'SANS: Cybersecurity Training and Research',
    'The gold standard of security training: GIAC certs, cheat sheets and the Internet Storm Center\u2019s threat diary.',
    ['security', 'training', 'sans', 'certification', 'cyber']],
]);
T('tech', 'web', 'eff.org', 'EFF', [
  ['/', 'Electronic Frontier Foundation: Digital Rights',
    'The EFF\u2019s guides: Surveillance Self-Defense, HTTPS Everywhere\u2019s legacy, and the fights for your digital rights.',
    ['security', 'privacy', 'eff', 'encryption', 'rights']],
]);
T('tech', 'web', 'tryhackme.com', 'TryHackMe', [
  ['/', 'TryHackMe: Learn Hacking Hands-On',
    'Gamified security labs: capture-the-flag rooms from beginner to red-team, all in your browser.',
    ['security', 'hacking', 'learn', 'ctf', 'tryhackme', 'ethical']],
]);
T('tech', 'web', 'portswigger.net', 'PortSwigger', [
  ['/web-security', 'Web Security Academy: Free Training',
    'The makers of Burp Suite teach web hacking free: SQLi, XSS and auth labs with solutions explained.',
    ['security', 'web', 'hacking', 'burp', 'xss', 'sqli']],
]);
T('tech', 'web', 'cisa.gov', 'CISA', [
  ['/', 'CISA: US Cybersecurity Guidance',
    'America\u2019s cyber defense agency: known-exploited vulnerabilities catalog and Shields Up guidance.',
    ['security', 'cisa', 'vulnerabilities', 'government', 'cyber']],
]);

/* ================= 36. news (28, type news) ================= */
T('tech', 'news', 'TechWire', 'TechWire', [
  ['/gpt6-launch', 'OpenAI unveils GPT-6 with on-device reasoning, claims 10x efficiency gain',
    'The new model runs partially on consumer laptops and phones, a shift OpenAI says will cut inference costs dramatically. Developers get API access next month with a free tier for open-source projects.',
    ['ai', 'openai', 'gpt', 'tech', 'news']],
  ['/deepmind-protein', 'Google DeepMind\u2019s protein model now predicts full cellular pathways',
    'The latest release models how proteins interact across entire cells, a leap researchers call transformative for drug discovery. Pharma partners have begun using it in trials.',
    ['ai', 'deepmind', 'protein', 'tech', 'science', 'news']],
]);
T('tech', 'news', 'The Ledger', 'The Ledger', [
  ['/tsmc-arizona', 'Chip shortage eases as TSMC Arizona fab hits full production',
    'TSMC confirmed its Arizona facility is shipping 3nm chips to US customers, easing the AI accelerator crunch. Analysts expect GPU prices to fall up to 15% by year end.',
    ['tech', 'chips', 'tsmc', 'gpu', 'ai', 'news']],
]);
T('tech', 'news', 'Pulse News', 'Pulse News', [
  ['/eu-ai-act', 'EU passes AI Accountability Act requiring watermarking of synthetic media',
    'The law mandates invisible watermarks on AI-generated images, video and audio from 2027. Non-compliant platforms face fines up to 4% of global revenue.',
    ['ai', 'eu', 'regulation', 'tech', 'news']],
]);
T('tech', 'news', 'Morning Brief', 'Morning Brief', [
  ['/visionos3', 'Apple ships visionOS 3 with AI real-time translation for smart glasses',
    'The update brings live conversation translation to 40 languages in the field of view. Reviewers praise accuracy; battery life under AI load remains a concern.',
    ['apple', 'tech', 'ai', 'glasses', 'news']],
]);
T('tech', 'news', 'Orbital Post', 'Orbital Post', [
  ['/quantaleap', 'Quantum startup QuantaLeap claims 1,000-qubit error-corrected milestone',
    'The startup demonstrated sustained error correction on 1,024 logical qubits, peer-reviewed this week. If replicated, it compresses the timeline for useful quantum computing by years.',
    ['quantum', 'tech', 'computing', 'news']],
]);
T('science', 'news', 'Orbital Post', 'Orbital Post', [
  ['/artemis-rehearsal', 'NASA\u2019s Artemis III crew completes final lunar landing rehearsal',
    'The four-person crew ran a full dress rehearsal of descent and surface operations. NASA says the lunar lander passed every test on the first attempt.',
    ['space', 'nasa', 'moon', 'artemis', 'news']],
  ['/mars-life', 'Perseverance finds strongest evidence yet of ancient microbial life on Mars',
    'Analysis of Jezero Crater rocks revealed organic patterns difficult to explain without biology. A sample-return mission is now NASA\u2019s top priority.',
    ['mars', 'space', 'nasa', 'life', 'news']],
]);
T('science', 'news', 'Morning Brief', 'Morning Brief', [
  ['/blackhole-image', 'Astronomers capture clearest-ever image of a black hole\u2019s photon ring',
    'A satellite-linked array resolved the glowing ring around M87* in unprecedented detail, confirming predictions about magnetic fields near the event horizon.',
    ['black', 'hole', 'space', 'astronomy', 'news']],
]);
T('science', 'news', 'The Ledger', 'The Ledger', [
  ['/co2-drop', 'New study: global CO2 emissions fell for the first time since 2020',
    'Falling coal use in China and record solar drove a 1.2% decline. Scientists caution the drop must accelerate tenfold to meet climate targets.',
    ['climate', 'co2', 'emissions', 'news']],
]);
T('science', 'news', 'Pulse News', 'Pulse News', [
  ['/flu-vaccine', 'WHO approves first universal flu vaccine after decade-long trial',
    'The vaccine targets a conserved flu region with 82% efficacy across strains. Annual flu shots could become history within five years.',
    ['vaccines', 'flu', 'health', 'who', 'news']],
]);
T('sports', 'news', 'The Ledger', 'The Ledger', [
  ['/wc26-tickets', 'World Cup 2026: record 6.5 million tickets sold in first wave',
    'FIFA confirmed record opening sales; the final drew 40 million requests. A second wave opens in November with dynamic pricing caps.',
    ['football', 'world', 'cup', '2026', 'tickets', 'news']],
]);
T('sports', 'news', 'Pulse News', 'Pulse News', [
  ['/india-t20', 'India clinch T20 series 3-1 after last-over thriller in Mumbai',
    'A final-over finish sealed the series as 40,000 fans watched a six off the last ball. The young captain called it \u201cthe loudest night of my career\u201d.',
    ['cricket', 'india', 't20', 'ipl', 'news']],
]);
T('sports', 'news', 'Morning Brief', 'Morning Brief', [
  ['/olympics28', 'LA 2028 Olympics: cricket returns after 128 years',
    'Cricket\u2019s Olympic return headlines the LA program alongside flag football. Organizers expect the T20 format to draw new global audiences.',
    ['olympics', 'cricket', '2028', 'sports', 'news']],
]);
T('world', 'news', 'The Ledger', 'The Ledger', [
  ['/g20-summit', 'G20 summit agrees landmark digital-trade framework',
    'Leaders signed a framework harmonizing data-flow rules across 19 economies, hailed as the biggest trade deal for the internet era.',
    ['world', 'g20', 'trade', 'news', 'economy']],
]);
T('world', 'news', 'Pulse News', 'Pulse News', [
  ['/election-2026', 'Record voter turnout in landmark European elections',
    'Turnout hit a 30-year high as young voters surged. Analysts say climate and housing dominated the campaign.',
    ['world', 'election', 'europe', 'news', 'politics']],
]);
T('world', 'news', 'Orbital Post', 'Orbital Post', [
  ['/lunar-treaty', 'Nations sign updated lunar resource treaty',
    'Forty-two countries agreed on rules for mining the Moon\u2019s south pole, balancing commercial interests with scientific preservation.',
    ['world', 'moon', 'space', 'treaty', 'news']],
]);
T('tech', 'news', 'TechWire', 'TechWire', [
  ['/solid-state', 'Toyota ships first solid-state EV batteries at scale',
    'The breakthrough batteries charge in 10 minutes and double range. Toyota says costs will match lithium-ion by 2028.',
    ['tech', 'ev', 'battery', 'toyota', 'news']],
]);
T('science', 'news', 'Orbital Post', 'Orbital Post', [
  ['/webb-exoplanet', 'Webb finds water vapor on potentially habitable exoplanet',
    'The telescope detected water in the atmosphere of a rocky world 40 light-years away. Follow-up observations are scheduled for next year.',
    ['space', 'webb', 'exoplanet', 'nasa', 'news']],
]);
T('sports', 'news', 'The Ledger', 'The Ledger', [
  ['/ucl-final', 'Champions League final sets viewership record',
    'Over 450 million watched the final, making it the most-viewed club match ever. The winning goal came in the 89th minute.',
    ['football', 'champions', 'league', 'uefa', 'news']],
]);
T('world', 'news', 'Morning Brief', 'Morning Brief', [
  ['/fusion-net', 'Fusion plant delivers net energy for 24 straight hours',
    'The experimental reactor sustained net-positive fusion for a full day \u2014 the milestone the field has chased for decades.',
    ['world', 'fusion', 'energy', 'science', 'news']],
]);
T('tech', 'news', 'Pulse News', 'Pulse News', [
  ['/open-llm', 'Open-weight LLM beats proprietary models on coding benchmarks',
    'A 70B open model topped the SWE-bench leaderboard, reigniting the open-vs-closed debate in AI development.',
    ['ai', 'llm', 'open', 'source', 'coding', 'news']],
]);
T('science', 'news', 'Morning Brief', 'Morning Brief', [
  ['/ocean-mapping', 'Scientists complete highest-resolution map of ocean floor',
    'The new map reveals 100,000+ uncharted seamounts. Researchers say it will transform tsunami modeling.',
    ['science', 'ocean', 'mapping', 'news']],
]);
T('sports', 'news', 'Pulse News', 'Pulse News', [
  ['/ashes-2026', 'Ashes 2026 dates announced: five Tests across England',
    'England and Australia will contest the urn next summer, starting at Edgbaston in June. Tickets sold out in hours.',
    ['cricket', 'ashes', 'england', 'australia', 'news']],
]);
T('world', 'news', 'The Ledger', 'The Ledger', [
  ['/india-economy', 'India becomes world\u2019s third-largest economy',
    'Official figures confirmed India overtook Japan, with growth led by manufacturing and digital services.',
    ['world', 'india', 'economy', 'news']],
]);
T('tech', 'news', 'Morning Brief', 'Morning Brief', [
  ['/robotaxi', 'Robotaxi services expand to 12 new cities',
    'Driverless ride-hailing now operates in 20 cities worldwide. Regulators report accident rates below human drivers.',
    ['tech', 'robotaxi', 'ai', 'autonomous', 'news']],
]);

/* ================= entities (knowledge panels) ================= */
const ENTITIES = {
  'python': { title: 'Python', sub: 'Programming language \u00b7 Created 1991', seed: 'python-knowledge',
    desc: 'Python is a high-level, interpreted programming language known for its readability and vast ecosystem. It dominates data science, web backends, automation, and AI development.',
    facts: [['Designed by', 'Guido van Rossum'], ['Latest', 'Python 3.13'], ['Paradigm', 'Multi-paradigm: OOP, functional'], ['Typing', 'Dynamic, gradual (type hints)']] },
  'javascript': { title: 'JavaScript', sub: 'Programming language \u00b7 Created 1995', seed: 'javascript-knowledge',
    desc: 'JavaScript is the programming language of the web, running in every browser. With Node.js it also powers servers, and frameworks like React dominate front-end development.',
    facts: [['Designed by', 'Brendan Eich'], ['Standard', 'ECMAScript 2024'], ['Runtime', 'Browsers, Node.js, Deno'], ['Typing', 'Dynamic']] },
  'react': { title: 'React', sub: 'JavaScript UI library \u00b7 Meta', seed: 'react-knowledge',
    desc: 'React is an open-source JavaScript library for building user interfaces, maintained by Meta. Its component model and virtual DOM made it the most widely used front-end library.',
    facts: [['Maintained by', 'Meta'], ['Released', '2013'], ['Latest', 'React 19'], ['Model', 'Components + hooks']] },
  'linux': { title: 'Linux', sub: 'Open-source operating system kernel', seed: 'linux-knowledge',
    desc: 'Linux is a free, open-source Unix-like OS kernel created by Linus Torvalds in 1991. It powers most servers, Android phones, and the world\u2019s top supercomputers.',
    facts: [['Creator', 'Linus Torvalds'], ['Released', '1991'], ['License', 'GPLv2'], ['Powers', 'Servers \u00b7 Android \u00b7 supercomputers']] },
  'albert einstein': { title: 'Albert Einstein', sub: 'Theoretical physicist \u00b7 1879\u20131955', seed: 'einstein-knowledge',
    desc: 'Albert Einstein developed the theory of relativity, one of the two pillars of modern physics. His mass\u2013energy equivalence formula E = mc\u00b2 is the world\u2019s most famous equation.',
    facts: [['Born', '14 March 1879, Ulm'], ['Nobel Prize', 'Physics, 1921'], ['Known for', 'Relativity, photoelectric effect'], ['Died', '18 April 1955']] },
  'leonardo da vinci': { title: 'Leonardo da Vinci', sub: 'Polymath \u00b7 1452\u20131519', seed: 'davinci-knowledge',
    desc: 'Leonardo da Vinci was an Italian polymath of the Renaissance \u2014 painter of the Mona Lisa and The Last Supper, inventor, anatomist and engineer whose notebooks anticipated flight and robotics.',
    facts: [['Born', '15 April 1452, Vinci'], ['Famous works', 'Mona Lisa \u00b7 The Last Supper'], ['Fields', 'Art, anatomy, engineering'], ['Died', '2 May 1519, Amboise']] },
  'paris': { title: 'Paris', sub: 'Capital of France', seed: 'paris-knowledge',
    desc: 'Paris is the capital and most populous city of France, a global center for art, fashion, gastronomy, and culture. Landmarks include the Eiffel Tower, the Louvre, and Notre-Dame.',
    facts: [['Country', 'France'], ['Population', '~2.1 million (city)'], ['Landmarks', 'Eiffel Tower \u00b7 Louvre \u00b7 Notre-Dame'], ['Founded', '3rd century BC']] },
  'japan': { title: 'Japan', sub: 'Island country in East Asia', seed: 'japan-knowledge',
    desc: 'Japan is an island nation in East Asia known for its blend of ancient tradition and cutting-edge technology, from Kyoto\u2019s temples to Tokyo\u2019s neon districts.',
    facts: [['Capital', 'Tokyo'], ['Population', '~124 million'], ['Currency', 'Yen (\u00a5)'], ['Known for', 'Sushi \u00b7 anime \u00b7 bullet trains']] },
  'taj mahal': { title: 'Taj Mahal', sub: 'Ivory-white marble mausoleum \u00b7 Agra, India', seed: 'tajmahal-knowledge',
    desc: 'The Taj Mahal is an ivory-white marble mausoleum commissioned in 1632 by Mughal emperor Shah Jahan for his wife Mumtaz Mahal. A UNESCO World Heritage Site and Wonder of the World.',
    facts: [['Location', 'Agra, India'], ['Built', '1632\u20131653'], ['Architect', 'Ustad Ahmad Lahori'], ['Visitors', '~8 million / year']] },
  'cricket': { title: 'Cricket', sub: 'Bat-and-ball sport', seed: 'cricket-knowledge',
    desc: 'Cricket is a bat-and-ball game played between two teams of eleven, hugely popular across South Asia, England, and Australia. Formats range from five-day Tests to three-hour T20s.',
    facts: [['Governed by', 'ICC'], ['Formats', 'Test \u00b7 ODI \u00b7 T20'], ['Top event', 'Cricket World Cup'], ['Players per side', '11']] },
  'pizza': { title: 'Pizza', sub: 'Italian dish', seed: 'pizza-knowledge',
    desc: 'Pizza is a savory Italian dish of flattened dough topped with tomato sauce, cheese, and toppings, baked in an oven. Naples is its birthplace; Margherita is the classic.',
    facts: [['Origin', 'Naples, Italy'], ['Classic', 'Margherita'], ['Base', 'Wheat dough \u00b7 tomato \u00b7 mozzarella'], ['Oven temp', '~450\u00b0C (wood-fired)']] },
  'black hole': { title: 'Black hole', sub: 'Region of spacetime', seed: 'blackhole-knowledge',
    desc: 'A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape. The first direct image of one (M87*) was released in 2019.',
    facts: [['First imaged', 'M87* (2019)'], ['Nearest known', 'Gaia BH1 (~1,560 ly)'], ['Boundary', 'Event horizon'], ['Theory', 'General relativity']] },
  'machine learning': { title: 'Machine learning', sub: 'Field of artificial intelligence', seed: 'ml-knowledge',
    desc: 'Machine learning is the study of algorithms that improve through experience. It powers recommendations, translation, medical diagnosis and the large language models behind modern AI.',
    facts: [['Types', 'Supervised \u00b7 unsupervised \u00b7 RL'], ['Key library', 'scikit-learn \u00b7 PyTorch'], ['Pioneer course', 'Andrew Ng (Coursera)'], ['Since', '1950s (term: 1959)']] },
  'sushi': { title: 'Sushi', sub: 'Japanese dish', seed: 'sushi-knowledge',
    desc: 'Sushi is a Japanese dish of seasoned vinegared rice paired with seafood, vegetables or egg. Styles include nigiri, maki rolls and chirashi; omakase counters are its highest form.',
    facts: [['Origin', 'Japan (Edo period)'], ['Styles', 'Nigiri \u00b7 maki \u00b7 temaki'], ['Rice', 'Vinegared short-grain'], ['Top form', 'Omakase counter']] },
  'football world cup': { title: 'FIFA World Cup', sub: 'International football tournament', seed: 'worldcup-knowledge',
    desc: 'The FIFA World Cup is the world\u2019s most-watched sporting event, held every four years. The 2026 edition spans the USA, Canada and Mexico with a record 48 teams.',
    facts: [['Founded', '1930'], ['2026 hosts', 'USA \u00b7 Canada \u00b7 Mexico'], ['Most titles', 'Brazil (5)'], ['Defending champion', 'Argentina']] },
  'eiffel tower': { title: 'Eiffel Tower', sub: 'Wrought-iron tower \u00b7 Paris', seed: 'eiffel-knowledge',
    desc: 'The Eiffel Tower is a 330-metre wrought-iron lattice tower on the Champ de Mars, built for the 1889 World\u2019s Fair. It is the most-visited paid monument in the world.',
    facts: [['Height', '330 m'], ['Built', '1887\u20131889'], ['Architect', 'Gustave Eiffel'], ['Visitors', '~7 million / year']] },
};

const SUGGESTIONS = [
  'javascript array methods', 'javascript tutorial for beginners', 'javascript fetch api example',
  'javascript async await', 'javascript map vs foreach', 'javascript closure explained',
  'javascript date format', 'javascript localstorage', 'python tutorial', 'python',
  'python list comprehension', 'python dictionary get', 'python virtualenv setup',
  'python requests library', 'python for loop', 'how to learn python for beginners',
  'python pandas dataframe', 'python web scraping', 'what is machine learning',
  'machine learning projects for beginners', 'deep learning vs machine learning',
  'artificial intelligence course', 'best ai tools 2026', 'ai image generator',
  'chatgpt alternatives', 'neural network explained', 'prompt engineering guide',
  'llm fine tuning', 'react', 'react hooks tutorial', 'react useeffect example',
  'react router setup', 'react vs vue', 'react state management', 'next.js tutorial',
  'css grid', 'css flexbox cheat sheet', 'css animation examples', 'css center div',
  'css variables', 'tailwind css tutorial', 'linux', 'linux commands cheat sheet',
  'linux permission denied fix', 'how to install linux on laptop', 'linux terminal shortcuts',
  'ubuntu server setup', 'docker', 'docker compose tutorial', 'dockerfile example nodejs',
  'docker vs kubernetes', 'git', 'git rebase vs merge', 'git undo last commit',
  'git stash', 'github', 'sql', 'sql join types explained', 'sql group by having',
  'postgres vs mysql', 'sql interview questions', 'space', 'spacex starship launch date',
  'black hole', 'what is a black hole', 'black hole photo', 'event horizon telescope',
  'mars', 'mars rover latest news', 'life on mars evidence', 'mars colonization timeline',
  'climate change', 'what causes climate change', 'carbon footprint calculator',
  'vaccines', 'are vaccines safe', 'sleep', 'how much sleep do i need',
  'sleep apnea symptoms', 'why do we dream', 'insomnia remedies', 'paris',
  'paris travel guide', 'things to do in paris', 'best time to visit paris',
  'paris metro map', 'japan', 'japan travel guide', 'japan visa requirements',
  'best time to visit japan', 'japan rail pass worth it', 'bali', 'bali travel tips',
  'best beaches in bali', 'pizza', 'best pizza near me', 'homemade pizza dough recipe',
  'sushi', 'how to make sushi at home', 'best sushi near me', 'ramen', 'best ramen recipe',
  'football', 'football world cup 2026 schedule', 'premier league table',
  'football transfer news', 'cricket', 'cricket world cup schedule', 'ipl 2026 auction',
  'india vs australia live score', 'cricket batting tips', 'olympics', 'olympics 2028 los angeles',
  'healthy breakfast ideas', 'taj mahal', 'leonardo da vinci', 'albert einstein',
  'eiffel tower tickets', 'biryani recipe', 'masala chai recipe', 'best smartphone 2026',
  'iphone vs android', 'how to learn guitar', 'best books 2026', 'imdb top 250',
  'credit card rewards', 'index funds vs etf', 'what is cryptocurrency',
  'yoga for beginners', 'home workout no equipment', 'best camera for beginners',
  'how to meditate', 'sourdough bread recipe', 'chess openings for beginners',
];

const TRENDING = [
  'football world cup 2026 schedule',
  'ipl 2026 auction',
  'best ai tools 2026',
  'python tutorial',
  'japan travel guide',
  'india vs australia live score',
  'spacex starship launch date',
  'homemade pizza dough recipe',
  'what is machine learning',
  'taj mahal',
];

module.exports = { DOCS, ENTITIES, SUGGESTIONS, TRENDING };
