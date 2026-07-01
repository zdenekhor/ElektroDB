/**
 * Databázové schéma pro ElektroDB
 * Reflektuje strukturu DBF souborů z Agentury ČAS.
 *
 * PLATNOST kódy: P=Platná, Z=Zrušená, N=Nahrazena, A=Avizovaná
 */

export const schema = {
  norms: `
    CREATE TABLE IF NOT EXISTS norms (
      id       INTEGER PRIMARY KEY,  -- VETA z DBF
      identif  TEXT NOT NULL,        -- plný identifikátor, např. "ČSN EN 60721-3-6"
      stupen   TEXT,                 -- stupeň: ČSN / EN / ISO / ...
      znak     TEXT,                 -- číslo znaku, např. "038900"
      cast     TEXT,
      podcast  TEXT,
      poradi   TEXT,
      nazev    TEXT,                 -- český název
      nazev_ang TEXT,               -- anglický název
      platnost TEXT,                -- P / Z / N / A
      schvalena TEXT,               -- datum schválení
      ucinnost  TEXT,               -- datum účinnosti
      vydana    TEXT,               -- datum vydání
      dat_uk    TEXT,               -- datum ukončení platnosti
      vestnik   TEXT,
      vestnik_z TEXT,
      skupina   INTEGER,
      katalog   INTEGER,
      strany    INTEGER,
      format    TEXT,
      anotace   TEXT,
      klice     TEXT
    )
  `,

  harmonizations: `
    CREATE TABLE IF NOT EXISTS harmonizations (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      veta     INTEGER NOT NULL,  -- FK → norms.id
      veta_zn  INTEGER,           -- navázaná norma
      typ      TEXT,
      c_harm   TEXT,
      platnost TEXT
    )
  `,

  ics_links: `
    CREATE TABLE IF NOT EXISTS ics_links (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      veta     INTEGER NOT NULL,  -- FK → norms.id
      ics      TEXT NOT NULL,
      platnost TEXT
    )
  `,

  replacements: `
    CREATE TABLE IF NOT EXISTS replacements (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      veta    INTEGER NOT NULL,  -- nahrazovaná norma
      veta_n  INTEGER,           -- nová norma
      veta_zm INTEGER
    )
  `,

  amendments: `
    CREATE TABLE IF NOT EXISTS amendments (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      veta     INTEGER NOT NULL,
      veta_zm  INTEGER,
      platnost TEXT,
      oznaceni TEXT,
      typ      TEXT,
      ucinnost TEXT,
      vydana   TEXT,
      dat_uk   TEXT
    )
  `,

  ics_reference: `
    CREATE TABLE IF NOT EXISTS ics_reference (
      ics       TEXT PRIMARY KEY,
      nazev     TEXT,
      nazev_ang TEXT
    )
  `,

  indexes: [
    'CREATE INDEX IF NOT EXISTS idx_norms_identif  ON norms(identif)',
    'CREATE INDEX IF NOT EXISTS idx_norms_platnost ON norms(platnost)',
    'CREATE INDEX IF NOT EXISTS idx_norms_znak     ON norms(znak)',
    'CREATE INDEX IF NOT EXISTS idx_ics_links_veta ON ics_links(veta)',
    'CREATE INDEX IF NOT EXISTS idx_ics_links_ics  ON ics_links(ics)',
    'CREATE INDEX IF NOT EXISTS idx_harm_veta      ON harmonizations(veta)',
    'CREATE INDEX IF NOT EXISTS idx_repl_veta      ON replacements(veta)',
    'CREATE INDEX IF NOT EXISTS idx_repl_veta_n    ON replacements(veta_n)',
    'CREATE INDEX IF NOT EXISTS idx_amend_veta     ON amendments(veta)',
  ]
};

export default schema;
