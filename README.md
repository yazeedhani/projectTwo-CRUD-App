# Project Management Application

## Description
This application allows users to collaborate on a project my creating project dashboards and will allow a user to create, edit, delete, and comment on project tasks.

## User Story
1. A user can sign in or sign up.
2. When the user logs into their account, their homepage will be a list of their project dashboards.
3. A user can click on a project dashboard to view it.
4. Inside a project dashboard are 5 categories viewed as columns: Backlog, Need Help, In Progress, In Review, and Ready.
5. When a user creates a project, they type which timezone the team on the project is in, alongside the time, date, and day of the week.
6. The user can create a task and select which category to place it in.
7. A user is able to only delete their own tasks and project dashboards.
8. Users can comment on each others tasks when viewing a single task.
9. A user may be a part of other projects created by other users.
10. Once finished, the user may sign out.

## Wireframes
![SignUp](/Wireframes&ERD/Screen%201.png)
![SignIn](/Wireframes&ERD/Screen%202.png)
![Project Dashboard](/Wireframes&ERD/Screen%203.png)
![Create New Task](/Wireframes&ERD/Screen%204.png)
![Create New Project](/Wireframes&ERD/Screen%205.png)
![My Project](/Wireframes&ERD/Screen%206.png)
![A Task](/Wireframes&ERD/Screen%207.png)

## ERD
![ERD](/Wireframes&ERD/ERD.jpeg)

## RESTful routes for resource Project
| HTTP Verb | Path | Controller | Used for |
|-----------|------|------------|----------|
| GET | /projects/mine | projects#index | display a list of all the projects for the logged in user |

## Technologies Used
- NodeJS
- Vanilla JS
- LiquidJS
- MongoDB
- Mongoose
- CSS
- HTML
- ExpressJS

## MVP
- Get user to sign up and log in.
- Get user to create a project dashboard and create news tasks for a category.
- Get user to delete project dashboards and tasks
- Get user to edit their own tasks
- Get user to comment on tasks.
- Get user to add other users to their projects.


## Stretch Plan
- Create drag and drop for tasks.
