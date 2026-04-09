// =====================================
// PROJECT MANAGEMENT TOOL - JavaScript
// =====================================

// Sample Data
const sampleProjects = [
    { id: 1, name: 'Website Redesign', description: 'Redesign company website with modern UI', color: '#4f46e5', deadline: '2024-02-15' },
    { id: 2, name: 'Mobile App Development', description: 'Build iOS and Android app', color: '#10b981', deadline: '2024-03-01' },
    { id: 3, name: 'Marketing Campaign', description: 'Q1 marketing and social media campaign', color: '#f59e0b', deadline: '2024-01-31' }
];

const sampleTasks = [
    { id: 1, title: 'Design homepage mockup', description: 'Create wireframes and mockups for the new homepage', projectId: 1, status: 'done', priority: 'high', assignee: 1, dueDate: '2024-01-20' },
    { id: 2, title: 'Implement navigation', description: 'Build responsive navigation component', projectId: 1, status: 'in-progress', priority: 'medium', assignee: 2, dueDate: '2024-01-25' },
    { id: 3, title: 'Set up backend API', description: 'Create REST API endpoints', projectId: 2, status: 'in-progress', priority: 'high', assignee: 1, dueDate: '2024-01-28' },
    { id: 4, title: 'Design app icons', description: 'Create app icons for iOS and Android', projectId: 2, status: 'todo', priority: 'medium', assignee: 3, dueDate: '2024-02-05' },
    { id: 5, title: 'Write blog posts', description: 'Create 5 blog posts for campaign', projectId: 3, status: 'review', priority: 'low', assignee: 4, dueDate: '2024-01-22' },
    { id: 6, title: 'Social media calendar', description: 'Plan social media content calendar', projectId: 3, status: 'todo', priority: 'medium', assignee: 4, dueDate: '2024-01-30' },
    { id: 7, title: 'User authentication', description: 'Implement login and registration', projectId: 2, status: 'todo', priority: 'high', assignee: 1, dueDate: '2024-02-10' },
    { id: 8, title: 'SEO optimization', description: 'Optimize website for search engines', projectId: 1, status: 'todo', priority: 'medium', assignee: 2, dueDate: '2024-02-08' }
];

const sampleTeam = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Project Manager', avatar: 'JS' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Developer', avatar: 'SJ' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', role: 'Designer', avatar: 'MD' },
    { id: 4, name: 'Emily Brown', email: 'emily@example.com', role: 'Marketing', avatar: 'EB' }
];

// Application State
let projects = [...sampleProjects];
let tasks = [...sampleTasks];
let team = [...sampleTeam];
let currentUser = team[0];
let selectedProject = null;
let currentMonth = new Date();
let currentTaskFilter = 'all';
let taskView = 'list';
let editingProject = null;
let editingTask = null;

// =====================================
// PAGE NAVIGATION
// =====================================

function showPage(pageName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[onclick="showPage('${pageName}')"]`);
    if (navItem) navItem.classList.add('active');

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');

    // Show target page
    const page = document.getElementById(pageName + 'Page');
    if (page) {
        page.style.display = 'block';
    }

    // Load page content
    switch (pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'projects':
            loadProjects();
            break;
        case 'tasks':
            loadMyTasks();
            break;
        case 'calendar':
            loadCalendar();
            break;
        case 'team':
            loadTeam();
            break;
    }
}

// =====================================
// DASHBOARD
// =====================================

function loadDashboard() {
    updateStats();
    loadRecentTasks();
    loadProjectProgress();
    loadUpcomingDeadlines();
    loadTeamActivity();
    loadSidebarProjects();
}

function updateStats() {
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.status === 'done').length;
    
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueSoon = tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return t.status !== 'done' && dueDate <= weekFromNow && dueDate >= today;
    }).length;
    document.getElementById('dueSoon').textContent = dueSoon;
}

function loadRecentTasks() {
    const container = document.getElementById('recentTasks');
    const recentTasks = tasks.slice(0, 5);
    
    container.innerHTML = recentTasks.map(task => createTaskItem(task)).join('');
}

function createTaskItem(task) {
    const isCompleted = task.status === 'done';
    const assignee = team.find(m => m.id === task.assignee);
    
    return `
        <div class="task-item ${isCompleted ? 'completed' : ''}" onclick="openTaskDetail(${task.id})">
            <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="event.stopPropagation(); toggleTask(${task.id})">
                ${isCompleted ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}</span>
                </div>
            </div>
        </div>
    `;
}

function loadProjectProgress() {
    const container = document.getElementById('projectProgress');
    
    container.innerHTML = projects.map(project => {
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const completed = projectTasks.filter(t => t.status === 'done').length;
        const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
        
        return `
            <div class="progress-item">
                <div class="progress-header">
                    <span class="progress-title">${project.name}</span>
                    <span class="progress-value">${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%; background: ${project.color}"></div>
                </div>
            </div>
        `;
    }).join('');
}

function loadUpcomingDeadlines() {
    const container = document.getElementById('upcomingDeadlines');
    const today = new Date();
    
    const upcomingTasks = tasks
        .filter(t => t.status !== 'done' && new Date(t.dueDate) >= today)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4);
    
    container.innerHTML = upcomingTasks.map(task => {
        const project = projects.find(p => p.id === task.projectId);
        const dueDate = new Date(task.dueDate);
        const day = dueDate.getDate();
        const month = dueDate.toLocaleString('default', { month: 'short' });
        
        return `
            <div class="deadline-item">
                <div class="deadline-date">
                    <span class="deadline-day">${day}</span>
                    <span class="deadline-month">${month}</span>
                </div>
                <div class="deadline-info">
                    <div class="deadline-title">${task.title}</div>
                    <div class="deadline-project">${project ? project.name : 'No project'}</div>
                </div>
            </div>
        `;
    }).join('');
}

function loadTeamActivity() {
    const container = document.getElementById('teamActivity');
    const activities = [
        { user: team[1], action: 'completed task', target: 'Design homepage mockup', time: '2 hours ago' },
        { user: team[0], action: 'created project', target: 'Website Redesign', time: '5 hours ago' },
        { user: team[2], action: 'added task', target: 'Design app icons', time: '1 day ago' },
        { user: team[3], action: 'submitted for review', target: 'Write blog posts', time: '2 days ago' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-avatar">${activity.user.avatar}</div>
            <div class="activity-content">
                <div class="activity-text">
                    <strong>${activity.user.name}</strong> ${activity.action} <strong>${activity.target}</strong>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function loadSidebarProjects() {
    const container = document.getElementById('sidebarProjects');
    container.innerHTML = projects.map(project => `
        <div class="project-item" onclick="viewProject(${project.id})">
            <span class="project-dot" style="background: ${project.color}"></span>
            <span>${project.name}</span>
        </div>
    `).join('');
}

// =====================================
// PROJECTS
// =====================================

function loadProjects() {
    const container = document.getElementById('projectsGrid');
    
    container.innerHTML = projects.map(project => {
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const completed = projectTasks.filter(t => t.status === 'done').length;
        const projectTeam = [...new Set(projectTasks.map(t => t.assignee))].map(id => team.find(m => m.id === id)).filter(Boolean);
        
        return `
            <div class="project-card" style="border-top-color: ${project.color}" onclick="viewProject(${project.id})">
                <div class="project-card-header">
                    <h3 class="project-card-title">${project.name}</h3>
                    <button class="project-card-menu" onclick="event.stopPropagation(); deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="project-card-desc">${project.description}</p>
                <div class="project-card-stats">
                    <div class="project-stat">
                        <span class="project-stat-value">${projectTasks.length}</span>
                        <span class="project-stat-label">Tasks</span>
                    </div>
                    <div class="project-stat">
                        <span class="project-stat-value">${completed}</span>
                        <span class="project-stat-label">Completed</span>
                    </div>
                </div>
                <div class="project-card-footer">
                    <div class="project-team">
                        ${projectTeam.slice(0, 3).map(member => `
                            <div class="avatar">${member.avatar}</div>
                        `).join('')}
                    </div>
                    <span class="project-deadline"><i class="fas fa-calendar"></i> ${formatDate(project.deadline)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function viewProject(projectId) {
    selectedProject = projects.find(p => p.id === projectId);
    if (!selectedProject) return;
    
    document.getElementById('projectDetailTitle').textContent = selectedProject.name;
    document.getElementById('projectDetailDescription').textContent = selectedProject.description;
    
    loadKanbanBoard();
    
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById('projectDetailPage').style.display = 'block';
}

function loadKanbanBoard() {
    const projectTasks = tasks.filter(t => t.projectId === selectedProject.id);
    
    const statuses = ['todo', 'in-progress', 'review', 'done'];
    statuses.forEach(status => {
        const statusTasks = projectTasks.filter(t => t.status === status);
        const container = document.getElementById(status === 'in-progress' ? 'inProgressTasks' : status + 'Tasks');
        const countEl = document.getElementById(status === 'in-progress' ? 'inProgressCount' : status + 'Count');
        
        countEl.textContent = statusTasks.length;
        container.innerHTML = statusTasks.map(task => createKanbanTask(task)).join('');
    });
}

function createKanbanTask(task) {
    const assignee = team.find(m => m.id === task.assignee);
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
    
    return `
        <div class="kanban-task" draggable="true" ondragstart="dragStart(event, ${task.id})" onclick="openTaskDetail(${task.id})">
            <div class="kanban-task-title">${task.title}</div>
            <div class="kanban-task-meta">
                <span class="kanban-task-due ${isOverdue ? 'overdue' : ''}">
                    <i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}
                </span>
                ${assignee ? `<div class="kanban-task-assignee">${assignee.avatar}</div>` : ''}
            </div>
        </div>
    `;
}

function saveProject(event) {
    event.preventDefault();
    
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDescription').value;
    const deadline = document.getElementById('projectDeadline').value;
    const color = document.getElementById('projectColor').value;
    
    if (editingProject) {
        const project = projects.find(p => p.id === editingProject);
        project.name = name;
        project.description = description;
        project.deadline = deadline;
        project.color = color;
        editingProject = null;
    } else {
        const newProject = {
            id: Date.now(),
            name,
            description,
            deadline,
            color
        };
        projects.push(newProject);
    }
    
    closeModal('project');
    event.target.reset();
    loadProjects();
    loadSidebarProjects();
    showToast('Project saved successfully', 'success');
}

function deleteProject(projectId) {
    if (!confirm('Delete this project and all its tasks?')) return;
    
    projects = projects.filter(p => p.id !== projectId);
    tasks = tasks.filter(t => t.projectId !== projectId);
    
    loadProjects();
    loadSidebarProjects();
    showToast('Project deleted');
}

function editCurrentProject() {
    if (!selectedProject) return;
    
    editingProject = selectedProject.id;
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    document.getElementById('projectName').value = selectedProject.name;
    document.getElementById('projectDescription').value = selectedProject.description;
    document.getElementById('projectDeadline').value = selectedProject.deadline;
    document.getElementById('projectColor').value = selectedProject.color;
    
    showModal('project');
}

// =====================================
// TASKS
// =====================================

function loadMyTasks() {
    let filteredTasks = [...tasks];
    
    if (currentTaskFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.status === currentTaskFilter);
    }
    
    const container = document.getElementById('tasksContainer');
    
    if (taskView === 'list') {
        container.innerHTML = filteredTasks.map(task => {
            const project = projects.find(p => p.id === task.projectId);
            const isCompleted = task.status === 'done';
            const isOverdue = new Date(task.dueDate) < new Date() && !isCompleted;
            
            return `
                <div class="task-card ${isCompleted ? 'completed' : ''}" onclick="openTaskDetail(${task.id})">
                    <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="event.stopPropagation(); toggleTask(${task.id})">
                        ${isCompleted ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <div class="task-card-content">
                        <div class="task-card-title">${task.title}</div>
                        <div class="task-card-meta">
                            <span class="task-card-project">
                                <i class="fas fa-folder"></i> ${project ? project.name : 'No project'}
                            </span>
                            <span class="task-card-due ${isOverdue ? 'overdue' : ''}">
                                <i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}
                            </span>
                            <span class="task-priority ${task.priority}">${task.priority}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        // Board view - show as Kanban
        container.innerHTML = `
            <div class="kanban-board">
                ${['todo', 'in-progress', 'review', 'done'].map(status => {
                    const statusTasks = filteredTasks.filter(t => t.status === status);
                    const statusLabels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'review': 'Review', 'done': 'Done' };
                    return `
                        <div class="kanban-column" data-status="${status}">
                            <div class="column-header">
                                <span class="column-title">${statusLabels[status]}</span>
                                <span class="column-count">${statusTasks.length}</span>
                            </div>
                            <div class="column-tasks">
                                ${statusTasks.map(task => createKanbanTask(task)).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}

function filterTasks(filter, btn) {
    currentTaskFilter = filter;
    document.querySelectorAll('.filter-tabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    loadMyTasks();
}

function setTaskView(view, btn) {
    taskView = view;
    document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadMyTasks();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'done' ? 'todo' : 'done';
        loadDashboard();
        if (document.getElementById('tasksPage').style.display !== 'none') {
            loadMyTasks();
        }
        if (selectedProject && document.getElementById('projectDetailPage').style.display !== 'none') {
            loadKanbanBoard();
        }
    }
}

function openTaskDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const project = projects.find(p => p.id === task.projectId);
    const assignee = team.find(m => m.id === task.assignee);
    
    document.getElementById('taskDetailTitle').textContent = task.title;
    document.getElementById('taskDetailContent').innerHTML = `
        <div style="padding: 20px;">
            <p style="color: var(--gray-600); margin-bottom: 24px;">${task.description}</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                <div>
                    <label style="font-size: 0.75rem; color: var(--gray-500); display: block; margin-bottom: 4px;">Status</label>
                    <select onchange="updateTaskStatus(${task.id}, this.value)" style="width: 100%; padding: 8px; border: 1px solid var(--gray-200); border-radius: 6px;">
                        <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
                        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
                        <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
                    </select>
                </div>
                <div>
                    <label style="font-size: 0.75rem; color: var(--gray-500); display: block; margin-bottom: 4px;">Priority</label>
                    <span class="task-priority ${task.priority}" style="display: inline-block; padding: 4px 12px;">${task.priority}</span>
                </div>
                <div>
                    <label style="font-size: 0.75rem; color: var(--gray-500); display: block; margin-bottom: 4px;">Project</label>
                    <span>${project ? project.name : 'No project'}</span>
                </div>
                <div>
                    <label style="font-size: 0.75rem; color: var(--gray-500); display: block; margin-bottom: 4px;">Due Date</label>
                    <span>${formatDate(task.dueDate)}</span>
                </div>
                <div>
                    <label style="font-size: 0.75rem; color: var(--gray-500); display: block; margin-bottom: 4px;">Assignee</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${assignee ? `<div class="avatar" style="width: 28px; height: 28px; font-size: 0.7rem;">${assignee.avatar}</div>` : ''}
                        <span>${assignee ? assignee.name : 'Unassigned'}</span>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                <button class="btn btn-outline" onclick="editTask(${task.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-outline" style="color: var(--danger);" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `;
    
    showModal('taskDetail');
}

function updateTaskStatus(taskId, status) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = status;
        loadDashboard();
        if (document.getElementById('tasksPage').style.display !== 'none') {
            loadMyTasks();
        }
        if (selectedProject && document.getElementById('projectDetailPage').style.display !== 'none') {
            loadKanbanBoard();
        }
    }
}

function saveTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const projectId = parseInt(document.getElementById('taskProject').value);
    const priority = document.getElementById('taskPriority').value;
    const assignee = parseInt(document.getElementById('taskAssignee').value);
    const dueDate = document.getElementById('taskDueDate').value;
    
    if (editingTask) {
        const task = tasks.find(t => t.id === editingTask);
        task.title = title;
        task.description = description;
        task.projectId = projectId;
        task.priority = priority;
        task.assignee = assignee;
        task.dueDate = dueDate;
        editingTask = null;
    } else {
        const newTask = {
            id: Date.now(),
            title,
            description,
            projectId,
            status: 'todo',
            priority,
            assignee,
            dueDate
        };
        tasks.push(newTask);
    }
    
    closeModal('task');
    event.target.reset();
    loadDashboard();
    if (document.getElementById('tasksPage').style.display !== 'none') {
        loadMyTasks();
    }
    if (selectedProject && document.getElementById('projectDetailPage').style.display !== 'none') {
        loadKanbanBoard();
    }
    showToast('Task saved successfully', 'success');
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    closeModal('taskDetail');
    
    editingTask = task.id;
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskProject').value = task.projectId;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskAssignee').value = task.assignee;
    document.getElementById('taskDueDate').value = task.dueDate;
    
    showModal('task');
}

function deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    
    tasks = tasks.filter(t => t.id !== taskId);
    closeModal('taskDetail');
    loadDashboard();
    if (document.getElementById('tasksPage').style.display !== 'none') {
        loadMyTasks();
    }
    if (selectedProject && document.getElementById('projectDetailPage').style.display !== 'none') {
        loadKanbanBoard();
    }
    showToast('Task deleted');
}

// =====================================
// CALENDAR
// =====================================

function loadCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    document.getElementById('calendarTitle').textContent = 
        currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let html = '';
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasTasks = tasks.some(t => t.dueDate === dateStr);
        const isToday = dateStr === todayStr;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}" onclick="selectDate('${dateStr}')">
                ${day}
                ${hasTasks ? '<span class="task-dot"></span>' : ''}
            </div>
        `;
    }
    
    // Next month days
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        html += `<div class="calendar-day other-month">${day}</div>`;
    }
    
    document.getElementById('calendarDays').innerHTML = html;
    
    // Load today's tasks
    selectDate(todayStr);
}

function changeMonth(delta) {
    currentMonth.setMonth(currentMonth.getMonth() + delta);
    loadCalendar();
}

function selectDate(dateStr) {
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    event?.target?.classList?.add('selected');
    
    const date = new Date(dateStr);
    document.getElementById('selectedDate').textContent = 
        date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    const container = document.getElementById('calendarTasksList');
    
    if (dayTasks.length === 0) {
        container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 24px;">No tasks scheduled</p>';
    } else {
        container.innerHTML = dayTasks.map(task => createTaskItem(task)).join('');
    }
}

// =====================================
// TEAM
// =====================================

function loadTeam() {
    const container = document.getElementById('teamGrid');
    
    container.innerHTML = team.map(member => {
        const memberTasks = tasks.filter(t => t.assignee === member.id);
        const completed = memberTasks.filter(t => t.status === 'done').length;
        
        return `
            <div class="team-card">
                <div class="team-avatar">${member.avatar}</div>
                <h3 class="team-name">${member.name}</h3>
                <p class="team-role">${member.role}</p>
                <div class="team-stats">
                    <div class="team-stat-item">
                        <span class="team-stat-value">${memberTasks.length}</span>
                        <span class="team-stat-label">Tasks</span>
                    </div>
                    <div class="team-stat-item">
                        <span class="team-stat-value">${completed}</span>
                        <span class="team-stat-label">Completed</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addMember(event) {
    event.preventDefault();
    
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const role = document.getElementById('memberRole').value;
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    const newMember = {
        id: Date.now(),
        name,
        email,
        role,
        avatar: initials
    };
    
    team.push(newMember);
    
    closeModal('member');
    event.target.reset();
    loadTeam();
    populateDropdowns();
    showToast('Team member added', 'success');
}

// =====================================
// DRAG & DROP
// =====================================

function dragStart(event, taskId) {
    event.dataTransfer.setData('taskId', taskId);
}

// Setup drop zones
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const taskId = parseInt(e.dataTransfer.getData('taskId'));
            const newStatus = column.dataset.status;
            
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                if (selectedProject) {
                    loadKanbanBoard();
                }
                loadDashboard();
            }
        });
    });
});

// =====================================
// UI HELPERS
// =====================================

function showModal(modalName) {
    populateDropdowns();
    if (modalName === 'project' && !editingProject) {
        document.getElementById('projectModalTitle').textContent = 'Create New Project';
    }
    if (modalName === 'task' && !editingTask) {
        document.getElementById('taskModalTitle').textContent = 'Create New Task';
        if (selectedProject) {
            document.getElementById('taskProject').value = selectedProject.id;
        }
    }
    document.getElementById(modalName + 'Modal').classList.add('show');
}

function closeModal(modalName) {
    document.getElementById(modalName + 'Modal').classList.remove('show');
    editingProject = null;
    editingTask = null;
}

function populateDropdowns() {
    // Projects dropdown
    const projectSelect = document.getElementById('taskProject');
    if (projectSelect) {
        projectSelect.innerHTML = projects.map(p => `
            <option value="${p.id}">${p.name}</option>
        `).join('');
    }
    
    // Assignee dropdown
    const assigneeSelect = document.getElementById('taskAssignee');
    if (assigneeSelect) {
        assigneeSelect.innerHTML = team.map(m => `
            <option value="${m.id}">${m.name}</option>
        `).join('');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('sidebar').classList.toggle('open');
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('show');
}

function globalSearch() {
    const query = document.getElementById('globalSearch').value.toLowerCase();
    // Implement search functionality
}

function formatDate(dateStr) {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
}

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown')?.classList.remove('show');
    }
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id.replace('Modal', '');
        closeModal(modalId);
    }
});

// =====================================
// INITIALIZATION
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    populateDropdowns();
});
