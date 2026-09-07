# Library Frontend

Angular Frontend for the Library Platform

## Overview

This repository represents the fourth phase of a multi-stage software architecture mentoring journey.

It provides a modern Angular frontend for the Library Platform, integrating with a distributed microservices ecosystem through REST APIs, WebSocket notifications and Keycloak-based authentication.

The application offers features such as catalogue management, loan workflows, purchase requests, user administration, dashboards and real-time notifications, providing a complete user experience on top of the backend platform.

## Mentoring Journey

This project was developed as part of a structured mentoring program focused on software architecture and backend engineering.

Throughout the mentoring journey, architectural decisions were regularly reviewed and discussed with my mentor.

The previous phases focused primarily on backend development, Domain-Driven Design, Event Sourcing, CQRS and distributed systems. This final phase introduces a frontend application capable of exercising and demonstrating the complete platform.

Particular attention was given to:

- frontend integration with distributed services;
- authentication and authorization through Keycloak;
- role-based user experiences;
- real-time updates through WebSocket communication;
- dashboard visualization and reporting;
- complete end-to-end business workflows.

## Learning Journey

This repository represents the fourth phase of a multi-stage evolution of the same business domain.

| Phase | Technology | Main Focus |
|---------|---------|---------|
| Phase 1 | Node.js + TypeScript | Learning a new ecosystem while exploring DDD and Event Sourcing |
| Phase 2 | Java + Spring Boot Monolith | Consolidating architectural concepts in a familiar ecosystem |
| Phase 3 | Java + Spring Boot Microservices | Applying the lessons learned to a distributed architecture |
| Phase 4 | Angular Frontend | Providing a user interface for the distributed platform and demonstrating complete end-to-end workflows |

This implementation represents the user-facing layer of the architecture developed throughout the previous repositories. 

## About This Repository

My primary area of expertise is backend development and software architecture.

This repository was developed outside my primary area of specialization and served as an opportunity to explore frontend technologies while building a complete user experience for the Library Platform.

Unlike the backend repositories, the objective was not to study Angular in depth or become a frontend specialist. Instead, the focus was on delivering a practical application capable of integrating with a distributed backend ecosystem and supporting real business workflows.

The implementation was developed with significant support from AI-assisted development tools.

The overall application design, backend integration, security model, user workflows and feature set were defined as part of the broader platform architecture. AI was primarily used as a development companion, helping to accelerate implementation, understand Angular-specific concepts and evaluate alternative solutions.

This approach allowed the project to be completed using technologies outside my primary area of expertise while maintaining responsibility for architectural decisions, integration work and validation of the resulting application.

## Main Features

The application provides user interfaces for:

- catalogue management;
- book subscriptions;
- loan lifecycle management;
- purchase request workflows;
- purchase request voting;
- user administration;
- dashboards and statistics;
- role-based authorization;
- real-time notifications.

Supported roles include:

- READER;
- LIBRARIAN;
- ADMIN.

Authentication and authorization are delegated to Keycloak and fully integrated with the backend security model.

## Technology Stack

The frontend is implemented using:

- Angular 21;
- Angular Standalone Components;
- Angular Signals;
- Angular Material 3;
- SCSS;
- Chart.js;
- Keycloak;
- STOMP / WebSocket.

The application communicates with the backend platform through the API Gateway and receives real-time updates through the Notification Service.

## UI Architecture

Although frontend engineering was not the primary focus of this phase, the user interface was designed with an emphasis on consistency, maintainability and usability.

Styling responsibilities are organized into dedicated SCSS resources:

- `variables.scss` for colors, spacing, typography, breakpoints and theme-related values;
- `layout.scss` for page structure, responsive layouts and shared layout utilities;
- `components.scss` for reusable component-level styling patterns.

The application also includes:

- responsive layouts for desktop and mobile devices;
- light, dark and system theme support;
- centralized design variables;
- reusable visual styling conventions;
- accessibility-oriented features such as focus visibility and screen-reader support.

These conventions help maintain a consistent visual experience across the application while keeping styling concerns separated from business functionality.

## State Management and Real-Time Updates

Application state is managed through feature-specific stores built with Angular Signals.

Dedicated stores are provided for:

- books;
- loans;
- users;
- operators;
- purchase requests.

The frontend integrates with the Notification Service through WebSocket and STOMP-based communication.

Business events received from the backend are propagated to the corresponding stores, allowing the user interface to react automatically to:

- catalogue updates;
- loan lifecycle changes;
- user management events;
- purchase request updates;
- system notifications.

This approach keeps the user interface synchronized with the distributed backend platform without relying solely on periodic HTTP refreshes.

## Testing

Automated frontend tests were not implemented for this repository.

The primary goal of the project was to provide a user-facing layer capable of demonstrating and exercising the distributed backend platform rather than exploring frontend testing strategies.

Given the educational objectives of the mentoring journey and my focus on backend architecture, development effort was intentionally concentrated on platform integration, authentication, real-time communication and end-to-end business workflows.

Comprehensive testing remains concentrated in the backend repositories, which include unit, integration and end-to-end tests.

## Running the Application

### Prerequisites

Before starting the frontend, the backend platform must already be running.

See the backend repository for instructions on starting the infrastructure and microservices environment.

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
ng serve
```

The application will be available at:

```text
http://localhost:4200
```

## Lessons Learned

This phase of the mentoring journey exposed me to technologies and development practices that were largely outside my previous experience.

The most valuable aspect of the project was discovering how AI-assisted development tools can accelerate implementation when working with technologies that are not part of one's core expertise.

At the same time, the experience reinforced an important lesson: AI can significantly improve productivity, but it does not replace software engineering skills. Understanding requirements, validating generated code, integrating multiple systems and making architectural decisions remain the responsibility of the developer.

Building this application also provided a better understanding of how frontend and backend concerns interact within a complete software platform and how a user interface consumes and exposes the capabilities of a distributed backend architecture.

## License

See the LICENSE file for licensing information.

## Feedback

Bug reports, suggestions and constructive feedback are welcome through GitHub Issues.