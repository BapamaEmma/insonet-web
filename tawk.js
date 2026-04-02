var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();

// Raise the widget above the OS home bar on iPhone X/14/etc and Android gesture nav
Tawk_API.customStyle = {
  visibility: {
    desktop: { position: 'br', xOffset: 16, yOffset: 16 },
    mobile:  { position: 'br', xOffset: 12, yOffset: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }
  }
};

// Shift widget up after it loads so it clears the home bar
Tawk_API.onLoad = function(){
  var safeBottom = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--sab') || '0'
  ) || 0;
  Tawk_API.setAttributes && Tawk_API.setAttributes({ position: 'br' });
  // Use the exposed iframe offset API if available
  if (typeof Tawk_API.setAttributes === 'function') {
    try {
      Tawk_API.setAttributes({ yOffset: Math.max(16, safeBottom + 12) });
    } catch(e) {}
  }
};

(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69c64c2592329d1c3229c7fb/1jl2anflo';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
