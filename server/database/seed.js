const bcrypt = require('bcryptjs');

async function seed(db) {
  const hash = await bcrypt.hash('password123', 10);

  const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve(this);
      });
    });
  };

  const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  };

  const users = [
    { username: 'sarah_dev', email: 'sarah@example.com', password: hash },
    { username: 'mike_codes', email: 'mike@example.com', password: hash },
    { username: 'priya_engineer', email: 'priya@example.com', password: hash },
    { username: 'alex_tech', email: 'alex@example.com', password: hash },
    { username: 'jordan_dev', email: 'jordan@example.com', password: hash },
  ];

  for (const u of users) {
    const existing = await get('SELECT id FROM users WHERE email = ?', [u.email]);
    if (!existing) {
      await run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [u.username, u.email, u.password]);
    }
  }

  const questions = [
    { title: 'Design a URL shortener like bit.ly', description: 'System design question: How would you design a URL shortening service that handles millions of URLs? Discuss database schema, hashing strategy, redirect performance, and scaling considerations.', tags: 'system-design,sd,google', company: 'Google', user_id: 1, views: 1542, status: 'verified' },
    { title: 'Explain how Google Search indexes web pages', description: 'Walk through the process of how Google crawls, indexes, and ranks web pages. What data structures are used for inverted indexing? How does PageRank work at scale?', tags: 'search,indexing,distributed-systems,google', company: 'Google', user_id: 2, views: 892, status: 'verified' },
    { title: 'Find the longest substring without repeating characters', description: 'Given a string s, find the length of the longest substring without repeating characters. Optimize for O(n) time complexity and explain the sliding window approach.', tags: 'algorithm,strings,sliding-window,google', company: 'Google', user_id: 3, views: 2103, status: 'verified' },
    { title: 'How does Google handle consistency in Spanner?', description: 'Explain TrueTime API and how Spanner achieves external consistency across globally distributed databases. What are the trade-offs compared to traditional ACID databases?', tags: 'distributed-systems,database,consistency,google', company: 'Google', user_id: 1, views: 678, status: 'community_verified' },
    { title: 'Implement a Least Recently Used (LRU) Cache', description: 'Design and implement an LRU cache with O(1) get and put operations. Which data structures would you use and why? Handle concurrent access considerations.', tags: 'system-design,caching,algorithms,google', company: 'Google', user_id: 2, views: 1876, status: 'verified' },
    { title: 'What is the CAP theorem and how does it apply to distributed databases?', description: 'Explain the CAP theorem in detail. How do Google Spanner, Bigtable, and MongoDB trade off consistency, availability, and partition tolerance? Provide real-world examples.', tags: 'distributed-systems,database,cap-theorem,google', company: 'Google', user_id: 4, views: 1456, status: 'community_verified' },
    { title: 'Given a list of words, group anagrams together', description: 'Given an array of strings, group anagrams together. Optimize time complexity and discuss edge cases like empty strings and Unicode characters.', tags: 'algorithm,hashtable,strings,google', company: 'Google', user_id: 3, views: 1234, status: 'verified' },
    { title: 'How would you design Google Drive?', description: 'Design a cloud storage system like Google Drive. Cover file upload/download, sync across devices, conflict resolution, sharing permissions, and offline access.', tags: 'system-design,storage,distributed-systems,google', company: 'Google', user_id: 5, views: 2341, status: 'verified' },
    { title: 'Design a distributed task scheduler', description: 'How would you design a task scheduler that can handle millions of scheduled jobs with fault tolerance? Discuss priority queues, worker pools, retry logic, and monitoring.', tags: 'system-design,scheduling,distributed-systems,microsoft', company: 'Microsoft', user_id: 2, views: 987, status: 'verified' },
    { title: 'Explain the difference between a thread and a process', description: 'Compare threads and processes in terms of memory sharing, context switching overhead, communication methods, and use cases. How do these concepts apply to Windows vs Linux kernel design?', tags: 'operating-systems,concurrency,threads,microsoft', company: 'Microsoft', user_id: 3, views: 892, status: 'community_verified' },
    { title: 'Reverse a linked list iteratively and recursively', description: 'Implement a function to reverse a singly linked list in both iterative and recursive approaches. Analyze time and space complexity. Handle edge cases like null and single-node lists.', tags: 'algorithm,linked-list,data-structures,microsoft', company: 'Microsoft', user_id: 1, views: 1567, status: 'verified' },
    { title: 'Design a logging system for a distributed application', description: 'Design a centralized logging system that aggregates logs from thousands of microservices. Discuss log formats, storage, querying, and real-time alerting capabilities.', tags: 'system-design,logging,microservices,microsoft', company: 'Microsoft', user_id: 4, views: 743, status: 'verified' },
    { title: 'Merge two sorted arrays in place', description: 'Given two sorted arrays, merge them into a single sorted array without using extra space. Optimize for O(n) time and O(1) space complexity.', tags: 'algorithm,arrays,two-pointers,microsoft', company: 'Microsoft', user_id: 5, views: 1123, status: 'verified' },
    { title: 'How does garbage collection work in .NET?', description: 'Explain the .NET garbage collector generations, mark-and-compact algorithm, large object heap, and how to optimize memory usage in C# applications.', tags: 'dotnet,garbage-collection,memory,microsoft', company: 'Microsoft', user_id: 2, views: 634, status: 'community_verified' },
    { title: 'Design a real-time collaborative editing system', description: 'How would you design a system like Google Docs or Microsoft Word Online that supports real-time multi-user editing? Discuss Operational Transformation and CRDT approaches.', tags: 'system-design,real-time,collaboration,microsoft', company: 'Microsoft', user_id: 1, views: 1876, status: 'verified' },
    { title: 'Design Amazon product recommendation system', description: 'How would you design a recommendation engine that suggests products based on user behavior? Discuss collaborative filtering, content-based filtering, matrix factorization, and A/B testing.', tags: 'system-design,recommendation,machine-learning,amazon', company: 'Amazon', user_id: 3, views: 2104, status: 'verified' },
    { title: 'Two Sum problem - optimize for different constraints', description: 'Given an array of integers and a target, return indices of two numbers that add up to the target. Solve for O(n) time, then handle follow-ups for sorted arrays and multiple pairs.', tags: 'algorithm,arrays,hashtable,amazon', company: 'Amazon', user_id: 1, views: 3456, status: 'verified' },
    { title: 'Design a scalable shopping cart service', description: 'Design a shopping cart system that handles millions of concurrent users. Discuss session management, persistence, inventory locking, and handling inconsistencies during checkout.', tags: 'system-design,ecommerce,scalability,amazon', company: 'Amazon', user_id: 2, views: 1567, status: 'verified' },
    { title: 'Amazon Leadership Principles - Tell me about a time you disagreed with your manager', description: 'Behavioral interview question based on Amazon Leadership Principles. Structure your answer using STAR method. Focus on "Have Backbone; Disagree and Commit" principle.', tags: 'behavioral,leadership,hr,amazon', company: 'Amazon', user_id: 4, views: 2345, status: 'community_verified' },
    { title: 'Design a highly available global e-commerce platform', description: 'How would you design a global e-commerce platform with 99.99% availability? Discuss multi-region deployment, disaster recovery, data replication, and graceful degradation strategies.', tags: 'system-design,high-availability,ecommerce,amazon', company: 'Amazon', user_id: 5, views: 1789, status: 'verified' },
    { title: 'Maximum subarray sum (Kadane Algorithm)', description: 'Find the contiguous subarray with the maximum sum in an array of integers. Implement Kadane algorithm and explain why it works. Handle arrays with all negative numbers.', tags: 'algorithm,dynamic-programming,arrays,amazon', company: 'Amazon', user_id: 1, views: 1678, status: 'verified' },
    { title: 'How would you handle data consistency across microservices?', description: 'Discuss patterns for maintaining data consistency across distributed microservices: Saga pattern, event sourcing, CQRS, and two-phase commit. When would you use each approach?', tags: 'microservices,consistency,distributed-systems,amazon', company: 'Amazon', user_id: 3, views: 1234, status: 'verified' },
    { title: 'Design Facebook News Feed', description: 'Design the Facebook News Feed algorithm that prioritizes relevant content. Discuss feed ranking, friend affinity, content types, real-time updates, and A/B testing at scale.', tags: 'system-design,social-media,feed,meta', company: 'Meta', user_id: 2, views: 2456, status: 'verified' },
    { title: 'Serialize and deserialize a binary tree', description: 'Design an algorithm to serialize a binary tree into a string and deserialize it back. Handle different tree structures and optimize for space efficiency.', tags: 'algorithm,tree,serialization,meta', company: 'Meta', user_id: 4, views: 1234, status: 'verified' },
    { title: 'Design a real-time messaging system like Facebook Messenger', description: 'Design a chat application supporting one-on-one and group messaging with read receipts, typing indicators, and message sync across devices.', tags: 'system-design,messaging,real-time,meta', company: 'Meta', user_id: 1, views: 1987, status: 'verified' },
    { title: 'Design a friend recommendation system', description: 'How would you design a "People You May Know" feature? Discuss graph algorithms, friend-of-friend relationships, mutual connections, and offline processing of large graphs.', tags: 'system-design,graph,recommendation,meta', company: 'Meta', user_id: 5, views: 876, status: 'community_verified' },
    { title: 'LRU Cache with expiration - implement in Python', description: 'Implement an LRU cache that also supports TTL (time-to-live) expiration for each key. Discuss thread safety considerations and real-world applications in web servers.', tags: 'algorithm,caching,python,meta', company: 'Meta', user_id: 3, views: 1567, status: 'verified' },
    { title: 'Design a media streaming service like Apple TV+', description: 'Design a video streaming platform that delivers high-quality content to millions of users. Discuss CDN architecture, adaptive bitrate streaming, DRM, and offline playback.', tags: 'system-design,streaming,media,video,apple', company: 'Apple', user_id: 2, views: 1234, status: 'verified' },
    { title: 'How does iOS manage memory for mobile apps?', description: 'Explain iOS memory management including ARC (Automatic Reference Counting), retain cycles, memory warnings, and best practices for optimizing memory in Swift applications.', tags: 'ios,memory-management,swift,mobile,apple', company: 'Apple', user_id: 4, views: 987, status: 'community_verified' },
    { title: 'Design a photo library management system', description: 'Design a photo management app that handles millions of photos with features like albums, search, face recognition, iCloud sync, and optimized thumbnail generation.', tags: 'system-design,photos,mobile,apple', company: 'Apple', user_id: 1, views: 765, status: 'verified' },
    { title: 'Find the k most frequent elements in an array', description: 'Given an integer array and a number k, return the k most frequent elements. Solve using hash map and bucket sort for O(n) time complexity.', tags: 'algorithm,hashtable,sorting,apple', company: 'Apple', user_id: 3, views: 1345, status: 'verified' },
    { title: 'How does Face ID authentication work?', description: 'Explain the Face ID authentication pipeline: infrared projection, depth mapping, neural network processing, Secure Enclave storage, and how it protects user privacy.', tags: 'security,biometrics,privacy,apple', company: 'Apple', user_id: 5, views: 567, status: 'verified' },
    { title: 'Design Netflix content delivery network', description: 'How does Netflix deliver video content to millions of users globally? Discuss Open Connect CDN, adaptive bitrate streaming, caching strategies, and regional failover.', tags: 'system-design,cdn,streaming,netflix', company: 'Netflix', user_id: 1, views: 2345, status: 'verified' },
    { title: 'Design a personalized movie recommendation engine', description: 'Design Netflix recommendation system using collaborative filtering, content-based filtering, deep learning models, and A/B testing at scale.', tags: 'system-design,machine-learning,recommendation,netflix', company: 'Netflix', user_id: 2, views: 1890, status: 'verified' },
    { title: 'How does Netflix handle Chaos Engineering?', description: 'Explain Chaos Monkey and Simian Army. How does Netflix intentionally inject failures to test system resilience? What are the principles of chaos engineering?', tags: 'chaos-engineering,resilience,sre,netflix', company: 'Netflix', user_id: 3, views: 1456, status: 'verified' },
    { title: 'Design a video encoding pipeline', description: 'Design a video encoding pipeline that converts raw footage into multiple formats and resolutions. Discuss codec selection, parallel processing, cost optimization, and quality assessment.', tags: 'system-design,video,encoding,pipeline,netflix', company: 'Netflix', user_id: 4, views: 876, status: 'community_verified' },
    { title: 'Design a collaborative design tool like Figma', description: 'Design a real-time collaborative design tool. Discuss vector graphics rendering, layer management, real-time sync, plugin architecture, and web-based performance optimization.', tags: 'system-design,collaboration,design,adobe', company: 'Adobe', user_id: 1, views: 1234, status: 'verified' },
    { title: 'How to implement a photo filter pipeline?', description: 'Design a photo editing pipeline with filters, adjustments, and effects. Discuss GPU vs CPU processing, non-destructive editing, and real-time preview performance.', tags: 'image-processing,gpu,graphics,adobe', company: 'Adobe', user_id: 2, views: 678, status: 'community_verified' },
    { title: 'Design a PDF rendering engine', description: 'How would you design a PDF document renderer from scratch? Discuss parsing PDF structure, font rendering, page layout, and cross-platform compatibility.', tags: 'system-design,documents,rendering,adobe', company: 'Adobe', user_id: 3, views: 543, status: 'verified' },
    { title: 'How does Oracle RAC (Real Application Clusters) work?', description: 'Explain Oracle RAC architecture: shared cache, cluster interconnect, cache fusion, and how it achieves high availability for enterprise databases.', tags: 'database,clustering,oracle,high-availability', company: 'Oracle', user_id: 4, views: 876, status: 'verified' },
    { title: 'Explain ACID properties with real database examples', description: 'Explain Atomicity, Consistency, Isolation, and Durability in the context of relational databases. How do different isolation levels prevent anomalies like dirty reads?', tags: 'database,acid,transactions,sql,oracle', company: 'Oracle', user_id: 5, views: 1234, status: 'verified' },
    { title: 'Design a distributed database system', description: 'Design a distributed relational database that supports ACID transactions across multiple nodes. Discuss partitioning, replication, consensus protocols, and query optimization.', tags: 'system-design,database,distributed-systems,oracle', company: 'Oracle', user_id: 1, views: 1567, status: 'verified' },
    { title: 'Design a multi-tenant SaaS architecture', description: 'How does Salesforce handle multi-tenancy? Discuss data isolation strategies, tenant-aware caching, rate limiting, and ensuring fair resource allocation among tenants.', tags: 'system-design,saas,multi-tenant,salesforce', company: 'Salesforce', user_id: 2, views: 987, status: 'verified' },
    { title: 'Design a CRM system from scratch', description: 'Design a Customer Relationship Management platform with contact management, pipeline tracking, reporting, and email integration capabilities.', tags: 'system-design,crm,saas,salesforce', company: 'Salesforce', user_id: 3, views: 765, status: 'verified' },
    { title: 'How to design a workflow automation engine?', description: 'Design a drag-and-drop workflow builder with triggers, conditions, and actions. Discuss state machine design, execution engine, and handling complex business logic.', tags: 'system-design,workflow,automation,salesforce', company: 'Salesforce', user_id: 4, views: 543, status: 'community_verified' },
    { title: 'Design a mainframe transaction processing system', description: 'Explain how IBM CICS handles high-volume transaction processing. Discuss transaction management, resource managers, two-phase commit, and recovery mechanisms.', tags: 'mainframe,transactions,enterprise,ibm', company: 'IBM', user_id: 1, views: 654, status: 'verified' },
    { title: 'How does Watson use NLP for question answering?', description: 'Explain the architecture of IBM Watson for natural language understanding, question analysis, evidence retrieval, and answer scoring.', tags: 'ai,nlp,machine-learning,watson,ibm', company: 'IBM', user_id: 2, views: 789, status: 'community_verified' },
    { title: 'Design an enterprise API gateway', description: 'Design an API gateway for enterprise microservices with authentication, rate limiting, request transformation, monitoring, and versioning.', tags: 'system-design,api-gateway,microservices,ibm', company: 'IBM', user_id: 3, views: 876, status: 'verified' },
    { title: 'Design a modern CPU architecture', description: 'Explain the key components of a modern CPU: instruction pipeline, cache hierarchy, branch prediction, out-of-order execution, and how they impact software performance.', tags: 'hardware,cpu,architecture,low-level,intel', company: 'Intel', user_id: 4, views: 1234, status: 'verified' },
    { title: 'How does virtual memory work at the hardware level?', description: 'Explain virtual memory translation from virtual addresses to physical addresses through page tables, TLB, and page walks. Discuss performance implications.', tags: 'operating-systems,memory,virtualization,intel', company: 'Intel', user_id: 5, views: 987, status: 'verified' },
    { title: 'Design a SIMD optimization for matrix multiplication', description: 'How would you optimize matrix multiplication using Intel AVX-512 SIMD instructions? Discuss memory layout, cache blocking, and parallelization strategies.', tags: 'performance,optimization,simd,hpc,intel', company: 'Intel', user_id: 1, views: 654, status: 'community_verified' },
    { title: 'Design a GPU kernel for parallel processing', description: 'Explain CUDA programming model: thread hierarchy, memory types (global, shared, local), warp execution, and occupancy optimization for maximum throughput.', tags: 'gpu,cuda,parallel-computing,hpc,nvidia', company: 'NVIDIA', user_id: 2, views: 1567, status: 'verified' },
    { title: 'How does real-time ray tracing work on RTX GPUs?', description: 'Explain the ray tracing pipeline: BVH traversal, ray-triangle intersection, denoising, and how RT Cores accelerate these computations in real-time.', tags: 'graphics,ray-tracing,gpu,rendering,nvidia', company: 'NVIDIA', user_id: 3, views: 1234, status: 'verified' },
    { title: 'Design a deep learning inference accelerator', description: 'Design a hardware accelerator for neural network inference. Discuss tensor cores, quantization, memory bandwidth optimization, and model parallelization strategies.', tags: 'ai,deep-learning,hardware,acceleration,nvidia', company: 'NVIDIA', user_id: 4, views: 1890, status: 'verified' },
    { title: 'How does BGP routing work on the internet?', description: 'Explain Border Gateway Protocol: AS path, route selection attributes, iBGP vs eBGP, route propagation, and how BGP failures can cascade across the internet.', tags: 'networking,routing,bgp,protocols,cisco', company: 'Cisco', user_id: 1, views: 2345, status: 'verified' },
    { title: 'Design a network load balancer', description: 'Design a Layer 4 and Layer 7 load balancer. Discuss algorithms (round-robin, least connections, IP hash), health checks, session persistence, and DDoS protection.', tags: 'system-design,networking,load-balancing,cisco', company: 'Cisco', user_id: 2, views: 1234, status: 'verified' },
    { title: 'Explain TCP congestion control algorithms', description: 'Compare TCP congestion control algorithms: Reno, Cubic, BBR. How do they handle packet loss, bandwidth estimation, and fairness across multiple flows?', tags: 'networking,tcp,congestion-control,protocols,cisco', company: 'Cisco', user_id: 5, views: 987, status: 'verified' },
    { title: 'How do you ensure quality in a large-scale digital transformation?', description: 'Discuss strategies for quality assurance in enterprise digital transformation: test automation, continuous integration, shift-left testing, and measuring outcomes.', tags: 'quality-assurance,digital-transformation,enterprise,accenture', company: 'Accenture', user_id: 3, views: 654, status: 'verified' },
    { title: 'Design a cloud migration strategy for a legacy system', description: 'How would you plan migrating a monolithic legacy application to the cloud? Discuss rehost, replatform, refactor strategies, risk mitigation, and phased rollout.', tags: 'cloud,migration,strategy,enterprise,accenture', company: 'Accenture', user_id: 4, views: 876, status: 'community_verified' },
    { title: 'Explain Agile vs Waterfall in enterprise delivery', description: 'Compare Agile and Waterfall methodologies for large enterprise projects. When would you choose one over the other? Discuss hybrid approaches.', tags: 'agile,project-management,methodology,accenture', company: 'Accenture', user_id: 1, views: 543, status: 'verified' },
    { title: 'How do you handle database migration in production?', description: 'Discuss strategies for zero-downtime database migrations: blue-green deployment, schema versioning, backward-compatible changes, and rollback procedures.', tags: 'database,migration,devops,production,tcs', company: 'TCS', user_id: 2, views: 987, status: 'verified' },
    { title: 'What is the difference between REST and SOAP APIs?', description: 'Compare REST and SOAP web services in terms of protocol, data format, statefulness, security, and performance. When would you use each in enterprise integration?', tags: 'api,rest,soap,webservices,tcs', company: 'TCS', user_id: 3, views: 1234, status: 'verified' },
    { title: 'Explain the Software Development Life Cycle phases', description: 'Walk through SDLC phases: requirements, analysis, design, implementation, testing, deployment, and maintenance. How does each phase contribute to project success?', tags: 'sdlc,software-engineering,methodology,tcs', company: 'TCS', user_id: 4, views: 456, status: 'verified' },
    { title: 'What are microservices and when should you use them?', description: 'Explain microservices architecture, its benefits (scalability, independent deployment) and challenges (distributed complexity, data consistency). Compare with monolithic architecture.', tags: 'architecture,microservices,design-patterns,infosys', company: 'Infosys', user_id: 5, views: 1567, status: 'verified' },
    { title: 'Design a RESTful API for an e-commerce platform', description: 'Design RESTful APIs for an e-commerce platform covering products, cart, orders, payments, and user management. Discuss resource naming, status codes, pagination, and versioning.', tags: 'api,rest,ecommerce,design,infosys', company: 'Infosys', user_id: 1, views: 1234, status: 'verified' },
    { title: 'How does OOP help in writing maintainable code?', description: 'Explain the four pillars of Object-Oriented Programming: encapsulation, inheritance, polymorphism, and abstraction. Provide real-world examples from enterprise applications.', tags: 'oop,programming-paradigms,software-design,infosys', company: 'Infosys', user_id: 2, views: 890, status: 'verified' },
    { title: 'What are the key components of a DevOps pipeline?', description: 'Explain a complete CI/CD pipeline: version control, automated builds, unit tests, integration tests, artifact repository, deployment automation, and monitoring.', tags: 'devops,ci-cd,automation,deployment,wipro', company: 'Wipro', user_id: 3, views: 765, status: 'verified' },
    { title: 'Design a monitoring dashboard for production systems', description: 'Design a comprehensive monitoring dashboard covering application metrics, infrastructure health, business KPIs, alerting rules, and incident response workflows.', tags: 'monitoring,observability,dashboard,devops,wipro', company: 'Wipro', user_id: 4, views: 543, status: 'community_verified' },
    { title: 'Explain Docker and containerization benefits', description: 'What is Docker and how do containers differ from virtual machines? Discuss image layers, container orchestration with Kubernetes, and benefits for development workflows.', tags: 'docker,containers,devops,cloud,wipro', company: 'Wipro', user_id: 5, views: 1234, status: 'verified' },
    { title: 'How would you design a data warehouse for analytics?', description: 'Design a data warehouse using star schema or snowflake schema. Discuss ETL pipelines, data modeling, partitioning strategies, and query optimization for BI tools.', tags: 'data-warehouse,etl,analytics,database,cognizant', company: 'Cognizant', user_id: 1, views: 876, status: 'verified' },
    { title: 'Explain normalization and denormalization in databases', description: 'Explain 1NF, 2NF, 3NF normalization forms with examples. When would you denormalize for performance? Discuss trade-offs in data warehouse vs OLTP design.', tags: 'database,normalization,data-modeling,cognizant', company: 'Cognizant', user_id: 2, views: 987, status: 'verified' },
    { title: 'What is the difference between SQL and NoSQL databases?', description: 'Compare relational databases with NoSQL types (document, key-value, column-family, graph). When would you choose each for different application requirements?', tags: 'database,sql,nosql,data-stores,cognizant', company: 'Cognizant', user_id: 3, views: 1345, status: 'verified' },
    { title: 'Design a customer support ticketing system', description: 'Design a ticketing system like Zoho Desk with ticket creation, assignment, escalation, SLA management, and multi-channel support (email, chat, phone).', tags: 'system-design,crm,saas,ticketing,zoho', company: 'Zoho', user_id: 4, views: 654, status: 'verified' },
    { title: 'How to build a spreadsheet application from scratch?', description: 'Design a web-based spreadsheet application. Discuss data model (sparse matrix), formula parsing, dependency graph for recalculation, and rendering optimization.', tags: 'system-design,spreadsheet,web-app,zoho', company: 'Zoho', user_id: 5, views: 543, status: 'verified' },
    { title: 'Design a cloud-based HRMS system', description: 'Design a Human Resource Management System with employee records, attendance, leave management, payroll, and performance review modules.', tags: 'system-design,hrms,saas,enterprise,zoho', company: 'Zoho', user_id: 1, views: 432, status: 'community_verified' },
    { title: 'Design a multi-channel customer communication platform', description: 'Design a customer engagement platform supporting email, chat, phone, social media, and messaging apps in a unified inbox.', tags: 'system-design,communication,saas,customer-support,freshworks', company: 'Freshworks', user_id: 2, views: 567, status: 'verified' },
    { title: 'How to design an AI-powered support chatbot?', description: 'Design a chatbot that handles customer queries using NLP. Discuss intent classification, entity extraction, dialog management, knowledge base integration, and escalation to humans.', tags: 'ai,chatbot,nlp,customer-service,freshworks', company: 'Freshworks', user_id: 3, views: 876, status: 'verified' },
    { title: 'Design a helpdesk analytics dashboard', description: 'Design an analytics dashboard that shows ticket trends, agent performance, customer satisfaction scores, and SLA compliance with drill-down capabilities.', tags: 'analytics,dashboard,reporting,saas,freshworks', company: 'Freshworks', user_id: 4, views: 345, status: 'community_verified' },
    { title: 'Tell me about yourself - how to structure your answer?', description: 'How to craft a compelling self-introduction for interviews? Structure: present role, past experience, relevant skills, and why you are interested in this opportunity.', tags: 'behavioral,hr,interview-tips,general', company: '', user_id: 5, views: 5678, status: 'verified' },
    { title: 'What are your strengths and weaknesses?', description: 'How to answer the strengths and weaknesses question honestly and effectively. Choose relevant strengths and show self-awareness with weaknesses you are actively improving.', tags: 'behavioral,hr,interview-tips,general', company: '', user_id: 1, views: 4567, status: 'verified' },
    { title: 'Explain a complex technical concept to a non-technical person', description: 'How do you explain cloud computing to someone without a technical background? Use analogies like renting vs owning a house to explain the concept effectively.', tags: 'behavioral,communication,soft-skills,general', company: '', user_id: 2, views: 3456, status: 'verified' },
    { title: 'Describe a time you had to work under tight deadlines', description: 'Behavioral question requiring STAR format. Describe a specific situation where you delivered quality work under pressure, how you prioritized, and what the outcome was.', tags: 'behavioral,deadline,time-management,general', company: '', user_id: 3, views: 2345, status: 'verified' },
    { title: 'Why do you want to work at this company?', description: 'How to research a company and craft a genuine answer. Discuss company mission, products, engineering challenges, culture, and growth opportunities.', tags: 'behavioral,hr,interview-tips,general', company: '', user_id: 4, views: 3456, status: 'verified' },
    { title: 'What is your approach to debugging a complex issue?', description: 'Describe your systematic approach: reproduce the issue, isolate variables, check logs, use debugging tools, write tests, identify root cause, and implement fix with proper testing.', tags: 'debugging,troubleshooting,problem-solving,general', company: '', user_id: 5, views: 2890, status: 'verified' },
    { title: 'How do you stay updated with new technologies?', description: 'Share your learning strategy: following engineering blogs, contributing to open source, attending conferences, online courses, building side projects, and participating in tech communities.', tags: 'learning,professional-development,career,general', company: '', user_id: 1, views: 2123, status: 'verified' },
    { title: 'Tell me about a project you are most proud of', description: 'Describe a significant project: the problem it solved, your role, technical challenges overcome, impact on users/business, and what you learned from the experience.', tags: 'behavioral,project,portfolio,general', company: '', user_id: 2, views: 1987, status: 'verified' },
  ];

  let qCount = 0;
  for (const q of questions) {
    const difficulty = q.difficulty || (
      q.tags.includes('algorithm') || q.tags.includes('system-design') ? 'hard' :
      q.tags.includes('behavioral') || q.tags.includes('hr') ? 'easy' : 'medium'
    );
    const result = await run(
      'INSERT INTO questions (title, description, tags, company, status, difficulty, user_id, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [q.title, q.description, q.tags, q.company, q.status, difficulty, q.user_id, q.views]
    );
    if (result.changes > 0) qCount++;
  }

  const answersData = [
    { content: 'A URL shortener maps long URLs to short codes. Key components: (1) Hash function to generate unique short codes (Base62 encoding of auto-increment ID or using MD5/CRC32). (2) Database table mapping short_code to original URL. (3) Redirect handler that looks up the code and returns 302 redirect. For scale, use a distributed ID generator, cache frequently accessed URLs in Redis, and partition the database by short_code hash.', question_id: 1, user_id: 3 },
    { content: 'For the sliding window approach, maintain two pointers (left, right) and a Set or Map tracking characters in the current window. Expand right pointer, if duplicate found, move left pointer until duplicate is removed. Time: O(n), Space: O(min(m, n)) where m is charset size.', question_id: 3, user_id: 1 },
    { content: 'LRU Cache using HashMap + Doubly Linked List: HashMap provides O(1) lookup, DLL allows O(1) add/remove. On get(), move node to head. On put(), if at capacity, remove tail node then add new node at head. For thread safety, use ReadWriteLock or ConcurrentHashMap with synchronized list operations.', question_id: 5, user_id: 4 },
    { content: 'Iterative: maintain prev, current, next pointers. Set current.next = prev, shift all pointers right. Recursive: base case - null or single node. Recurse on current.next, then set current.next.next = current and current.next = null. Both are O(n) time. Iterative uses O(1) space, recursive uses O(n) stack space.', question_id: 11, user_id: 1 },
    { content: 'A process is an independent execution unit with its own memory space. Threads are lighter-weight units within a process that share memory. Context switching between threads is cheaper. Use processes for isolation (security), threads for performance (shared data). Windows uses fibers, Linux uses tasks.', question_id: 10, user_id: 2 },
    { content: 'For Two Sum, use a HashMap to store complement values. Iterate through array once: for each num, check if target - num exists in map. If yes, return indices. Time: O(n), Space: O(n). For sorted arrays, use two pointers from both ends instead.', question_id: 18, user_id: 3 },
    { content: 'STAR method: Situation, Task, Action, Result. Example: S - I disagreed with my manager on the database migration approach. T - We needed to migrate 50TB of data with zero downtime. A - I gathered performance benchmarks for both approaches, presented data showing my proposed incremental migration would be safer. R - We adopted my approach with a phased rollout, completed migration with zero incidents, and saved 40% in cloud costs.', question_id: 20, user_id: 5 },
    { content: 'For News Feed ranking: (1) Gather candidate stories from friends and pages. (2) Rank using signals like affinity score, content type weight, recency, and engagement predictions. (3) Apply business rules and diversity constraints. (4) Serve ranked feed via pull-based API. For real-time updates, maintain a fanout-on-write model for active users and fanout-on-read for inactive users.', question_id: 23, user_id: 1 },
    { content: 'Structure your answer in 3 parts: (1) Present - briefly describe your current role and key responsibilities. (2) Past - highlight 2-3 relevant experiences or achievements from previous roles. (3) Future - explain why you are interested in this role and how your skills align. Keep it to 60-90 seconds. Practice but sound natural.', question_id: 79, user_id: 2 },
    { content: 'Choose genuine weaknesses that are not core to the job. Show self-awareness and describe specific steps you are taking to improve. For strengths, pick relevant skills and back them with concrete examples. Avoid cliché weaknesses like "I work too hard" or "I am a perfectionist."', question_id: 80, user_id: 3 },
    { content: 'Systematic debugging process: (1) Reproduce the issue consistently. (2) Check recent changes and logs. (3) Isolate the problem by eliminating variables. (4) Use debuggers, profilers, or tracing tools. (5) Write a failing test that reproduces the issue. (6) Identify root cause. (7) Implement fix. (8) Verify fix and add regression tests.', question_id: 84, user_id: 4 },
  ];

  let aCount = 0;
  for (const a of answersData) {
    const result = await run(
      'INSERT INTO answers (content, question_id, user_id) VALUES (?, ?, ?)',
      [a.content, a.question_id, a.user_id]
    );
    if (result.changes > 0) aCount++;
  }

  const votesData = [
    { answer_id: 1, user_id: 1, vote_type: 'upvote' },
    { answer_id: 1, user_id: 2, vote_type: 'upvote' },
    { answer_id: 1, user_id: 4, vote_type: 'upvote' },
    { answer_id: 2, user_id: 2, vote_type: 'upvote' },
    { answer_id: 2, user_id: 3, vote_type: 'upvote' },
    { answer_id: 3, user_id: 1, vote_type: 'upvote' },
    { answer_id: 3, user_id: 5, vote_type: 'upvote' },
    { answer_id: 4, user_id: 3, vote_type: 'upvote' },
    { answer_id: 4, user_id: 4, vote_type: 'upvote' },
    { answer_id: 5, user_id: 1, vote_type: 'upvote' },
    { answer_id: 5, user_id: 2, vote_type: 'downvote' },
    { answer_id: 6, user_id: 3, vote_type: 'upvote' },
    { answer_id: 7, user_id: 1, vote_type: 'upvote' },
    { answer_id: 7, user_id: 4, vote_type: 'upvote' },
    { answer_id: 8, user_id: 2, vote_type: 'upvote' },
    { answer_id: 9, user_id: 5, vote_type: 'upvote' },
    { answer_id: 10, user_id: 3, vote_type: 'upvote' },
    { answer_id: 11, user_id: 1, vote_type: 'upvote' },
    { answer_id: 11, user_id: 2, vote_type: 'upvote' },
    { answer_id: 12, user_id: 4, vote_type: 'upvote' },
    { answer_id: 13, user_id: 1, vote_type: 'upvote' },
    { answer_id: 14, user_id: 5, vote_type: 'upvote' },
    { answer_id: 15, user_id: 2, vote_type: 'upvote' },
    { answer_id: 15, user_id: 3, vote_type: 'upvote' },
    { answer_id: 16, user_id: 1, vote_type: 'upvote' },
    { answer_id: 16, user_id: 4, vote_type: 'upvote' },
    { answer_id: 17, user_id: 5, vote_type: 'upvote' },
  ];

  let vCount = 0;
  for (const v of votesData) {
    try {
      const result = await run(
        'INSERT OR IGNORE INTO votes (answer_id, user_id, vote_type) VALUES (?, ?, ?)',
        [v.answer_id, v.user_id, v.vote_type]
      );
      if (result.changes > 0) vCount++;
    } catch { /* ignore */ }
  }

  console.log(`Seed completed: ${users.length} users, ${qCount} questions, ${aCount} answers, ${vCount} votes`);
}

if (require.main === module) {
  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, 'echo.db');
  const db = new sqlite3.Database(dbPath);
  seed(db).then(() => process.exit(0)).catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = seed;
