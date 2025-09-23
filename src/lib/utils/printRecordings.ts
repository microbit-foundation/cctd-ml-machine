/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import StaticConfiguration from '../../StaticConfiguration';
import { getRecordingChartDatasets } from '../ChartDataset';
import type { Axis } from '../../core/entities/Axis';
import type { RecordingData } from '../../core/entities/RecordingData';

// Print recordings in a hidden iframe: 4 recordings per A4 landscape page.
export function printRecordings(
  gestureName: string,
  recordings: RecordingData[],
  highlightedAxes: Axis[],
) {
  if (!recordings || recordings.length === 0) return;

  function chunk<T>(arr: T[], size: number): T[][] {
    const res: T[][] = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  }

  const colors = StaticConfiguration.graphColors ?? ['#f9808e', '#80f98e', '#80b8f9'];
  // Determine which axis indices to render based on highlightedAxes; if none provided, render all.
  const selectedAxisIndices: number[] | null =
    highlightedAxes && highlightedAxes.length > 0
      ? highlightedAxes.map(a => a.index).filter(i => Number.isFinite(i) && i >= 0)
      : null;

  function svgForRecording(
    recording: RecordingData,
    globalMinY?: number,
    globalMaxY?: number,
  ) {
    const datasetsAll = getRecordingChartDatasets(recording.samples);
    const indices =
      selectedAxisIndices && selectedAxisIndices.length > 0
        ? selectedAxisIndices.filter(i => i >= 0 && i < datasetsAll.length)
        : datasetsAll.map((_, idx) => idx);
    const datasets = indices.map(i => datasetsAll[i]);
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
        // Use original axis index (from `indices`) when selecting color so colors map to axis positions
        const originalAxisIndex = indices[idx];
        const color = colors[originalAxisIndex % colors.length];
        return `<path d="${path}" fill="none" stroke="${color}" stroke-width="1.5" />`;
      })
      .join('\n');

    // Build legend using axis labels. Prefer highlightedAxes labels when available; fallback to recording.labels.
    const legendCount = indices.length;
    const legendSpacing = Math.max(
      80,
      Math.floor((w - leftPad - rightPad) / Math.max(1, legendCount)),
    );
    // gap between the x-axis (plot) and the legend area
    const legendGap = 25;
    const legendItems = indices
      .map((axisIdx, i) => {
        const originalAxisIndex = axisIdx;
        const color = colors[originalAxisIndex % colors.length];
        // Prefer label from highlightedAxes if provided, else use recording.labels
        let label =
          recording.labels && recording.labels[originalAxisIndex]
            ? recording.labels[originalAxisIndex]
            : `Axis ${originalAxisIndex + 1}`;
        if (highlightedAxes && highlightedAxes.length > 0) {
          const found = highlightedAxes.find(a => a.index === originalAxisIndex);
          if (found && found.label) {
            label = found.label;
          }
        }
        const lx = leftPad + i * legendSpacing;
        // place legend in the bottom padding area (below the x-axis) with a small gap
        const legendRectY = h - bottomPad + legendGap;
        const legendTextY = legendRectY + 9; // vertically center text with the color box
        // small color box and text label placed below the graph
        return (
          `<rect x="${lx}" y="${legendRectY}" width="10" height="10" fill="${color}" />` +
          `<text x="${lx + 14}" y="${legendTextY}" font-size="11" fill="#333" dominant-baseline="middle">${escapeHtml(label)}</text>`
        );
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
        const label = `<text x="${leftPad - 8}" y="${y + 5}" font-size="11" text-anchor="end" fill="#333">${escapeHtml(formatTick(val))}</text>`;
        return tick + '\n' + label;
      })
      .join('\n');

    // Draw a dashed gray horizontal line across the plotting area at y=0 if zero lies within the data range
    let zeroLine = '';
    if (minY <= 0 && 0 <= maxY) {
      const y0 = h - bottomPad - (0 - minY) * yScale;
      zeroLine = `<line x1="${leftPad}" y1="${y0}" x2="${w - rightPad}" y2="${y0}" stroke="#999" stroke-width="1" stroke-dasharray="4 3"/>`;
    }

    // place legendItems after the plotted paths so it's rendered on top and positioned below the graph
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${leftAxis}${axis}${tickLines}${zeroLine}${paths}${legendItems}</svg>`;
  }

  // compute global min/max across all recordings so y-axis is shared (consider only selected axes)
  let globalMinY = Infinity;
  let globalMaxY = -Infinity;
  recordings.forEach(rec => {
    const datasetsAll = getRecordingChartDatasets(rec.samples);
    const indices =
      selectedAxisIndices && selectedAxisIndices.length > 0
        ? selectedAxisIndices.filter(i => i >= 0 && i < datasetsAll.length)
        : datasetsAll.map((_, idx) => idx);
    indices.forEach(i =>
      datasetsAll[i].forEach((p: any) => {
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
