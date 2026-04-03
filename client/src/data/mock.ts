export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  bio: string;
  connections: number;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  upvotes: number;
  answers: number;
  views: number;
  timeAgo: string;
}

export interface Team {
  id: string;
  name: string;
  event: string;
  lookingFor: string[];
  members: User[];
  status: 'recruiting' | 'full';
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Rivera",
    avatar: "https://i.pravatar.cc/150?u=1",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    bio: "Building fast, beautiful web experiences. Looking for ML folks for the upcoming HackNC.",
    connections: 142
  },
  {
    id: "2",
    name: "Samantha Lee",
    avatar: "https://i.pravatar.cc/150?u=2",
    role: "ML Engineer",
    skills: ["Python", "TensorFlow", "PyTorch", "AWS"],
    bio: "Data enthusiast. I make computers see things. Open for collaboration on AI projects.",
    connections: 89
  },
  {
    id: "3",
    name: "Jordan Smith",
    avatar: "https://i.pravatar.cc/150?u=3",
    role: "UI/UX Designer",
    skills: ["Figma", "Framer", "React", "CSS"],
    bio: "Pixel perfect designs wrapper in buttery smooth animations.",
    connections: 215
  },
  {
    id: "4",
    name: "Priya Patel",
    avatar: "https://i.pravatar.cc/150?u=4",
    role: "Mobile Dev",
    skills: ["Flutter", "Dart", "Firebase", "Swift"],
    bio: "Cross-platform magic. Currently building a campus map app.",
    connections: 67
  }
];

export const mockQuestions: Question[] = [
  {
    id: "q1",
    title: "How to handle JWT token expiration in React smoothly?",
    content: "I'm building my first full-stack app and the user gets logged out abruptly when the token expires. What is the standard way to handle silent refreshes?",
    author: mockUsers[0],
    tags: ["React", "Authentication", "Security"],
    upvotes: 42,
    answers: 5,
    views: 312,
    timeAgo: "2h ago"
  },
  {
    id: "q2",
    title: "Best architecture for a real-time chat app using Firebase?",
    content: "Should I structure my Firestore collections by /chats/{chatId}/messages or /users/{userId}/chats?",
    author: mockUsers[3],
    tags: ["Firebase", "Database", "Architecture"],
    upvotes: 28,
    answers: 3,
    views: 156,
    timeAgo: "5h ago"
  },
  {
    id: "q3",
    title: "Framer Motion layout animations causing flickering",
    content: "When using layoutId across different components, the exit animation sometimes flickers. Any tips?",
    author: mockUsers[2],
    tags: ["React", "Animation", "Framer Motion"],
    upvotes: 115,
    answers: 12,
    views: 890,
    timeAgo: "1d ago"
  }
];

export const mockTeams: Team[] = [
  {
    id: "t1",
    name: "Byte Me",
    event: "Campus Hackathon 2026",
    lookingFor: ["UI/UX Designer", "Backend Developer"],
    members: [mockUsers[0], mockUsers[3]],
    status: 'recruiting'
  },
  {
    id: "t2",
    name: "Visionaries",
    event: "AI Innovation Challenge",
    lookingFor: ["React Developer"],
    members: [mockUsers[1], mockUsers[2]],
    status: 'recruiting'
  }
];

export const ALL_SKILLS = [
  "React", "Vue", "Angular", "Next.js", "TypeScript", "JavaScript", 
  "Python", "Java", "C++", "C#", "Go", "Rust", 
  "Node.js", "Express", "Django", "Spring Boot",
  "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes",
  "Figma", "Framer", "UI/UX", "Tailwind CSS",
  "Flutter", "React Native", "Swift", "Kotlin",
  "Machine Learning", "TensorFlow", "PyTorch",
  "Blockchain", "Web3", "Solidity"
];
