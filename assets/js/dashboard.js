/**
 * dashboard.js — Visor estático client-side para reportes JSON de `npx kronforge report --format json`.
 * No envía datos a ningún servidor; todo se procesa localmente en el navegador.
 */

export function bindAssuranceDashboard() {
    const input = document.getElementById('kf-report-file');
    const output = document.getElementById('kf-report-output');
    if (!input || !output || input.dataset.bound === 'true') return;
    input.dataset.bound = 'true';

    input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return;
        output.textContent = '';

        try {
            const report = JSON.parse(await file.text());
            if (!report || typeof report !== 'object' || !report.score) {
                throw new Error('El archivo no tiene la estructura de un reporte generado por `kronforge report --format json`.');
            }

            const header = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = `${report.repository || 'Repositorio'} — ${report.score.total}/100 · Nivel ${report.grade} (${report.verdict})`;
            header.appendChild(strong);
            output.appendChild(header);

            const meta = document.createElement('p');
            meta.textContent = `Protocolo: ${report.protocol || 'AFP-004'} · Gobernanza: ${report.governanceStatus || 'N/A'} · Hallazgos: ${report.findings?.length ?? 0}`;
            output.appendChild(meta);

            const list = document.createElement('ul');
            for (const dim of report.score.dimensions || []) {
                const li = document.createElement('li');
                li.textContent = `${dim.name}: ${dim.score}/${dim.max}`;
                list.appendChild(li);
            }
            output.appendChild(list);
        } catch (error) {
            const err = document.createElement('p');
            err.textContent = `No se pudo leer el reporte: ${error.message}`;
            output.appendChild(err);
        }
    });
}
