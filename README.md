# CareSync Web Service

A comprehensive healthcare management system built with React, TypeScript, and modern web technologies.

## 🚀 Features

- Hospital search and management
- Appointment booking system
- User authentication and authorization
- Admin dashboard for healthcare providers
- Real-time notifications
- Responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Firebase** for authentication and real-time features

### Testing
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Cypress** for end-to-end testing

## 📁 Project Structure

```
caresync-web-service/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts
│   │   ├── lib/           # Utility functions and API
│   │   └── types/         # TypeScript type definitions
│   ├── cypress/           # E2E tests
│   └── public/            # Static assets
└── .github/workflows/     # GitHub Actions CI/CD
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd caresync-web-service
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

### Unit Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npm run cypress:open  # Opens Cypress UI
# or
npm run cypress:run   # Runs tests headlessly
```

### Linting
```bash
cd frontend
npm run lint
```

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The pipeline includes:

### Automated Tests
- **Unit Tests**: Jest tests run on Node.js 18.x and 20.x
- **E2E Tests**: Cypress tests run in Chrome browser
- **Linting**: ESLint checks for code quality
- **Build Verification**: Ensures the project builds successfully

### Branch Protection
- Tests must pass before merging to `main` or `develop`
- Pull requests require at least one approval
- Force pushes and deletions are disabled on protected branches

### Workflow Triggers
- **Push**: Runs on pushes to `main` and `develop` branches
- **Pull Request**: Runs on all PRs targeting `main` and `develop`

### Artifacts
- Test coverage reports are uploaded to Codecov
- Cypress screenshots and videos are saved on test failures
- Build artifacts are available for deployment

## 📊 Test Coverage

The CI pipeline generates test coverage reports that are automatically uploaded to Codecov. You can view coverage metrics in:
- GitHub Actions workflow summary
- Codecov dashboard (if configured)

## 🔧 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests for new functionality
   - Ensure all tests pass locally

3. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **CI checks will run automatically**
   - Unit tests
   - E2E tests
   - Linting
   - Build verification

5. **Merge after approval**
   - All checks must pass
   - At least one review approval required

## 🚀 Deployment

### Development
```bash
cd frontend
npm run build:dev
```

### Production
```bash
cd frontend
npm run build
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please open an issue in the GitHub repository. 