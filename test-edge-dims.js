const { exec } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const script = `
  const media = document.querySelector('.product-information__media');
  const details = document.querySelector('.product-details');
  const grid = document.querySelector('.product-information__grid');
  console.log(JSON.stringify({
    gridWidth: grid?.getBoundingClientRect().width,
    mediaWidth: media?.getBoundingClientRect().width,
    detailsWidth: details?.getBoundingClientRect().width,
    mediaPct: (media?.getBoundingClientRect().width / grid?.getBoundingClientRect().width * 100).toFixed(1) + '%',
    detailsPct: (details?.getBoundingClientRect().width / grid?.getBoundingClientRect().width * 100).toFixed(1) + '%'
  }));
`;

const cmd = `"${edgePath}" --headless --disable-gpu --window-size=1440,900 --dump-dom "http://127.0.0.1:9292/products/cr7-energy-1"`;

exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('DOM length:', stdout.length);
  // Let's check if stdout contains our classes
  const hasGrid = stdout.includes('product-information__grid');
  console.log('Has grid:', hasGrid);
});
