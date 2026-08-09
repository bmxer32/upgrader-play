/* Ссылки на Google Play, определение платформы, счётчики. */

(function () {
  'use strict';

  var PACKAGE = 'com.upgrader.upgrader';
  var CAMPAIGN = 'landing';

  /* Install Referrer доезжает до приложения, только если referrer —
     URL-энкоженная строка UTM. Метка каждой кнопки идёт в utm_content. */
  function playUrl(place) {
    var ref = [
      'utm_source=' + CAMPAIGN,
      'utm_medium=web',
      'utm_campaign=' + CAMPAIGN,
      'utm_content=' + place,
    ].join('&');
    return (
      'https://play.google.com/store/apps/details?id=' +
      PACKAGE +
      '&referrer=' +
      encodeURIComponent(ref)
    );
  }

  var isAndroid = /android/i.test(navigator.userAgent);
  document.body.setAttribute('data-plat', isAndroid ? 'android' : 'other');

  function track(name, params) {
    if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (window.ym && window.ymCounterId) window.ym(window.ymCounterId, 'reachGoal', name, params);
  }
  window.upTrack = track;

  document.querySelectorAll('[data-cta]').forEach(function (el) {
    var place = el.getAttribute('data-cta');
    el.setAttribute('href', playUrl(place));
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', function () {
      track('cta_click', { place: place });
    });
  });

  /* Мгновенная переадресация — включается флагом в <head> */
  if (window.AUTO_REDIRECT) {
    location.replace(playUrl('auto'));
    return;
  }

  /* Липкая кнопка снизу появляется, когда первый экран уже прокручен */
  var onScroll = function () {
    if (window.scrollY > 320) document.body.setAttribute('data-scrolled', '');
    else document.body.removeAttribute('data-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();
