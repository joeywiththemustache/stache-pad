(function () {
  var API = window.STACHE_API;
  var DATA = { weeks: [], gear: [] }, picked = [];
  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
  var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };

  if ($('weeks') && location.hash === '#sound') { location.replace('/event-rentals/'); return; }

  function renderWeeks() {
    var box = $('weeks'); box.className = ''; box.innerHTML = '';
    var month = '', grid;
    DATA.weeks.forEach(function (w) {
      if (w.month !== month) {
        month = w.month;
        var h = document.createElement('div'); h.className = 'month'; h.textContent = month; box.appendChild(h);
        grid = document.createElement('div'); grid.className = 'grid'; box.appendChild(grid);
      }
      var taken = w.past || w.status === 'Booked' || w.status === 'Held';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'wk'; b.disabled = taken;
      var tags = '';
      if (w.label) tags += '<span class="tag hot">' + esc(w.label) + '</span> ';
      if (w.status === 'Held') tags += '<span class="tag">On hold</span> ';
      if (w.status === 'Booked') tags += '<span class="tag">Booked</span> ';
      if (w.roomsOpen) tags += '<span class="tag">Rooms open</span>';
      b.innerHTML = '<span class="check">✓</span><div class="dates">' + esc(w.start + ' – ' + w.end) + '</div><div>' + tags + '</div><div class="price">' +
        (w.price === null ? '<span class="rur">Rate upon request</span>' : money(w.price) + ' <small>/ week</small>') + '</div>';
      b.onclick = function () {
        var i = picked.indexOf(w.id);
        if (i > -1) picked.splice(i, 1); else picked.push(w.id);
        b.classList.toggle('sel', i === -1);
        updateBar();
      };
      grid.appendChild(b);
    });
    var bar = document.createElement('div'); bar.className = 'bar'; bar.id = 'bar';
    bar.innerHTML = '<div class="wrap"><div id="barText"></div><button class="btn" id="barBtn" type="button">Request these dates</button></div>';
    document.body.appendChild(bar);
    $('barBtn').onclick = function () { $('stayForm').classList.add('show'); $('stayForm').scrollIntoView({ behavior: 'smooth' }); };
  }

  function summary() {
    var sel = DATA.weeks.filter(function (w) { return picked.indexOf(w.id) > -1; });
    var total = 0, ask = 0;
    sel.forEach(function (w) { if (w.price === null) ask++; else total += w.price; });
    return { sel: sel, total: total, ask: ask, rooms: sel.some(function (w) { return w.roomsOpen; }) };
  }

  function updateBar() {
    var s = summary(), bar = $('bar'); if (!bar) return;
    bar.classList.toggle('show', s.sel.length > 0);
    var price = s.total ? money(s.total) : '';
    if (s.ask) price += (price ? ' + ' : '') + s.ask + ' rate upon request';
    $('barText').textContent = s.sel.length + (s.sel.length === 1 ? ' week' : ' weeks') + ' · ' + price;
    if (s.sel.length >= 3) $('barText').textContent += ' · $1,000 multi-week discount available';
    $('pickedSummary').innerHTML = s.sel.length
      ? '<b>Your weeks</b><br>' + s.sel.map(function (w) { return esc(w.start + ' – ' + w.end) + (w.label ? ' · ' + esc(w.label) : '') + ' · ' + (w.price === null ? 'Rate upon request' : money(w.price)); }).join('<br>')
      : 'Pick at least one week above.';
    if (s.sel.length >= 3) $('pickedSummary').innerHTML += '<br><b>3+ weeks: $1,000 discount available.</b> Joey will apply it when he confirms.';
    $('typeRow').hidden = !s.rooms;
  }

  function renderGear() {
    var box = $('gearList'); box.innerHTML = '';
    if (!DATA.gear.length) { box.innerHTML = '<p class="sub">Gear list coming soon. Use the form below and tell us what you need.</p>'; return; }
    DATA.gear.forEach(function (g) {
      var l = document.createElement('label'); l.className = 'gear';
      l.innerHTML = '<input type="checkbox"><div><b></b><span></span><ul></ul></div>';
      l.querySelector('input').value = g.item;
      l.querySelector('b').textContent = (g.qty > 1 ? g.qty + ' × ' : '') + g.item;
      var lines = String(g.desc || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
      l.querySelector('span').textContent = lines.shift() || '';
      var ul = l.querySelector('ul');
      lines.forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li); });
      if (!lines.length) ul.remove();
      box.appendChild(l);
    });
  }

  function formData(form) { var o = {}; new FormData(form).forEach(function (v, k) { o[k] = v; }); return o; }

  function send(payload, form, errEl, doneEl, label) {
    var btn = form.querySelector('button[type=submit]');
    errEl.textContent = ''; btn.disabled = true; btn.textContent = 'Sending…';
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || 'Something went wrong');
        form.classList.remove('show'); form.style.display = 'none';
        doneEl.classList.add('show'); doneEl.scrollIntoView({ behavior: 'smooth' });
        if (payload.action === 'stay' && $('bar')) $('bar').remove();
      })
      .catch(function (e) {
        btn.disabled = false; btn.textContent = label;
        errEl.textContent = String(e.message || e).replace(/^Error:\s*/, '') + '. Try again, or email hi@stachepad.com.';
      });
  }

  if ($('stayForm')) $('stayForm').onsubmit = function (e) {
    e.preventDefault();
    var f = formData(this); f.action = 'stay'; f.weeks = picked.slice();
    var err = $('stayErr');
    if (!f.weeks.length) return err.textContent = 'Pick at least one week.';
    if (!f.name || !f.email) return err.textContent = 'Name and email, please.';
    send(f, this, err, $('stayDone'), 'Send request');
  };

  if ($('gearForm')) $('gearForm').onsubmit = function (e) {
    e.preventDefault();
    var f = formData(this); f.action = 'gear';
    f.gear = [].map.call(document.querySelectorAll('#gearList input:checked'), function (i) { return i.value; });
    f.setup = !!f.setup;
    if (f.dj) { f.message = 'DJ: ' + f.dj + (f.message ? '\n\n' + f.message : ''); }
    var err = $('gearErr');
    if (!f.name || !f.email || !f.eventDate) return err.textContent = 'Name, email, and date, please.';
    send(f, this, err, $('gearDone'), 'Request a quote');
  };

  fetch(API + (API.indexOf('?') > -1 ? '&' : '?') + 'action=data')
    .then(function (r) { return r.json(); })
    .then(function (d) { DATA = d; if ($('weeks')) { renderWeeks(); updateBar(); } if ($('gearList')) renderGear(); })
    .catch(function () {
      var msg = 'Couldn\'t load this. Refresh, or email <a href="mailto:hi@stachepad.com">hi@stachepad.com</a>.';
      if ($('weeks')) $('weeks').innerHTML = msg;
      if ($('gearList')) $('gearList').innerHTML = msg;
    });
})();
