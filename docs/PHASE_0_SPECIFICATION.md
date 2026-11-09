# Product Planning & Requirements --- Phase 0 (Sections 0.1--0.4)

**Product:** Multi-Tenant Cinema Management and Movie Ticket Booking
SaaS Platform\
**Document version:** 1.0\
**Status:** Phases 0.1--0.4 finalized\
**Purpose:** This is the consolidated source-of-truth document for the
product decisions made during Phase 0. It combines the business model,
user roles, feature scope, and business workflows.

------------------------------------------------------------------------

## Document guide

  -----------------------------------------------------------------------
  Section                 Name                    Status
  ----------------------- ----------------------- -----------------------
  0.1                     Business Model          Finalized direction;
                                                  pricing details
                                                  deferred

  0.2                     User Roles and          Main roles finalized;
                          Permissions             detailed staff
                                                  permissions to be
                                                  designed

  0.3                     Feature Scope           Finalized

  0.4                     Business Workflows      Finalized
  -----------------------------------------------------------------------

**Important:** This document records decisions made so far. Items
explicitly marked "deferred", "to be defined", or "technical design" are
not final implementation decisions.

# Phase 0.1 --- Business Model

## 1. Objective

Define what the product is, who it serves, and how cinema companies and
customers will use it. The business model should support both
independent cinemas and cinema chains.

## 2. Product vision

Build a multi-tenant SaaS platform that cinema companies can use to
manage their cinema operations, while customers use the platform to
discover movies, select shows and seats, pay, and receive digital
tickets.

The product combines two connected experiences:

1.  **Cinema operations platform:** A management workspace for cinema
    companies, owners, branch managers and theatre staff.
2.  **Customer booking platform:** A customer-facing website for movie
    discovery, show selection, interactive 3D seat selection, payment
    and ticket access.

The product should be capable of serving: - Independent cinemas
operating one location. - Cinema companies operating multiple
branches. - Larger cinema chains that need centralized company-level
management and branch-level operations.

## 3. Business model direction

A **hybrid SaaS business model** is the preferred direction for further
business-model planning.

Potential revenue components to evaluate later: - SaaS subscription
charged to cinema companies. - Transaction-based fee associated with
successful bookings. - Optional paid add-ons or advanced modules in
later releases.

These are possible commercial components, not finalized prices or
contractual terms.

### Explicitly deferred

The following decisions are intentionally postponed: - Subscription plan
names and tiers. - Monthly or annual subscription prices. - Per-ticket
or percentage transaction fees. - Free trials, onboarding fees or setup
fees. - Feature limits by plan. - Billing cycles, invoicing and renewal
rules.

**Reason for deferral:** Pricing should be decided after the product
scope, operating costs, payment costs, infrastructure requirements and
commercial strategy are better understood. Pricing must not block the
product requirements work.

## 4. How the platform works at a high level

1.  A cinema company submits an application to join the platform.
2.  A Super Admin reviews and approves the application.
3.  The approved cinema company receives its own isolated tenant
    workspace.
4.  The Cinema Owner configures branches, theatres, screens, staff,
    movies and shows.
5.  Customers access the cinema's booking experience through the web.
6.  Customers select a movie, branch, showtime and seats in the 3D
    auditorium.
7.  The platform holds the selected seats, processes payment and
    confirms the booking.
8.  The customer receives a digital ticket with a QR code.
9.  Theatre staff scan and validate the QR code at entry.
10. Cinema users manage operations and view reports according to their
    permissions.

## 5. Business model principles

-   The platform is designed for multiple cinema companies, not just one
    cinema.
-   Each cinema company is a separate tenant.
-   A cinema company may operate multiple branches.
-   Customers use one shared customer account across participating
    cinema companies.
-   The platform initially supports cinema-specific booking experiences.
-   A centralized cross-cinema marketplace is planned for a later
    release.
-   Cinema companies manage their own operations within their authorized
    scope.
-   The SaaS platform operator retains platform-level administration and
    oversight.
-   Subscription and transaction pricing remain open decisions.

## 6. Phase 0.1 outcome

**Finalized direction:** A multi-tenant cinema-management and
ticket-booking SaaS product for independent cinemas and cinema chains,
with a hybrid monetization direction to be evaluated later.

**Not finalized:** Actual subscription plans, prices, transaction fees
and billing implementation.

------------------------------------------------------------------------

# Phase 0.2 --- User Roles and Permissions

## 1. Objective

Define the main categories of users and establish who can access and
manage which parts of the platform. The system must support
platform-wide administration, company-wide management, branch
operations, staff tasks and customer bookings.

## 2. Finalized user roles

The five main roles are:

1.  Super Admin
2.  Cinema Owner
3.  Branch Manager
4.  Theatre Staff
5.  Customer

## 3. Role definitions and responsibilities

### 3.1 Super Admin

**Scope:** Entire SaaS platform.

The Super Admin operates and manages the SaaS product itself.

Main responsibilities: - Access the platform administration dashboard. -
Review cinema company applications. - Approve, reject or request
additional information for applications. - Activate, suspend or
deactivate cinema companies in accordance with platform procedures. -
View and manage registered cinema tenants. - Monitor platform-level
booking and transaction summaries. - Manage platform-wide
configuration. - Review security and audit logs. - Provide controlled
and audited support access where required.

The Super Admin is not an ordinary employee of a cinema tenant.
Platform-level privileges must be separated from tenant-level
permissions.

### 3.2 Cinema Owner

**Scope:** Their own cinema company and all branches belonging to that
company.

Main responsibilities: - Manage the cinema company profile and
settings. - Create, view, update and deactivate the company's
branches. - View company-wide operational information and reports. -
Assign Branch Managers. - Create or manage staff memberships and
permissions within the company. - Oversee theatres, screens, movies,
shows, bookings and operations across their company, subject to the
platform's permission model. - Configure company-level operational
policies, including cancellation policy where supported. - View
company-wide booking and revenue summaries.

**Finalized decision:** The Cinema Owner can manage branches belonging
to their cinema company.

A Cinema Owner must not access or manage another cinema company's tenant
data.

### 3.3 Branch Manager

**Scope:** Only the branch or branches assigned to that manager.

Main responsibilities: - Manage day-to-day operations for assigned
branches. - Manage branch-level theatre and screen information, subject
to granted permissions. - Coordinate show schedules and branch
operations. - Manage assigned Theatre Staff. - View branch-specific
bookings, sales and reports. - Handle permitted operational changes,
cancellations or exceptions. - Monitor ticket checking and counter
operations.

A Branch Manager must not automatically receive access to every branch
of the cinema company. Access is limited to assigned branches and
explicitly granted permissions.

### 3.4 Theatre Staff

**Scope:** Assigned branch, operational area or task.

Theatre Staff is a role category with different staff types. Staff
should receive only the permissions required for their assigned work.

Examples of staff types discussed: - **Ticket Checker:** Scans QR
tickets and validates customer entry. - **Counter Operator / Box Office
Operator:** Creates walk-in bookings, selects seats and records counter
payments. - Other staff types and their exact permissions are **to be
defined** during detailed permission design.

Theatre Staff permissions must be configurable and limited. For
example: - A Ticket Checker should be able to validate tickets but
should not automatically have permission to edit show schedules or issue
refunds. - A Counter Operator should be able to create counter bookings
but should not automatically have platform-wide or company-wide
administrative access.

### 3.5 Customer

**Scope:** Their own customer account, bookings and tickets.

Main responsibilities: - Register and sign in. - Browse and search
movies. - Select a cinema branch and showtime. - Explore the 3D
auditorium. - Select seats and proceed to checkout. - Make payment. -
View booking history and digital tickets. - Present the ticket QR code
at the cinema. - Request cancellation where permitted by the applicable
policy. - Manage their own profile.

**Finalized decision:** Customer accounts are shared across
participating cinema companies. A customer should not need a separate
account for each cinema company.

Customers may only access their own personal information, bookings and
tickets.

## 4. High-level permission matrix

This matrix records the intended permission boundaries. It is not the
final low-level permission catalogue.

  ---------------------------------------------------------------------------------------
  Capability        Super Admin         Cinema      Branch      Theatre Staff Customer
                                        Owner       Manager                   
  ----------------- ------------------- ----------- ----------- ------------- -----------
  Manage SaaS       Yes                 No          No          No            No
  platform                                                                    

  Review cinema     Yes                 No          No          No            No
  applications                                                                

  Manage a cinema   Platform oversight  Own company No          No            No
  company                                                                     

  Manage branches   Platform oversight  All own     Assigned    No by default No
                                        branches    branches,                 
                                                    if                        
                                                    permitted                 

  Manage branch     Support/oversight   Own company Assigned    Assigned      No
  operations                                        branches    tasks only    

  Manage staff      Platform support    Own company Assigned    No by default No
                    only                            branch, if                
                                                    permitted                 

  Manage            Platform support    Own company If          No by default No
  theatre/screen    only                            permitted                 
  setup                                                                       

  Manage movies and Platform support    Own company If          No by default No
  shows             only                            permitted                 

  Create counter    No by default       If          If          Counter       No
  bookings                              permitted   permitted   Operator only 

  Validate entry    No by default       If          If          Ticket        No
  tickets                               permitted   permitted   Checker only  

  Browse movies and Support/preview     Own cinema  Assigned    Operational   Yes
  shows                                 context     branch      context       
                                                    context                   

  Book tickets      No by default       No by       No by       No by default Yes
  online                                default     default                   

  View              Platform-wide       Own company Assigned    Limited if    Own
  booking/revenue                                   branches    permitted     bookings
  reports                                                                     only

  Manage own        Yes                 Yes         Yes         Yes           Yes
  profile                                                                     
  ---------------------------------------------------------------------------------------

**Permission principle:** Role names establish broad responsibilities,
but every protected action must also be checked against tenant
membership, branch assignment and specific permission grants on the
backend.

## 5. Account and access rules

-   Super Admin accounts operate at platform level.
-   Cinema Owner accounts are associated with their own cinema company.
-   Branch Managers are assigned to one or more specific branches.
-   Theatre Staff are assigned to a company/branch and receive
    task-specific permissions.
-   Customers use one shared account across cinema companies.
-   A user may not gain access to another tenant merely by changing a
    tenant or branch ID in a browser request.
-   All protected actions must be authorized by the server.
-   Sensitive administrative and operational actions should be recorded
    in audit logs.

## 6. Items intentionally left for detailed design

-   The complete list of Theatre Staff types.
-   The exact permission list for each staff type.
-   Whether a user may hold more than one operational role.
-   Invitation, onboarding and deactivation rules for staff accounts.
-   Fine-grained permissions for refunds, show cancellation, pricing
    changes and overrides.

## 7. Phase 0.2 outcome

**Finalized:** Five main roles, their broad responsibilities, owner
control over branches, branch-scoped manager access, staff types with
task-specific permissions, and one shared customer identity.

**To be detailed later:** Fine-grained staff permissions and the
complete permission catalogue.

------------------------------------------------------------------------

# Phase 0.3 --- Feature Scope

## 1. Objective

Establish what the first release must contain, what belongs in Version
2, and what is reserved for future releases.

## 2. Finalized product decisions

  -----------------------------------------------------------------------
  Decision                            Final choice
  ----------------------------------- -----------------------------------
  Initial platform                    Web application only

  Customer website                    Responsive desktop and mobile web

  Seat-selection experience           Interactive 3D seat selection as
                                      the primary experience

  Booking channels                    Cinema-specific booking experiences
                                      initially; centralized marketplace
                                      later

  Counter booking                     Included in MVP

  White-label customization           Version 2

  MVP scope                           All proposed essential MVP modules

  Customer identity                   One shared customer account across
                                      participating cinemas

  Architecture direction              Multi-tenant SaaS

  Pricing/subscription model          Deferred
  -----------------------------------------------------------------------

### Scope interpretation

-   Native Android and iOS applications are not part of the MVP.
-   Customers use a responsive website.
-   The MVP provides cinema-specific booking entry points on the shared
    platform.
-   Full branding customization and custom domains are deferred to
    Version 2.
-   The centralized marketplace is deferred to a future release.
-   3D seat selection is a core differentiator and is part of the MVP.
-   The 3D seat view must reflect the actual inventory for the selected
    show.
-   Subscription plans and transaction-fee rules are not yet decided.

## 3. MVP --- First Release

The MVP includes the following 18 modules.

### Module 1 --- Super Admin Management

-   Super Admin authentication.
-   Platform administration dashboard.
-   Register and review cinema company applications.
-   Approve, reject, activate or deactivate cinema companies.
-   View registered cinema companies.
-   View platform-level booking and transaction summaries.
-   Manage platform configuration.
-   View security and audit logs.
-   Provide controlled, audited support access where necessary.

### Module 2 --- Cinema Company Management

-   Cinema company onboarding and profile.
-   Company contact information and operational details.
-   Cinema Owner account management.
-   Company status management.
-   Company-level settings.
-   Company-wide booking and operational summaries.

### Module 3 --- Branch Management

-   Create, view, update and deactivate branches.
-   Store branch name, address, contact details and location.
-   Configure operating hours.
-   Assign Branch Managers.
-   View branch-specific information and performance.

### Module 4 --- Theatre and Screen Management

-   Create theatres within branches.
-   Create and manage multiple screens.
-   Configure screen name, number, capacity and type.
-   Support screen formats such as 2D and 3D where applicable.
-   Define seat categories such as regular and premium.
-   Configure accessible seating.
-   Maintain screen and seating-layout information.

### Module 5 --- 3D Seat Layout Designer

-   Create and edit theatre seating layouts.
-   Configure rows, seats, aisles and gaps.
-   Position the screen and define auditorium orientation.
-   Configure seat categories and attributes.
-   Preview the layout before publishing.
-   Generate and save a corresponding 3D auditorium layout.
-   Reuse layouts where appropriate.
-   Validate that the configured layout matches the physical screen
    inventory.

### Module 6 --- Movie Management

-   Add, edit and archive movie records.
-   Store title, description, poster and banner.
-   Store trailer reference, language, genre and duration.
-   Store release date, certification and cast/crew information.
-   Set movie status: upcoming, currently running or completed.
-   Support multiple languages and regional movies.

### Module 7 --- Show Scheduling

-   Schedule a movie against a branch and screen.
-   Set show date, start time and duration.
-   Configure ticket prices and seat-category pricing.
-   Set booking opening and closing times.
-   Prevent overlapping shows on the same screen.
-   View daily and weekly schedules.
-   Cancel or update shows with appropriate operational controls.

### Module 8 --- Customer Authentication and Profiles

-   Customer registration, login and logout.
-   Email or mobile verification.
-   Password recovery.
-   Customer profile management.
-   One shared customer identity across participating cinemas.
-   View customer booking history and tickets.
-   Protect personal information and restrict access to the customer's
    own records.

### Module 9 --- Movie Discovery and Search

-   Display currently running and upcoming movies.
-   Search movies by title.
-   Filter by language and genre.
-   Select a city or location.
-   View movie details and trailers.
-   View participating cinemas and available shows for a movie.
-   Display show dates and timings.

### Module 10 --- Interactive Seat Selection and Booking

-   Display available shows and the associated auditorium.
-   Load the correct 3D seating layout for the selected show.
-   Display available, selected, temporarily held and unavailable/booked
    seats.
-   Allow customers to explore the 3D auditorium and select seats.
-   Display selected seat numbers and categories.
-   Calculate ticket price and booking total.
-   Temporarily hold selected seats during checkout.
-   Release expired or abandoned holds.
-   Prevent concurrent customers from successfully booking the same
    seat.
-   Proceed to checkout.

**Critical:** Seat inventory is authoritative on the server. Seat holds,
booking confirmation and payment handling must prevent double booking,
including simultaneous online and counter bookings.

### Module 11 --- 3D Theatre Visualization

-   Render an interactive 3D auditorium.
-   Display seats in positions matching the configured layout.
-   Display the theatre screen and auditorium orientation.
-   Support camera rotation and zoom.
-   Allow customers to select seats directly in the 3D view.
-   Highlight available, selected and unavailable seats.
-   Display seat row, number and category.
-   Synchronize the 3D selection with the booking's server-side seat
    inventory.

The experience should work on common desktop and mobile browsers.
Performance and accessibility should be tested on lower-powered devices.
A practical non-3D fallback may be considered for devices that cannot
render the experience, without changing the primary 3D direction.

### Module 12 --- Payment Gateway

-   Integrate a suitable payment provider.
-   Support provider payment methods, with UPI as an important
    Indian-market requirement.
-   Handle payment success, failure, pending and timeout states.
-   Verify payment status securely on the server.
-   Record transaction references and payment status.
-   Confirm bookings only after valid payment confirmation.
-   Support refunds according to the applicable policy.
-   Reconcile payment records with bookings.

### Module 13 --- Ticket Generation and QR Verification

-   Generate a unique booking reference.
-   Generate unique ticket identifiers.
-   Generate QR codes for confirmed tickets.
-   Display tickets in the customer account.
-   Allow customers to download or print tickets.
-   Send ticket confirmation by email.
-   Provide staff with a QR scanning and validation interface.
-   Reject invalid, cancelled or already-used tickets.
-   Record entry/check-in time and validation result.

### Module 14 --- Booking Management

-   View booking details according to role permissions.
-   Track booking and payment statuses.
-   View booking history.
-   Handle permitted cancellations.
-   Record refund requests and outcomes.
-   Handle failed and abandoned booking attempts.
-   Provide booking and cancellation reports.

### Module 15 --- Counter Booking System

-   Provide an authenticated counter-booking interface for authorized
    staff.
-   Search for a movie and show.
-   View real-time seat availability.
-   Select seats and create walk-in bookings.
-   Record the permitted counter payment method and payment status.
-   Generate a ticket or receipt.
-   Update seat inventory immediately.
-   Use the same seat inventory and booking rules as online bookings.

**Critical:** Online and counter bookings share the same inventory and
concurrency controls. A seat sold at the counter must immediately become
unavailable online, and vice versa.

### Module 16 --- Basic Analytics and Reports

-   Total bookings and tickets sold.
-   Revenue summaries.
-   Movie-wise performance.
-   Branch-wise performance.
-   Screen and show occupancy.
-   Payment summaries.
-   Cancellation and refund summaries.
-   Date-based filtering.
-   Role-appropriate access to reports.

### Module 17 --- Basic Cinema-Specific Booking Experience

-   Provide a cinema-specific customer booking entry point on the shared
    platform.
-   Display the relevant cinema's movies, branches and shows.
-   Keep cinema-specific booking information separated by tenant.
-   Provide basic cinema identity and contact information.
-   Exclude full custom-domain provisioning and advanced visual
    customization from MVP.

### Module 18 --- Basic Notifications

-   Booking confirmation.
-   Payment confirmation or failure status.
-   Ticket delivery.
-   Cancellation updates.
-   Refund status updates.
-   Show cancellation or schedule-change notifications.
-   Basic upcoming-show reminders where supported.

Email is the initial notification channel. SMS and WhatsApp can be
evaluated separately.

## 4. Version 2

### 4.1 White-Label Website Customization

-   Custom cinema logos and brand colors.
-   Custom homepage banners and content.
-   More extensive layout and theme configuration.
-   Custom domain support, such as `tickets.cinema-domain.com`.
-   Branded booking pages and customer communications.

### 4.2 Advanced 3D Experience

-   More detailed auditorium materials and lighting.
-   Improved camera presets and viewing angles.
-   Optional seat-view previews where cinema data supports them.
-   Performance improvements and richer visual interactions.

### 4.3 Advanced Analytics

-   More detailed revenue and occupancy dashboards.
-   Demand and show-performance comparisons.
-   Advanced export and reporting tools.
-   Operational trend analysis.

### 4.4 Offers and Promotions

-   Coupon codes.
-   Promotional campaigns.
-   Discount rules.
-   Offer eligibility and redemption tracking.

### 4.5 Expanded Communication

-   SMS notifications.
-   WhatsApp notifications, subject to provider approval and applicable
    requirements.
-   More configurable reminder rules.

## 5. Future Releases

### 5.1 Centralized Movie Marketplace

-   Discover movies across participating cinema companies.
-   Compare showtimes and locations.
-   Search and filter across cinemas.
-   Book tickets through one central customer experience.
-   Use the shared customer account and identity.

### 5.2 Loyalty and Rewards

-   Customer reward points.
-   Membership tiers.
-   Referral programs.
-   Loyalty benefits and redemption.

### 5.3 Food and Beverage Ordering

-   Browse cinema food and beverage menus.
-   Pre-order snacks and drinks.
-   Link food orders to a movie booking.
-   Manage fulfilment and order status.

### 5.4 Native Mobile Applications

-   Dedicated Android application.
-   Dedicated iOS application.
-   Mobile-specific notifications and experiences.

### 5.5 Advanced Business Intelligence

-   Demand forecasting.
-   Occupancy prediction.
-   Revenue optimization.
-   Advanced operational insights.

### 5.6 SaaS Subscription and Billing

-   Subscription plans.
-   Monthly and annual billing.
-   Usage limits and feature entitlements.
-   Invoices and renewals.
-   Transaction-fee configuration.
-   Billing and payment history for cinema companies.

Subscription and pricing remain undecided until product requirements,
operating costs and commercial strategy are better understood.

## 6. Cross-cutting requirements

### 6.1 Multi-Tenant Data Isolation

-   Each cinema company is a separate tenant.
-   A tenant can have multiple branches.
-   Branches contain theatres and screens.
-   Tenant data must not be exposed to another tenant.
-   Tenant authorization must be enforced on the backend.

### 6.2 Role-Based Access Control

-   Super Admin has platform-level permissions.
-   Cinema Owner manages their own company and branches.
-   Branch Manager is limited to assigned branches and granted
    permissions.
-   Theatre Staff receive operational permissions based on staff type.
-   Customers can access their own profiles, bookings and tickets.
-   Sensitive administrative actions must be audited.

### 6.3 Booking and Inventory Integrity

-   A show has its own seat inventory.
-   Seat holds must expire.
-   Booking confirmation must be idempotent.
-   Payment callbacks and retries must not create duplicate bookings.
-   Online and counter bookings must use the same inventory.
-   A confirmed booking must not be silently overwritten.

### 6.4 Security and Privacy

-   Authenticate users securely.
-   Authorize every protected server-side operation.
-   Protect customer personal and payment-related information.
-   Do not store raw payment-card details.
-   Validate QR tickets against server-side booking records.
-   Record important administrative and operational actions.

### 6.5 Reliability and Usability

-   Provide clear payment and booking status messages.
-   Handle network failures and payment timeouts safely.
-   Make the web application responsive.
-   Test 3D performance on supported browsers and devices.
-   Provide useful error messages and recovery paths.

## 7. MVP completion criteria

The MVP should not be considered complete until: 1. A Super Admin can
register and activate a cinema company. 2. A Cinema Owner can create
multiple branches. 3. A Cinema Owner can assign Branch Managers and
staff. 4. A branch can be configured with theatres, screens and seating
layouts. 5. An administrator can create a movie and schedule a show. 6.
A customer can discover the movie and select a show. 7. The customer can
explore the auditorium in 3D and select seats. 8. The system can hold
seats safely during checkout. 9. The customer can complete payment and
receive a confirmed ticket. 10. The ticket QR code can be validated at
the cinema entrance. 11. Authorized staff can create counter bookings.
12. Online and counter bookings cannot sell the same seat twice. 13.
Cinema users can view information permitted by their roles. 14. Tenant
data remains isolated between cinema companies. 15. Booking, payment,
cancellation and entry records can be audited.

## 8. Explicitly out of scope for MVP

-   Native Android and iOS applications.
-   Centralized cross-cinema marketplace discovery.
-   Full white-label customization and custom domains.
-   Loyalty and rewards.
-   Food and beverage ordering.
-   Advanced AI forecasting.
-   SaaS subscription billing and finalized pricing plans.

## 9. Phase 0.3 outcome

**Status: Finalized.** The initial product scope and release priorities
are established. Changes should be handled as documented scope changes
rather than informal additions.

------------------------------------------------------------------------

# Phase 0.4 --- Business Workflows

## 1. Objective

Define the end-to-end operational workflows for cinema onboarding,
branch and screen setup, movie and show scheduling, customer booking,
seat holding, payment, ticket generation, QR verification, counter
bookings, cancellations and refunds.

Each workflow identifies the objective, actors, preconditions, main
success path, exception paths, required system actions and completion
condition.

## 2. Finalized operational decisions

  -----------------------------------------------------------------------
  Decision                            Final rule
  ----------------------------------- -----------------------------------
  Cinema company onboarding           Application and Super Admin
                                      approval required before activation

  Temporary seat hold                 10 minutes during online checkout

  Payment failure                     Customer may retry while the seat
                                      hold remains valid

  Counter payment methods             Cash, UPI and Card

  Cancellation                        Each cinema company configures its
                                      own policy, subject to platform
                                      rules and applicable law

  Online ticket generation            Immediately after booking
                                      confirmation following successful
                                      verified payment

  Customer identity                   One shared customer account across
                                      participating cinema companies

  Booking inventory                   Online and counter bookings use the
                                      same authoritative inventory
  -----------------------------------------------------------------------

## 3. Global business rules

1.  Every cinema company is a separate tenant.
2.  A cinema company can have multiple branches.
3.  Each branch can have multiple theatres or screens.
4.  Every show is associated with one movie, one screen and a scheduled
    time.
5.  Seat availability is maintained separately for each show.
6.  Protected operations enforce role, tenant and branch permissions on
    the server.
7.  The server is the source of truth for seat availability, booking
    status, payment status and ticket validity.
8.  Seat holds expire after 10 minutes. The system must not silently
    extend holds indefinitely.
9.  A seat cannot be sold twice for the same show.
10. Payment callbacks, retries and client refreshes must not create
    duplicate bookings or tickets.
11. Ticket QR codes must be validated against current server-side
    booking and ticket records.
12. Important administrative, payment, booking and entry actions must be
    auditable.
13. Displayed times use the relevant cinema branch's local time zone;
    backend timestamps are stored consistently.
14. Cancellation and refund rules must be shown to customers before
    booking confirmation.

## 4. Workflow 1 --- Cinema Company Onboarding

**Objective:** A cinema company applies to join the platform. A Super
Admin reviews the application and approves or rejects it. Only an
approved company can access its management workspace.

**Actors:** Cinema applicant/prospective Cinema Owner, Super Admin, SaaS
platform.

**Preconditions:** - Applicant can access the public cinema registration
form. - Applicant can provide company and contact details. - Email
address or phone number can be verified.

**Success path:** 1. Applicant opens the cinema company registration
page. 2. Applicant enters company name, business contact details,
primary contact information and requested business information. 3.
Applicant submits the application and required supporting documents. 4.
System validates required fields and checks for likely duplicate
applications. 5. System creates an application with `PENDING_REVIEW`
status. 6. System records submission time and notifies applicant. 7.
Super Admin opens the pending application list. 8. Super Admin reviews
company details and supporting information. 9. Super Admin approves the
application. 10. System creates the tenant/company record and initial
Cinema Owner account, or links a verified owner account. 11. System
assigns a unique tenant identifier and initializes the workspace. 12.
System marks the application/company `APPROVED` or `ACTIVE`, according
to the status model. 13. System sends activation notification and secure
account setup instructions. 14. Cinema Owner sets credentials, signs in
and completes remaining profile details.

**Failure and exception paths:** - Invalid/incomplete application:
identify missing or invalid fields and request correction. - Duplicate
application: flag for review rather than silently creating another
company. - Rejected application: record reason, mark `REJECTED` and
notify applicant. - More information required: mark `ACTION_REQUIRED`,
notify applicant and allow resubmission. - Activation email failure:
keep approval state, record delivery failure and provide secure
resend. - Provisioning failure: do not show the company as active until
tenant resources and owner access are successfully created; log for
retry or intervention.

**Required system actions:** - Validate and store application data. -
Maintain application status and review history. - Create isolated tenant
only after approval. - Create or associate initial Cinema Owner
account. - Record who approved/rejected and when. - Notify applicant of
status changes. - Prevent tenant-management access before activation.

**Completion condition:** Company is approved, tenant workspace exists,
Cinema Owner can sign in and company is ready for branch configuration.

## 5. Workflow 2 --- Branch Management

**Objective:** Allow a Cinema Owner to create and manage multiple
branches and assign managers to individual branches.

**Actors:** Cinema Owner, Branch Manager, Super Admin for authorized
platform support, SaaS platform.

**Preconditions:** Cinema company is approved and active; Cinema Owner
is authenticated and has branch-management permission.

**Success path:** 1. Owner opens company dashboard. 2. Owner selects Add
Branch. 3. Owner enters branch name, address, city, contact details,
location and operating hours. 4. System validates branch information. 5.
System creates branch under the owner's tenant. 6. System assigns a
unique branch identifier. 7. Owner opens the branch staff/manager
section. 8. Owner selects an eligible user or invites a Branch Manager.
9. Owner assigns manager to the branch and grants permitted branch-level
permissions. 10. System sends invitation/access notification. 11.
Manager accepts invitation or completes account setup. 12. Manager signs
in and sees only assigned branches and features. 13. Owner can view and
manage all branches belonging to their company.

**Failure and exception paths:** - Invalid branch details: prevent
saving and identify fields to correct. - Possible duplicate branch: warn
the owner. - Manager invitation failure: branch remains created;
invitation can be resent. - User already belongs to another company:
validate membership and role model; do not accidentally grant
cross-tenant access. - Unauthorized access: reject branch operations
without permission. - Branch deactivation: prevent new shows while
preserving historical bookings, financial records and audit history.
Existing shows require an explicit operational process.

**Required system actions:** - Link each branch to exactly one tenant. -
Maintain address, location and operating hours. - Assign managers
through explicit tenant and branch membership records. - Enforce branch
authorization on protected operations. - Audit branch creation, updates,
manager assignments and deactivation. - Preserve historical records.

**Completion condition:** Branch exists under the correct company and
its authorized manager can access the branch workspace without seeing
unauthorized branches.

## 6. Workflow 3 --- Theatre and Screen Setup

**Objective:** Allow authorized cinema administrators to create
theatres/screens and configure the seating layout needed for 3D
rendering.

**Actors:** Cinema Owner, authorized Branch Manager, authorized Theatre
Staff where permitted, SaaS platform.

**Preconditions:** Company and branch are active; user has
theatre/screen configuration permission.

**Success path:** 1. Authorized user opens the branch management
dashboard. 2. User creates a theatre or auditorium. 3. User adds one or
more screens and enters screen name/number, capacity and supported
format. 4. User configures seat categories such as regular and premium,
plus accessible seats where applicable. 5. User opens the seat-layout
designer. 6. User defines rows, seat numbers, aisles, gaps and screen
position. 7. System validates seat identifiers and layout structure. 8.
System generates a 3D preview. 9. User checks the preview against the
physical auditorium. 10. User saves and publishes the layout. 11. System
stores a version/reference of the published layout for use by shows.

**Failure and exception paths:** - Duplicate seat identifiers or invalid
layout: prevent publication. - Capacity mismatch: warn and require
correction. - 3D preview/rendering failure: do not publish an invalid
layout. - Layout changed after shows exist: preserve the layout version
used by existing shows; do not silently remap sold seats. - Unauthorized
user: reject configuration changes.

**Required system actions:** - Associate theatre and screens with the
correct branch and tenant. - Validate seat identifiers, categories and
capacity. - Preserve layout versions/references for scheduled shows. -
Audit layout publication and changes.

**Completion condition:** An authorized user has published a valid
screen layout that accurately represents the auditorium and can be
loaded by the 3D booking experience.

## 7. Workflow 4 --- Movie Management

**Objective:** Allow authorized cinema users to maintain movie
information that can be scheduled and displayed to customers.

**Actors:** Cinema Owner, authorized Branch Manager or movie
administrator, SaaS platform.

**Preconditions:** User is authenticated and has movie-management
permission.

**Success path:** 1. User opens movie management. 2. User adds a movie
or selects an existing movie record. 3. User enters title, description,
language, genre, duration, release date, certification, poster/banner,
trailer reference and cast/crew details as available. 4. System
validates required fields and media references. 5. User saves the movie.
6. System stores the movie and makes it available for show scheduling.
7. User updates status as upcoming, currently running or completed when
appropriate.

**Failure and exception paths:** - Missing/invalid required information:
prevent publication and request correction. - Duplicate movie record:
flag possible duplicate. - Invalid media reference: report the issue and
allow correction. - Movie archived while future shows exist: require
those shows to be handled explicitly. - Unauthorized user: reject
changes.

**Required system actions:** - Validate movie metadata. - Preserve
references used by existing shows and bookings. - Maintain status and
change history. - Enforce tenant permissions for cinema-specific movie
operations.

**Completion condition:** A valid movie record is available for show
scheduling and customer display.

## 8. Workflow 5 --- Show Scheduling

**Objective:** Schedule a movie against a branch and screen, configure
show time, price and booking window, and prevent conflicts.

**Actors:** Cinema Owner, authorized Branch Manager/show scheduler, SaaS
platform.

**Preconditions:** Branch and screen are active; movie exists; a valid
published seat layout exists; user has scheduling permission.

**Success path:** 1. User opens show scheduling for a branch. 2. User
selects a movie, screen, date and start time. 3. User enters duration
and any required buffer/cleaning time. 4. User configures ticket prices
and seat-category pricing. 5. User sets booking opening and closing
times. 6. System checks screen availability and overlapping shows. 7.
System validates that the selected screen has a valid layout. 8. System
creates show-specific seat inventory based on the applicable layout
version. 9. User reviews and publishes the show. 10. System displays the
show to customers during the permitted booking window.

**Failure and exception paths:** - Screen-time overlap: reject the
schedule and show the conflict. - Invalid screen/layout: prevent
publication. - Invalid price or booking window: request correction. -
Show cancellation or rescheduling: apply controlled operational process
and notify affected customers where necessary. - Unauthorized user:
reject schedule changes.

**Required system actions:** - Validate schedule conflicts
transactionally. - Store show date/time with branch time-zone context. -
Create a show-specific inventory reference for the applicable layout. -
Apply seat-category prices. - Publish only valid shows. - Maintain
schedule-change and cancellation history.

**Completion condition:** Show is published, its seat inventory and
prices are configured, and customers can discover it during the
permitted booking window.

## 9. Workflow 6 --- Customer Movie Booking and Seat Hold

**Objective:** Allow a customer to discover a movie, select a cinema and
show, explore the auditorium in 3D, select seats and begin checkout.

**Actors:** Customer, SaaS platform, cinema company, seat inventory
service.

**Preconditions:** Movie and show are published and bookable; selected
screen has a valid published 3D layout; show has available seats.

**Success path:** 1. Customer opens booking website. 2. Customer selects
a city or location. 3. Customer browses/searches for a movie. 4.
Customer opens movie details. 5. Customer selects a cinema branch. 6.
Customer selects a date and available showtime. 7. System loads the
correct auditorium layout for the show. 8. Customer explores the 3D
auditorium, rotates/zooms and inspects seats. 9. Customer selects one or
more seats. 10. Customer confirms selection. 11. Server checks current
availability of every selected seat. 12. Server atomically creates a
temporary hold for all selected seats for 10 minutes. 13. System
displays selected seats, price breakdown, applicable fees and total. 14.
Customer proceeds to checkout. 15. System requests authentication if
required and associates the attempt with the customer. 16. Customer
reviews booking details and cancellation policy before payment.

**Failure and exception paths:** - Show unavailable: explain and offer
other shows. - Seat taken by another customer: reject hold and refresh
seating state. - Partial seat availability: do not create a partial
hold; explain unavailable seats and ask customer to select again. - Hold
creation failure: do not proceed to checkout; refresh inventory. -
Customer leaves checkout: hold expires after 10 minutes and seats return
to availability. - Session expires: require sign-in and revalidate
hold. - Layout unavailable: do not offer misleading seat selection;
report issue and provide recovery path.

**Required system actions:** - Retrieve current show and seat
inventory. - Render correct show-specific 3D layout. - Validate seat
selection on server. - Create all-or-nothing holds using
concurrency-safe database operations. - Record hold creation and expiry
timestamps. - Display countdown based on server-authoritative expiry. -
Revalidate hold before payment. - Release expired holds automatically.

**Completion condition:** Customer has a valid 10-minute hold on all
requested seats and can proceed to payment.

## 10. Workflow 7 --- Payment and Ticket Generation

**Objective:** Process payment, confirm the booking exactly once and
generate a digital ticket with a QR code.

**Actors:** Customer, payment gateway, SaaS platform, seat inventory
service, notification service.

**Preconditions:** Customer has a valid show; selected seats are held
and hold has not expired; total is calculated by the server; customer
has reviewed booking and policy.

**Success path:** 1. Customer proceeds from checkout to payment. 2.
System creates booking/payment attempt with unique reference and pending
status. 3. System creates a payment order with provider using
server-calculated amount. 4. Customer completes payment using a
provider-supported method. 5. Provider returns a result or sends
server-to-server notification. 6. Backend verifies result and validates
amount, currency, order reference and status. 7. System processes
confirmation idempotently. 8. System confirms booking and commits held
seats as sold, subject to authoritative inventory and reconciliation
rules. 9. System creates unique ticket records. 10. System generates QR
codes containing an opaque, non-guessable ticket reference or secure
token---not sensitive customer/payment data. 11. Ticket becomes
available in customer account. 12. System sends booking confirmation and
ticket through configured notification channel. 13. System records
payment, booking, ticket and notification outcomes.

**Payment failure and retry path:** 1. Definitive failure marks that
payment attempt failed. 2. If the 10-minute hold is still valid,
customer may retry against the same held seats, subject to provider
rules. 3. Each retry receives a distinct payment-attempt reference. 4.
Failed payment does not create a confirmed booking or ticket. 5. If hold
expires before successful payment is confirmed, seats are released. 6.
Customer must select available seats again if hold has expired.

**Pending or ambiguous payment path:** - Browser timeout or missing
redirect is not proof of payment failure. - Mark attempt `PENDING` or
`UNKNOWN` and query provider's authoritative status. - Avoid
releasing/reselling seats while a potentially successful payment is
unresolved, where provider capabilities and hold policy allow safe
reconciliation. - Do not extend the 10-minute hold indefinitely. - If
outcome cannot be resolved within the hold window, follow a defined
reconciliation process before resale. - If payment succeeds after seats
were released or sold, do not double-book; initiate
refund/reconciliation and notify customer.

**Other failure paths:** - Invalid signature/callback: reject, do not
confirm, log event. - Amount mismatch: do not confirm; flag for
investigation. - Duplicate callback: idempotent response; no duplicate
booking/ticket. - Ticket generation failure after payment: keep
payment/booking confirmed, retry ticket generation and alert operations;
do not charge again. - Notification failure: ticket remains accessible
in customer account; retry notification. - Provider unavailable: show
clear message and permit retry only while hold remains valid.

**Required system actions:** - Calculate amount on server. - Use unique
order and payment-attempt references. - Verify provider notifications
securely. - Implement idempotent payment and booking confirmation. -
Coordinate payment confirmation with seat inventory safely. - Maintain
payment, booking and ticket state separately. - Generate secure ticket
references and QR codes. - Reconcile late, duplicate and ambiguous
payment results.

**Completion condition:** Payment is verified, booking is confirmed
exactly once, seats are committed and customer can access a valid
digital ticket.

## 11. Workflow 8 --- Theatre Entry and QR Verification

**Objective:** Allow authorized staff to scan a customer's QR ticket and
validate entry securely while preventing duplicate entry.

**Actors:** Customer, Ticket Checker/authorized Theatre Staff, Branch
Manager or Theatre Supervisor, SaaS platform.

**Preconditions:** Customer has a confirmed valid ticket; staff is
authenticated and assigned to correct branch/show; show is within
permitted entry window.

**Success path:** 1. Customer arrives at cinema entrance. 2. Customer
presents digital or printed QR ticket. 3. Ticket Checker opens
authorized scanning interface. 4. Staff scans QR code. 5. System
resolves opaque ticket reference against server records. 6. System
verifies token, booking status, show, branch and entry eligibility. 7.
System checks whether ticket has already been used. 8. If valid and
unused, system atomically marks ticket checked in. 9. System records
check-in time, staff identity and validation result. 10. Scanner
displays success. 11. Customer is permitted entry.

**Failure and exception paths:** - Invalid QR: reject. -
Cancelled/refunded booking: reject. - Unpaid/unconfirmed booking:
reject. - Wrong branch/show: reject and show mismatch. - Already-used
ticket: reject duplicate entry and show prior check-in status to
authorized staff. - Network unavailable: do not claim successful online
validation without authoritative check. Any future offline procedure
needs controlled synchronization and duplicate-entry safeguards. -
Scanner failure: allow authorized manual lookup using same server-side
validation rules. - Unauthorized staff: deny validation access or data
outside assignment.

**Required system actions:** - Validate against current server-side
records. - Check booking, payment, cancellation and refund status. -
Atomically mark ticket used. - Record staff, branch, show and
timestamp. - Provide clear valid/invalid/already-used responses. - Audit
manual overrides if permitted.

**Completion condition:** A valid ticket is checked in exactly once and
entry event is recorded.

## 12. Workflow 9 --- Counter Booking

**Objective:** Allow walk-in customers to purchase tickets at the cinema
counter using the same seat inventory as online bookings.

**Actors:** Customer, Box Office Operator/authorized Theatre Staff,
Branch Manager or Theatre Supervisor, SaaS platform, payment provider
for integrated UPI/card payments.

**Preconditions:** Branch and screen are active; show is published and
open for counter sales; staff has counter-booking permission; seats are
available.

**Success path:** 1. Customer visits cinema counter. 2. Box Office
Operator signs in. 3. Operator selects movie, show date and showtime. 4.
System displays current shared seat availability. 5. Operator selects
requested seats. 6. Server validates and temporarily reserves seats for
counter transaction using concurrency-safe operations. 7. System
calculates total. 8. Operator selects Cash, UPI or Card. 9. Operator
collects payment or completes integrated payment. 10. Operator records
or provider confirms payment result. 11. System confirms counter booking
and commits seats as sold. 12. System generates booking reference and
ticket QR code. 13. Operator prints ticket or provides digital
ticket/receipt. 14. System records operator, branch, show, seats,
payment method and transaction details.

**Failure and exception paths:** - Seat becomes unavailable: reject and
refresh layout. - Online customer holds same seat first: counter cannot
sell it; select another. - Cash payment not completed: cancel pending
counter transaction and release temporary hold. - UPI/card payment
fails: booking remains unconfirmed; operator may retry or select another
permitted method while hold remains valid. - Printer failure: confirmed
ticket remains retrievable/reprintable; do not charge again. - Duplicate
operator submission: idempotency prevents duplicate bookings/charges. -
Unauthorized refund/cancellation: reject unless permission exists.

**Required system actions:** - Use same inventory as online booking. -
Reserve seats atomically. - Record staff member and payment method. -
Confirm only after payment is recorded successful. - Generate same
secure ticket type as online bookings. - Support reprinting without
duplicate sale. - Maintain auditable counter transaction record.

**Completion condition:** Counter booking is confirmed, seats are
unavailable online, payment is recorded and valid ticket is issued.

## 13. Workflow 10 --- Cancellation and Refunds

**Objective:** Allow eligible customers or authorized cinema staff to
cancel bookings under the cinema company's configured policy and process
applicable refunds.

**Actors:** Customer, authorized Cinema Owner/Branch Manager/support
staff, SaaS platform, payment provider, notification service.

**Preconditions:** Booking exists; requester is authenticated and
authorized; booking is not already cancelled or fully refunded;
applicable policy is available.

**Success path:** 1. Customer opens booking history and selects a
booking. 2. System displays booking details and applicable cancellation
policy. 3. Customer requests cancellation. 4. System checks booking
status, show time, policy deadline and refund conditions. 5. System
calculates eligible refund, deductions and fees. 6. System displays
consequences and refund amount. 7. Customer confirms. 8. System records
cancellation request and updates booking through controlled state
transition. 9. System invalidates unused tickets. 10. System submits
refund to provider if due. 11. System records refund reference and
status. 12. System notifies customer of cancellation and expected refund
status. 13. System updates reports and audit records when refund
completes.

**Failure and exception paths:** - Outside allowed cancellation window:
reject or route for authorized review according to policy. - Already
cancelled: show existing status; do not create another cancellation. -
Ticket already checked in: normal cancellation rejected; authorized
exception may be required. - Refund provider failure: keep cancellation
and refund states distinct; mark pending/failed and allow safe
retry/investigation. - Partial refund: record original payment, refund
amount, deductions and final status. - Show cancelled by cinema: stop
further sales, identify affected bookings, invalidate affected tickets
and initiate applicable refund/resolution. - Unauthorized cancellation:
reject and record attempt. - Policy changed after booking: apply policy
version accepted at booking time unless applicable law or formally
defined exception requires otherwise.

**Required system actions:** - Store policy versions and policy accepted
at booking time. - Calculate refunds on server. - Separate booking
cancellation status from payment refund status. - Invalidate cancelled
tickets. - Prevent duplicate cancellation/refund requests. - Track
refund references, amounts, attempts and outcomes. - Notify customers of
material status changes. - Maintain audit trail.

**Completion condition:** Booking is cancelled under applicable policy,
associated tickets are invalidated, and eligible refund is completed or
tracked to a final outcome.

## 14. Recommended core status models

These are the proposed implementation baseline. Exact enums may be
refined during technical design.

### 14.1 Cinema application status

-   `DRAFT`
-   `PENDING_REVIEW`
-   `ACTION_REQUIRED`
-   `APPROVED`
-   `REJECTED`

Track active tenant/company lifecycle separately, for example: -
`ACTIVE` - `SUSPENDED` - `DEACTIVATED`

### 14.2 Seat inventory status per show

-   `AVAILABLE`
-   `HELD`
-   `BOOKED`
-   `BLOCKED`

A hold should include its owner/session or booking-attempt reference,
creation time and expiry time.

### 14.3 Booking status

-   `PENDING`
-   `CONFIRMED`
-   `CANCELLED`
-   `EXPIRED`
-   `REQUIRES_REVIEW`

Payment status is separate so delayed provider responses can be
reconciled safely.

### 14.4 Payment status

-   `CREATED`
-   `PENDING`
-   `SUCCESS`
-   `FAILED`
-   `UNKNOWN`
-   `REFUND_PENDING`
-   `PARTIALLY_REFUNDED`
-   `REFUNDED`

### 14.5 Ticket status

-   `ACTIVE`
-   `CHECKED_IN`
-   `CANCELLED`
-   `EXPIRED`

### 14.6 Refund status

-   `NOT_APPLICABLE`
-   `PENDING`
-   `PROCESSING`
-   `SUCCESS`
-   `FAILED`
-   `REQUIRES_REVIEW`

All state transitions must be validated server-side, not accepted as
arbitrary client updates.

## 15. Critical cross-workflow rules

### 15.1 Preventing double booking

-   Database must enforce a unique allocation for a seat within a show.
-   Seat holds must be created atomically.
-   Online and counter booking flows must use the same inventory service
    and constraints.
-   Expired holds must be safely released.
-   Client-side seat display is informational; server decides whether a
    seat can be held or sold.

### 15.2 Handling payment uncertainty

-   Browser redirect is not authoritative proof of payment.
-   Verify payment using provider-signed server notification and/or
    server-to-server status lookup.
-   Use idempotency keys and unique provider references.
-   Do not generate a confirmed ticket for failed payment.
-   Reconcile late successful payments against seat inventory before
    confirming.
-   If seats cannot safely be committed, initiate refund/review process.

### 15.3 Tenant and branch security

-   Every cinema-owned record must be associated with the correct
    tenant.
-   Branch-level records must reference the correct branch.
-   Server derives and validates access scope from authenticated
    membership and permissions.
-   Never rely only on tenant or branch ID supplied by browser.
-   Super Admin support access must be controlled and audited.

### 15.4 Auditability

Record at minimum: - Actor and role. - Tenant and branch context, where
applicable. - Action performed. - Affected record. - Timestamp. - Result
and failure reason, where appropriate. - Correlation/reference ID for
payment and booking operations.

Do not place passwords, payment credentials or sensitive personal data
in audit logs.

## 16. End-to-end MVP acceptance scenarios

The following scenarios should pass before core workflows are considered
implemented:

1.  A cinema applies, receives approval and its Cinema Owner can sign
    in.
2.  Owner creates two branches and assigns a different manager to each.
3.  A manager cannot access another branch without explicit permission.
4.  Administrator creates a screen and publishes a valid 3D seating
    layout.
5.  Administrator creates a movie and schedules a show without
    screen-time conflict.
6.  Customer selects seats and receives a 10-minute hold.
7.  A second customer cannot hold or buy the same seats.
8.  Customer can retry a failed payment while hold remains valid.
9.  Confirmed payment creates exactly one booking and valid QR ticket.
10. Delayed or duplicate payment notification does not create duplicate
    booking or ticket.
11. Counter operator cannot sell a seat held or booked online.
12. Counter sale immediately updates online seat availability.
13. Valid ticket can be checked in only once.
14. Cancelled or refunded ticket is rejected at entry.
15. Cancellation follows the policy version applicable to that booking.
16. Failed refund remains visible and can be reconciled without
    duplicate payment.
17. Tenant and branch isolation is enforced across all workflows.

## 17. Phase 0.4 outcome

**Status: Finalized.** The ten core workflows and selected operational
rules are documented, including normal success paths, exception paths,
responsible actors, system actions, status models and cross-workflow
safeguards.

------------------------------------------------------------------------

# Consolidated Product Decisions

This section summarizes the decisions that must remain consistent across
future design and implementation.

  -----------------------------------------------------------------------
  Area                                Current decision
  ----------------------------------- -----------------------------------
  Product                             Multi-tenant cinema management and
                                      movie ticket booking SaaS

  Target customers                    Independent cinemas and cinema
                                      chains

  Business model                      Hybrid SaaS direction; commercial
                                      details deferred

  Tenant model                        Each cinema company is a separate
                                      tenant

  Company structure                   One company can have multiple
                                      branches

  Main roles                          Super Admin, Cinema Owner, Branch
                                      Manager, Theatre Staff, Customer

  Owner permissions                   Owner can manage all branches in
                                      their own company

  Manager permissions                 Limited to assigned branches and
                                      granted permissions

  Staff permissions                   Task-specific; exact staff
                                      types/permissions to be detailed

  Customer identity                   One shared customer account across
                                      participating cinemas

  Platform                            Web only for MVP

  Customer experience                 Responsive desktop and mobile web

  Seat selection                      Interactive 3D experience in MVP

  Booking entry                       Cinema-specific booking experience
                                      initially

  Counter booking                     Included in MVP

  Marketplace                         Later release

  White-label                         Version 2

  Online seat hold                    10 minutes

  Payment retry                       Allowed while hold remains valid

  Counter payment                     Cash, UPI and Card

  Ticket issue                        After verified payment and
                                      confirmed booking

  Cancellation                        Cinema-specific configurable policy

  Inventory                           Shared authoritative inventory for
                                      online and counter sales

  Pricing plans                       Deferred

  Native mobile apps                  Future release
  -----------------------------------------------------------------------

# Phase 0 Sign-off and Next Phase

## Current status

-   **Phase 0.1 --- Business Model:** Direction finalized; pricing and
    subscription details intentionally deferred.
-   **Phase 0.2 --- User Roles and Permissions:** Main roles and broad
    permission boundaries finalized; detailed staff permission catalogue
    remains to be designed.
-   **Phase 0.3 --- Feature Scope:** Finalized.
-   **Phase 0.4 --- Business Workflows:** Finalized.

## Next: Phase 0.5 --- Technical and Product Requirements

The next phase should define technical requirements before
implementation begins. Proposed topics:

1.  Frontend technology and architecture.
2.  Backend technology and architecture.
3.  Database design and multi-tenant isolation.
4.  3D rendering technology and performance requirements.
5.  Payment gateway integration (including UPI).
6.  Authentication and security.
7.  API architecture.
8.  Hosting, deployment and cloud infrastructure.
9.  Performance, scalability and availability.
10. Backup, logging and monitoring.

**Working method:** Define one section, discuss trade-offs, finalize the
decision, document it, and only then move to the next section. Do not
begin implementation based on assumptions that have not been approved.
