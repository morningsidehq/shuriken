# Constance Application Documentation

Current Version: v0.6.6

Version Notes: Added "View Full Doc" functionality.

## Version History

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
- Navigation to Records, Search, Actions, Upload, and User Management features
- Integration with user authentication state
- Admin-specific features like User Management access

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
- Improved drag-and-drop functionality with visual feedback
- Progress tracking with shadcn/ui Progress component
- Multi-file upload support
- Automatic metadata extraction
- Real-time validation and error handling

Components:
- **FileUploadZone**: Enhanced upload area with:
  - Visual feedback during drag operations
  - File type validation
  - Size limit enforcement
  - Multiple file handling
- **UploadProgress**: 
  - Real-time progress tracking interface
  - Individual file progress bars
  - Overall upload status
  - Error state handling
- **FileList**: 
  - Improved file list display using shadcn/ui components
  - File metadata preview
  - Delete/remove functionality
  - Upload status indicators
- **MetadataEditor**:
  - Automatic metadata extraction
  - Manual metadata editing capabilities
  - Validation rules enforcement
- **UploadQueue**:
  - Manages multiple file uploads
  - Prioritization options
  - Retry failed uploads
  - Batch operations support

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

#### 9. Semantic Search (`src/app/assistant/search/page.tsx`)
- Advanced document search using embeddings and vector similarity
- Real-time content preview directly from search results
- Multi-tab search interface for parallel searches
- User group-scoped search results

Components:
- **SemanticSearch**: Main search interface with hybrid search capabilities
  - Uses all-mpnet-base-v2 model for text embeddings
  - Implements similarity-based document matching
  - Direct content preview from vector storage
  - Displays metadata and similarity scores
  - Multi-tab search functionality:
    - Dynamic tab creation and removal
    - Independent search contexts per tab
    - Parallel search capabilities
  - User group context integration
  - Enhanced error handling and loading states

#### 10. User Management (`src/app/user-management/page.tsx`)
- Admin-only interface for managing system users
- Two distinct interfaces based on user role:
  1. Agency Admin Interface (user_role === 7):
    - Management of users within their specific agency group
    - User addition with automatic group assignment
    - User confirmation capabilities
    - Real-time user status updates
    - User list with filtering and refresh capabilities
  2. System Admin Interface (user_role === 5):
    - Global user management capabilities (planned)
    - Cross-agency user administration
    - System-wide role management

Components:
- **AgencyUserManagement**: Agency-specific user management interface
  - Real-time user list with status indicators
  - User confirmation controls
  - Refresh functionality
  - Empty state handling
  
- **AddAgencyUserModal**: New user creation interface
  - Automated user provisioning
  - Temporary password generation
  - Profile creation with agency group assignment
  - Error handling and validation
  - Loading states and feedback

Features:
- Role-based access control:
  - System Admin (role 5): Full system access
  - Agency Admin (role 7): Agency-specific access
- User status management:
  - Pending/Confirmed status tracking
  - User confirmation workflow
- Security:
  - Role verification
  - Group-based access restrictions
  - Audit logging for changes
- Real-time updates:
  - Immediate status changes
  - List refresh capabilities
  - Loading states

API Routes:
- **/api/embeddings**: Text embedding generation endpoint
  - Uses @xenova/transformers for embedding generation
  - Implements normalized vector outputs
  - Includes debug information and error handling
  - Optimized with ONNX runtime

Database Functions:
- **hybrid_search**: Supabase stored procedure
  - Combines vector similarity search with text matching
  - Configurable similarity thresholds
  - Returns ranked results with metadata
  - Supports content preview extraction

### Shared Components

#### Layout Components
- **Header** (`src/components/Header.tsx`): Navigation and user context, including admin-specific menu items
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
- Admin-specific features including User Management access

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

#### User Management Page (`src/app/user-management/page.tsx`)
- Protected route with dual-role access (System Admin and Agency Admin)
- Server-side role verification
- Features:
  - Dynamic interface based on user role
  - Agency-specific user management
  - User addition workflow:
    - Basic user information collection
    - Automatic group assignment
    - Temporary password generation
    - Email notification system
  - User status management:
    - Confirmation workflow
    - Status indicators
    - Real-time updates
  - List management:
    - Refresh capabilities
    - Loading states
    - Empty state handling
- Security measures:
  - Role-based access control
  - Group-based restrictions
  - Server-side validation
  - Error handling

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

### Semantic Search

#### Embeddings Endpoint (`/api/embeddings`)
- Generates text embeddings using all-mpnet-base-v2 model
- Input validation and preprocessing
- Returns normalized 768-dimensional embeddings
- Includes debugging information:
  - Original magnitude
  - Final magnitude
  - Embedding dimensions
  - Sample values

#### Hybrid Search Function
- Implemented as a Supabase stored procedure
- Parameters:
  - query_text: Text to search for
  - query_embedding: Vector representation
  - match_count: Number of results to return
  - similarity_threshold: Minimum similarity score
- Returns:
  - Document metadata
  - Similarity scores
  - File paths
  - Content preview capabilities

### User Management

#### User Creation
- Handles new user provisioning through Supabase Auth
- Creates associated profile records
- Manages temporary credentials
- Implements group assignment

#### User Confirmation
- Updates user confirmation status
- Validates agency group membership
- Ensures proper role assignments
- Maintains audit trail

#### Profile Management
- Handles user profile updates
- Manages user role assignments
- Controls agency group associations
- Implements data validation and sanitization

