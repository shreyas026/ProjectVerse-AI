# ProjectVerse AI - Folder Structure

## Root Structure (For GitHub)
```
projectverse-ai/                          # Root repository
├── .github/
│   └── workflows/                        # CI/CD pipelines
│       ├── frontend.yml
│       └── backend.yml
├── frontend/                             # React Web App
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
├── backend/                              # Node.js API Server
│   ├── src/
│   ├── ml-service/                       # Python ML Microservice
│   ├── tests/
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── mobile/                               # Flutter Mobile App
│   ├── android/
│   ├── ios/
│   ├── lib/
│   ├── pubspec.yaml
│   └── README.md
├── architecture/                         # Architecture Documents
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Frontend Structure
```
frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── manifest.json
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # Root component
│   ├── index.css                         # Global styles
│   ├── config/
│   │   ├── api.config.ts                 # API URLs, endpoints
│   │   ├── theme.config.ts               # Dark/Light theme
│   │   └── constants.ts                  # App constants
│   ├── context/
│   │   ├── AuthContext.tsx               # Authentication state
│   │   ├── ThemeContext.tsx              # Dark/Light mode
│   │   └── SocketContext.tsx             # WebSocket connection
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useTheme.ts
│   │   └── useMediaQuery.ts
│   ├── layouts/
│   │   ├── MainLayout.tsx                # Dashboard layout with sidebar
│   │   ├── AuthLayout.tsx                # Login/Register layout
│   │   └── AdminLayout.tsx               # Admin panel layout
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── CodeBlock.tsx
│   │   ├── navigation/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── BottomNav.tsx             # Mobile bottom nav
│   │   │   └── Breadcrumbs.tsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── calls/
│   │   │   ├── CallInterface.tsx
│   │   │   ├── IncomingCallModal.tsx
│   │   │   └── VideoGrid.tsx
│   │   ├── ai/
│   │   │   ├── AIChatInterface.tsx
│   │   │   ├── AIResponseCard.tsx
│   │   │   ├── RoadmapDisplay.tsx
│   │   │   ├── ArchitectureDiagram.tsx
│   │   │   ├── CodeReviewResult.tsx
│   │   │   └── LoadingDots.tsx
│   │   ├── coding/
│   │   │   ├── CodeEditor.tsx            # Monaco Editor
│   │   │   ├── ProblemStatement.tsx
│   │   │   ├── TestCaseResults.tsx
│   │   │   ├── LeaderboardTable.tsx
│   │   │   └── DifficultyBadge.tsx
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── SkillBadge.tsx
│   │   │   ├── AchievementBadge.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── CertificationCard.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── project/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   ├── ProjectFilters.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   └── TeamSection.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventCalendar.tsx
│   │   │   ├── EventRegistration.tsx
│   │   │   └── EventFilters.tsx
│   │   └── workspace/
│   │       ├── TaskBoard.tsx             # Kanban board
│   │       ├── TaskCard.tsx
│   │       ├── NoteEditor.tsx
│   │       ├── FileManager.tsx
│   │       └── ProgressTracker.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── VerifyEmailPage.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx         # Main dashboard
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── LeaderboardPage.tsx
│   │   ├── profile/
│   │   │   ├── MyProfilePage.tsx
│   │   │   ├── EditProfilePage.tsx
│   │   │   └── PublicProfilePage.tsx
│   │   ├── projects/
│   │   │   ├── ProjectsListPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── CreateProjectPage.tsx
│   │   │   └── MyProjectsPage.tsx
│   │   ├── teams/
│   │   │   ├── TeamsListPage.tsx
│   │   │   ├── TeamDetailPage.tsx
│   │   │   ├── CreateTeamPage.tsx
│   │   │   └── MyTeamsPage.tsx
│   │   ├── events/
│   │   │   ├── EventsListPage.tsx
│   │   │   ├── EventDetailPage.tsx
│   │   │   ├── CreateEventPage.tsx
│   │   │   └── MyEventsPage.tsx
│   │   ├── messaging/
│   │   │   ├── MessagesPage.tsx          # Main messaging hub
│   │   │   └── VideoCallPage.tsx
│   │   ├── ai/
│   │   │   ├── AIMentorPage.tsx          # AI Mentor chat
│   │   │   ├── AICoFounderPage.tsx       # AI Co-Founder
│   │   │   └── AIChatbotPage.tsx         # AI Chatbot
│   │   ├── coding/
│   │   │   ├── CodingArenaPage.tsx       # Coding dashboard
│   │   │   ├── ChallengePage.tsx         # Solve challenge
│   │   │   ├── ContestPage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   └── SubmissionsPage.tsx
│   │   ├── workspace/
│   │   │   └── WorkspacePage.tsx         # Project workspace (Trello + Notion)
│   │   ├── company/
│   │   │   ├── CompaniesListPage.tsx
│   │   │   ├── CompanyDetailPage.tsx
│   │   │   ├── JobPostingsPage.tsx
│   │   │   └── CompanyDashboardPage.tsx
│   │   ├── faculty/
│   │   │   ├── FacultyListPage.tsx
│   │   │   ├── ResearchHubPage.tsx
│   │   │   └── MentorshipPage.tsx
│   │   ├── alumni/
│   │   │   ├── AlumniNetworkPage.tsx
│   │   │   └── MentorshipRequestsPage.tsx
│   │   ├── startup/
│   │   │   ├── StartupHubPage.tsx
│   │   │   ├── StartupDetailPage.tsx
│   │   │   └── CreateStartupPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── UsersManagementPage.tsx
│   │       ├── ProjectsManagementPage.tsx
│   │       ├── EventsManagementPage.tsx
│   │       └── AnalyticsPage.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts                 # Axios instance
│   │   │   ├── auth.api.ts
│   │   │   ├── user.api.ts
│   │   │   ├── project.api.ts
│   │   │   ├── team.api.ts
│   │   │   ├── event.api.ts
│   │   │   ├── message.api.ts
│   │   │   ├── coding.api.ts
│   │   │   ├── ai.api.ts
│   │   │   ├── company.api.ts
│   │   │   ├── job.api.ts
│   │   │   ├── research.api.ts
│   │   │   ├── startup.api.ts
│   │   │   ├── workspace.api.ts
│   │   │   ├── analytics.api.ts
│   │   │   └── upload.api.ts
│   │   └── socket/
│   │       └── socket.service.ts
│   ├── store/
│   │   ├── index.ts                      # Zustand store
│   │   ├── auth.store.ts
│   │   ├── theme.store.ts
│   │   ├── chat.store.ts
│   │   ├── project.store.ts
│   │   ├── notification.store.ts
│   │   └── workspace.store.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── project.types.ts
│   │   ├── team.types.ts
│   │   ├── event.types.ts
│   │   ├── message.types.ts
│   │   ├── coding.types.ts
│   │   ├── ai.types.ts
│   │   ├── company.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   └── utils/
│       ├── formatters.ts
│       ├── validators.ts
│       ├── encryption.ts
│       ├── dateHelpers.ts
│       ├── colorHelpers.ts
│       └── constants.ts
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
└── Dockerfile
```

## Backend Structure
```
backend/
├── src/
│   ├── server.ts                         # Entry point
│   ├── app.ts                            # Express app setup
│   ├── config/
│   │   ├── database.ts                   # MongoDB connection
│   │   ├── redis.ts                      # Redis connection
│   │   ├── cloudinary.ts                 # Cloudinary setup
│   │   ├── passport.ts                   # Auth strategies
│   │   ├── socket.ts                     # Socket.IO setup
│   │   ├── logger.ts                     # Winston logger
│   │   └── env.ts                        # Environment validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── auth.types.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── user.validation.ts
│   │   │   ├── user.model.ts
│   │   │   └── user.types.ts
│   │   ├── project/
│   │   │   ├── project.controller.ts
│   │   │   ├── project.service.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── project.validation.ts
│   │   │   ├── project.model.ts
│   │   │   └── project.types.ts
│   │   ├── team/
│   │   │   ├── team.controller.ts
│   │   │   ├── team.service.ts
│   │   │   ├── team.routes.ts
│   │   │   ├── team.validation.ts
│   │   │   ├── team.model.ts
│   │   │   └── team.types.ts
│   │   ├── event/
│   │   │   ├── event.controller.ts
│   │   │   ├── event.service.ts
│   │   │   ├── event.routes.ts
│   │   │   ├── event.validation.ts
│   │   │   ├── event.model.ts
│   │   │   └── event.types.ts
│   │   ├── message/
│   │   │   ├── message.controller.ts
│   │   │   ├── message.service.ts
│   │   │   ├── message.routes.ts
│   │   │   ├── message.socket.ts         # Socket handlers
│   │   │   ├── message.model.ts
│   │   │   └── message.types.ts
│   │   ├── call/
│   │   │   ├── call.controller.ts
│   │   │   ├── call.service.ts
│   │   │   ├── call.routes.ts
│   │   │   ├── call.socket.ts            # WebRTC signaling
│   │   │   ├── call.model.ts
│   │   │   └── call.types.ts
│   │   ├── coding/
│   │   │   ├── coding.controller.ts
│   │   │   ├── coding.service.ts
│   │   │   ├── coding.routes.ts
│   │   │   ├── coding.validation.ts
│   │   │   ├── coding.model.ts
│   │   │   ├── coding.executor.ts        # Code execution engine
│   │   │   └── coding.types.ts
│   │   ├── ai/
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.routes.ts
│   │   │   ├── mentor/
│   │   │   │   ├── mentor.service.ts
│   │   │   │   └── mentor.prompts.ts
│   │   │   ├── cofounder/
│   │   │   │   ├── cofounder.service.ts
│   │   │   │   └── cofounder.prompts.ts
│   │   │   ├── chatbot/
│   │   │   │   ├── chatbot.service.ts
│   │   │   │   └── chatbot.prompts.ts
│   │   │   ├── resume/
│   │   │   │   └── resume-generator.service.ts
│   │   │   └── portfolio/
│   │   │       └── portfolio-generator.service.ts
│   │   ├── company/
│   │   │   ├── company.controller.ts
│   │   │   ├── company.service.ts
│   │   │   ├── company.routes.ts
│   │   │   ├── company.model.ts
│   │   │   └── company.types.ts
│   │   ├── job/
│   │   │   ├── job.controller.ts
│   │   │   ├── job.service.ts
│   │   │   ├── job.routes.ts
│   │   │   ├── job.model.ts
│   │   │   └── job.types.ts
│   │   ├── research/
│   │   │   ├── research.controller.ts
│   │   │   ├── research.service.ts
│   │   │   ├── research.routes.ts
│   │   │   ├── research.model.ts
│   │   │   └── research.types.ts
│   │   ├── startup/
│   │   │   ├── startup.controller.ts
│   │   │   ├── startup.service.ts
│   │   │   ├── startup.routes.ts
│   │   │   ├── startup.model.ts
│   │   │   └── startup.types.ts
│   │   ├── workspace/
│   │   │   ├── workspace.controller.ts
│   │   │   ├── workspace.service.ts
│   │   │   ├── workspace.routes.ts
│   │   │   ├── task.model.ts
│   │   │   ├── note.model.ts
│   │   │   └── workspace.types.ts
│   │   ├── analytics/
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── analytics.routes.ts
│   │   │   └── analytics.types.ts
│   │   └── notification/
│   │       ├── notification.controller.ts
│   │       ├── notification.service.ts
│   │       ├── notification.routes.ts
│   │       ├── notification.socket.ts
│   │       ├── notification.model.ts
│   │       └── notification.types.ts
│   ├── services/
│   │   ├── ml/                           # ML Services
│   │   │   ├── originality-checker.service.ts
│   │   │   ├── team-recommendation.service.ts
│   │   │   ├── event-recommendation.service.ts
│   │   │   ├── career-recommendation.service.ts
│   │   │   ├── placement-prediction.service.ts
│   │   │   ├── code-reviewer.service.ts
│   │   │   ├── coding-opponent.service.ts
│   │   │   ├── semantic-search.service.ts
│   │   │   └── embedding.service.ts      # Generate embeddings
│   │   ├── external/
│   │   │   ├── gemini.service.ts         # Google Gemini API
│   │   │   ├── huggingface.service.ts    # Hugging Face API
│   │   │   ├── cloudinary.service.ts     # File uploads
│   │   │   └── email.service.ts          # Email sending
│   │   └── utils/
│   │       ├── encryption.ts
│   │       ├── token.ts
│   │       ├── password.ts
│   │       └── validators.ts
│   ├── middleware/
│   │   ├── auth.ts                       # JWT verification
│   │   ├── rbac.ts                       # Role-based access
│   │   ├── error.ts                      # Error handler
│   │   ├── validate.ts                   # Request validation
│   │   ├── rateLimit.ts                  # Rate limiting
│   │   ├── upload.ts                     # File upload
│   │   └── cors.ts                       # CORS setup
│   ├── types/
│   │   ├── express.d.ts                  # Express extensions
│   │   ├── common.ts                     # Shared types
│   │   └── enums.ts                      # Enum definitions
│   ├── utils/
│   │   ├── ApiError.ts                   # Custom error class
│   │   ├── ApiResponse.ts                # Response formatter
│   │   ├── catchAsync.ts                 # Async error wrapper
│   │   ├── logger.ts                     # Logger utility
│   │   └── helpers.ts                    # General helpers
│   └── templates/
│       ├── email/                        # Email templates
│       │   ├── verification.html
│       │   ├── password-reset.html
│       │   └── welcome.html
│       └── ai/                           # AI prompt templates
│           ├── mentor-prompts.txt
│           ├── cofounder-prompts.txt
│           └── chatbot-prompts.txt
├── ml-service/                           # Python ML Microservice
│   ├── app.py                            # Flask/FastAPI entry
│   ├── models/                           # Saved ML models
│   │   ├── career_rf_model.pkl
│   │   ├── career_xgb_model.pkl
│   │   ├── placement_rf_model.pkl
│   │   ├── placement_xgb_model.pkl
│   │   └── label_encoders.pkl
│   ├── training/                         # Training scripts
│   │   ├── train_career_model.py
│   │   ├── train_placement_model.py
│   │   └── prepare_dataset.py
│   ├── data/                             # Training datasets
│   │   └── student_career_data.csv
│   ├── requirements.txt
│   └── Dockerfile
├── tests/
│   ├── unit/
│   ├── integration/
│   └── setup.ts
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
├── Dockerfile
├── ecosystem.config.js                   # PM2 config
└── README.md
```

## Mobile Structure
```
mobile/
├── android/
├── ios/
├── lib/
│   ├── main.dart
│   ├── config/
│   │   ├── api_config.dart
│   │   ├── theme.dart
│   │   └── constants.dart
│   ├── models/
│   │   ├── user.dart
│   │   ├── project.dart
│   │   ├── team.dart
│   │   ├── event.dart
│   │   ├── message.dart
│   │   └── notification.dart
│   ├── services/
│   │   ├── api_service.dart
│   │   ├── auth_service.dart
│   │   ├── socket_service.dart
│   │   └── storage_service.dart
│   ├── providers/
│   │   ├── auth_provider.dart
│   │   ├── theme_provider.dart
│   │   └── chat_provider.dart
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── login_screen.dart
│   │   │   └── register_screen.dart
│   │   ├── home/
│   │   │   └── home_screen.dart
│   │   ├── profile/
│   │   │   ├── profile_screen.dart
│   │   │   └── edit_profile_screen.dart
│   │   ├── projects/
│   │   │   ├── projects_screen.dart
│   │   │   └── project_detail_screen.dart
│   │   ├── teams/
│   │   │   ├── teams_screen.dart
│   │   │   └── team_detail_screen.dart
│   │   ├── events/
│   │   │   ├── events_screen.dart
│   │   │   └── event_detail_screen.dart
│   │   ├── chat/
│   │   │   ├── conversations_screen.dart
│   │   │   └── chat_screen.dart
│   │   ├── ai/
│   │   │   ├── ai_mentor_screen.dart
│   │   │   ├── ai_cofounder_screen.dart
│   │   │   └── ai_chatbot_screen.dart
│   │   ├── coding/
│   │   │   ├── coding_arena_screen.dart
│   │   │   └── challenge_screen.dart
│   │   └── dashboard/
│   │       └── dashboard_screen.dart
│   ├── widgets/
│   │   ├── custom_button.dart
│   │   ├── custom_card.dart
│   │   ├── custom_textfield.dart
│   │   ├── loading_widget.dart
│   │   └── avatar_widget.dart
│   └── utils/
│       ├── helpers.dart
│       ├── validators.dart
│       └── formatters.dart
├── test/
├── pubspec.yaml
└── README.md
```
