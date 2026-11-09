# Agent Guidelines: Sotta. (Laravel 12 + Supabase + React/Inertia)

This document provides architectural standards, conventions, and operational instructions for AI agents and developers working on this codebase.

---

## 1. Project Overview

* **Project Name**: Sotta. (`VITE_APP_NAME` in `.env`)
* **Type**: Social networking & microblogging web application (posts, threads, likes, reposts, bookmarks, follows, user preferences, and real-time notifications).
* **Core Stack**:
  * **Backend**: Laravel 12.x (PHP 8.2+)
  * **Database & Auth**: PostgreSQL via Supabase, Laravel Sanctum, Laravel Breeze
  * **Modular Framework**: `nwidart/laravel-modules` (Modular Monolith)
  * **Frontend Bridge**: Inertia.js v3 (`@inertiajs/react`)
  * **Frontend**: React 19 (`.jsx`), Material UI (`@mui/material`), Tailwind CSS, Lucide React, Framer Motion
  * **Route Helper**: Ziggy (`ziggy-js`)

---

## 2. Architecture & Directory Layout

### Modular Monolith (`Modules/`)
Business domains are separated into modules under `Modules/`. Each module is encapsulated with its own layers:

```
Modules/
├── Post/             # Post creation, feeds, likes, bookmarks, reposts, replies
│   ├── Actions/      # Single-purpose action classes (e.g., CreatePostAction)
│   ├── Http/         # Controllers, Requests, Resources
│   ├── Models/       # Eloquent Models
│   ├── Repositories/ # Data-access layer abstractions
│   ├── Services/     # Business logic coordination
│   ├── Policies/     # Authorization policies
│   └── Database/     # Module-specific migrations, seeders, factories
├── Profile/          # User profiles, avatar/header uploads, follow graph
├── Notification/     # In-app notifications, badge counts, read statuses
└── User/             # User identity, account management, settings
```

### Application Root Structure
```
app/
├── Http/Controllers/ # Top-level / shared controllers (e.g. UserPreferenceController)
├── Models/           # Core User model & base models
resources/
├── css/              # Tailwind and custom stylesheets (app.css)
└── js/
    ├── app.jsx       # App bootstrap (Inertia setup, MUI ThemeProvider, Ziggy)
    ├── Pages/        # Inertia page components (Dashboard, Posts, Profile, etc.)
    ├── Components/   # Reusable React components (buttons, modals, feeds)
    └── Layouts/      # Application shell layouts (Authenticated, Guest)
routes/
├── web.php           # Core application and module web routes
├── auth.php          # Authentication routes (Breeze)
└── api.php           # Sanctum-protected REST endpoints
```

---

## 3. Development Workflow & Commands

### Running Locally
```powershell
# Start PHP development server
php artisan serve

# Start Vite dev server (HMR)
npm run dev

# Run queue worker (if handling background jobs)
php artisan queue:work
```

### Build & Code Quality
```powershell
# Frontend build
npm run build

# Code formatting
./vendor/bin/pint

# Run tests
php artisan test
# or Pest directly:
./vendor/bin/pest
```

### Database & Migrations
```powershell
# Run pending migrations
php artisan migrate

# Module-specific migration
php artisan module:migrate <ModuleName>

# Refresh and seed
php artisan migrate:fresh --seed
```

### Creating Module Components
```powershell
php artisan module:make <ModuleName>
php artisan module:make-controller <ControllerName> <ModuleName>
php artisan module:make-model <ModelName> <ModuleName>
```

---

## 4. Coding & Architectural Conventions

### Backend Conventions
1. **Modular Domain First**:
   * Features relating to Posts, Notifications, Profiles, or Users belong in their respective `Modules/<Domain>/` directory.
   * Avoid putting domain-specific logic directly in `app/Http/Controllers/` unless it is global/system-wide.
2. **Layer Separation**:
   * **Controllers**: Lean. Handle HTTP validation, invoke an Action or Service, and return an Inertia response or redirect.
   * **Actions / Services**: House multi-step business logic (e.g., handling post creation + hashtag parsing + notification dispatch).
   * **Repositories**: Abstract complex queries or Supabase/PostgreSQL specifics.
3. **Route Naming**:
   * Always name routes using dot-notation (`posts.index`, `posts.like`, `profile.index`).
   * Never hardcode URLs in controllers or React components; use named routes.

### Frontend Conventions
1. **Inertia Pages & Navigation**:
   * Page components reside in `resources/js/Pages/` and match the string returned by `Inertia::render('PageName')`.
   * Use `<Link href={route('posts.show', post.id)}>` for SPA-like navigation.
2. **Design System & Styling**:
   * **MUI Theme**: Configured in [resources/js/app.jsx](file:///d:/PROJECT/laravel12/laravel-supabase/resources/js/app.jsx):
     * Primary: `#1F6F5F` (Forest/Teal Green)
     * Secondary: `#a5e4d7ff` (Soft Mint/Cyan)
   * Use Tailwind CSS utility classes alongside MUI components for layouts, spacing, and responsive design.
   * Icons: Prefer `lucide-react`.
3. **Route Helper (Ziggy)**:
   * Call `route('route.name', params)` anywhere in React components (Ziggy is attached to `window.route` in `app.jsx`).

---

## 5. Rules for AI Agents

1. **Check Existing Modules**: Before introducing a new feature, check whether it belongs in an existing module (`Post`, `Profile`, `Notification`, `User`) or requires a new module.
2. **Preserve Database Compatibility**: Schema modifications must be written as reversible Laravel migrations that are compatible with PostgreSQL (Supabase).
3. **Consistent State Updates**: When modifying post interactions (likes, bookmarks, comments, reposts), make sure Inertia responses return fresh state or updated props so React components update optimistically or reactively without full page reloads.
4. **No Destructive Overwrites**: Maintain existing comments, formatting, and docstrings unless explicitly asked to refactor.
