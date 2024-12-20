# Constance Application Documentation

Current Version: v0.7.7

Version Notes: Enhanced user management system with role-based interfaces and comprehensive user controls.

## Table of Contents
1. [Version History](#version-history)
2. [Core Configuration](#core-configuration)
3. [Authentication & Security](#authentication--security)
4. [Application Structure](#application-structure)
5. [API Structure](#api-structure)
6. [Component Library](#component-library)

## Version History

- v0.7:
  - v0.7.7: Enhanced user management system with role-based interfaces and comprehensive user controls.
    - Added separate interfaces for System Admins and Agency Admins
    - Implemented user confirmation workflow
    - Added user CRUD operations with role-based permissions
    - Enhanced security with group-based access control
    - Added phone number support for user profiles
  - v0.7.6: Added upload to library feature to the document generation page.
  - v0.7.51: Fixed issue with document generation form.
  - v0.7.5: Added functionality for uploading documents, including multi-file upload and drag-and-drop. Reitterated semantic search functionality.
  - v0.7.21: Cleaned up unused api routes.
  - v0.7.2: Added HTTPS route to API endpoints.
  - v0.7.1: Reduced extraneous content in dashboard and menu for enhanced user experience.
  - v0.7.0: Added Document Generation System
    - Implemented multi-tab document generation interface
    - Added support for multiple document formats (PDF, DOCX, PPTX, CSV)
    - Real-time document preview and download capabilities
    - Context-aware document generation with search integration
    - User group and date-specific document creation
    - Enhanced error handling and loading states
    - Document history tracking per generation session

- v0.6:
  - v0.6.6: Added "View Full Doc" functionality
    - Implemented surrounding text retrieval for search results
    - Added ability to view complete document context
    - Enhanced result navigation with expanded content view
    - Improved user experience with contextual document access
  - v0.6.5: Enhanced semantic search functionality
    - Improved vector search with direct content access
    - Removed storage bucket dependencies for text retrieval
    - Enhanced multi-tab search interface
    - Added real-time content preview
    - Improved error handling and loading states
    - Updated hybrid search function with better text matching
    - Added user group context for search scoping
  - v0.6.4: Enhanced document processing pipeline
    - Implemented comprehensive document processing workflow with FastAPI integration
    - Added user group and user ID tracking throughout processing pipeline
    - Enhanced error handling and status reporting
    - Key improvements:
      * Document Origin Detection:
        - Automatic detection of digital vs scanned documents
        - Optimized processing path selection based on document type
      * Processing Pipeline:
        - Queue management with job ID tracking
        - Digital document text extraction
        - Scanned document OCR processing
        - Document classification with user group context
        - Text chunking for improved analysis
        - Embeddings generation with metadata
      * API Integration:
        - Secure FastAPI endpoint connections
        - Basic authentication implementation
        - Comprehensive error handling and logging
      * User Context:
        - User group propagation throughout pipeline
        - Embeddings metadata association with user context
        - Group-based access control for processed documents
      * Status Tracking:
        - Real-time processing status updates
        - Detailed progress reporting
        - Error state handling and recovery
    - Technical Implementation:
      * Document Processing Flow:
        - Initial PDF queuing with user context
        - Origin detection (digital/scanned)
        - Text extraction (PDF-to-text or OCR)
        - Classification with user group context
        - Text chunking for analysis
        - Embeddings generation
        - Metadata association
      * API Integration Points:
        - Queue PDF endpoint
        - Origin check endpoint
        - Text extraction endpoints
        - Classification endpoint
        - Chunking endpoint
        - Embeddings generation endpoint
        - Upload endpoints
      * Error Handling:
        - Comprehensive try-catch blocks
        - Detailed error logging
        - User-friendly error messages
        - Recovery mechanisms
      * Security:
        - Basic authentication for API calls
        - User group validation
        - Access control enforcement

- v0.5:
  - v0.5.8: Fixed issue with user management page. Added New User functionality for Agency Admins. Added group confirmation for new users.
  - v0.5.7: Added user group to document processing. Added User Management interface for admin users.
  - v0.5.5: Fixed issue with cookie handling in middleware, user session handling, and semantic search.
  - v0.5.4: Enhanced semantic search functionality
    - Added multi-tab search interface for parallel searches
    - Implemented search analysis panel with bot interface
    - Added common terms highlighting and one-click search
    - Enhanced PDF viewer with lightbox modal
    - Improved document content preview and analysis
  - v0.5.1: Fixed issue with semantic search causing build failure.
  - v0.5.0: Added semantic search capabilities and AI assistant features
    - Implemented semantic search using all-mpnet-base-v2 model
    - Added document content preview in search results
    - Integrated hybrid search functionality with Supabase vector storage
    - Added similarity scoring and metadata display

- v0.4:
  - v0.4.6: Added Entity analysis page.
  - v0.4.55: Added more detailed commenting throughout the codebase.
  - v0.4.5: Implemented shadcn/ui components across all major pages. Overhauled Records, Agency Records, and Intake pages.
  - v0.4.4: Fixed issue with TypeScript error with AgencyRecordsTable.tsx causing build failure. Fixed issue with calendar component.
  - v0.4.3: Overhauled Agency Records page. Fixed multiple build/deployment issues with components. Fixed upload intake area.
  - v0.4.23: Fixed TypeScript error with AgencyRecordsTable.tsx causing build failure. Fixed issue with calendar component.
  - v0.4.1: Styling and layout overhaul to shadcn/ui. Updated login component. Fixed issue with org records appearing in public records page.
  - v0.4.0: Installed shadcn/ui. Added dark mode toggle. Fixed header navigation menu.

- v0.3:
  - v0.3.7: Further updated session handling. Login button should now redirect immediately.
  - v0.3.6: Updated session handling to attempt to get the Login, Logout buttons to redirect immediately. Added Global and Agency buttons to view records on dashboard.
  - v0.3.5: Rearranged layout of Dashboard page and added the user's organization to the subtitle. Fixed an issue with the actions page.
  - v0.3.4: Added documentation page.
  - v0.3.3: Fixed runtime error on Public Records page. Fixed issue with build and deployment related to middleware and supabase.
  - v0.3.0: Added agency records page, added PDF viewer, added more detailed filtering options.

- v0.2:
  - v0.2.51: Changed the deployment settings to work better with Digital Ocean.
  - v0.2.5: Added insert ability to actions page. 213 filter capabilities to actions page.
  - v0.2.41: Removed all Mobile-specific styling and RWD as it was causing issues.
  - v0.2.4: Added the Actions page and some functionality.
  - v0.2.3: Added advanced record creation, changed landing page for Constance-specific, added dashboard links with updated styling/layout, added Constance logo to loading screen.

## Core Configuration

### System Requirements
- Windows 11 OS recommended
- Node.js LTS version
- Supabase account and project

### Configuration Files
- **next.config.js**: Next.js configuration with MDX support and standalone output
- **postcss.config.js**: Tailwind CSS configuration
- **server.js**: Production deployment server implementation
- **tailwind.config.js**: Theme and styling configuration

## Authentication & Security

### Authentication System
- Supabase Authentication integration
- Role-based access control (RBAC)
- User group management
- Session handling and middleware protection

### Security Features
- HTTPS enforcement
- API route protection
- User group isolation
- Audit logging
- Secure file handling

## Application Structure

### Core Pages

#### 1. Authentication Flow
- **Landing** (`src/app/page.tsx`): Welcome page with Constance branding
- **Login** (`src/app/login/page.tsx`): Enhanced login with error handling
- **Signup** (`src/app/signup/page.tsx`): User registration with group assignment
- **Logout** (`src/app/logout/page.tsx`): Session termination

#### 2. Dashboard (`src/app/dashboard/page.tsx`)
- Role-based dashboard views
- Quick access tiles
- Recent activity display
- Notification center
- Admin-specific features

#### 3. Document Management

##### Records System
- **Public Records** (`src/app/records/page.tsx`)
  - Enhanced filtering system
  - Sorting and pagination
  - Document preview
  - Download capabilities

- **Agency Records** (`src/app/records/agencyrecords/page.tsx`)
  - Agency-specific document management
  - Advanced metadata handling
  - Document preview and download
  - Access control integration

##### Document Processing
- **Upload System** (`src/app/upload/page.tsx`)
  - Multi-file upload support
  - Drag-and-drop interface
  - Progress tracking
  - Metadata extraction
  - File validation

- **Document Generation** (`src/app/assistant/create/page.tsx`)
  - Multi-format document creation
  - Template-based generation
  - Real-time preview
  - Context-aware content
  - Version tracking

#### 4. Search & Analysis

##### Search Systems
- **Semantic Search** (`src/app/assistant/search/page.tsx`)
  - Vector similarity search
  - Multi-tab interface
  - Content preview
  - User group scoping

- **Entity Analytics** (`src/app/analytics/page.tsx`)
  - Timeline visualization
  - Entity relationship mapping
  - Real-time search
  - Data visualization

#### 5. Administration

##### User Management (`src/app/user-management/page.tsx`)
- **Role-Based Access**
  - System Admin interface (Role 5)
  - Agency Admin interface (Role 7)
  - Restricted access for non-admin users

- **Agency Admin Features**
  - User listing with status indicators
  - Add new users to agency group
  - Edit existing user details
  - Confirm pending users
  - Delete users from agency
  - Real-time user list updates
  - Phone number management

- **User Operations**
  - Add new users with temporary passwords
  - Edit user profiles (name, phone)
  - Confirm pending users
  - Delete users with confirmation
  - View user status (Confirmed/Pending)

- **Security Features**
  - Group-based access control
  - Role-based interface rendering
  - Secure user deletion with confirmation
  - Protected admin routes
  - Email-based user verification

##### Actions Management (`src/app/actions/page.tsx`)
- Task tracking
- Action assignment
- Priority management
- Status updates
- Collaborative features

### Shared Components

#### Layout Components
- **Header**: Navigation and user context
- **Footer**: Version and credits
- **Sidebar**: Context-aware navigation

#### UI Components
- Document viewers
- Filter systems
- Form components
- Modal dialogs
- Loading states
- Error displays

## API Structure

### Document Processing
- PDF processing pipeline
- OCR integration
- Text extraction
- Metadata generation
- Vector embeddings

### Search Services
- Semantic search endpoints
- Entity analytics
- Hybrid search functions
- Content preview services

### User Services
- Authentication endpoints
- Profile management
- Group assignment
- Access control

## Component Library

### Core UI (shadcn/ui)
- Theme system
- Dark mode support
- Responsive components
- Form elements
- Data display
- Navigation
- Modals and overlays

### Custom Components
- Document viewers
- Upload interfaces
- Search interfaces
- Analytics visualizations
- Management interfaces

### State Management
- React Context implementation
- Form state handling
- Authentication state
- User preferences
- Application settings

