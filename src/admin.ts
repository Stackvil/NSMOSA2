// Admin Dashboard Functionality
interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: number;
}

interface PhotoItem {
  id: string;
  url: string;
  name: string;
  uploadedAt: number;
}

interface EventPhoto {
  id: string;
  eventName: string;
  eventDate: string;
  photos: PhotoItem[];
  createdAt: number;
}

interface GalleryPhoto {
  id: string;
  year: number;
  photos: PhotoItem[];
  createdAt: number;
}

interface ChapterPhoto {
  id: string;
  chapterType: string;
  year: number;
  photos: PhotoItem[];
  createdAt: number;
}

interface ReunionPhoto {
  id: string;
  year: number;
  photos: PhotoItem[];
  createdAt: number;
}

// Check authentication
function checkAuth(): boolean {
  const session = localStorage.getItem('admin_session');
  const loginTime = parseInt(localStorage.getItem('admin_login_time') || '0');
  const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours

  if (!session || Date.now() - loginTime > sessionDuration) {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// Initialize admin dashboard
function initAdminDashboard(): void {
  if (!checkAuth()) return;

  // Set username
  const username = localStorage.getItem('admin_username') || 'Admin';
  const usernameEl = document.getElementById('admin-username');
  if (usernameEl) {
    usernameEl.textContent = username;
  }

  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_login_time');
      window.location.href = 'admin-login.html';
    });
  }

  // Initialize navigation
  initNavigation();

  // Initialize tabs
  initTabs();

  // Initialize year selectors
  initYearSelectors();

  // Initialize forms
  initUpdateForm();
  initEventPhotoForm();
  initGalleryPhotoForm();
  initChapterPhotoForm();
  initReunionPhotoForm();
  initContentForms();
  initHomepagePhotoForms();

  // Load data
  loadUpdates();
  loadUserActivity();
  loadRegistrations();
  loadDonations();
  
  // Update statistics
  updateStatistics();
}

// Navigation between pages
function initNavigation(): void {
  const navBtns = document.querySelectorAll('.nav-tab-btn');
  const pageSections = document.querySelectorAll('.admin-page-section');

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      if (!page) return;

      // Remove active from all buttons and sections
      navBtns.forEach((b) => b.classList.remove('active'));
      pageSections.forEach((s) => s.classList.remove('active'));

      // Add active to clicked button
      btn.classList.add('active');

      // Show corresponding page
      const targetPage = document.getElementById(`page-${page}`);
      if (targetPage) {
        targetPage.classList.add('active');
      }
    });
  });
}

// Update statistics
function updateStatistics(): void {
  const updates = getUpdates();
  const eventPhotos = getEventPhotos();
  const galleryPhotos = getGalleryPhotos();
  const reunionPhotos = getReunionPhotos();
  const users = JSON.parse(localStorage.getItem('nsm_users') || '[]');
  const donations = JSON.parse(localStorage.getItem('nsm_donations') || '[]');
  
  const updatesCount = document.getElementById('updates-count');
  const eventsCount = document.getElementById('events-count');
  const galleryCount = document.getElementById('gallery-count');
  const reunionCount = document.getElementById('reunion-count');
  const usersCount = document.getElementById('users-count');
  const donationsCount = document.getElementById('donations-count');
  
  if (updatesCount) updatesCount.textContent = updates.length.toString();
  if (eventsCount) eventsCount.textContent = eventPhotos.length.toString();
  if (galleryCount) {
    const totalGalleryPhotos = galleryPhotos.reduce((sum, gallery) => sum + gallery.photos.length, 0);
    galleryCount.textContent = totalGalleryPhotos.toString();
  }
  if (reunionCount) {
    const totalReunionPhotos = reunionPhotos.reduce((sum, reunion) => sum + reunion.photos.length, 0);
    reunionCount.textContent = totalReunionPhotos.toString();
  }
  if (usersCount) usersCount.textContent = users.length.toString();
  if (donationsCount) donationsCount.textContent = donations.length.toString();
}

// Tab functionality
function initTabs(): void {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      if (!tabName) return;

      // Remove active from all tabs and contents
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      // Add active to clicked tab and corresponding content
      btn.classList.add('active');
      const content = document.getElementById(tabName);
      if (content) {
        content.classList.add('active');
      }

      // Load data if needed
      if (tabName === 'manage-updates') {
        loadUpdates();
      }
    });
  });
}

// Initialize year selectors
function initYearSelectors(): void {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= 1993; year--) {
    years.push(year);
  }

  const yearSelects = ['gallery-year', 'chapter-year', 'reunion-year'];
  yearSelects.forEach((selectId) => {
    const select = document.getElementById(selectId) as HTMLSelectElement;
    if (select) {
      years.forEach((year) => {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        select.appendChild(option);
      });
    }
  });
}

// Photo upload functionality
function initPhotoUpload(
  uploadAreaId: string,
  fileInputId: string,
  previewId: string,
  countId?: string
): void {
  const uploadArea = document.getElementById(uploadAreaId);
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
  const preview = document.getElementById(previewId);
  const countDisplay = countId ? document.getElementById(countId) : null;

  if (!uploadArea || !fileInput || !preview) return;

  // Update photo count
  function updatePhotoCount(): void {
    if (countDisplay && preview) {
      const count = preview.querySelectorAll('.photo-preview-item').length;
      if (count > 0) {
        countDisplay.style.display = 'block';
        countDisplay.textContent = `${count} photo${count !== 1 ? 's' : ''} selected`;
      } else {
        countDisplay.style.display = 'none';
      }
    }
  }

  // Click to upload
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer?.files;
    if (files) {
      handleFiles(files, preview, fileInput);
      updatePhotoCount();
    }
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      handleFiles(target.files, preview, fileInput);
      updatePhotoCount();
    }
  });

  // Make remove button update count
  if (preview) {
    preview.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.remove-photo')) {
        setTimeout(updatePhotoCount, 0);
      }
    });
  }

  // Initial count update
  updatePhotoCount();
}

function handleFiles(
  files: FileList,
  preview: HTMLElement,
  _fileInput: HTMLInputElement
): void {
  const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
  
  if (fileArray.length === 0) {
    alert('Please select image files only');
    return;
  }

  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-preview-item';
      photoItem.dataset.fileName = file.name;
      photoItem.innerHTML = `
        <img src="${url}" alt="${file.name}">
        <button type="button" class="remove-photo" onclick="this.parentElement.remove(); updatePhotoCountForPreview('${preview.id}')">
          <i class="fas fa-times"></i>
        </button>
      `;
      preview.appendChild(photoItem);
    };
    reader.readAsDataURL(file);
  });
}

// Global function to update photo count after removal
(window as any).updatePhotoCountForPreview = (previewId: string): void => {
  const preview = document.getElementById(previewId);
  if (!preview) return;
  
  // Find the count display element (it should be the next sibling or in the same parent)
  const parent = preview.parentElement;
  if (parent) {
    const countDisplay = parent.querySelector('.photo-count') as HTMLElement;
    if (countDisplay) {
      const count = preview.querySelectorAll('.photo-preview-item').length;
      if (count > 0) {
        countDisplay.style.display = 'block';
        countDisplay.textContent = `${count} photo${count !== 1 ? 's' : ''} selected`;
      } else {
        countDisplay.style.display = 'none';
      }
    }
  }
};

function getPreviewPhotos(previewId: string): string[] {
  const preview = document.getElementById(previewId);
  if (!preview) return [];

  const photos: string[] = [];
  preview.querySelectorAll('img').forEach((img) => {
    photos.push(img.src);
  });
  return photos;
}

// Update form
function initUpdateForm(): void {
  const form = document.getElementById('update-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = (document.getElementById('update-title') as HTMLInputElement).value;
    const content = (document.getElementById('update-content') as HTMLTextAreaElement).value;
    const date = (document.getElementById('update-date') as HTMLInputElement).value;

    const update: Update = {
      id: Date.now().toString(),
      title,
      content,
      date,
      createdAt: Date.now(),
    };

    saveUpdate(update);
    showSuccess('Update added successfully!');
    form.reset();
  });
}

function saveUpdate(update: Update): void {
  const updates = getUpdates();
  updates.push(update);
  localStorage.setItem('nsm_updates', JSON.stringify(updates));
  updateStatistics();
}

function getUpdates(): Update[] {
  const stored = localStorage.getItem('nsm_updates');
  return stored ? JSON.parse(stored) : [];
}

function loadUpdates(): void {
  const updates = getUpdates();
  const list = document.getElementById('updates-list');
  if (!list) return;

  list.innerHTML = '';

  if (updates.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No updates yet</p>';
    return;
  }

  updates
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((update) => {
      const item = document.createElement('div');
      item.className = 'item-card';
      item.innerHTML = `
        <div class="item-card-info">
          <h3>${update.title}</h3>
          <p>${update.date} • ${new Date(update.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="item-card-actions">
          <button class="btn btn-danger btn-small" onclick="deleteUpdate('${update.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
      list.appendChild(item);
    });
}

// Make deleteUpdate available globally
(window as any).deleteUpdate = (id: string) => {
  if (confirm('Are you sure you want to delete this update?')) {
    const updates = getUpdates();
    const filtered = updates.filter((u) => u.id !== id);
    localStorage.setItem('nsm_updates', JSON.stringify(filtered));
    loadUpdates();
    updateStatistics();
    showSuccess('Update deleted successfully!');
  }
};

// Event photo form
function initEventPhotoForm(): void {
  initPhotoUpload('event-upload-area', 'event-photos', 'event-photo-preview', 'event-photo-count');

  const form = document.getElementById('event-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const eventName = (document.getElementById('event-name') as HTMLInputElement).value;
    const eventDate = (document.getElementById('event-date') as HTMLInputElement).value;
    const photos = getPreviewPhotos('event-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const eventPhoto: EventPhoto = {
      id: Date.now().toString(),
      eventName,
      eventDate,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Event Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    saveEventPhoto(eventPhoto);
    showSuccess('Event photos uploaded successfully!');
    form.reset();
    document.getElementById('event-photo-preview')!.innerHTML = '';
  });
}

function saveEventPhoto(eventPhoto: EventPhoto): void {
  const events = getEventPhotos();
  events.push(eventPhoto);
  localStorage.setItem('nsm_event_photos', JSON.stringify(events));
  updateStatistics();
}

function getEventPhotos(): EventPhoto[] {
  const stored = localStorage.getItem('nsm_event_photos');
  return stored ? JSON.parse(stored) : [];
}

// Gallery photo form
function initGalleryPhotoForm(): void {
  initPhotoUpload('gallery-upload-area', 'gallery-photos', 'gallery-photo-preview', 'gallery-photo-count');

  const form = document.getElementById('gallery-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const year = parseInt((document.getElementById('gallery-year') as HTMLSelectElement).value);
    const photos = getPreviewPhotos('gallery-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const galleryPhoto: GalleryPhoto = {
      id: Date.now().toString(),
      year,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Gallery Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    saveGalleryPhoto(galleryPhoto);
    showSuccess('Gallery photos uploaded successfully!');
    form.reset();
    document.getElementById('gallery-photo-preview')!.innerHTML = '';
  });
}

function saveGalleryPhoto(galleryPhoto: GalleryPhoto): void {
  const galleries = getGalleryPhotos();
  galleries.push(galleryPhoto);
  localStorage.setItem('nsm_gallery_photos', JSON.stringify(galleries));
  updateStatistics();
}

function getGalleryPhotos(): GalleryPhoto[] {
  const stored = localStorage.getItem('nsm_gallery_photos');
  return stored ? JSON.parse(stored) : [];
}

// Chapter photo form
function initChapterPhotoForm(): void {
  initPhotoUpload('chapter-upload-area', 'chapter-photos', 'chapter-photo-preview', 'chapter-photo-count');

  const form = document.getElementById('chapter-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const chapterType = (document.getElementById('chapter-type') as HTMLSelectElement).value;
    const year = parseInt((document.getElementById('chapter-year') as HTMLSelectElement).value);
    const photos = getPreviewPhotos('chapter-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const chapterPhoto: ChapterPhoto = {
      id: Date.now().toString(),
      chapterType,
      year,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Chapter Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    saveChapterPhoto(chapterPhoto);
    showSuccess('Chapter photos uploaded successfully!');
    form.reset();
    document.getElementById('chapter-photo-preview')!.innerHTML = '';
  });
}

function saveChapterPhoto(chapterPhoto: ChapterPhoto): void {
  const chapters = getChapterPhotos();
  chapters.push(chapterPhoto);
  localStorage.setItem('nsm_chapter_photos', JSON.stringify(chapters));
}

function getChapterPhotos(): ChapterPhoto[] {
  const stored = localStorage.getItem('nsm_chapter_photos');
  return stored ? JSON.parse(stored) : [];
}

// Reunion photo form
function initReunionPhotoForm(): void {
  initPhotoUpload('reunion-upload-area', 'reunion-photos', 'reunion-photo-preview', 'reunion-photo-count');

  const form = document.getElementById('reunion-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const year = parseInt((document.getElementById('reunion-year') as HTMLSelectElement).value);
    const photos = getPreviewPhotos('reunion-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const reunionPhoto: ReunionPhoto = {
      id: Date.now().toString(),
      year,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Reunion Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    saveReunionPhoto(reunionPhoto);
    showSuccess('Reunion photos uploaded successfully!');
    form.reset();
    document.getElementById('reunion-photo-preview')!.innerHTML = '';
  });
}

function saveReunionPhoto(reunionPhoto: ReunionPhoto): void {
  const reunions = getReunionPhotos();
  reunions.push(reunionPhoto);
  localStorage.setItem('nsm_reunion_photos', JSON.stringify(reunions));
  updateStatistics();
}

function getReunionPhotos(): ReunionPhoto[] {
  const stored = localStorage.getItem('nsm_reunion_photos');
  return stored ? JSON.parse(stored) : [];
}

// Content forms
function initContentForms(): void {
  // Home content form
  const homeForm = document.getElementById('home-content-form') as HTMLFormElement;
  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const heroTitle = (document.getElementById('hero-title') as HTMLInputElement).value;
      const heroQuote = (document.getElementById('hero-quote') as HTMLInputElement).value;

      if (heroTitle) {
        localStorage.setItem('nsm_hero_title', heroTitle);
      }
      if (heroQuote) {
        localStorage.setItem('nsm_hero_quote', heroQuote);
      }

      showSuccess('Home page content updated successfully!');
    });
  }

  // About content form
  const aboutForm = document.getElementById('about-content-form') as HTMLFormElement;
  if (aboutForm) {
    aboutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const section = (document.getElementById('about-section') as HTMLSelectElement).value;
      const content = (document.getElementById('about-content') as HTMLTextAreaElement).value;

      localStorage.setItem(`nsm_about_${section}`, content);
      showSuccess('About page content updated successfully!');
    });
  }
}

// Homepage photo forms
function initHomepagePhotoForms(): void {
  // Middle box photos
  const middleBoxForm = document.getElementById('middle-box-photo-form') as HTMLFormElement;
  if (middleBoxForm) {
    initPhotoUpload('middle-box-upload-area', 'middle-box-photos', 'middle-box-photo-preview', 'middle-box-photo-count');
    
    middleBoxForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const photos = getPreviewPhotos('middle-box-photo-preview');
      if (photos.length === 0) {
        alert('Please upload at least one photo');
        return;
      }
      
      const photoItems: PhotoItem[] = photos.map((url, index) => ({
        id: Date.now().toString() + index,
        url,
        name: `Middle Box Photo ${index + 1}`,
        uploadedAt: Date.now()
      }));
      
      localStorage.setItem('nsm_homepage_middle_box_photos', JSON.stringify(photoItems));
      showSuccess('Homepage middle box photos updated successfully!');
      middleBoxForm.reset();
      document.getElementById('middle-box-photo-preview')!.innerHTML = '';
      document.getElementById('middle-box-photo-count')!.style.display = 'none';
    });
  }

  // Homepage gallery photos
  const homepageGalleryForm = document.getElementById('homepage-gallery-photo-form') as HTMLFormElement;
  if (homepageGalleryForm) {
    initPhotoUpload('homepage-gallery-upload-area', 'homepage-gallery-photos', 'homepage-gallery-photo-preview', 'homepage-gallery-photo-count');
    
    homepageGalleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const photos = getPreviewPhotos('homepage-gallery-photo-preview');
      if (photos.length === 0) {
        alert('Please upload at least one photo');
        return;
      }
      
      const photoItems: PhotoItem[] = photos.map((url, index) => ({
        id: Date.now().toString() + index,
        url,
        name: `Homepage Gallery Photo ${index + 1}`,
        uploadedAt: Date.now()
      }));
      
      localStorage.setItem('nsm_homepage_gallery_photos', JSON.stringify(photoItems));
      showSuccess('Homepage gallery photos updated successfully!');
      homepageGalleryForm.reset();
      document.getElementById('homepage-gallery-photo-preview')!.innerHTML = '';
      document.getElementById('homepage-gallery-photo-count')!.style.display = 'none';
    });
  }
}

// Load user activity
function loadUserActivity(): void {
  const activityBody = document.getElementById('user-activity-body');
  if (!activityBody) return;
  
  const logins = JSON.parse(localStorage.getItem('nsm_user_logins') || '[]');
  
  if (logins.length === 0) {
    activityBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No login activity yet</h3>
          <p>User login records will appear here</p>
        </td>
      </tr>
    `;
    return;
  }
  
  activityBody.innerHTML = logins
    .sort((a: any, b: any) => b.timestamp - a.timestamp)
    .map((login: any) => `
      <tr>
        <td>${new Date(login.timestamp).toLocaleString('en-IN')}</td>
        <td>${login.email || login.contact || 'N/A'}</td>
        <td><span class="badge badge-info">${login.method || 'Email'}</span></td>
        <td><span class="badge badge-success">Success</span></td>
      </tr>
    `).join('');
}

// Load registrations
function loadRegistrations(): void {
  const registrationsBody = document.getElementById('registrations-body');
  if (!registrationsBody) return;
  
  const users = JSON.parse(localStorage.getItem('nsm_users') || '[]');
  
  if (users.length === 0) {
    registrationsBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No registrations yet</h3>
          <p>Registration records will appear here</p>
        </td>
      </tr>
    `;
    return;
  }
  
  registrationsBody.innerHTML = users
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((user: any) => `
      <tr>
        <td>${user.firstName || ''} ${user.surname || ''}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.telcode || ''}${user.mobile || ''}</td>
        <td>${user.course || 'N/A'}</td>
        <td>${user.from || ''} - ${user.to || ''}</td>
        <td><span class="badge badge-primary">${user.paymentMethod || 'N/A'}</span></td>
        <td>₹${user.donationAmount ? parseFloat(user.donationAmount).toLocaleString('en-IN') : '0'}</td>
        <td>${new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
      </tr>
    `).join('');
}

// Load donations
function loadDonations(): void {
  const donationsBody = document.getElementById('donations-body');
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  
  if (!donationsBody) return;
  
  function renderDonations(filter: string = 'all'): void {
    if (!donationsBody) return;
    
    let donations = JSON.parse(localStorage.getItem('nsm_donations') || '[]');
    
    if (filter === 'nsm') {
      donations = donations.filter((d: any) => d.category === 'nsm');
    } else if (filter === 'general') {
      donations = donations.filter((d: any) => d.category === 'general');
    }
    
    if (donations.length === 0) {
      donationsBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>No donations yet</h3>
            <p>Donation records will appear here</p>
          </td>
        </tr>
      `;
      return;
    }
    
    donationsBody.innerHTML = donations
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .map((donation: any) => `
        <tr>
          <td>${new Date(donation.timestamp).toLocaleString('en-IN')}</td>
          <td>${donation.name || 'Anonymous'}</td>
          <td>${donation.email || 'N/A'}</td>
          <td><span class="badge ${donation.category === 'nsm' ? 'badge-primary' : 'badge-info'}">${donation.category === 'nsm' ? 'NSM Student/Alumni' : 'General Public'}</span></td>
          <td>₹${parseFloat(donation.amount).toLocaleString('en-IN')}</td>
          <td>${donation.method || 'N/A'}</td>
          <td>${donation.transactionId || 'N/A'}</td>
        </tr>
      `).join('');
  }
  
  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderDonations(filter);
    });
  });
  
  renderDonations('all');
}

// Success message
function showSuccess(message: string): void {
  const successMsg = document.getElementById('success-message');
  if (successMsg) {
    successMsg.textContent = message;
    successMsg.classList.add('show');
    setTimeout(() => {
      successMsg.classList.remove('show');
    }, 3000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
  initAdminDashboard();
}

