# EU Projects Dashboard

A modern, interactive React dashboard for managing EU research projects with advanced visualization and filtering capabilities.

## 🚀 Live Demo

Visit the deployed application: [EU Projects Dashboard](https://corebeatdev.eu/)

## ✨ Features

### 🎯 Core Features
- **Interactive Dashboard** - Grid layout with project cards and advanced search
- **Project Management** - Detailed project pages with comprehensive information
- **Gantt Chart Timeline** - Interactive timeline with work packages, milestones, and current progress indicator
- **Geographic Visualization** - Interactive maps showing participant locations
- **Advanced Filtering** - Filter by country, coordinator, budget, duration, and team size
- **Dark/Light Mode** - Theme switching with system preference detection

### 📊 Advanced Visualizations
- **Smart Gantt Charts** - Work packages as bars, milestones as points, with intelligent overlap handling
- **Current Month Indicator** - Vertical red line showing project progress relative to start date
- **Deliverables Timeline** - Vertical timeline with progress indicators and type categorization
- **Participant Maps** - Leaflet-powered maps with country distribution
- **Milestone Grid** - Card-based layout for milestone details

### 🔧 Technical Features
- **Dynamic Project Discovery** - Automatic scanning and manifest generation for JSON files
- **Responsive Design** - Mobile-first approach with glassmorphism effects
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **Error Boundaries** - Comprehensive error handling and loading states
- **TypeScript** - Full type safety throughout the application

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite (latest)
- **UI Library**: ShadCN/UI components
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Maps**: Leaflet with OpenStreetMap
- **Icons**: Lucide React
- **Data Source**: JSON files in \`eu-data/\` folder

## 📋 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/core-innovation/eu-proj-dashboard.git
cd eu-proj-dashboard
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

4. **Open in browser**
Visit [http://localhost:5173](http://localhost:5173)

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run update-manifest  # Update project manifest
\`\`\`

## 🗂️ Project Structure

\`\`\`
eu-proj-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── ProjectCard.tsx # Project card component
│   │   ├── ProjectTimeline.tsx # Gantt chart component
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── ProjectPage.tsx # Individual project view
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── eu-data/                # Project JSON files
├── public/                 # Static assets
└── scripts/                # Build and utility scripts
\`\`\`

## 📊 Data Format

Projects are stored as JSON files in the \`eu-data/\` directory. Each project should follow this structure:

\`\`\`json
{
  "projectInfo": {
    "title": "Project Title",
    "acronym": "ACRONYM",
    "startDate": "1 January 2024",
    "endDate": "31 December 2027",
    "duration": "48 Months",
    "coordinator": { ... },
    "summary": "Project description..."
  },
  "participants": [...],
  "workPackagesWithTasks": [...],
  "deliverables": [...],
  "milestones": [...]
}
\`\`\`

## 🎨 Key Features Showcase

### Interactive Gantt Chart
- Work packages displayed as colored bars
- Milestones and reports as overlaid icons
- Smart positioning to prevent overlap
- Current month indicator based on project start date
- Hover tooltips with detailed information

### Advanced Filtering
- **Country Filter**: Multi-select dropdown with all participant countries
- **Coordinator Filter**: Filter by project coordinators
- **Duration Filter**: Ranges from <12 months to 72+ months
- **Budget Filter**: €0-5M, €5M-10M, €10M-15M, €15M-20M, €20M+
- **Team Size Filter**: Small (≤5), Medium (6-10), Large (11-15), Extra Large (16+)

### Navigation & UX
- Collapsible project sections
- Keyboard shortcuts (D key for details toggle)
- Quick navigation panels
- Breadcrumb navigation
- Loading skeletons for smooth UX

## 🔧 Development

### Adding New Projects
1. Add a new JSON file to the \`eu-data/\` directory
2. Run \`npm run update-manifest\` to update the project manifest
3. The new project will automatically appear in the dashboard

### Customizing Themes
The application uses Tailwind CSS with ShadCN/UI for theming. To customize:
1. Update \`tailwind.config.js\` for global styles
2. Modify ShadCN component styles in \`src/components/ui/\`
3. Use CSS variables for theme-aware colors

### Contributing
1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📈 Performance

- **Bundle Size**: Optimized with Vite's code splitting
- **Loading**: Skeleton screens and progressive loading
- **Responsive**: Mobile-first design with smooth animations
- **Accessibility**: WCAG 2.1 AA compliant

## 🔗 Links

- **Repository**: [GitHub](https://github.com/core-innovation/eu-proj-dashboard)
- **Issues**: [Report a bug](https://github.com/core-innovation/eu-proj-dashboard/issues)
- **Discussions**: [Community discussions](https://github.com/core-innovation/eu-proj-dashboard/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ShadCN/UI for beautiful component library
- Leaflet for mapping capabilities
- Lucide React for comprehensive icons
- React community for excellent ecosystem

---

Built with ❤️ by [Core Innovation](https://github.com/core-innovation)
