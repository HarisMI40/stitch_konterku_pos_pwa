/* KonterKu - navigasi bersama antar halaman */
(function () {
  var PAGES = {
    beranda: 'index.html',
    kasir: 'kasir_konterku.html',
    stok: 'stok_inventaris_konterku.html',
    laporan: 'laporan_keuangan_konterku.html',
    input_massal: 'input_massal_konterku.html',
    hutang: 'buku_hutang_kasbon_konterku.html',
    tutup_kas: 'tutup_kas_harian_konterku.html'
  };
  var MORE = [
    { key: 'input_massal', icon: 'playlist_add', label: 'Input Massal', desc: 'Rekap penjualan tutup toko' },
    { key: 'hutang', icon: 'menu_book', label: 'Buku Hutang / Kasbon', desc: 'Piutang pelanggan & hutang kita' },
    { key: 'tutup_kas', icon: 'lock_clock', label: 'Tutup Kas Harian', desc: 'Rekonsiliasi kas shift' }
  ];
  var BOTTOM = [
    { key: 'beranda', icon: 'home', label: 'Beranda' },
    { key: 'kasir', icon: 'point_of_sale', label: 'Kasir' },
    { key: 'stok', icon: 'inventory_2', label: 'Stok' },
    { key: 'laporan', icon: 'bar_chart', label: 'Laporan' },
    { key: 'lainnya', icon: 'more_horiz', label: 'Lainnya' }
  ];

  var file = decodeURIComponent(location.pathname.split('/').pop() || '');
  var current = Object.keys(PAGES).filter(function (k) { return PAGES[k] === file; })[0] || '';
  var isMore = MORE.some(function (m) { return m.key === current; });

  function go(key) { location.href = PAGES[key]; }

  /* ---------- sheet menu "Lainnya" ---------- */
  var sheet;
  function buildSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.id = 'kk-more-sheet';
    sheet.style.cssText = 'position:fixed;inset:0;z-index:100;display:none;';
    var items = MORE.map(function (m) {
      var active = m.key === current;
      return '<a href="' + PAGES[m.key] + '" style="display:flex;align-items:center;gap:14px;padding:12px 8px;border-radius:12px;text-decoration:none;color:#0b1c30;' +
        (active ? 'background:#eff4ff;' : '') + '">' +
        '<span class="material-symbols-outlined" style="font-size:24px;color:#1d4ed8">' + m.icon + '</span>' +
        '<span style="display:flex;flex-direction:column"><b style="font-size:14px">' + m.label + '</b>' +
        '<small style="font-size:12px;color:#434655">' + m.desc + '</small></span></a>';
    }).join('');
    sheet.innerHTML =
      '<div data-close style="position:absolute;inset:0;background:rgba(0,0,0,.4)"></div>' +
      '<div style="position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:20px 20px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px));max-width:560px;margin:0 auto;font-family:Inter,sans-serif">' +
      '<div style="width:40px;height:4px;border-radius:2px;background:#c4c5d7;margin:0 auto 12px"></div>' +
      '<div style="font-weight:700;font-size:16px;margin-bottom:8px">Menu Lainnya</div>' + items + '</div>';
    sheet.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) sheet.style.display = 'none';
    });
    document.body.appendChild(sheet);
    return sheet;
  }
  function openMore(e) {
    if (e) e.preventDefault();
    buildSheet().style.display = 'block';
  }

  /* ---------- hubungkan link yang sudah ada (data-path) ---------- */
  var links = document.querySelectorAll('a[data-path]');
  Array.prototype.forEach.call(links, function (a) {
    var key = a.getAttribute('data-path');
    if (key === 'lainnya') {
      a.setAttribute('href', '#');
      a.addEventListener('click', openMore);
    } else if (PAGES[key]) {
      a.setAttribute('href', PAGES[key]);
    }
  });

  /* ---------- halaman tanpa bottom nav (buku hutang): sisipkan ---------- */
  var hasBottomNav = Array.prototype.some.call(links, function (a) { return a.getAttribute('data-path') === 'lainnya'; });
  if (!hasBottomNav && current !== 'input_massal') {
    var nav = document.createElement('nav');
    nav.className = 'fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)]';
    nav.innerHTML = '<div class="flex items-center justify-around h-16 px-space-xs">' + BOTTOM.map(function (b) {
      var active = (b.key === 'lainnya' && isMore);
      return '<a class="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 transition-colors group ' +
        (active ? 'text-primary-container font-semibold' : 'text-on-surface-variant') + '" data-path="' + b.key + '" href="' +
        (b.key === 'lainnya' ? '#' : PAGES[b.key]) + '">' +
        '<span class="material-symbols-outlined text-[24px] mb-0.5">' + b.icon + '</span>' +
        '<span class="font-label-sm text-label-sm tracking-tight">' + b.label + '</span></a>';
    }).join('') + '</div>';
    document.body.appendChild(nav);
    var more = nav.querySelector('[data-path="lainnya"]');
    if (more) more.addEventListener('click', openMore);
    var main = document.querySelector('main');
    if (main) main.style.paddingBottom = '96px';
  } else if (isMore) {
    /* sorot "Lainnya" di halaman turunan */
    var m = document.querySelector('a[data-path="lainnya"]');
    if (m) m.classList.add('text-primary-container', 'font-semibold');
  }

  /* ---------- tombol kembali ---------- */
  var back = document.querySelector('button[aria-label="Kembali"]');
  if (back) {
    back.removeAttribute('onclick');
    back.addEventListener('click', function () {
      if (history.length > 1 && document.referrer) history.back(); else go('beranda');
    });
  }

  /* ---------- logo / nama KonterKu -> beranda ---------- */
  var brand = document.querySelector('header img[alt="KonterKu Logo"]');
  if (brand) { brand.style.cursor = 'pointer'; brand.addEventListener('click', function () { go('beranda'); }); }

  /* ---------- breadcrumb Input Massal ---------- */
  if (current === 'input_massal') {
    var crumbs = document.querySelectorAll('main span');
    Array.prototype.forEach.call(crumbs, function (s) {
      var t = s.textContent.trim();
      var target = t === 'Kasir' ? 'kasir' : t === 'Rekap Akhir Hari' ? 'tutup_kas' : '';
      if (target && s.children.length === 0 && s.parentElement.className.indexOf('mb-1') > -1) {
        s.style.cursor = 'pointer';
        s.addEventListener('click', function () { go(target); });
      }
    });
  }
})();
