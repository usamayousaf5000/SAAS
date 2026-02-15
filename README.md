# SmartBook - AI Appointment Scheduling

A full-stack web application that uses conversational AI to simplify appointment booking. Built as a technical assessment to demonstrate end-to-end development capabilities.

## What This Is

SmartBook lets users book appointments by chatting naturally with an AI assistant. Instead of filling out forms, users can say "I need an appointment next Tuesday at 2pm" and the system handles the rest.

The project showcases:
- Clean separation between frontend and backend
- Practical API and database design
- Thoughtful UI/UX implementation
- Integration with a third-party AI service (Mistral AI)

## Architecture

**Frontend**: Next.js with React for the user interface  
**Backend**: Node.js/Express serving a RESTful API  
**Database**: PostgreSQL for data persistence  
**AI**: Mistral AI for natural language processing

The frontend communicates with the backend via REST APIs. The backend handles authentication, database operations, and proxies requests to the AI service to keep API keys secure.

## Key Features

- **Authentication**: JWT-based signup and login
- **Conversational Booking**: Chat with an AI to schedule appointments
- **Appointment Management**: View, edit, cancel, and delete bookings
- **Session History**: Multiple chat conversations with persistent history
- **Calendar Integration**: Export appointments to Google Calendar

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Mistral API key (optional - app works without it using mock responses)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd SAAS
   npm run install:all
   ```

2. **Set up the database**
   ```bash
   createdb booking_app
   psql -d booking_app -f db/schema.sql
   ```

3. **Configure environment variables**
   
   Create `server/.env`:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=booking_app
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   MISTRAL_API_KEY=your_mistral_key  # Optional
   ```

   Create `client/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Project Structure

```
├── client/              # Next.js frontend
│   ├── src/
│   │   ├── app/        # Pages and routes
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # React context providers
│   │   └── services/   # API client
├── server/             # Express backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, errors
│   │   ├── services/     # AI integration
│   │   └── config/       # Database connection
└── db/                 # Database schema
```

## Design Decisions

### Why These Choices?

**Monolithic Architecture**: Chose a modular monolith over microservices for simplicity and faster development. The codebase is still organized into clear domains (auth, chat, appointments) that could be split later if needed.

**Polling vs WebSockets**: Messages refresh every 10 seconds via polling rather than WebSockets. This is simpler to implement and sufficient for a booking use case where real-time updates aren't critical.

**Client-Side State**: Used React Context instead of Redux or Zustand. The app's state is simple enough that Context provides all the functionality we need without extra dependencies.

**JWT Without Refresh Tokens**: Tokens expire after 24 hours with no refresh mechanism. This is acceptable for a prototype but would need improvement for production (refresh tokens, sliding sessions, etc.).

**AI as a Proxy**: The backend proxies AI requests rather than calling Mistral directly from the frontend. This keeps API keys secure and allows us to sanitize/validate AI responses before they reach the client.

**No Form Validation Library**: Validation is handled manually in controllers. For a larger app, I'd use something like Zod or Joi, but manual validation keeps dependencies minimal and demonstrates understanding of the fundamentals.

### Tradeoffs

**Security vs Convenience**: Session ownership verification was removed from the chat controller to reduce database queries. The foreign key constraints and auth middleware provide sufficient protection.

**Performance vs Simplicity**: No caching layer (Redis) or query optimization. Database queries are straightforward and would be the first place to optimize if performance became an issue.

**UX vs Complexity**: The AI sometimes requires multiple back-and-forth messages to gather all booking details. A hybrid approach (AI + form) might be faster, but pure conversation feels more natural.

## Known Limitations

- **No double-booking prevention**: The system doesn't check for scheduling conflicts
- **Limited AI error handling**: If the AI returns malformed JSON, the booking silently fails
- **No email notifications**: Users don't receive confirmation emails
- **Basic error messages**: Error handling could be more user-friendly
- **No rate limiting per user**: Only global rate limiting is implemented
- **Client-side route protection**: Protected routes rely on client-side checks (backend is secure)

## API Overview

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in

### Chat
- `GET /api/chat/sessions` - List conversations
- `POST /api/chat/sessions` - Start new conversation
- `GET /api/chat/sessions/:id/messages` - Get messages
- `POST /api/chat/messages` - Send message
- `DELETE /api/chat/sessions/:id` - Delete conversation

### Appointments
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

All endpoints except `/auth/*` require a valid JWT token in the `Authorization` header.

## Testing the App

1. **Register an account** at http://localhost:3000/register
2. **Log in** with your credentials
3. **Start a chat** and try booking an appointment:
   - "I need an appointment tomorrow at 3pm"
   - "Book me for next Monday at 10am for a consultation"
4. **View your appointments** in the History tab
5. **Edit or cancel** bookings as needed

## What I'd Do Differently in Production

- Add comprehensive test coverage (unit, integration, e2e)
- Implement proper logging and monitoring
- Add database migrations instead of raw SQL
- Use a proper secret management solution
- Implement rate limiting per user
- Add email notifications
- Improve error handling and user feedback
- Add WebSocket support for real-time updates
- Implement proper session management with refresh tokens
- Add input sanitization and validation libraries
- Deploy with CI/CD pipeline
- Add database backups and disaster recovery

## Development Notes

The codebase prioritizes readability and maintainability over clever abstractions. I've avoided over-engineering while still demonstrating solid architectural patterns.

Comments are minimal because the code should be self-documenting. Where complexity is unavoidable (like the AI response parsing), I've kept the logic as straightforward as possible.

The UI is clean and functional without being flashy. I focused on usability over aesthetics, though the design is modern and professional.

---

Built by [Your Name] as a technical assessment for [Company Name]
