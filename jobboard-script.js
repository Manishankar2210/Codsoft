// =====================================
// JOB BOARD APPLICATION - JavaScript
// =====================================

// Sample Job Data
const sampleJobs = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        category: 'Technology',
        salary: '$120,000 - $150,000',
        experience: 'Senior Level',
        description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building and maintaining high-quality web applications using modern technologies.',
        requirements: [
            '5+ years of experience with React or Vue.js',
            'Strong proficiency in JavaScript, HTML, and CSS',
            'Experience with state management libraries',
            'Familiarity with RESTful APIs',
            'Excellent problem-solving skills'
        ],
        posted: '2 days ago',
        featured: true
    },
    {
        id: 2,
        title: 'UX/UI Designer',
        company: 'DesignHub',
        location: 'Remote',
        type: 'Remote',
        category: 'Design',
        salary: '$90,000 - $110,000',
        experience: 'Mid Level',
        description: 'Join our creative team to design beautiful and intuitive user experiences. You will work closely with product managers and developers to create user-centered designs.',
        requirements: [
            '3+ years of UX/UI design experience',
            'Proficiency in Figma and Adobe Creative Suite',
            'Strong portfolio demonstrating design skills',
            'Understanding of user research methodologies',
            'Excellent communication skills'
        ],
        posted: '1 day ago',
        featured: true
    },
    {
        id: 3,
        title: 'Marketing Manager',
        company: 'GrowthLab',
        location: 'New York, NY',
        type: 'Full-time',
        category: 'Marketing',
        salary: '$85,000 - $100,000',
        experience: 'Mid Level',
        description: 'Lead our marketing efforts to drive brand awareness and customer acquisition. You will develop and execute marketing strategies across multiple channels.',
        requirements: [
            '4+ years of marketing experience',
            'Experience with digital marketing channels',
            'Strong analytical skills',
            'Excellent written and verbal communication',
            'Experience with marketing automation tools'
        ],
        posted: '3 days ago',
        featured: true
    },
    {
        id: 4,
        title: 'Data Analyst',
        company: 'DataDriven Co.',
        location: 'Chicago, IL',
        type: 'Full-time',
        category: 'Finance',
        salary: '$75,000 - $95,000',
        experience: 'Entry Level',
        description: 'Analyze complex datasets to provide actionable insights for business decisions. Work with cross-functional teams to understand data needs and deliver reports.',
        requirements: [
            'Bachelor\'s degree in Statistics, Mathematics, or related field',
            'Proficiency in SQL and Python',
            'Experience with data visualization tools',
            'Strong attention to detail',
            'Ability to communicate findings clearly'
        ],
        posted: '5 days ago',
        featured: false
    },
    {
        id: 5,
        title: 'Backend Developer',
        company: 'CloudNine Systems',
        location: 'Austin, TX',
        type: 'Full-time',
        category: 'Technology',
        salary: '$110,000 - $140,000',
        experience: 'Senior Level',
        description: 'Build and maintain scalable backend services and APIs. You will work on challenging problems and help shape our technical architecture.',
        requirements: [
            '5+ years of backend development experience',
            'Strong proficiency in Node.js or Python',
            'Experience with cloud services (AWS/GCP/Azure)',
            'Knowledge of database design and optimization',
            'Experience with microservices architecture'
        ],
        posted: '1 week ago',
        featured: true
    },
    {
        id: 6,
        title: 'Registered Nurse',
        company: 'HealthFirst Medical',
        location: 'Boston, MA',
        type: 'Full-time',
        category: 'Healthcare',
        salary: '$70,000 - $85,000',
        experience: 'Mid Level',
        description: 'Provide compassionate patient care in our state-of-the-art medical facility. Work with a dedicated team of healthcare professionals.',
        requirements: [
            'Valid RN license',
            '2+ years of clinical experience',
            'BLS and ACLS certification',
            'Excellent patient care skills',
            'Strong communication abilities'
        ],
        posted: '4 days ago',
        featured: false
    },
    {
        id: 7,
        title: 'Product Manager',
        company: 'InnovateTech',
        location: 'Seattle, WA',
        type: 'Full-time',
        category: 'Technology',
        salary: '$130,000 - $160,000',
        experience: 'Senior Level',
        description: 'Lead product strategy and development for our flagship products. Work with engineering, design, and marketing teams to deliver exceptional products.',
        requirements: [
            '5+ years of product management experience',
            'Strong technical background',
            'Experience with agile methodologies',
            'Excellent stakeholder management skills',
            'Data-driven decision making'
        ],
        posted: '2 days ago',
        featured: true
    },
    {
        id: 8,
        title: 'Part-time Content Writer',
        company: 'ContentKing',
        location: 'Remote',
        type: 'Part-time',
        category: 'Marketing',
        salary: '$25 - $35/hour',
        experience: 'Entry Level',
        description: 'Create engaging content for our clients across various industries. Flexible hours and remote work options available.',
        requirements: [
            'Excellent writing and editing skills',
            'Knowledge of SEO best practices',
            'Ability to meet deadlines',
            'Research skills',
            'Portfolio of writing samples'
        ],
        posted: '6 days ago',
        featured: false
    },
    {
        id: 9,
        title: 'High School Teacher',
        company: 'Springfield Academy',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        category: 'Education',
        salary: '$55,000 - $70,000',
        experience: 'Mid Level',
        description: 'Inspire the next generation of learners. Teach and mentor high school students in a supportive educational environment.',
        requirements: [
            'Teaching credential required',
            '2+ years of teaching experience',
            'Passion for education',
            'Strong classroom management skills',
            'Ability to differentiate instruction'
        ],
        posted: '1 week ago',
        featured: false
    },
    {
        id: 10,
        title: 'DevOps Engineer',
        company: 'ScaleUp Inc.',
        location: 'Denver, CO',
        type: 'Contract',
        category: 'Technology',
        salary: '$65 - $85/hour',
        experience: 'Senior Level',
        description: 'Help us build and maintain our cloud infrastructure. Implement CI/CD pipelines and ensure system reliability.',
        requirements: [
            '4+ years of DevOps experience',
            'Strong knowledge of AWS or GCP',
            'Experience with Docker and Kubernetes',
            'Scripting skills (Bash, Python)',
            'Knowledge of Infrastructure as Code'
        ],
        posted: '3 days ago',
        featured: false
    }
];

// Application State
let currentUser = null;
let applications = [];
let savedJobs = [];
let postedJobs = [];
let selectedJob = null;
let filteredJobs = [...sampleJobs];

// =====================================
// PAGE NAVIGATION
// =====================================

function showPage(pageName, pushState = true) {
    if (pushState) {
        history.pushState({ pageName }, '', `#${pageName}`);
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    const pageId = pageName + 'Page';
    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = 'block';
        window.scrollTo(0, 0);
    }

    // Close mobile menu
    closeMobileMenu();

    // Load page-specific content
    switch (pageName) {
        case 'home':
            loadFeaturedJobs();
            break;
        case 'jobs':
            loadJobsList();
            break;
        case 'dashboard':
            if (!currentUser) {
                showModal('login');
                return;
            }
            loadDashboard();
            break;
    }
}

// =====================================
// JOBS FUNCTIONALITY
// =====================================

function loadFeaturedJobs() {
    const grid = document.getElementById('featuredJobsGrid');
    if (!grid) return;

    const featuredJobs = sampleJobs.filter(job => job.featured).slice(0, 6);
    grid.innerHTML = featuredJobs.map(job => createJobCard(job)).join('');
}

function loadJobsList() {
    const list = document.getElementById('jobsList');
    const countEl = document.getElementById('jobCount');
    if (!list) return;

    if (filteredJobs.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
    } else {
        list.innerHTML = filteredJobs.map(job => createJobListItem(job)).join('');
    }

    if (countEl) {
        countEl.textContent = `${filteredJobs.length} jobs found`;
    }
}

function createJobCard(job) {
    return `
        <div class="job-card" onclick="viewJob(${job.id})">
            <div class="job-card-header">
                <div class="company-logo">${job.company.charAt(0)}</div>
                <div class="job-card-info">
                    <h3>${job.title}</h3>
                    <span class="company-name">${job.company}</span>
                </div>
            </div>
            <div class="job-card-details">
                <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                <span><i class="fas fa-clock"></i> ${job.posted}</span>
            </div>
            <div class="job-card-footer">
                <span class="job-type-badge ${job.type.toLowerCase()}">${job.type}</span>
                <span class="salary">${job.salary}</span>
            </div>
        </div>
    `;
}

function createJobListItem(job) {
    return `
        <div class="job-list-item" onclick="viewJob(${job.id})">
            <div class="company-logo">${job.company.charAt(0)}</div>
            <div class="job-list-content">
                <h3>${job.title}</h3>
                <div class="company-name">${job.company}</div>
                <div class="job-list-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                    <span><i class="fas fa-layer-group"></i> ${job.experience}</span>
                </div>
            </div>
            <div class="job-list-actions">
                <span class="salary">${job.salary}</span>
                <span class="posted-date">${job.posted}</span>
            </div>
        </div>
    `;
}

function viewJob(jobId) {
    selectedJob = sampleJobs.find(job => job.id === jobId);
    if (!selectedJob) return;

    showPage('jobDetail');
    loadJobDetail();
}

function loadJobDetail() {
    if (!selectedJob) return;

    const content = document.getElementById('jobDetailContent');
    const companyCard = document.getElementById('companyCard');

    content.innerHTML = `
        <div class="job-detail-header">
            <div class="company-logo">${selectedJob.company.charAt(0)}</div>
            <div class="job-detail-title">
                <h1>${selectedJob.title}</h1>
                <div class="company-name">${selectedJob.company}</div>
                <div class="job-detail-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${selectedJob.location}</span>
                    <span><i class="fas fa-briefcase"></i> ${selectedJob.type}</span>
                    <span><i class="fas fa-clock"></i> ${selectedJob.posted}</span>
                </div>
            </div>
        </div>
        <div class="job-detail-section">
            <h2>Job Description</h2>
            <p>${selectedJob.description}</p>
        </div>
        <div class="job-detail-section">
            <h2>Requirements</h2>
            <ul>
                ${selectedJob.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>
        <div class="job-detail-section">
            <h2>Salary</h2>
            <p>${selectedJob.salary}</p>
        </div>
    `;

    companyCard.innerHTML = `
        <h4>About ${selectedJob.company}</h4>
        <div class="company-info-item">
            <i class="fas fa-building"></i>
            <span>${selectedJob.company}</span>
        </div>
        <div class="company-info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${selectedJob.location}</span>
        </div>
        <div class="company-info-item">
            <i class="fas fa-industry"></i>
            <span>${selectedJob.category}</span>
        </div>
    `;
}

// =====================================
// SEARCH & FILTER FUNCTIONALITY
// =====================================

function searchJobs() {
    const keyword = document.getElementById('heroJobSearch')?.value || '';
    const location = document.getElementById('heroLocation')?.value || '';

    document.getElementById('jobSearchInput').value = keyword;
    filterJobs();
    showPage('jobs');
}

function filterJobs() {
    const searchTerm = document.getElementById('jobSearchInput')?.value.toLowerCase() || '';
    
    // Get checked job types
    const typeCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"][value="Full-time"], .filter-section input[type="checkbox"][value="Part-time"], .filter-section input[type="checkbox"][value="Remote"], .filter-section input[type="checkbox"][value="Contract"]');
    const selectedTypes = Array.from(typeCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Get checked experience levels
    const expCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"][value="Entry Level"], .filter-section input[type="checkbox"][value="Mid Level"], .filter-section input[type="checkbox"][value="Senior Level"]');
    const selectedExp = Array.from(expCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Get salary filter
    const salaryFilter = document.getElementById('salaryFilter')?.value || '';

    // Filter jobs
    filteredJobs = sampleJobs.filter(job => {
        // Search term filter
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm) ||
            job.category.toLowerCase().includes(searchTerm);

        // Job type filter
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);

        // Experience filter
        const matchesExp = selectedExp.length === 0 || selectedExp.includes(job.experience);

        // Salary filter (simplified)
        let matchesSalary = true;
        if (salaryFilter) {
            const salary = parseInt(job.salary.replace(/[^0-9]/g, ''));
            if (salaryFilter === '120000+') {
                matchesSalary = salary >= 120000;
            } else {
                const [min, max] = salaryFilter.split('-').map(Number);
                matchesSalary = salary >= min && salary <= max;
            }
        }

        return matchesSearch && matchesType && matchesExp && matchesSalary;
    });

    loadJobsList();
}

function filterByCategory(category) {
    document.getElementById('jobSearchInput').value = category;
    filteredJobs = sampleJobs.filter(job => job.category === category);
    showPage('jobs');
    loadJobsList();
}

function clearFilters() {
    document.getElementById('jobSearchInput').value = '';
    document.getElementById('salaryFilter').value = '';
    document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(cb => cb.checked = false);
    filteredJobs = [...sampleJobs];
    loadJobsList();
}

// =====================================
// AUTHENTICATION
// =====================================

function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate login
    currentUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        role: 'candidate'
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('login');
    showToast('Welcome back!', 'success');
    showPage('dashboard');
}

function register(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const role = document.getElementById('registerRole').value;

    // Simulate registration
    currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        role: role
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('register');
    showToast('Account created successfully!', 'success');
    showPage('dashboard');
}

function logout() {
    currentUser = null;
    applications = [];
    savedJobs = [];
    postedJobs = [];
    localStorage.removeItem('currentUser');
    updateAuthUI();
    closeDropdown();
    showToast('Logged out successfully');
    showPage('home');
}

function updateAuthUI() {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const userName = document.getElementById('userName');

    if (currentUser) {
        navAuth.style.display = 'none';
        navUser.style.display = 'block';
        userName.textContent = currentUser.name;
    } else {
        navAuth.style.display = 'flex';
        navUser.style.display = 'none';
    }
}

// =====================================
// DASHBOARD
// =====================================

function loadDashboard() {
    if (!currentUser) return;

    const dashboardUserName = document.getElementById('dashboardUserName');
    if (dashboardUserName) dashboardUserName.textContent = currentUser.name;

    // Show appropriate dashboard based on role
    const candidateDash = document.getElementById('candidateDashboard');
    const employerDash = document.getElementById('employerDashboard');

    if (currentUser.role === 'employer') {
        candidateDash.style.display = 'none';
        employerDash.style.display = 'block';
        loadEmployerDashboard();
    } else {
        candidateDash.style.display = 'block';
        employerDash.style.display = 'none';
        loadCandidateDashboard();
    }
}

function loadCandidateDashboard() {
    // Update counts
    document.getElementById('applicationCount').textContent = applications.length;
    document.getElementById('savedJobsCount').textContent = savedJobs.length;

    // Load applications list
    const applicationsList = document.getElementById('applicationsList');
    if (applications.length === 0) {
        applicationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No applications yet</h3>
                <p>Start applying to jobs to track your applications here</p>
            </div>
        `;
    } else {
        applicationsList.innerHTML = applications.map(app => `
            <div class="application-item">
                <div class="application-info">
                    <h4>${app.jobTitle}</h4>
                    <span>${app.company} • Applied ${app.appliedDate}</span>
                </div>
                <span class="status-badge ${app.status}">${app.status}</span>
            </div>
        `).join('');
    }

    // Pre-fill profile form
    document.getElementById('profileName').value = currentUser.name || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
}

function loadEmployerDashboard() {
    document.getElementById('postedJobsCount').textContent = postedJobs.length;

    const totalApplicants = postedJobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
    document.getElementById('totalApplicants').textContent = totalApplicants;

    const postedJobsList = document.getElementById('postedJobsList');
    if (postedJobs.length === 0) {
        postedJobsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-briefcase"></i>
                <h3>No job postings yet</h3>
                <p>Post your first job to start receiving applications</p>
            </div>
        `;
    } else {
        postedJobsList.innerHTML = postedJobs.map(job => `
            <div class="posted-job-item">
                <div class="posted-job-info">
                    <h4>${job.title}</h4>
                    <span>${job.applicants || 0} applicants • Posted ${job.posted}</span>
                </div>
                <span class="status-badge pending">Active</span>
            </div>
        `).join('');
    }
}

function updateProfile(event) {
    event.preventDefault();
    currentUser.name = document.getElementById('profileName').value;
    currentUser.email = document.getElementById('profileEmail').value;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    showToast('Profile updated successfully!', 'success');
}

// =====================================
// JOB APPLICATION
// =====================================

function submitApplication(event) {
    event.preventDefault();

    if (!currentUser) {
        closeModal('apply');
        showModal('login');
        showToast('Please login to apply', 'error');
        return;
    }

    const application = {
        id: Date.now(),
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        appliedDate: 'Just now',
        status: 'pending'
    };

    applications.push(application);
    closeModal('apply');
    showToast('Application submitted successfully!', 'success');
}

// =====================================
// POST JOB (EMPLOYER)
// =====================================

function postJob(event) {
    event.preventDefault();

    if (!currentUser || currentUser.role !== 'employer') {
        showToast('Only employers can post jobs', 'error');
        return;
    }

    const newJob = {
        id: Date.now(),
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('jobCompany').value,
        location: document.getElementById('jobLocation').value,
        type: document.getElementById('jobType').value,
        category: document.getElementById('jobCategory').value,
        salary: document.getElementById('jobSalary').value,
        description: document.getElementById('jobDescription').value,
        requirements: document.getElementById('jobRequirements').value.split('\n').filter(r => r.trim()),
        posted: 'Just now',
        applicants: 0
    };

    postedJobs.push(newJob);
    sampleJobs.unshift(newJob); // Add to main jobs list
    filteredJobs = [...sampleJobs];

    closeModal('postJob');
    showToast('Job posted successfully!', 'success');
    loadEmployerDashboard();

    // Reset form
    event.target.reset();
}

// =====================================
// MODAL FUNCTIONS
// =====================================

function showModal(modalName) {
    const modal = document.getElementById(modalName + 'Modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        if (modalName === 'apply' && selectedJob) {
            document.getElementById('applyJobTitle').textContent = selectedJob.title + ' at ' + selectedJob.company;
            if (currentUser) {
                document.getElementById('applyName').value = currentUser.name || '';
                document.getElementById('applyEmail').value = currentUser.email || '';
            }
        }
    }
}

function closeModal(modalName) {
    const modal = document.getElementById(modalName + 'Modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function switchModal(fromModal, toModal) {
    closeModal(fromModal);
    setTimeout(() => showModal(toModal), 200);
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        const modalName = e.target.id.replace('Modal', '');
        closeModal(modalName);
    }
});

// =====================================
// UI HELPERS
// =====================================

function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

function closeDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.remove('show');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('show');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.remove('show');
}

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown')) {
        closeDropdown();
    }
});

// =====================================
// INITIALIZATION
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }

    // Load initial content
    loadFeaturedJobs();

    const hash = window.location.hash.slice(1);
    const initialPage = hash || 'home';
    history.replaceState({ pageName: initialPage }, '', `#${initialPage}`);
    showPage(initialPage, false);
});

window.addEventListener('popstate', (e) => {
    const pageName = e.state ? e.state.pageName : 'home';
    showPage(pageName, false);
});
