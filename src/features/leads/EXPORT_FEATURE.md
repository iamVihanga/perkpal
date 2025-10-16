# CSV Export Feature for Leads Module

## Overview

A comprehensive CSV export feature that allows administrators to export all lead data from the database.

## Features

### 🚀 **API Endpoint**

- **Route**: `GET /api/leads/export`
- **Authentication**: Admin access required
- **Query Parameters**:
  - `sort` (optional): "asc" or "desc" sorting
- **Export Scope**: Exports ALL leads in the database regardless of any filters

### 📊 **CSV Structure**

The exported CSV includes the following columns:

1. **Lead ID** - Unique identifier
2. **Perk Title** - Associated perk name
3. **Perk Vendor** - Vendor/company name
4. **Submission Date** - When the lead was submitted
5. **IP Address** - User's IP address
6. **Form Data** - All form field responses in "field: value" format

### 🎯 **Export Locations**

#### 1. **Leads Management Page**

- Located in the table actions toolbar
- Respects current filters (perk selection, sorting)
- Button: "Export CSV" with download icon

#### 2. **Dashboard Recent Submissions**

- Quick export button in the recent submissions widget
- Exports all leads across all perks
- Button: "Export All" (ghost style)

### 🔧 **React Components**

#### `ExportLeadsButton`

Reusable export button component:

```tsx
<ExportLeadsButton sort="desc" variant="outline" size="sm">
  Export All Leads CSV
</ExportLeadsButton>
```

#### `useExportLeads` Hook

React Query mutation hook for handling exports:

- Shows loading toast during export
- Automatically downloads file
- Displays success/error messages
- Handles file naming with timestamps

### 📁 **File Naming**

- Format: `leads-export-YYYY-MM-DD.csv`
- Example: `leads-export-2025-10-16.csv`

### 🔐 **Security**

- Admin role required for export access
- Input validation on all query parameters
- SQL injection protection via Drizzle ORM
- Proper error handling and logging

### 💫 **User Experience**

- Loading states with toast notifications
- Automatic file download in browser
- Success feedback with export statistics
- Error handling with user-friendly messages
- No page refresh required

### 🎨 **UI Integration**

- Consistent with existing component design system
- Proper loading and disabled states
- Icon-based visual feedback
- Responsive design for all screen sizes

## Usage Examples

### Export All Leads

```tsx
import { ExportLeadsButton } from "@/features/leads/components/export-leads-button";

<ExportLeadsButton />;
```

### Export All Leads

```tsx
<ExportLeadsButton sort="asc" variant="default">
  Export All Leads
</ExportLeadsButton>
```

### Programmatic Export

```tsx
const { mutate: exportLeads } = useExportLeads();

const handleExport = () => {
  exportLeads({
    sort: "desc"
  });
};
```

## Technical Implementation

### Backend

- CSV generation using native JavaScript string manipulation
- Efficient database queries with selective field loading
- Proper HTTP headers for file download
- Memory-efficient streaming for large datasets

### Frontend

- Blob API for client-side file handling
- Automatic download trigger without user interaction
- Proper cleanup of temporary URLs
- React Query for state management and caching

This feature provides a complete, user-friendly solution for exporting lead data while maintaining security and performance standards.
