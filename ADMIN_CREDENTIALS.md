# NSM Alumni Admin Dashboard - Login Credentials

## 🔐 Admin Access Information

### Login URL
**Direct Access:** `admin-login.html`

You can access the admin login page by navigating to:
- `http://localhost:5173/admin-login.html` (during development)
- `https://yourdomain.com/admin-login.html` (in production)

### Login Credentials

**Username:** `nsmadmin2024`  
**Password:** `NSM@Admin#Secure2024!`

---

## 📋 Admin Dashboard Features

The admin dashboard allows you to manage:

### 1. **Latest Updates**
- Add new updates/announcements
- Manage existing updates
- Delete updates

### 2. **Event Photos**
- Upload photos for events
- Add event name and date
- Multiple photo upload support

### 3. **Photo Gallery**
- Upload photos by year (1993-2025)
- Manage gallery photos
- Year-based organization

### 4. **Chapter Gallery**
- Upload photos by chapter type (All/India/International)
- Select year for chapter photos
- Organize by chapter and year

### 5. **Reunion Photos**
- Upload reunion photos by year
- Manage reunion galleries
- Year-based organization

### 6. **Content Updates**
- Update home page content (Hero title, quote)
- Update about page sections
- Manage website content

---

## 🔒 Security Notes

1. **Session Duration:** Admin sessions last 8 hours
2. **Storage:** All data is stored in browser localStorage (for demo purposes)
3. **Production Recommendation:** In production, implement:
   - Backend API for authentication
   - Server-side session management
   - Database storage instead of localStorage
   - HTTPS encryption
   - Rate limiting for login attempts

---

## 🚀 How to Use

1. Navigate to `admin-login.html`
2. Enter the credentials above
3. Click "Sign In"
4. You'll be redirected to the admin dashboard
5. Use the dashboard to manage content

---

## 📝 Important Notes

- **Data Storage:** Currently, all data is stored in browser localStorage
- **Photo Uploads:** Photos are stored as base64 data URLs in localStorage
- **Limitations:** 
  - localStorage has size limits (~5-10MB)
  - For production, implement proper file upload to server
  - Consider using cloud storage (AWS S3, Cloudinary, etc.)

---

## 🛠️ Development

To test the admin dashboard locally:

```bash
npm run dev
```

Then navigate to: `http://localhost:5173/admin-login.html`

---

## 📞 Support

For issues or questions about the admin dashboard, contact the development team.

---

**⚠️ SECURITY WARNING:** Change these credentials in production! The current credentials are for development/testing purposes only.














