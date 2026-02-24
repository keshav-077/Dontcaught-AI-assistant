/**
 * Override cursor styling for Tauri drag regions
 * This utility forcefully sets cursor to default on elements with data-tauri-drag-region
 */

export function initializeCursorOverride() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCursorOverride);
  } else {
    applyCursorOverride();
  }
}

function applyCursorOverride() {
  // Find all elements with data-tauri-drag-region attribute
  const dragRegionElements = document.querySelectorAll('[data-tauri-drag-region]');
  
  dragRegionElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      // Force cursor style
      element.style.setProperty('cursor', 'default', 'important');
      element.style.setProperty('-webkit-app-region', 'no-drag', 'important');
      
      // Also apply to all children
      const children = element.querySelectorAll('*');
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.setProperty('cursor', 'default', 'important');
        }
      });
    }
  });
  
  // Set up a MutationObserver to handle dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.hasAttribute('data-tauri-drag-region')) {
            node.style.setProperty('cursor', 'default', 'important');
            node.style.setProperty('-webkit-app-region', 'no-drag', 'important');
          }
          
          // Check children
          const dragRegions = node.querySelectorAll('[data-tauri-drag-region]');
          dragRegions.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.setProperty('cursor', 'default', 'important');
              el.style.setProperty('-webkit-app-region', 'no-drag', 'important');
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
