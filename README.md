# Flask Work Block Tracker

A Flask-based application for tracking daily work blocks with Toggl Track-like functionality and calendar view (Notion/Jira style).

## Features

- **Daily Page**: Track work blocks with start/stop timer functionality
- **Calendar View**: Visualize work blocks in a monthly/weekly/daily calendar
- **Project & Task Management**: Create and organize projects and tasks
- **Time Tracking**: Start/stop tracking with actual time recording
- **Drag & Drop**: Move and resize events in calendar view
- **Color-coded Projects**: Visual distinction between different projects

## Installation

### Prerequisites
- Python 3.7+
- pip

### Steps

1. **Install dependencies**:
```bash
pip install flask flask-sqlalchemy
```

2. **Run the application**:
```bash
python app.py
```

3. **Access the application**:
Open your browser and navigate to:
- Daily view: `http://127.0.0.1:5000/today`
- Calendar view: `http://127.0.0.1:5000/calendar`

## Project Structure

```
/app
├── app.py                 # Main Flask application
├── worktracker.db         # SQLite database (created automatically)
├── /templates
│   ├── daily.html         # Daily work blocks page
│   └── calendar.html      # Calendar view page
└── /static
    ├── /css
    │   └── style.css      # Application styles
    └── /js
        ├── daily.js       # Daily page functionality
        └── calendar.js    # Calendar functionality
```

## Usage

### Adding Projects and Tasks

1. In the "Today" page, use the **Add Project** form to create new projects
2. Use the **Add Task** form to create tasks under a project
3. Each project can have a custom color for visual distinction

### Creating Work Blocks

**Daily Page:**
- Fill in start time, end time, select project and task
- Click "Add Work Block"

**Calendar View:**
- Click on any date to open the modal
- Fill in the time and task details
- Click "Add Work Block"

### Time Tracking

1. Click the **▶️ Start** button to begin tracking
2. The button changes to **⏹️ Stop** with a running indicator
3. Click **⏹️ Stop** to end tracking
4. Only one task can be tracked at a time

### Managing Work Blocks

- **Delete**: Click the 🗑️ button to remove a work block
- **Edit (Calendar)**: Drag and drop events to reschedule
- **Resize (Calendar)**: Drag event edges to change duration

## Database Schema

### Projects
- `id`: Primary key
- `name`: Project name
- `color`: Hex color code

### Tasks
- `id`: Primary key
- `project_id`: Foreign key to Projects
- `name`: Task name
- `category`: Task category (optional)

### WorkBlocks
- `id`: Primary key
- `task_id`: Foreign key to Tasks
- `planned_start`: Scheduled start time
- `planned_end`: Scheduled end time
- `actual_start`: Actual start time (when tracking starts)
- `actual_end`: Actual end time (when tracking stops)
- `is_running`: Boolean flag for active tracking

## API Endpoints

### Work Blocks
- `GET /api/blocks` - Get all work blocks (with date filtering)
- `POST /api/blocks` - Create a new work block
- `PUT /api/blocks/<id>` - Update a work block
- `DELETE /api/blocks/<id>` - Delete a work block

### Time Tracking
- `POST /api/tracker/<id>/start` - Start tracking a work block
- `POST /api/tracker/<id>/stop` - Stop tracking a work block

### Projects & Tasks
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/tasks` - Get all tasks (optional project_id filter)
- `POST /api/tasks` - Create a new task

## Sample Data

The application comes with sample data:
- **Project B** with Task C1 (Development)
- **Project M** with Task M3 (Research)
- Two work blocks scheduled for today (9:00-10:00 and 13:00-15:00)

## Customization

### Change Database Location
Edit `app.py`:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///path/to/your/database.db'
```

### Change Secret Key
Edit `app.py`:
```python
app.config['SECRET_KEY'] = 'your-secure-secret-key'
```

### Modify Colors and Styling
Edit `static/css/style.css` to customize the appearance

## Technologies Used

- **Backend**: Flask, Flask-SQLAlchemy
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript
- **Calendar Library**: FullCalendar.js v6.1.10

## Future Enhancements

- User authentication and multi-user support
- Statistics and reporting dashboard
- Export data to CSV/PDF
- Notifications and reminders
- Mobile responsive improvements
- Dark mode

## License

This project is open-source and available for personal and commercial use.

## Support

For issues or questions, please create an issue in the repository or contact the developer.
