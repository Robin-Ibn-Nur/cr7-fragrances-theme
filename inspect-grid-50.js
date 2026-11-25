const fs = require('fs');

fetch('http://127.0.0.1:9292/products/cr7-energy-1')
  .then(r => r.text())
  .then(t => {
    // Check all rules affecting .product-information__media and .product-details
    const matchesMedia = [...t.matchAll(/(\.[^{}]*product-information__media[^{}]*\{[^{}]*\})/gi)].map(m => m[0]);
    console.log('Matches for product-information__media:');
    matchesMedia.forEach(m => console.log(m));

    const matchesDetails = [...t.matchAll(/(\.[^{}]*product-details[^{}]*\{[^{}]*\})/gi)].map(m => m[0]);
    console.log('\nMatches for product-details:');
    matchesDetails.slice(0, 10).forEach(m => console.log(m));
  });
