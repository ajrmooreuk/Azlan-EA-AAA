/**
 * OAA v6.1.0 compliance panel rendering.
 */

import { state } from './state.js';

export function renderOAACompliancePanel(validation) {
  const el = document.getElementById('oaa-compliance-content');
  let html = '';

  const statusText = validation.overall === 'pass' ? 'Compliant' :
                     validation.overall === 'warn' ? 'Warnings' : 'Non-Compliant';
  html += `<div style="margin-bottom:12px; padding:10px; border-radius:6px; background:${
    validation.overall === 'pass' ? 'rgba(22,101,52,0.2)' :
    validation.overall === 'warn' ? 'rgba(85,48,22,0.2)' : 'rgba(127,29,29,0.2)'
  };">`;
  html += `<div style="font-weight:600; color:${
    validation.overall === 'pass' ? '#86efac' :
    validation.overall === 'warn' ? '#ffb48e' : '#fca5a5'
  };">${statusText}</div>`;
  html += `<div style="font-size:11px; color:#888; margin-top:4px;">Core gates (G1-G4): ${validation.summary.pass} pass | ${validation.summary.warn} warn | ${validation.summary.fail} fail</div>`;
  html += '</div>';

  html += '<div style="margin-bottom:8px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.5px;">Core Gates (Required)</div>';

  validation.gates.forEach(g => {
    if (g.skipped || g.advisory) return;

    html += `<div class="gate-result ${g.status}">`;
    html += `<div class="gate-name">${g.gate} <span class="audit-badge ${g.status}">${g.status.toUpperCase()}</span></div>`;
    html += `<div class="gate-detail">${g.detail}</div>`;

    if (g.issues && g.issues.length > 0) {
      html += '<div class="gate-items">';
      g.issues.slice(0, 3).forEach(issue => {
        html += `<div style="color:#fca5a5;">\u2022 ${issue}</div>`;
      });
      if (g.issues.length > 3) html += `<div style="color:#888;">... and ${g.issues.length - 3} more</div>`;
      html += '</div>';
    }

    if (g.warnings && g.warnings.length > 0) {
      html += '<div class="gate-items">';
      g.warnings.slice(0, 3).forEach(warn => {
        html += `<div style="color:#ffb48e;">\u2022 ${warn}</div>`;
      });
      if (g.warnings.length > 3) html += `<div style="color:#888;">... and ${g.warnings.length - 3} more</div>`;
      html += '</div>';
    }

    html += '</div>';
  });

  const advisoryGates = validation.gates.filter(g => g.advisory && !g.skipped);
  if (advisoryGates.length > 0) {
    html += '<div style="margin-top:16px; margin-bottom:8px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.5px;">Advisory Gates (Recommendations)</div>';

    advisoryGates.forEach(g => {
      html += `<div class="gate-result ${g.status}" style="opacity:0.7;">`;
      html += `<div class="gate-name">${g.gate} <span style="font-size:10px; color:#666;">ADVISORY</span></div>`;
      html += `<div class="gate-detail">${g.detail}</div>`;

      if (g.warnings && g.warnings.length > 0) {
        html += '<div class="gate-items">';
        g.warnings.slice(0, 2).forEach(warn => {
          html += `<div style="color:#888;">\u2022 ${warn}</div>`;
        });
        html += '</div>';
      }

      html += '</div>';
    });
  }

  el.innerHTML = html;

  const badge = document.getElementById('compliance-status');
  badge.className = `compliance-badge ${validation.overall}`;
  document.getElementById('compliance-text').textContent = `OAA v6.1.0 ${statusText}`;
  badge.style.display = 'inline-flex';

  const upgradeBtn = document.getElementById('btn-run-oaa');
  if (upgradeBtn) {
    upgradeBtn.style.display = validation.overall !== 'pass' ? 'inline-block' : 'none';
  }

  const saveBtn = document.getElementById('btn-save-library');
  if (saveBtn) {
    saveBtn.style.display = validation.overall === 'pass' ? 'inline-block' : 'none';
  }

  const exportBtn = document.getElementById('btn-export-audit');
  if (exportBtn) {
    exportBtn.style.display = 'inline-block';
  }

  state.lastValidation = validation;
}
