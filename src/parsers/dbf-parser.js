/**
 * Parser pro DBF soubory z Agentury ČAS
 * Používá balíček dbffile (čtení Visual FoxPro / dBase III souborů).
 *
 * Kódování zdrojových souborů: Windows-1250 (cp1250).
 */
import { DBFFile } from 'dbffile';

const ENCODING = 'cp1250';

function trim(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

function formatDate(d) {
  if (!d || !(d instanceof Date) || isNaN(d)) return null;
  return d.toISOString().slice(0, 10);
}

export async function collectAll(asyncGen) {
  const rows = [];
  for await (const row of asyncGen) rows.push(row);
  return rows;
}

// ---------------------------------------------------------------------------
// Csn.dbf  – hlavní tabulka norem
// ---------------------------------------------------------------------------

export async function* readCSN(filePath) {
  const dbf = await DBFFile.open(filePath, { readMode: 'loose', encoding: ENCODING });
  for await (const r of dbf) {
    yield {
      id:        r.VETA,
      identif:   trim(r.IDENTIF),
      stupen:    trim(r.STUPEN),
      znak:      trim(r.ZNAK),
      cast:      trim(r.CAST),
      podcast:   trim(r.PODCAST),
      poradi:    trim(r.PORADI),
      nazev:     trim(r.NAZEV),
      nazev_ang: trim(r.ANG),
      platnost:  trim(r.PLATNOST),
      schvalena: formatDate(r.SCHVALENA),
      ucinnost:  formatDate(r.UCINNOST),
      vydana:    formatDate(r.VYDANA),
      dat_uk:    formatDate(r.DAT_UK),
      vestnik:   trim(r.VESTNIK),
      vestnik_z: trim(r.VESTNIK_Z),
      skupina:   r.SKUPINA   || null,
      katalog:   r.KATALOG   || null,
      strany:    r.STRANY    || null,
      format:    trim(r.FORMAT),
      anotace:   trim(r.ANOTACE),
      klice:     trim(r.KLICE),
    };
  }
}

// ---------------------------------------------------------------------------
// Csn_harm.dbf  – harmonizace s mezinárodními normami
// ---------------------------------------------------------------------------

export async function* readHarmonizations(filePath) {
  const dbf = await DBFFile.open(filePath, { readMode: 'loose', encoding: ENCODING });
  for await (const r of dbf) {
    yield {
      veta:     r.VETA,
      veta_zn:  r.VETA_ZN  || null,
      typ:      trim(r.TYP),
      c_harm:   trim(r.C_HARM),
      platnost: trim(r.PLATNOST),
    };
  }
}

// ---------------------------------------------------------------------------
// Csn_ics.dbf  – vazby normy na ICS kódy
// ---------------------------------------------------------------------------

export async function* readICSLinks(filePath) {
  const dbf = await DBFFile.open(filePath, { readMode: 'loose', encoding: ENCODING });
  for await (const r of dbf) {
    const ics = trim(r.ICS);
    if (!ics) continue;
    yield {
      veta:     r.VETA,
      ics,
      platnost: trim(r.PLATNOST),
    };
  }
}

// ---------------------------------------------------------------------------
// Nahrada.dbf  – nahrazení norem
// ---------------------------------------------------------------------------

export async function* readReplacements(filePath) {
  const dbf = await DBFFile.open(filePath, { readMode: 'loose', encoding: ENCODING });
  for await (const r of dbf) {
    yield {
      veta:    r.VETA,
      veta_n:  r.VETA_N  || null,
      veta_zm: r.VETA_ZM || null,
    };
  }
}

// ---------------------------------------------------------------------------
// Csn_zm.dbf  – změny norem
// ---------------------------------------------------------------------------

export async function* readAmendments(filePath) {
  const dbf = await DBFFile.open(filePath, { readMode: 'loose', encoding: ENCODING });
  for await (const r of dbf) {
    yield {
      veta:     r.VETA,
      veta_zm:  r.VETA_ZM  || null,
      platnost: trim(r.PLATNOST),
      oznaceni: trim(r.OZNACENI),
      typ:      trim(r.TYP),
      ucinnost: formatDate(r.UCINNOST),
      vydana:   formatDate(r.VYDANA),
      dat_uk:   formatDate(r.DAT_UK),
    };
  }
}

// ---------------------------------------------------------------------------
// Ics.dbf  – číselník ICS kategorií
// ---------------------------------------------------------------------------

export async function* readICSReference(filePath) {
  const dbf = await DBFFile.open(filePath, { readMode: 'loose', encoding: ENCODING });
  for await (const r of dbf) {
    const ics = trim(r.ICS);
    if (!ics) continue;
    yield {
      ics,
      nazev:     trim(r.NAZEV),
      nazev_ang: trim(r.NAZEV_ANG),
    };
  }
}
