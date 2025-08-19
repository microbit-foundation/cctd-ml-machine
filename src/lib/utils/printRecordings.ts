/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import StaticConfiguration from '../../StaticConfiguration';
import { getRecordingChartDatasets } from '../../components/features/graphs/recording/RecordingGraph';

// Print recordings in a hidden iframe: 4 recordings per A4 landscape page.
export function printRecordings(gestureName: string, recordings: any[]) {
  if (!recordings || recordings.length === 0) return;

  function chunk<T>(arr: T[], size: number): T[][] {
    const res: T[][] = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  }

  const colors = StaticConfiguration.graphColors ?? ['#f9808e', '#80f98e', '#80b8f9'];

  function svgForRecording(recording: any, globalMinY?: number, globalMaxY?: number) {
    const datasets = getRecordingChartDatasets(recording.samples);
    const w = 600;
    const h = 260;
    // padding inside SVG so labels/ticks don't clip
    const leftPad = 44;
    const rightPad = 20;
    const topPad = 20;
    const bottomPad = 20;
    const n = datasets.length > 0 ? datasets[0].length : 0;
    let minY = typeof globalMinY === 'number' ? globalMinY : Infinity;
    let maxY = typeof globalMaxY === 'number' ? globalMaxY : -Infinity;
    if (typeof globalMinY !== 'number' || typeof globalMaxY !== 'number') {
      datasets.forEach(ds =>
        ds.forEach((p: any) => {
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        }),
      );
    }
    if (!isFinite(minY) || !isFinite(maxY)) {
      minY = 0;
      maxY = 1;
    }
    if (minY === maxY) {
      maxY = minY + 1;
    }

    const xScale = n > 1 ? (w - leftPad - rightPad) / (n - 1) : 1;
    const yScale = (h - topPad - bottomPad) / (maxY - minY);

    const paths = datasets
      .map((ds, idx) => {
        const path = ds
          .map(
            (p: any, i: number) =>
              `${i === 0 ? 'M' : 'L'} ${leftPad + i * xScale} ${h - bottomPad - (p.y - minY) * yScale}`,
          )
          .join(' ');
        const color = colors[idx % colors.length];
        return `<path d="${path}" fill="none" stroke="${color}" stroke-width="1.5" />`;
      })
      .join('\n');

    const axis = `<line x1="${leftPad}" y1="${h - bottomPad}" x2="${w - rightPad}" y2="${h - bottomPad}" stroke="#ccc" stroke-width="1"/>`;
    // vertical left axis and ticks (no horizontal ticks)
    const leftAxis = `<line x1="${leftPad}" y1="${topPad}" x2="${leftPad}" y2="${h - bottomPad}" stroke="#ccc" stroke-width="1"/>`;
    const tickCount = 5;

    // helper to format tick numbers with sensible precision
    function formatTick(v: number) {
      const a = Math.abs(v);
      if (a === 0) return '0';
      if (a < 1) return v.toFixed(3).replace(/\.?0+$/, '');
      if (a < 10) return v.toFixed(2).replace(/\.?0+$/, '');
      if (a < 100) return v.toFixed(1).replace(/\.?0+$/, '');
      return Math.round(v).toString();
    }

    const eps = (maxY - minY) / 1e6;
    const tickVals = Array.from(
      { length: tickCount },
      (_, ti) => minY + (ti / (tickCount - 1)) * (maxY - minY),
    );

    // Render axis ticks and labels, but do NOT render a numeric label for the zero value (it will be shown as a dashed horizontal line)
    const tickLines = tickVals
      .map(val => {
        const y = h - bottomPad - (val - minY) * yScale;
        // If this tick is effectively zero, skip rendering its label/tick here; a dashed zero line will be drawn across the plot.
        if (Math.abs(val) <= eps) {
          return '';
        }
        // small tick extending left from axis plus label
        const tick = `<line x1="${leftPad}" y1="${y}" x2="${leftPad - 6}" y2="${y}" stroke="#ccc" stroke-width="1"/>`;
        const label = `<text x="${leftPad - 8}" y="${y + 4}" font-size="9" text-anchor="end" fill="#333">${escapeHtml(formatTick(val))}</text>`;
        return tick + '\n' + label;
      })
      .join('\n');

    // Draw a dashed gray horizontal line across the plotting area at y=0 if zero lies within the data range
    let zeroLine = '';
    if (minY <= 0 && 0 <= maxY) {
      const y0 = h - bottomPad - (0 - minY) * yScale;
      zeroLine = `<line x1="${leftPad}" y1="${y0}" x2="${w - rightPad}" y2="${y0}" stroke="#999" stroke-width="1" stroke-dasharray="4 3"/>`;
    }

    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${leftAxis}${axis}${tickLines}${zeroLine}${paths}</svg>`;
  }

  // compute global min/max across all recordings so y-axis is shared
  let globalMinY = Infinity;
  let globalMaxY = -Infinity;
  recordings.forEach(rec => {
    const datasets = getRecordingChartDatasets(rec.samples);
    datasets.forEach(ds =>
      ds.forEach((p: any) => {
        globalMinY = Math.min(globalMinY, p.y);
        globalMaxY = Math.max(globalMaxY, p.y);
      }),
    );
  });
  if (!isFinite(globalMinY) || !isFinite(globalMaxY)) {
    globalMinY = 0;
    globalMaxY = 1;
  }
  if (globalMinY === globalMaxY) globalMaxY = globalMinY + 1;

  // Build items with label and SVG so we can number them (Example 1, Example 2, ...)
  const items = recordings.map((r, idx) => ({
    label: `Example ${idx + 1}`,
    svg: svgForRecording(r, globalMinY, globalMaxY),
  }));

  const pages = chunk(items, 4);

  const safeTitle = escapeHtml(gestureName ?? '');

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Print - ${safeTitle}</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  html,body { height: 100%; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111; }
  /* Landscape A4 is 297mm x 210mm; use the shorter side (210mm) for page height */
  .page { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; height: calc(210mm - 20mm); box-sizing: border-box; page-break-after: always; padding: 8px; }
  /* Ensure each card fills its grid cell so all 4 cells are used */
  .card { box-sizing: border-box; padding: 6px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; border: 1px solid #ddd; border-radius: 4px; height: 100%; overflow: hidden; background: #fff; }
  .rec-label { margin: 4px 0; font-size: 10pt; font-weight: 600; text-align: center; width: 100%; }
  /* Make SVG fill the available card space */
  .card > svg { width: 100%; height: calc(100% - 30px); max-height: 100%; }
</style>
</head>
<body>
${pages
  .map(
    page =>
      `<div class="page">${page
        .map(
          item =>
            `<div class="card"><div class="rec-label">${escapeHtml(item.label)}</div>${item.svg}</div>`,
        )
        .concat(new Array(4 - page.length).fill('<div class="card"></div>'))
        .join('')}</div>`,
  )
  .join('')}
</body>
</html>`;

  // create hidden iframe and print its content
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.srcdoc = html;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    // small timeout to ensure rendering
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        // ignore
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    }, 200);
  };

  function escapeHtml(str: string) {
    return String(str).replace(
      /[&<>"']/g,
      m =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
          m
        ] as string,
    );
  }
}
