// Version checking utility for automatic updates
export class VersionChecker {
    private static instance: VersionChecker;
    private currentVersion: string;
    private checkInterval: number = 30000; // 30 seconds
    private intervalId: NodeJS.Timeout | null = null;
    private lastCheckTime: number = 0;
  
    private constructor() {
      this.currentVersion = this.getCurrentVersion();
      console.log(`🔍 Version Checker initialized - Current version: ${this.currentVersion}`);
    }
  
    public static getInstance(): VersionChecker {
      if (!VersionChecker.instance) {
        VersionChecker.instance = new VersionChecker();
      }
      return VersionChecker.instance;
    }
  
    private getCurrentVersion(): string {
      const metaTag = document.querySelector('meta[name="app-version"]');
      const version = metaTag?.getAttribute('content') || '1.0.1';
      console.log(`📱 Current app version: ${version}`);
      return version;
    }
  
    private async checkForUpdates(): Promise<boolean> {
      try {
        const now = Date.now();
        this.lastCheckTime = now;
        
        console.log(`🔍 Checking for updates at ${new Date().toLocaleTimeString()}...`);
        
        // Fetch the current index.html with aggressive cache busting
        const response = await fetch(`/?v=${now}&cb=${Math.random()}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          console.warn(`❌ Failed to check for updates: ${response.status}`);
          return false;
        }
  
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const versionMeta = doc.querySelector('meta[name="app-version"]');
        const latestVersion = versionMeta?.getAttribute('content') || '1.0.1';
  
        console.log(`📊 Version check result:
          Current: ${this.currentVersion}
          Latest:  ${latestVersion}
          Changed: ${latestVersion !== this.currentVersion ? '✅ YES' : '❌ NO'}`);
  
        if (latestVersion !== this.currentVersion) {
          console.log('🎉 New version detected! Showing notification...');
          this.showUpdateNotification(latestVersion);
          return true;
        }
  
        return false;
      } catch (error) {
        console.error('❌ Error checking for updates:', error);
        return false;
      }
    }
  
    private showUpdateNotification(newVersion?: string): void {
      console.log('🔔 Displaying update notification...');
      
      // Remove existing notification if any
      const existing = document.getElementById('update-notification');
      if (existing) {
        existing.remove();
      }
  
      // Create update notification with enhanced styling
      const notification = document.createElement('div');
      notification.id = 'update-notification';
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 20px 24px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1);
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 380px;
          animation: slideInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          backdrop-filter: blur(10px);
        ">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <div style="
              width: 24px; 
              height: 24px; 
              background: rgba(255,255,255,0.2); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin-right: 12px;
              animation: pulse 2s infinite;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12c0 1-.6 3-1.5 4.5-.9 1.5-2.4 3-4.5 3.5-2.1.5-4.5 0-6.5-1.5-2-1.5-3.5-4-3.5-6.5s1.5-5 3.5-6.5c2-1.5 4.4-2 6.5-1.5 2.1.5 3.6 2 4.5 3.5.9 1.5 1.5 3.5 1.5 4.5z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div>
              <strong style="font-size: 16px;">Update Available!</strong>
              ${newVersion ? `<div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">Version ${newVersion}</div>` : ''}
            </div>
          </div>
          <p style="margin: 0 0 16px 0; font-size: 14px; opacity: 0.95; line-height: 1.4;">
            A new version is available with the latest features and improvements. Update now to get the best experience!
          </p>
          <div style="display: flex; gap: 10px;">
            <button onclick="window.versionChecker.forceUpdate()" style="
              background: rgba(255,255,255,0.9);
              border: none;
              color: #059669;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.2s;
              flex: 1;
            " onmouseover="this.style.background='rgba(255,255,255,1)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='rgba(255,255,255,0.9)'; this.style.transform='translateY(0)'">
              Update Now
            </button>
            <button onclick="document.getElementById('update-notification').remove()" style="
              background: transparent;
              border: 1px solid rgba(255,255,255,0.4);
              color: white;
              padding: 10px 16px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='transparent'; this.style.transform='translateY(0)'">
              Later
            </button>
          </div>
        </div>
        <style>
          @keyframes slideInBounce {
            0% { transform: translateX(100%) scale(0.8); opacity: 0; }
            60% { transform: translateX(-10px) scale(1.05); opacity: 1; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        </style>
      `;
  
      document.body.appendChild(notification);
  
      // Auto-remove after 15 seconds if user doesn't interact
      setTimeout(() => {
        const notif = document.getElementById('update-notification');
        if (notif) {
          notif.style.animation = 'slideOut 0.3s ease-in forwards';
          setTimeout(() => notif.remove(), 300);
        }
      }, 15000);
  
      // Add slide out animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  
    public startChecking(): void {
      if (this.intervalId) {
        return; // Already checking
      }
  
      console.log('🚀 Starting automatic version checking...');
      
      // Check immediately after a short delay
      setTimeout(() => {
        this.checkForUpdates();
      }, 2000);
  
      // Then check every 30 seconds
      this.intervalId = setInterval(() => {
        this.checkForUpdates();
      }, this.checkInterval);
    }
  
    public stopChecking(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        console.log('⏹️ Stopped version checking');
      }
    }
  
    public forceUpdate(): void {
      console.log('🔄 Force updating application...');
      
      // Clear all caches and reload
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => {
            caches.delete(name);
          });
          // Add timestamp to force reload
          window.location.href = window.location.href + '?updated=' + Date.now();
        });
      } else {
        window.location.href = window.location.href + '?updated=' + Date.now();
      }
    }
  
    // Manual check method for testing
    public checkNow(): Promise<boolean> {
      console.log('🔍 Manual version check triggered...');
      return this.checkForUpdates();
    }
  }
  
  // Auto-start version checking when module loads
  export const versionChecker = VersionChecker.getInstance();
  
  // Make it globally available for the notification buttons
  (window as any).versionChecker = versionChecker;