# Images Directory

This directory is for storing static images that will be served by the website.

## How to Use

1. **Place your images here**: Add any image files (`.jpg`, `.png`, `.gif`, `.svg`, etc.) directly in this folder or create subfolders to organize them.

2. **Reference images in your code**: 
   - In HTML: Use `/images/your-image.jpg` (note the leading slash)
   - In CSS: Use `url('/images/your-image.jpg')`
   - In JavaScript: Use `/images/your-image.jpg`

## Examples

### HTML Example:
```html
<img src="/images/nsm-campus.jpg" alt="NSM Campus" />
```

### CSS Example:
```css
.hero {
  background-image: url('/images/hero-background.jpg');
}
```

### JavaScript Example:
```javascript
const imageUrl = '/images/logo.png';
```

## Folder Structure Suggestions

You can organize images into subfolders:
- `/images/events/` - Event photos
- `/images/gallery/` - Gallery images
- `/images/logos/` - Logo files
- `/images/hero/` - Hero section backgrounds
- `/images/portraits/` - Portrait images

## Notes

- All files in the `public` folder are served at the root URL path
- Images are accessible directly via URL (e.g., `http://localhost:3000/images/photo.jpg`)
- The `public` folder is configured in `vite.config.ts` and will be copied to the build output


