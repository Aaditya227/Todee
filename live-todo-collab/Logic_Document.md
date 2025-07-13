:- Logic Document - Collaborative Todo Board

How Smart Assign Works

# What it does
Smart Assign is basically like having a fair manager who automatically gives tasks to whoever has the least work to do.

# How I built it
Here's the simple logic :

# Technology: 
- Frontend: React.js (no UI libraries), CSS , Socket.IO client
- Backend: Node.js, Express.js, MongoDB, Mongoose, Socket.IO server
- Authentication: JWT + Bcrypt for hashing passwords
- Deployment:
  - Frontend: Vercel
  - Backend: Render (MongoDB Atlas as database)

:- Authentication (Login / Register)
- Created custom registration and login forms.
- Passwords are hashed using `bcrypt` before storing in MongoDB.
- Used JWT to generate token on login and store it in localStorage for further authenticated requests.


:- Kanban Board
- Three columns: Todo, In Progress, Done.
- Tasks can be dragged and dropped between columns using `react-beautiful-dnd`.
- Tasks include: `title`, `description`, `status`, `assigned user`.


:- Keeping data clean
Here's how I make sure nothing breaks:

1. Track when things change: Every time someone edits a task, the app records the timestamp. This way we know what happened when.

2. Form validation: When creating or editing tasks, the app won't let you save unless you fill in the required stuff (like the task title).

3. Unique IDs: Each task gets a unique ID based on when it was created, so we never have duplicate tasks.


# Real Examples

Example 1: Smart Assignment**
- Team situation: Sarah has 2 tasks, Mike has 1 task, John has 3 tasks
- Someone clicks "Smart Assign" on a new task
- App thinks: "Mike has the least work, let's give it to him"
- Result: Task goes to Mike, keeping things balanced

Example 2: Moving Tasks
- User drags a task from "To Do" to "In Progress"
- What happens:
  1. You see it move instantly on screen
  2. App updates the task status in memory
  3. Timestamp gets updated
  4. Everything else updates automatically

Example 3: Bad Data
- Someone tries to create a task without a title
- Form says "Nope, you need a title"
- Task doesn't get created until they fix it
- Database stays clean



:- How I Prevent Problems

1. Everything in one place: All task data lives in one spot, so no conflicting information
2. Show changes instantly: Users see what happened right away, no confusion
3. Stop bad stuff early: Multiple validation checks prevent broken data
4. One thing at a time: Each action gets completed fully before moving to the next
5. Clear feedback: Users always know what's happening with visual cues

