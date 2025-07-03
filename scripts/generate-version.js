const fs = require('fs');
const path = require('path');

// Generate version timestamp for cache busting
const generateVersion = () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const version = packageJson.version;
  const timestamp = Date.now();
  const buildVersion = `${version}.${timestamp}`;
  
  console.log(`Generated build version: ${buildVersion}`);
  
  // Update index.html with new version
  const indexPath = path.join('dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(
      /<meta name="app-version" content="[^"]*">/,
      `<meta name="app-version" content="${buildVersion}">`
    );
    fs.writeFileSync(indexPath, indexContent);
    console.log(`Updated index.html with version: ${buildVersion}`);
  }
  
  // Create version.json for API checks
  const versionInfo = {
    version: buildVersion,
    buildTime: new Date().toISOString(),
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
  };
  
  fs.writeFileSync(
    path.join('dist', 'version.json'), 
    JSON.stringify(versionInfo, null, 2)
  );
  
  console.log('Version files generated successfully!');
};

generateVersion();