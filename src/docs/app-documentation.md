# Constance Application Documentation

Current Version: v0.4.6

## Version History

- v0.4.6: Added Entity analysis page.
- v0.4.55: Added more detailed commenting throughout the codebase.
- v0.4.5: Implemented shadcn/ui components across all major pages. Overhauled Records, Agency Records, and Intake pages.
- v0.4.4: Fixed issue with TypeScript error with AgencyRecordsTable.tsx causing build failure. Fixed issue with calendar component.
- v0.4.3: Overhauled Agency Records page. Fixed multiple build/deployment issues with components. Fixed upload intake area.
- v0.4.23: Fixed TypeScript error with AgencyRecordsTable.tsx causing build failure. Fixed issue with calendar component.
- v0.4.1: Styling and layout overhaul to shadcn/ui. Updated login component. Fixed issue with org records appearing in public records page.
- v0.4.0: Installed shadcn/ui. Added dark mode toggle. Fixed header navigation menu.
- v0.3.7: Further updated session handling. Login button should now redirect immediately.
- v0.3.6: Updated session handling to attempt to get the Login, Logout buttons to redirect immediately. Added Global and Agency buttons to view records on dashboard.
- v0.3.5: Rearranged layout of Dashboard page and added the user's organization to the subtitle. Fixed an issue with the actions page.
- v0.3.4: Added documentation page.
- v0.3.3: Fixed runtime error on Public Records page. Fixed issue with build and deployment related to middleware and supabase.
- v0.3.0: Added agency records page, added PDF viewer, added more detailed filtering options.
- v0.2.51: Changed the deployment settings to work better with Digital Ocean.
- v0.2.5: Added insert ability to actions page. 213 filter capabilities to actions page.
- v0.2.41: Removed all Mobile-specific styling and RWD as it was causing issues.
- v0.2.4: Added the Actions page and some functionality.
- v0.2.3: Added advanced record creation, changed landing page for Constance-specific, added dashboard links with updated styling/layout, added Constance logo to loading screen.

## Application Structure

### Core Configuration

- **next.config.js**: Configuration for Next.js, including MDX support, bundle analysis, and standalone output
- **postcss.config.js**: PostCSS configuration for Tailwind CSS
- **server.js**: Custom server implementation for production deployment

### Authentication & Middleware

The application uses Supabase for authentication, implemented through:

- **src/middleware.ts**: Handles authentication routes and protected pages
- **src/utils/supabase.ts**: Supabase client utilities for browser, server, and middleware contexts

### Pages Structure

#### 1. Landing Page (`src/app/page.tsx`)
- Simple welcome page with login/signup options
- Features Constance logo and navigation buttons

#### 2. Authentication Pages
- **Login** (`src/app/login/page.tsx`): Handles user login
- **Signup** (`src/app/signup/page.tsx`): User registration
- **Logout** (`src/app/logout/page.tsx`): Confirmation page after logout

#### 3. Dashboard (`src/app/dashboard/page.tsx`)
Protected page featuring:
- Quick access tiles to main functionalities
- Navigation to Records, Search, Actions, and Upload features
- Integration with user authentication state

#### 4. Records Management

##### Public Records (`src/app/records/page.tsx`)
- Redesigned with shadcn/ui components
- Features enhanced filtering capabilities with multi-select dropdowns
- Improved table layout with sorting and pagination

Components:
- **RecordsContent**: Main content container using shadcn/ui Card
- **DataTable**: New shadcn/ui table component with built-in sorting and filtering
- **FilterDropdowns**: Enhanced filters using shadcn/ui Select and MultiSelect

##### Agency Records (`src/app/records/agencyrecords/page.tsx`)
- Completely overhauled with shadcn/ui components
- Enhanced document preview capabilities
- Improved metadata display

Components:
- **AgencyRecordsDataTable**: New shadcn/ui table implementation
- **DocumentPreview**: Enhanced PDF viewer with shadcn/ui Dialog
- **MetadataDisplay**: New metadata panel using shadcn/ui Accordion

#### 5. Upload System

##### Intake System (`src/app/upload/page.tsx`)
- Redesigned upload interface using shadcn/ui components
- Improved drag-and-drop functionality
- Progress tracking with shadcn/ui Progress component

Components:
- **FileUploadZone**: Enhanced upload area with visual feedback
- **UploadProgress**: New progress tracking interface
- **FileList**: Improved file list display using shadcn/ui components

#### 6. Actions Management (`src/app/actions/page.tsx`)
- Task and action management interface

Components:
- **ActionsProvider**: State management for actions
- **ActionsTable**: Display and interaction with actions
- **ActionFilters**: Filtering interface
- **ActionForm**: Creation/editing form

#### 7. Search Interface (`src/app/search/page.tsx`)
- Document search functionality
- Integration with Typesense for search capabilities

Components:
- **SearchInterface**: Main search interface
- **PDF viewer modal** for results:
  - Lightbox-style modal display for viewing PDFs
  - Triggered by clicking on search results
  - Full-screen viewing capability
  - Built-in PDF controls including:
    - Zoom in/out
    - Page navigation
    - Document download option
  - Responsive design that works across devices
  - Keyboard shortcuts for navigation (Esc to close, arrow keys for pages)

#### 8. Analytics Pages (`src/app/analytics/page.tsx`)
- Entity analysis and visualization interface
- Interactive timeline visualization using Recharts
- Real-time entity search capabilities

Components:
- **EntitySearch**: Real-time entity search with debounced input
  - Uses shadcn/ui Command component for search interface
  - Autocomplete suggestions with agency names
  - Debounced search with 300ms delay
  - Error handling for failed searches

- **TimelineChart**: Interactive scatter plot showing entity occurrences over time
  - Built with Recharts ScatterChart
  - Color-coded entities with persistent color assignments
  - Custom tooltip showing detailed record information
  - Automatic date formatting on X-axis
  - Responsive container adapting to viewport size
  - Legend for multiple entity tracking

Features:
- Multi-entity selection and comparison
- Color-coded entity visualization using a predefined palette
- Document occurrence tracking with record IDs
- Interactive timeline navigation
- Real-time search suggestions from agency database
- Error handling and validation using Zod
- Responsive visualization using Recharts

API Routes:
- **/api/entity-analytics/search**: Entity search endpoint
  - Handles agency name searches with partial matching
  - Returns up to 10 matching results
  - Input validation with Zod schema

- **/api/entity-analytics/timeline**: Timeline data retrieval endpoint
  - Accepts multiple entity parameters
  - Returns chronological record occurrences
  - Includes record metadata (ID, date, entity name)
  - Supports filtering by agency IDs

### Shared Components

#### Layout Components
- **Header** (`src/components/Header.tsx`): Navigation and user context
- **Footer** (`src/components/Footer.tsx`): Version information and credits

#### UI Components
- **ViewPDFButton**: PDF viewing functionality, specifically used in the Agency Records page for viewing uploaded documents
- **ViewRecordButton**: Record viewing interface, specifically used in the Public Records page for viewing record details
- Various filter components for different sections

### State Management
- Uses React Context through SupabaseProvider
- Implements client-side state management for forms and filters
- Server-side authentication state management

### Styling
- Primary UI framework: shadcn/ui
- Theme customization through tailwind.config.js
- Dark mode support using shadcn/ui's built-in theming
- Consistent component styling across the application
- Responsive design maintained through shadcn/ui's built-in responsive components

## Detailed Page Functions

#### Login Page (`src/app/login/page.tsx`)
- Redesigned with shadcn/ui components
- Enhanced error handling and validation
- Improved loading states

Components:
- **LoginForm**: New form implementation using shadcn/ui Form components
- **AuthButtons**: Styled using shadcn/ui Button
- **ErrorDisplay**: Enhanced error messaging using shadcn/ui Toast

#### Dashboard Page (`src/app/dashboard/page.tsx`) 
- Protected route requiring authentication
- Displays user-specific information and actions
- Shows recent activity and important notifications
- Quick access to key features
- Role-based content display

#### Records Page (`src/app/records/page.tsx`)
- Protected route for viewing public records
- Implements complex filtering system:
  - Filter by document type
  - Filter by agency
  - Filter by tags
- Displays both agency-specific and complete records
- Handles file downloads and previews
- Error handling for failed record fetches
- Loading states for data retrieval
- Pagination for large record sets

#### Agency Records Page (`src/app/agency-records/page.tsx`)
- Agency-specific document management
- File upload capabilities with progress tracking
- Document organization and categorization
- Preview functionality for uploaded files
- Metadata management for documents
- Access control based on user permissions

#### Actions Page (`src/app/actions/page.tsx`)
- Protected route for managing tasks and actions
- Real-time action tracking and updates
- Filtering system for actions:
  - Filter by status
  - Filter by assignee
  - Filter by priority
- Action creation and editing capabilities
- Deadline management and notifications
- Integration with user roles and permissions
- Collaborative features for team coordination

## API Structure

### Entity Analytics

#### Search Endpoint (`/api/entity-analytics/search`)
- Handles entity search queries
- Input validation using Zod schema
- Returns matching entity suggestions

#### Timeline Endpoint (`/api/entity-analytics/timeline`)
- Processes requests for entity timeline data
- Supports multiple entity parameters
- Returns occurrence data including:
  - Entity name
  - Entity type
  - Record date
  - Record ID
