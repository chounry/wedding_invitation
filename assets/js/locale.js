/* English / Khmer switch for the themed pages. Load it just before themes.js, so the
   text is already translated when titles get split into letters.
   Text and aria-label / alt / title attributes are looked up in KM by their exact
   English wording, so the markup stays plain English; when you add or reword copy
   on a page, add the matching line here. Choice order: ?lang=km|en, last pick, English. */
(function () {
  "use strict";

  var KM = {
    // names and dates
    "Oun Chounry": "អូន ជូនរី",
    "Sorm Pisey": "សោម ពិសី",
    "Chounry": "ជូនរី",
    "Pisey": "ពិសី",
    "Chounry & Pisey": "ជូនរី & ពិសី",
    "Chounry and Pisey": "ជូនរី និង ពិសី",
    "C P": "ជ ព",
    "C&P": "ជ&ព",
    "C": "ជ",
    "P": "ព",
    "18 · 19 December 2026": "១៨ · ១៩ ធ្នូ ២០២៦",
    "18 · 19 . 12 . 2026": "១៨ · ១៩ . ១២ . ២០២៦",
    "2026": "២០២៦",
    "Siem Reap, Cambodia": "ខេត្តសៀមរាប ប្រទេសកម្ពុជា",

    // page titles
    "Chounry & Pisey — Emerald Seal": "ជូនរី & ពិសី — Emerald Seal",
    "Chounry & Pisey — Palace Gates": "ជូនរី & ពិសី — Palace Gates",
    "Chounry & Pisey — Velvet Curtain": "ជូនរី & ពិសី — Velvet Curtain",
    "Chounry & Pisey — Olive Letter": "ជូនរី & ពិសី — Olive Letter",
    "Chounry & Pisey — Amalfi Lemons": "ជូនរី & ពិសី — Amalfi Lemons",

    // intros
    "Open the wedding invitation": "បើកលិខិតអញ្ជើញមង្គលការ",
    "Together with their families": "រួមជាមួយក្រុមគ្រួសារទាំងសងខាង",
    "You are cordially invited": "សូមគោរពអញ្ជើញ",
    "Break the seal": "បើកស្រោមសំបុត្រ",
    "Welcome": "សូមស្វាគមន៍",
    "The Wedding of": "មង្គលការរបស់",
    "Open the gates": "បើកទ្វារ",
    "The honour of your presence is requested": "សូមគោរពអញ្ជើញលោកអ្នកចូលរួមជាភ្ញៀវកិត្តិយស",
    "Tonight’s performance": "ការសម្តែងយប់នេះ",
    "Raise the curtain": "បើកវាំងនន",
    "Unfold the letter": "បើកលិខិត",
    "Greetings from": "សួស្តីពី",
    "Dear friend,": "ជូនចំពោះមិត្តជាទីស្រឡាញ់",
    "We're getting married, and we'd love you to be there.": "យើងនឹងរៀបការ ហើយចង់ឲ្យអ្នកមកចូលរួម។",
    "With love, C & P": "ដោយក្តីស្រឡាញ់ ជ & ព",
    "Tap the postcard": "ចុចលើកាតប៉ុស្តាល់",

    // hero
    "An evening of love": "រាត្រីនៃក្តីស្រឡាញ់",
    "Scroll for Act I": "រំកិលចុះ ដើម្បីមើលឆាកទី ១",
    "Join us for a sunny celebration": "សូមអញ្ជើញមកអបអរជាមួយយើង",
    "Swipe": "អូស",
    "Act I": "ឆាកទី ១",
    "Act II": "ឆាកទី ២",
    "Act III": "ឆាកទី ៣",
    "Act IV": "ឆាកទី ៤",
    "Act V": "ឆាកទី ៥",

    // countdown
    "Save the Date": "សូមចំណាំកាលបរិច្ឆេទ",
    "Counting the days": "រាប់ថ្ងៃរង់ចាំ",
    "Days": "ថ្ងៃ",
    "Hours": "ម៉ោង",
    "Minutes": "នាទី",
    "Seconds": "វិនាទី",

    // program
    "Two days of celebration": "ពិធីមង្គលការរយៈពេលពីរថ្ងៃ",
    "Wedding Program": "កម្មវិធីមង្គលការ",
    "Fri 18 Dec": "សុក្រ ១៨ ធ្នូ",
    "Sat 19 Dec": "សៅរ៍ ១៩ ធ្នូ",
    "7:00 AM": "ម៉ោង ៧:០០ ព្រឹក",
    "9:00 AM": "ម៉ោង ៩:០០ ព្រឹក",
    "3:00 PM": "ម៉ោង ៣:០០ រសៀល",
    "5:00 PM": "ម៉ោង ៥:០០ ល្ងាច",
    "Monks' Blessing": "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត",
    "Morning prayers and blessings for the couple.": "ព្រះសង្ឃចម្រើនព្រះបរិត្ត និងប្រទានពរដល់កូនកំលោះ កូនក្រមុំ។",
    "Hai Goan Sla": "ពិធីហែជំនូន",
    "The groom's procession arrives with gifts for the bride's family.": "ក្បួនហែកូនកំលោះ នាំជំនូនមកជូនក្រុមគ្រួសារខាងកូនក្រមុំ។",
    "Gaat Sah": "ពិធីកាត់សក់",
    "The hair-cutting ceremony, a fresh start together.": "ពិធីកាត់សក់បង្កក់សិរី ដើម្បីចាប់ផ្តើមជីវិតថ្មីជាមួយគ្នា។",
    "Bongvil Popil": "ពិធីបង្វិលពពិល",
    "Candles are passed around the couple seven times for luck.": "ពពិលទៀនត្រូវបានបង្វិលជុំវិញកូនកំលោះ កូនក្រមុំ ប្រាំពីរជុំ ដើម្បីសិរីសួស្តី។",
    "Sompeah Ponlea": "ពិធីចងដៃ",
    "Knot-tying: family and guests bless the couple with red threads.": "ក្រុមគ្រួសារ និងភ្ញៀវកិត្តិយស ចងដៃប្រសិទ្ធពរដល់កូនកំលោះ កូនក្រមុំ ដោយអំបោះក្រហម។",
    "Wedding Reception": "ពិធីជប់លៀងមង្គលការ",
    "Dinner, music and dancing. Come celebrate with us!": "អាហារពេលល្ងាច តន្ត្រី និងរាំកម្សាន្ត។ សូមអញ្ជើញមកអបអរជាមួយយើង!",

    // gallery
    "Memories": "អនុស្សាវរីយ៍",
    "Our Moments": "គ្រាដ៏ផ្អែមល្ហែម",
    "The proposal": "ការសុំរៀបការ",
    "In full bloom": "ផ្កាកំពុងរីក",
    "A toast to us": "លើកកែវអបអរ",
    "Lovebirds": "គូស្នេហ៍",
    "Forever and always": "រហូតតទៅ",
    "The happy couple": "គូស្វាមីភរិយាដ៏រីករាយ",

    // venue
    "Where": "ទីកន្លែង",
    "The Venue": "ទីតាំងកម្មវិធី",
    "Angkor Wat": "ប្រាសាទអង្គរវត្ត",
    "Siem Reap, Cambodia · placeholder address": "ខេត្តសៀមរាប ប្រទេសកម្ពុជា · អាសយដ្ឋានបណ្តោះអាសន្ន",
    "Wedding venue map": "ផែនទីទីតាំងមង្គលការ",
    "Get Directions": "មើលផែនទី",

    // gift + closing
    "With love": "ដោយក្តីស្រឡាញ់",
    "Wedding Gift": "ចំណងដៃ",
    "Your presence is the greatest gift of all. Should you wish to honor us further, a contribution can be sent below.": "វត្តមានរបស់លោកអ្នក គឺជាកាដូដ៏មានតម្លៃបំផុត។ ប្រសិនបើលោកអ្នកមានបំណងផ្ញើចំណងដៃ សូមស្កេនខាងក្រោម។",
    "Wedding gift QR code": "កូដ QR សម្រាប់ចំណងដៃ",
    "Scan with your banking app to send a gift": "ស្កេនជាមួយកម្មវិធីធនាគាររបស់អ្នក ដើម្បីផ្ញើចំណងដៃ",
    "See you there": "សូមអញ្ជើញចូលរួម",
    "With love & gratitude": "ដោយក្តីស្រឡាញ់ និងការដឹងគុណ",

    // controls
    "← All designs": "← គំរូទាំងអស់",
    "Close": "បិទ",
    "Previous": "មុន",
    "Next": "បន្ទាប់",
    "Pages": "ទំព័រ",
    "Previous page": "ទំព័រមុន",
    "Next page": "ទំព័របន្ទាប់"
  };

  var root = document.documentElement;
  var KEY = "lang";
  var ATTRS = ["aria-label", "alt", "title"];
  var norm = function (s) { return s.trim().replace(/\s+/g, " "); };

  var texts = [], attrs = [], splits = [];
  document.querySelectorAll("[data-split]").forEach(function (el) {
    splits.push([el, norm(el.textContent)]);
  });
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    var n = walker.currentNode, en = norm(n.nodeValue);
    if (!KM[en] || n.parentElement.closest("script, style, [data-split]")) continue;
    var ws = n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/);
    texts.push([n, en, ws[1], ws[2]]);
  }
  ATTRS.forEach(function (a) {
    document.querySelectorAll("[" + a + "]").forEach(function (el) {
      var en = norm(el.getAttribute(a));
      if (KM[en]) attrs.push([el, a, en]);
    });
  });

  function apply(lang) {
    var tr = function (en) { return lang === "km" ? KM[en] : en; };
    texts.forEach(function (t) { t[0].nodeValue = t[2] + tr(t[1]) + t[3]; });
    attrs.forEach(function (t) { t[0].setAttribute(t[1], tr(t[2])); });
    splits.forEach(function (t) { t[0].textContent = tr(t[1]) || t[1]; });
    root.lang = lang;
  }

  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function ok(l) { return l === "en" || l === "km"; }

  var param = new URLSearchParams(location.search).get("lang");
  var current = ok(param) ? param : ok(load()) ? load() : "en";
  if (current === "km") apply("km");

  var tools = document.querySelector(".tools");
  if (!tools) {
    tools = document.createElement("div");
    tools.className = "tools";
    document.body.appendChild(tools);
  }
  var group = document.createElement("div");
  group.className = "lang";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Language / ភាសា");
  [["en", "EN"], ["km", "ខ្មែរ"]].forEach(function (l) {
    var b = document.createElement("button");
    b.type = "button";
    b.lang = l[0];
    b.textContent = l[1];
    b.setAttribute("aria-pressed", String(l[0] === current));
    b.addEventListener("click", function () {
      if (l[0] === current) return;
      current = l[0];
      save(current);
      var url = new URL(location.href);
      if (current === "en") url.searchParams.delete("lang");
      else url.searchParams.set("lang", current);
      history.replaceState(null, "", url);
      apply(current);
      Array.prototype.forEach.call(group.children, function (x) {
        x.setAttribute("aria-pressed", String(x.lang === current));
      });
      document.dispatchEvent(new CustomEvent("invite:lang", { detail: current }));
    });
    group.appendChild(b);
  });
  tools.insertBefore(group, tools.firstChild);
})();
