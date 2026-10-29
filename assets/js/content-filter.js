// İletişim formunda uygunsuz ifade (küfür, hakaret, argo) denetimi.
// Kelime listesi herkese açık depoda düz metin olarak durmasın diye yalnız özetleri (cyrb53) yayınlanır.
(function (root, factory) {
  const api = factory(root.CONTENT_FILTER_DATA || { exact: [], prefix: [], allow: [] });
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ContentFilter = api;
})(typeof self !== "undefined" ? self : globalThis, (data) => {
  const MIN_PREFIX = 4;
  const MAX_STRETCHED_RUNS = 6;
  const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", "@": "a", $: "s" };
  const exact = new Set(data.exact);
  const prefix = new Set(data.prefix);
  const allow = new Set(data.allow);

  // cyrb53 (bryc, kamu malı): hızlı, 53 bit; şifreleme amaçlı değil. Ara durum her karakterde
  // sonlandırıldığı için bir sözcüğün bütün öneklerinin özeti tek geçişte çıkar.
  const finish = (h1, h2) => {
    const a = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    const b = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
    return (4294967296 * (2097151 & b) + (a >>> 0)).toString(36);
  };
  const prefixHashes = (value) => {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    const hashes = [];
    for (let i = 0; i < value.length; i++) {
      const ch = value.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
      hashes.push(finish(h1, h2));
    }
    return hashes;
  };
  const last = (items) => items[items.length - 1];
  const hash = (value) => last(prefixHashes(value));

  const canonical = (word) => word.normalize("NFKC").toLocaleLowerCase("tr");

  // Görünmez karakterler atılır; tek karakterlik en az üç parça birleştirilerek de denenir
  // ("m e r h a b a"), iki baş harf ("M. K.") birleştirilmez.
  const tokensOf = (text) => {
    const words = text.normalize("NFKC").replace(/\p{Cf}/gu, "").split(/[^\p{L}\p{N}@$]+/u).filter(Boolean);
    const tokens = [...words];
    let run = [];
    for (const word of [...words, ""]) {
      if (word.length === 1) {
        run.push(word);
        continue;
      }
      if (run.length >= 3) tokens.push(run.join(""));
      run = [];
    }
    return tokens;
  };

  // Türkçe (I -> ı) ve İngilizce (I -> i) küçük harf birlikte denenir.
  const lowerVariants = (token) => [...new Set([token.toLocaleLowerCase("tr"), token.toLowerCase().replace(/̇/g, "")])];

  // Harf tekrarındaki ("meeerhaba") her tekrar dizisi tek ve çift harfle denenir: sözcüğün kendi çift
  // harfi ("dikkat") korunur, çift harfi olmayan masum sözcük de çift harfli bir köke benzemez.
  const stretchVariants = (word) => {
    const runs = (word.match(/(.)\1*/gu) || []).map((run) => {
      const ch = String.fromCodePoint(run.codePointAt(0));
      return run.length > ch.length ? [ch, ch + ch] : [ch];
    });
    if (runs.filter((options) => options.length > 1).length > MAX_STRETCHED_RUNS) {
      return [runs.map((options) => options[0]).join(""), runs.map(last).join("")];
    }
    return runs.reduce((variants, options) => variants.flatMap((variant) => options.map((ch) => variant + ch)), [""]);
  };

  // Rakamla gizlenmiş yazım ("m3rh4b4") harfe çevrilerek de denenir.
  const candidatesOf = (word) =>
    [...new Set([word, word.replace(/[013457@$]/g, (ch) => LEET[ch])])].flatMap(stretchVariants);

  const isBlocked = (candidate) => {
    const hashes = prefixHashes(candidate);
    return exact.has(last(hashes)) || hashes.slice(MIN_PREFIX - 1).some((value) => prefix.has(value));
  };

  const contains = (text) =>
    tokensOf(text).some((token) => {
      const words = lowerVariants(token);
      if (words.some((word) => allow.has(hash(word)))) return false;
      return words.some((word) => candidatesOf(word).some(isBlocked));
    });

  return { contains, canonical, hash, MIN_PREFIX };
});
