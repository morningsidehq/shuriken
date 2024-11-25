# Constance Application Documentation

Current Version: v0.4.23

## Version History

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
- Displays all accessible records
- Features filtering capabilities

Components:
- **RecordsContent**: Main content container
- **RecordsTable**: Displays filtered records
- **RecordsFilters**: Filtering interface

##### Agency Records (`src/app/records/agencyrecords/page.tsx`)
- Agency-specific record viewing

Components:
- **AgencyRecordsContent**: Main content container
- **AgencyRecordsTable**: Agency-specific record display
- **ObjectList**: Record list management

#### 5. Upload System

##### Quick Upload (`src/app/upload/page.tsx`)
- Simple document upload interface

Components:
- **FileUploader**: Handles file selection and upload
- **FileInput**: Basic file input component

##### Advanced Record Creation (`src/app/upload/adv_record_creation/page.tsx`)
- Detailed record creation interface

Components:
- **AdvancedRecordForm**: Complex form for detailed record creation
- **FileUploader**: Reused for file handling

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
- Tailwind CSS for primary styling
- Custom CSS modules for specific components
- Responsive design considerations
- Dark theme support

## Detailed Page Functions

#### Login Page (`src/app/login/page.tsx`)
- Handles user authentication through Supabase Auth
- Provides email/password login form
- Implements "magic link" authentication option
- Redirects authenticated users to dashboard
- Error handling for invalid credentials
- Loading states during authentication
- Session persistence using cookies

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
