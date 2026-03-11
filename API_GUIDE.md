# API Guide for Treasure Hunt Backend

Base URL for all API routes: `/api/v1`

---

## 1. Authentication & Team Routes

**Base Path:** `/users`

### `POST /signup`
Register a new team or admin.
- **Request Body (JSON):**
  ```json
  {
    "name": "Team Name",
    "email": "team@example.com",
    "password": "securepassword123",
    "role": "participant" // or "admin"
  }
  ```
- **Response:** `201 Created` with user details.

### `POST /login`
Login to an existing account.
- **Request Body (JSON):**
  ```json
  {
    "name": "Team Name",
    "password": "securepassword123"
  }
  ```
- **Response:** `200 OK`
  - Returns access & refresh tokens securely in HTTP-only cookies.
  - Returns user data and tokens in the JSON response.

### `POST /logout`
Logout the currently authenticated user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` (clears cookies).

### `POST /change-password`
Change current user's password.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (JSON):**
  ```json
  {
    "oldpassword": "currentpassword",
    "newpassword": "newpassword123"
  }
  ```
- **Response:** `200 OK`

### `GET /current`
Get currently authenticated user details.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` containing current user object.

### `POST /refresh-token`
Refresh user's access token.
- **Request Details:** Token read from `cookies.refreshToken` or `req.body.refreshToken`.
- **Response:** `200 OK` sets new tokens in cookies and returns them in JSON.

### `DELETE /delete`
Delete the current user account.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`

---

## 2. Team Progress Routes

**Base Path:** `/teamProgress`
*(Requires Authentication & Event to be "active")*

### `GET /progress`
Fetch the team's current progress, score, and the clue for their current location.
- **Response:** `200 OK`
  ```json
  {
    "teamId": "id",
    "currentRound": 1,
    "currentLocation": "Location Name",
    "score": 10,
    "clue": { /* clue object */ }
  }
  ```

### `GET /clueHint`
Fetch the hint for the current clue.
- **Note:** Deducts 5 points from the team's score on the first usage.
- **Response:** `200 OK` containing clue hint string.

---

## 3. QR Code & Puzzle Routes

**Base Path:** `/qrCode`
*(Requires Authentication & Event to be "active")*

### `GET /checkQrLocation/:locId`
Check if the scanned QR code corresponds to the team's currently assigned location. If correct, awards 10 points and reveals the puzzle.
- **Path Params:** `locId` (Location ID)
- **Response:** `200 OK` containing the puzzle data.

### `GET /getPuzzleHint/:locId`
Fetch the hint for the puzzle at the specified location.
- **Path Params:** `locId` (Location ID)
- **Note:** Deducts 5 points from the score.
- **Response:** `200 OK` containing the puzzle hint.

### `POST /checkPuzzleAnswer/:locId`
Submit an answer for the puzzle at the current location.
- **Path Params:** `locId` (Location ID)
- **Request Body (JSON):**
  ```json
  {
    "answer": "your answer here"
  }
  ```
- **Response:** 
  - `200 OK` if the answer is correct (advances team to next round, updates score).
  - `400 Bad Request` if the answer is incorrect.

### `POST /giveUpPuzzle/:locId`
Give up on the current puzzle to proceed to the next round.
- **Path Params:** `locId` (Location ID)
- **Note:** Deducts 5 points from the score and advances the team.
- **Response:** `200 OK`

---

## 4. Location Routes

**Base Path:** `/location`

### `POST /create-location`
Create a new location with its clues and puzzles.
- **Headers:** `Authorization: Bearer <token>` (Admin Only)
- **Request Body (FormData / Multipart):**
  - `name` (required string)
  - `answer` (required string for puzzle)
  - `clueText`, `clueHint`, `puzzleText`, `puzzleHint` (optional strings)
  - **Files:** `clueImage`, `clueAudio`, `puzzleImage`, `puzzleAudio` (all optional, up to 1 file each)
- **Note:** At least one form of clue (text, image, audio) and one form of puzzle (text, image, audio) is required.

### `GET /get-locations`
Get a list of all locations.
- **Headers:** `Authorization: Bearer <token>` (Admin Only)
- **Response:** `200 OK` array of location objects.

### `GET /get-location/:locationId`
Get data for a single location by ID.
- **Headers:** `Authorization: Bearer <token>`
- **Path Params:** `locationId`
- **Response:** `200 OK` single location object.

### `DELETE /delete-location/:locationId`
Delete a specific location.
- **Headers:** `Authorization: Bearer <token>` (Admin Only)
- **Path Params:** `locationId`
- **Response:** `200 OK`

---

## 5. Admin Routes

**Base Path:** `/admin`
*(Requires Authentication & Admin Role)*

### `GET /team/:teamId`
Get detailed progress of a specific team, including their route logs, scores, and hints used per round.
- **Path Params:** `teamId`
- **Response:** `200 OK` containing summary, round logs, and route details.

### `GET /dashboard`
Get dashboard data containing the leaderboard, sorted by rounds completed, then score, then completion time.
- **Response:** `200 OK`
  ```json
  {
    "summary": { "totalTeams": 10, "finishedTeams": 2 },
    "leaderboard": [ /* sorted array of teams */ ],
    "hintUsage": [ /* hint usage per team */ ]
  }
  ```

### `POST /start-event`
Change event status to 'active'. Provides access to progress and QR code routes.
- **Response:** `201 Created`

### `POST /stop-event`
Change event status to 'completed'. Stops access to active event routes.
- **Response:** `201 Created`

### `POST /upcoming-event`
Change event status to 'upcoming'.
- **Response:** `201 Created`
