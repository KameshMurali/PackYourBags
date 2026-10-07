// Official immigration / visa information source for each country in the country index.
//
// Shown on "Rule not yet verified for your passport" cards, so a traveller always has an
// authoritative next step. Only government sources (immigration authority, foreign ministry,
// official e-visa portal) belong here. Countries without a verified source fall back to the
// IATA Travel Centre.
//
// Every URL here was opened and confirmed on its lastReviewed date. Not listed because their
// sites sat behind bot protection on 2026-10-07, so the page couldn't be confirmed: Bulgaria,
// Liechtenstein, Lithuania, Norway, Portugal and Romania (mfa.bg, llv.li, keliauk.urm.lt,
// udi.no, vistos.mne.gov.pt, mae.ro). Re-check them in a browser before adding.

import type { OfficialSource } from "./types";

export type CountrySource = OfficialSource & {
  /** ISO date (YYYY-MM-DD) the URL was last checked. */
  lastReviewed: string;
};

export const COUNTRY_SOURCES: Record<string, CountrySource> = {
  AL: { label: "Government of Albania — e-Visa", url: "https://e-visa.al/", lastReviewed: "2026-10-07" },
  AM: { label: "Ministry of Foreign Affairs (Armenia) — visa", url: "https://www.mfa.am/en/visa", lastReviewed: "2026-10-07" },
  AT: { label: "Foreign Ministry (Austria) — visa information", url: "https://www.bmeia.gv.at/en/travel-stay/entrance-and-residence-in-austria/visa", lastReviewed: "2026-10-07" },
  AU: { label: "Department of Home Affairs (Australia) — visa finder", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder", lastReviewed: "2026-10-07" },
  BE: { label: "FPS Foreign Affairs (Belgium) — visa for Belgium", url: "https://diplomatie.belgium.be/en/travel-belgium/visa-belgium", lastReviewed: "2026-10-07" },
  BH: { label: "National Portal of Bahrain — e-Visa", url: "https://www.evisa.gov.bh/", lastReviewed: "2026-10-07" },
  CA: { label: "Immigration, Refugees and Citizenship Canada — check if you need a visa or eTA", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/check-visa-eta.html", lastReviewed: "2026-10-07" },
  CH: { label: "State Secretariat for Migration (Switzerland) — entry requirements by nationality", url: "https://www.sem.admin.ch/sem/en/home/themen/einreise/info-einreise/voraussetzungen-nach-staat.html", lastReviewed: "2026-10-07" },
  CZ: { label: "Ministry of Foreign Affairs (Czechia) — entry and residence for foreigners", url: "https://mzv.gov.cz/jnp/en/information_for_aliens/index.html", lastReviewed: "2026-10-07" },
  DE: { label: "Federal Foreign Office (Germany) — visa information", url: "https://www.auswaertiges-amt.de/en/visa-service", lastReviewed: "2026-10-07" },
  DK: { label: "Danish Immigration Service — short-stay visa", url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Short-stay-visa", lastReviewed: "2026-10-07" },
  EE: { label: "Ministry of Foreign Affairs (Estonia) — who needs a visa", url: "https://vm.ee/en/consular-visa-and-travel-information/visa-information/who-does-not-need-visa-visit-estonia", lastReviewed: "2026-10-07" },
  EG: { label: "Egypt e-Visa portal", url: "https://www.visa2egypt.gov.eg/eVisa/Home", lastReviewed: "2026-10-07" },
  ES: { label: "Ministry of the Interior (Spain) — entry requirements and conditions", url: "https://www.interior.gob.es/opencms/en/servicios-al-ciudadano/tramites-y-gestiones/extranjeria/regimen-general/entrada-requisitos-y-condiciones/", lastReviewed: "2026-10-07" },
  FI: { label: "Ministry for Foreign Affairs (Finland) — visa requirement", url: "https://um.fi/visa-requirement-and-travel-documents-accepted-by-finland", lastReviewed: "2026-10-07" },
  FR: { label: "France-Visas (French government) — official visa portal", url: "https://france-visas.gouv.fr/en/", lastReviewed: "2026-10-07" },
  GB: { label: "UK Government (GOV.UK) — check if you need a UK visa", url: "https://www.gov.uk/check-uk-visa", lastReviewed: "2026-10-07" },
  GE: { label: "Government of Georgia — e-Visa portal", url: "https://www.evisa.gov.ge/GeoVisa/", lastReviewed: "2026-10-07" },
  GR: { label: "Ministry of Foreign Affairs (Greece) — countries requiring or not requiring a visa", url: "https://www.mfa.gr/en/services/visas-for-foreigners-traveling-to-greece/countries-requiring-or-not-requiring-a-visa/", lastReviewed: "2026-10-07" },
  HK: { label: "Immigration Department (Hong Kong) — visit visa and entry permit requirements", url: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html", lastReviewed: "2026-10-07" },
  HR: { label: "Ministry of Foreign and European Affairs (Croatia) — visa requirements overview", url: "https://mvep.gov.hr/services-for-citizens/consular-information-22802/visas-22807/visa-requirements-overview-22879/22879", lastReviewed: "2026-10-07" },
  HU: { label: "Consular Service (Hungary) — visa information", url: "https://konzinfo.mfa.gov.hu/en/how-apply-visa", lastReviewed: "2026-10-07" },
  ID: { label: "Directorate General of Immigration (Indonesia) — official eVisa", url: "https://evisa.imigrasi.go.id/", lastReviewed: "2026-10-07" },
  IE: { label: "Immigration Service Delivery (Ireland) — coming to visit Ireland", url: "https://www.irishimmigration.ie/coming-to-visit-ireland/", lastReviewed: "2026-10-07" },
  IL: { label: "Population and Immigration Authority (Israel) — entry and ETA-IL", url: "https://israel-entry.piba.gov.il/", lastReviewed: "2026-10-07" },
  IN: { label: "Government of India — e-Visa", url: "https://indianvisaonline.gov.in/evisa/tvoa.html", lastReviewed: "2026-10-07" },
  IS: { label: "Government of Iceland (Ísland.is) — do you need a visa", url: "https://island.is/en/do-you-need-a-visa", lastReviewed: "2026-10-07" },
  IT: { label: "Ministry of Foreign Affairs (Italy) — Il visto per l'Italia portal", url: "https://vistoperitalia.esteri.it/", lastReviewed: "2026-10-07" },
  JP: { label: "Ministry of Foreign Affairs (Japan) — visa exemption for short-term stays", url: "https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html", lastReviewed: "2026-10-07" },
  KE: { label: "Kenya Electronic Travel Authorisation (eTA)", url: "https://etakenya.go.ke/", lastReviewed: "2026-10-07" },
  KR: { label: "Korea Visa Portal (Ministry of Justice)", url: "https://www.visa.go.kr/", lastReviewed: "2026-10-07" },
  LK: { label: "Department of Immigration and Emigration (Sri Lanka) — online visa", url: "https://www.eta.gov.lk/slvisa/", lastReviewed: "2026-10-07" },
  LU: { label: "Ministry of Foreign Affairs (Luxembourg) — visa and immigration", url: "https://mae.gouvernement.lu/en/services-aux-citoyens/visa-immigration.html", lastReviewed: "2026-10-07" },
  LV: { label: "Ministry of Foreign Affairs (Latvia) — who may enter without a visa", url: "https://www.mfa.gov.lv/en/countries-and-territories-whose-citizens-may-enter-latvia-without-visa", lastReviewed: "2026-10-07" },
  MA: { label: "Accès Maroc — Morocco e-Visa", url: "https://www.acces-maroc.ma/", lastReviewed: "2026-10-07" },
  MT: { label: "Identità Malta, Central Visa Unit — visa information", url: "https://identita.gov.mt/central-visa-unit-main-page/", lastReviewed: "2026-10-07" },
  MV: { label: "Maldives Immigration", url: "https://www.immigration.gov.mv/", lastReviewed: "2026-10-07" },
  NL: { label: "Netherlands Worldwide (Dutch government) — visa for the Netherlands", url: "https://www.netherlandsworldwide.nl/visa-the-netherlands", lastReviewed: "2026-10-07" },
  NP: { label: "Department of Immigration (Nepal)", url: "https://immigration.gov.np/", lastReviewed: "2026-10-07" },
  NZ: { label: "Immigration New Zealand — what you need to visit New Zealand", url: "https://www.immigration.govt.nz/visit/what-you-need-to-visit-new-zealand/", lastReviewed: "2026-10-07" },
  OM: { label: "Royal Oman Police — e-Visa", url: "https://evisa.rop.gov.om/", lastReviewed: "2026-10-07" },
  PL: { label: "Ministry of Foreign Affairs (Poland) — visas", url: "https://www.gov.pl/web/diplomacy/visas", lastReviewed: "2026-10-07" },
  RS: { label: "Ministry of Foreign Affairs (Serbia) — visa regime", url: "https://www.mfa.gov.rs/en/citizens/travel-serbia/visa-regime", lastReviewed: "2026-10-07" },
  SE: { label: "Swedish Migration Agency — Schengen visa", url: "https://www.migrationsverket.se/en/you-want-to-apply/visiting-sweden/visiting-sweden-for-up-to-90-days-entry-visa.html", lastReviewed: "2026-10-07" },
  SG: { label: "Immigration and Checkpoints Authority (Singapore) — check if you need an entry visa", url: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements", lastReviewed: "2026-10-07" },
  SI: { label: "Government of Slovenia (gov.si) — entry and residence", url: "https://www.gov.si/en/topics/entry-and-residence/", lastReviewed: "2026-10-07" },
  SK: { label: "Ministry of Foreign and European Affairs (Slovakia) — visas for foreigners", url: "https://www.mzv.sk/en/services/information-for-foreigners/visas-for-foreigners-to-enter-sr", lastReviewed: "2026-10-07" },
  TR: { label: "Republic of Türkiye e-Visa system", url: "https://www.evisa.gov.tr/en/", lastReviewed: "2026-10-07" },
  TW: { label: "Bureau of Consular Affairs (Taiwan) — visa-exempt entry", url: "https://www.boca.gov.tw/cp-149-4486-7785a-2.html", lastReviewed: "2026-10-07" },
  TZ: { label: "Immigration Services Department (Tanzania) — eVisa", url: "https://visa.immigration.go.tz/", lastReviewed: "2026-10-07" },
  UZ: { label: "Government of Uzbekistan — e-Visa portal", url: "https://e-visa.gov.uz/", lastReviewed: "2026-10-07" },
  VN: { label: "Immigration Department (Vietnam) — national e-visa portal", url: "https://evisa.gov.vn/", lastReviewed: "2026-10-07" },
  ZA: { label: "Department of Home Affairs (South Africa) — visa-exempt countries", url: "https://www.dha.gov.za/index.php/immigration-services/exempt-countries", lastReviewed: "2026-10-07" },
};
