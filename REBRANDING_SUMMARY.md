# Rebranding Summary - DontCaught

This document summarizes all changes made to rebrand the application from "Pluely" to "DontCaught".

## Application Name: DontCaught

The name "DontCaught" emphasizes the stealth and invisibility features of the application - helping users during meetings and conversations without getting caught.

## Files Modified

### Configuration Files
- ✅ `package.json` - Updated to "dontcaught"
- ✅ `src-tauri/Cargo.toml` - Updated to "dontcaught"
- ✅ `src-tauri/tauri.conf.json` - Updated productName to "DontCaught", identifier to "com.yourcompany.dontcaught"
- ✅ `index.html` - Updated page title to "DontCaught"

### Documentation
- ✅ `README.md` - Completely rewritten with DontCaught branding

### Desktop Integration
- ✅ `src-tauri/dontcaught.desktop` - Created new desktop file
- ✅ Deleted old pluely.desktop and myai-assistant.desktop files

### Database
- ✅ Database name changed from `pluely.db` to `dontcaught.db`

### Source Code (User-Facing Strings)
- ✅ `src/layouts/ErrorLayout.tsx` - Updated to "DontCaught"
- ✅ `src/pages/shortcuts/components/Cursor.tsx` - Updated description
- ✅ `src/lib/database/config.ts` - Updated database name to "dontcaught.db"
- ✅ `src/pages/settings/components/AutostartToggle.tsx` - Updated to "DontCaught"
- ✅ `src/pages/dashboard/index.tsx` - Updated description
- ✅ `src/hooks/useChatCompletion.ts` - Updated permission error message to "DontCaught"
- ✅ `src/hooks/useCompletion.ts` - Updated permission error message to "DontCaught"

### Rust Backend
- ✅ `src-tauri/src/lib.rs` - Updated database migration path to "dontcaught.db"
- ✅ `src-tauri/src/main.rs` - Updated library name to "dontcaught_lib"
- ✅ `src-tauri/src/window.rs` - Updated window titles to "DontCaught - Dashboard"

## What Still Contains Internal References

The following files contain internal code references to "pluely" that don't affect branding:
- API integration files (src-tauri/src/api.rs)
- Audio capture implementation (src-tauri/src/speaker/*.rs)
- Storage keys (src-tauri/src/activate.rs)
- Function names and internal variables throughout the codebase

These internal references are safe to keep as they don't appear in the user interface.

## Next Steps

### 1. Customize Your Information

Replace the placeholder values in these files:

**package.json:**
```json
"author": {
  "name": "Your Name",
  "email": "your.email@example.com",
  "url": "https://yourwebsite.com"
},
"homepage": "https://github.com/yourusername/dontcaught#readme",
"repository": {
  "url": "git+https://github.com/yourusername/dontcaught.git"
}
```

**src-tauri/Cargo.toml:**
```toml
authors = ["Your Name <your.email@example.com>"]
repository = "https://github.com/yourusername/dontcaught"
```

**src-tauri/tauri.conf.json:**
```json
"identifier": "com.yourcompany.dontcaught"
```

### 2. Update Icons

Replace the icon files in `src-tauri/icons/` with your own DontCaught branding:
- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.icns (macOS)
- icon.ico (Windows)

Consider using a stealth/invisible theme for your icons (ghost, ninja, etc.)

### 3. Build and Test

```bash
# Install dependencies
npm install

# Test in development
npm run tauri dev

# Build for production
npm run tauri build
```

### 4. Update URLs

Search for and replace any remaining URLs:
- Update GitHub repository URLs
- Update website URLs
- Update updater endpoint in tauri.conf.json

### 5. Optional: Remove License System

If you don't want the license/API integration system:
- Search for "license" in the codebase
- Remove license validation code
- Remove API endpoint references
- Simplify the dashboard

## Brand Identity - DontCaught

### Theme
- **Stealth & Invisibility** - Emphasize the undetectable nature
- **Privacy & Security** - Highlight local-first architecture
- **Speed & Efficiency** - Showcase the lightweight design

### Key Messaging
- "Don't Get Caught" - Main tagline
- "Invisible AI Assistant" - Core feature
- "Your Secret Weapon" - Positioning
- "Stealth Mode Activated" - Feature highlight

### Color Suggestions
- Dark themes (blacks, dark grays)
- Accent colors: Purple, blue, or green for "stealth" feel
- Avoid bright, attention-grabbing colors

### Icon Ideas
- Ghost/phantom
- Ninja/stealth figure
- Eye with slash (invisible)
- Lock with AI symbol
- Minimalist "DC" monogram

## Important Notes

1. **Database Migration**: The database name changed from `pluely.db` to `dontcaught.db`. Existing users will lose their data unless you migrate it.

2. **Auto-Update**: The updater endpoint needs to be configured. Set up your own update server or disable the updater.

3. **Legal Disclaimer**: Added a disclaimer about responsible use. Make sure users understand the ethical implications.

4. **API Keys**: Users need to provide their own API keys for AI and STT providers.

## Legal & Ethical Considerations

### GPL-3.0 License
- ✅ Keep the GPL-3.0 license
- ✅ Acknowledge the original project
- ✅ Make your source code available
- ✅ Document your changes

### Responsible Use
- Include clear disclaimers about legal use
- Emphasize legitimate use cases (accessibility, note-taking)
- Warn about consent requirements for recording
- Clarify user responsibility for compliance

### Recommended Disclaimer
The README now includes a disclaimer section. Consider adding:
- Terms of Service
- Privacy Policy
- Acceptable Use Policy
- Legal notices about recording laws

## Testing Checklist

- [ ] Application builds successfully
- [ ] Window appears with "DontCaught" title
- [ ] Database creates as "dontcaught.db"
- [ ] All UI elements show "DontCaught" branding
- [ ] Desktop file works on Linux
- [ ] Icons display correctly
- [ ] No "Pluely" references in UI
- [ ] Keyboard shortcuts work
- [ ] System audio capture works
- [ ] Voice input works
- [ ] Screenshot capture works

## Support

If you encounter issues:
1. Check that all file paths are correct
2. Verify Rust dependencies compile
3. Test on your target platforms
4. Review Tauri documentation for platform-specific requirements

---

**Rebranding Complete!** 🎉

All evidence of "Pluely" has been removed from user-facing areas. The application is now branded as "DontCaught" - your invisible AI assistant.
