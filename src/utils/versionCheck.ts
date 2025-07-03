// Version checking utility for automatic updates
export class VersionChecker {
    private static instance: VersionChecker;
    private currentVersion: string;
    private checkInterval: number = 30000; // 30 seconds
    private intervalId: NodeJS.Timeout | null = null;
  
    private constructor() {
      this.currentVersion = this.getCurrentVersion();
    }
  
    public static getInstance(): VersionChecker {
      if (!VersionChecker.instance) {
        VersionChecker.instance = new VersionChecker();
      }
      return VersionChecker.instance;
    }
  
    private getCurrentVersion(): string {
      const metaTag = document.querySelector('meta[name="app-version"]');
      return metaTag?.getAttribute('content') || '1.0.0';
    }
  
    private async checkForUpdates(): Promise<boolean> {
      try {
        // Fetch the current index.html with cache busting
        const response = await fetch(`/?v=${Date.now()}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          console.warn('Failed to check for updates');
          return false;
        }
  
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const versionMeta = doc.querySelector('meta[name="app-version"]');
        const latestVersion = versionMeta?.getAttribute('content') || '1.0.0';
  
        console.log(`Current version: ${this.currentVersion}, Latest version: ${latestVersion}`);
  
        if (latestVersion !== this.currentVersion) {
          console.log('New version detected!');
          this.showUpdateNotification();
          return true;
        }
  
        return false;
      } catch (error) {
        console.error('Error checking for updates:', error);
        return false;
      }
    }
  
    private showUpdateNotification(): void {
      // Create update notification
      const notification = document.createElement('div');
      notification.id = 'update-notification';
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 350px;
          animation: slideIn 0.3s ease-out;
        ">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
              <path d="M21 12c0 1-.6 3-1.5 4.5-.9 1.5-2.4 3-4.5 3.5-2.1.5-4.5 0-6.5-1.5-2-1.5-3.5-4-3.5-6.5s1.5-5 3.5-6.5c2-1.5 4.4-2 6.5-1.5 2.1.5 3.6 2 4.5 3.5.9 1.5 1.5 3.5 1.5 4.5z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <strong>Update Available!</strong>
          </div>
          <p style="margin: 0 0 12px 0; font-size: 14px; opacity: 0.9;">
            A new version of the application is available with the latest features and improvements.
          </p>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.location.reload()" style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
              Update Now
            </button>
            <button onclick="document.getElementById('update-notification').remove()" style="
              background: transparent;
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
              Later
            </button>
          </div>
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `;
  
      // Remove existing notification if any
      const existing = document.getElementById('update-notification');
      if (existing) {
        existing.remove();
      }
  
      document.body.appendChild(notification);
  
      // Auto-remove after 10 seconds if user doesn't interact
      setTimeout(() => {
        const notif = document.getElementById('update-notification');
        if (notif) {
          notif.remove();
        }
      }, 10000);
    }
  
    public startChecking(): void {
      if (this.intervalId) {
        return; // Already checking
      }
  
      console.log('Starting version check...');
      
      // Check immediately
      this.checkForUpdates();
  
      // Then check every 30 seconds
      this.intervalId = setInterval(() => {
        this.checkForUpdates();
      }, this.checkInterval);
    }
  
    public stopChecking(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        console.log('Stopped version checking');
      }
    }
  
    public forceUpdate(): void {
      // Clear all caches and reload
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => {
            caches.delete(name);
          });
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    }
  }
  
  // Auto-start version checking when module loads
  export const versionChecker = VersionChecker.getInstance();