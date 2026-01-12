export const filterSVG = (svg: string | undefined): string | undefined => {
  if (!svg) return undefined;

  try {
    // Parse SVG as XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return svg;

    // Add a unique scoping class to the root svg
    const scopeClass = 'ml-makecode-' + Math.random().toString(36).slice(2, 9);
    // Preserve existing class attribute
    const existingClass = svgEl.getAttribute('class');
    svgEl.setAttribute('class', (existingClass ? existingClass + ' ' : '') + scopeClass);

    // Helper to prefix selectors while preserving @-rules
    const prefixCssSelectors = (cssText: string, scope: string) => {
      // Remove CDATA wrapper if present, remember to not reintroduce it
      const hasCData = /^\s*<!\[CDATA\[/.test(cssText);
      const cleaned = cssText.replace(/<!\[CDATA\[([\s\S]*?)\]\]>?/, '$1');

      let out = '';
      let i = 0;
      const len = cleaned.length;

      while (i < len) {
        // Skip whitespace
        if (/\s/.test(cleaned[i])) {
          out += cleaned[i];
          i++;
          continue;
        }

        if (cleaned[i] === '@') {
          // Preserve whole @ rule (e.g. @keyframes, @media)
          const start = i;
          // find the opening brace
          const brace = cleaned.indexOf('{', i);
          if (brace === -1) {
            out += cleaned.slice(i);
            break;
          }
          // find matching closing brace by counting braces
          let depth = 1;
          let k = brace + 1;
          while (k < len && depth > 0) {
            if (cleaned[k] === '{') depth++;
            else if (cleaned[k] === '}') depth--;
            k++;
          }
          out += cleaned.slice(start, k);
          i = k;
        } else {
          // Normal selector block
          const brace = cleaned.indexOf('{', i);
          if (brace === -1) {
            out += cleaned.slice(i);
            break;
          }
          const selector = cleaned.slice(i, brace).trim();
          // find matching closing brace
          let depth = 1;
          let k = brace + 1;
          while (k < len && depth > 0) {
            if (cleaned[k] === '{') depth++;
            else if (cleaned[k] === '}') depth--;
            k++;
          }
          const body = cleaned.slice(brace + 1, k - 1);

          // Remove any background declarations so the SVG doesn't force a page background
          const bodyNoBackground = body
            .replace(/\bbackground(?:-color)?\s*:\s*[^;]+;?/gi, '')
            .replace(/\bbackground\s*:\s*[^;]+;?/gi, '');

          if (selector) {
            // prefix each selector in a comma-separated list
            const prefixed = selector
              .split(',')
              .map(s => `.${scope} ${s.trim()}`)
              .join(', ');
            out += prefixed + '{' + bodyNoBackground + '}';
          } else {
            out += '{' + bodyNoBackground + '}';
          }
          i = k;
        }
      }

      // Return without CDATA wrapper (safe for injection into DOM)
      return out;
    };

    // Process each <style> inside the svg
    const styleEls = svgEl.querySelectorAll('style');
    styleEls.forEach(styleEl => {
      const original = styleEl.textContent || '';
      try {
        const scoped = prefixCssSelectors(original, scopeClass);
        // Replace content; using textContent avoids accidental HTML parsing
        styleEl.textContent = scoped;
      } catch (e) {
        // If something goes wrong, leave the original
        // eslint-disable-next-line no-console
        console.warn('filterSVG: failed to scope style, leaving original', e);
        styleEl.textContent = original;
      }
    });

    // Serialize back to string
    const serializer = new XMLSerializer();
    // Serialize the whole document to preserve xmlns attributes
    const result = serializer.serializeToString(doc.documentElement || svgEl);
    return result;
  } catch (e) {
    // If parsing or processing fails, return original svg as a fallback
    // eslint-disable-next-line no-console
    console.warn('filterSVG: failed to parse svg, returning original', e);
    return svg;
  }
};
