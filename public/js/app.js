// ── i18n ──
const LANGS = {
  es:{nav_search:'Buscar Campos',nav_how:'Cómo funciona',nav_publish:'Publicar Campo',nav_login:'Ingresar',nav_logout:'Salir',nav_dashboard:'Mi Panel',hero_badge:'Verificado por escribanos certificados',hero_title1:'Campos y Granjas',hero_title2:'de Sudamérica',hero_sub:'La plataforma donde vendedores y compradores honestos de campos de Sudamérica se encuentran. Verificación independiente por 5 escribanos.',hero_cta1:'Ver Propiedades',hero_cta2:'Publicar mi Campo',stat_props:'Propiedades',stat_countries:'Países',stat_verify:'Verificaciones',stat_langs:'Idiomas',qs_title:'Buscar Campos',qs_country:'País',qs_province:'Provincia',qs_type:'Tipo',type_sale:'Venta',type_rent:'Alquiler',btn_search:'Buscar',recent_title:'Propiedades Recientes',see_all:'Ver todas',how_title:'¿Cómo funciona?',how_seller:'Vendedor / Propietario',how_s1:'Registrate como vendedor',how_s2:'Cargá tu campo con 10+ fotos y video',how_s3:'Completá todos los detalles técnicos',how_s4:'5 escribanos verifican independientemente',how_s5:'Tu propiedad queda activa y visible',how_s6:'Recibí consultas de compradores',btn_sell:'Publicar Campo',how_notary:'Escribano / Notario',how_n1:'Registrate como escribano',how_n2:'Revisá las propiedades de tu zona',how_n3:'Verificá el título, impuestos y legales',how_n4:'Firmá la verificación con tus notas',how_n5:'Con 5 firmas, la propiedad se activa',btn_notary:'Registrarme como Escribano',how_buyer:'Comprador / Inversor',how_b1:'Explorá listados verificados',how_b2:'Filtrá por país, provincia, hectáreas',how_b3:'Ver fotos, videos y datos técnicos',how_b4:'Consultá directamente al vendedor',how_b5:'Te sugerimos 5 abogados locales',how_b6:'Cerrá el trato con seguridad',btn_buy:'Buscar Campos',countries_title:'Disponible en toda Sudamérica',trust1_t:'Verificación Independiente',trust1_d:'5 escribanos certificados verifican cada propiedad antes de publicarse',trust2_t:'Títulos Limpios',trust2_d:'Sin impuestos pendientes, sin herencias sin resolver, sin reclamos',trust3_t:'Abogados Locales',trust3_d:'Te recomendamos 5 abogados locales para cerrar el contrato',trust4_t:'8 Idiomas',trust4_d:'Plataforma disponible en español, inglés, portugués, francés, italiano, alemán, holandés y ruso',footer_desc:'Conectando vendedores y compradores honestos de campos de Sudamérica',footer_platform:'Plataforma',footer_notary:'Ser Escribano',footer_account:'Cuenta',footer_register:'Crear cuenta',footer_rights:'Todos los derechos reservados.',login_title:'Ingresar',register_title:'Crear cuenta',lbl_password:'Contraseña',no_account:'¿No tenés cuenta? Crear cuenta',have_account:'Ya tengo cuenta',btn_register:'Crear cuenta',role_buyer:'Comprador',role_seller:'Vendedor',role_notary:'Escribano',lbl_name:'Nombre completo',lbl_country:'País',lbl_phone:'Teléfono',filters_title:'Filtros',filter_country:'País',all_countries:'Todos los países',filter_province:'Provincia / Estado',all_provinces:'Todas',filter_type:'Tipo',filter_hectares:'Hectáreas',filter_price:'Precio total (USD)',filter_features:'Características',feat_river:'Río',feat_wells:'Pozos de agua',feat_fence:'Valla perimetral',feat_house:'Casa principal',btn_apply:'Aplicar Filtros',search_title:'Buscar Campos - Merrali',results_count:'Resultados',sort_newest:'Más recientes',sort_price_asc:'Menor precio',sort_price_desc:'Mayor precio',sort_ha:'Más hectáreas',new_title:'Publicar mi Campo',new_sub:'Completá todos los datos. Tu campo será verificado por 5 escribanos antes de publicarse.',sec_basic:'Datos Básicos',lbl_title:'Título del anuncio',lbl_type:'Tipo',lbl_province:'Provincia / Estado',lbl_city:'Ciudad / Localidad',sec_price:'Dimensiones y Precio',lbl_hectares:'Hectáreas totales',lbl_pph:'Precio por hectárea (USD)',lbl_total:'Precio total (USD)',sec_features:'Características del Campo',lbl_wells:'Cantidad de pozos',lbl_houses:'Casas principales',lbl_worker_houses:'Casas de trabajadores',lbl_grass:'Tipo de hierba / pasto',lbl_forest_pct:'% Bosque / Monte',lbl_agri_pct:'% Agrícola mixta',lbl_rain:'Pluviación anual (mm)',feat_bushes:'Arbustos',feat_forest:'Bosque / Monte',sec_agri:'Producción y Cultivos',lbl_agri:'Tipos de agricultura',lbl_products:'Productos principales',lbl_fruits:'Árboles frutales',sec_desc:'Descripción Detallada',lbl_video:'URL de Video (YouTube)',sec_media:'Fotos y Videos',sec_media_sub:'mínimo 5 fotos, máximo 15 archivos',upload_hint:'Hacé clic para subir fotos y videos del campo',upload_formats:'JPG, PNG, MP4 - Máx 50MB por archivo',btn_publish:'Publicar Campo',desc_title:'Descripción',features_title:'Características',agri_title:'Producción Agrícola',video_title:'Video del Campo',verif_title:'Verificaciones',seller_title:'Vendedor',inquiry_title:'Consultar esta propiedad',btn_send:'Enviar Consulta',lawyers_title:'Abogados Recomendados',lawyers_desc:'Te sugerimos consultar con abogados locales para verificar el título de propiedad.',lawyers_btn:'Ver Abogados Locales',tab_overview:'Resumen',tab_listings:'Mis Campos',tab_verify:'Verificar',tab_new:'Nuevo Campo',tab_profile:'Mi Perfil',verify_desc:'Revisá y verificá las propiedades de tu zona.',modal_verify:'Verificar Propiedad',verify_status:'Resultado',vstatus_verified:'✅ Verificado - Todo en orden',vstatus_pending:'⚠️ Pendiente - Necesita más información',vstatus_rejected:'❌ Rechazado - Tiene problemas legales',verify_notes:'Notas de verificación',btn_submit_verify:'Enviar Verificación',ha:'há',usd:'USD'},
  en:{nav_search:'Search Fields',nav_how:'How it works',nav_publish:'List a Property',nav_login:'Login',nav_logout:'Logout',nav_dashboard:'My Panel',hero_badge:'Verified by certified notaries',hero_title1:'Farms & Ranches',hero_title2:'in South America',hero_sub:'The platform where honest buyers and sellers of South American farmland meet. Independent verification by 5 notaries.',hero_cta1:'Browse Properties',hero_cta2:'List my Property',stat_props:'Properties',stat_countries:'Countries',stat_verify:'Verifications',stat_langs:'Languages',qs_title:'Search Properties',qs_country:'Country',qs_province:'Province',qs_type:'Type',type_sale:'Sale',type_rent:'Rent',btn_search:'Search',recent_title:'Recent Properties',see_all:'View all',how_title:'How does it work?',how_seller:'Seller / Owner',how_s1:'Register as a seller',how_s2:'Upload your farm with 10+ photos and video',how_s3:'Fill in all technical details',how_s4:'5 notaries verify independently',how_s5:'Your property goes live',how_s6:'Receive inquiries from buyers',btn_sell:'List Property',how_notary:'Notary / Escribano',how_n1:'Register as a notary',how_n2:'Review properties in your area',how_n3:'Verify title, taxes and legal status',how_n4:'Sign verification with your notes',how_n5:'With 5 signatures, property goes active',btn_notary:'Register as Notary',how_buyer:'Buyer / Investor',how_b1:'Browse verified listings',how_b2:'Filter by country, province, hectares',how_b3:'View photos, videos and technical data',how_b4:'Contact the seller directly',how_b5:'We suggest 5 local lawyers',how_b6:'Close the deal safely',btn_buy:'Search Properties',countries_title:'Available across South America',trust1_t:'Independent Verification',trust1_d:'5 certified notaries verify every property before it goes live',trust2_t:'Clean Titles',trust2_d:'No pending taxes, no unresolved estate claims',trust3_t:'Local Lawyers',trust3_d:'We recommend 5 local lawyers to close the contract',trust4_t:'8 Languages',trust4_d:'Platform available in Spanish, English, Portuguese, French, Italian, German, Dutch and Russian',footer_desc:'Connecting honest buyers and sellers of South American farmland',footer_platform:'Platform',footer_notary:'Become a Notary',footer_account:'Account',footer_register:'Create account',footer_rights:'All rights reserved.',login_title:'Login',register_title:'Create account',lbl_password:'Password',no_account:"Don't have an account? Sign up",have_account:'Already have an account',btn_register:'Create account',role_buyer:'Buyer',role_seller:'Seller',role_notary:'Notary',lbl_name:'Full name',lbl_country:'Country',lbl_phone:'Phone',ha:'ha',usd:'USD'},
  pt:{nav_search:'Buscar Imóveis',nav_publish:'Publicar Campo',nav_login:'Entrar',hero_title1:'Fazendas e Campos',hero_title2:'na América do Sul',hero_cta1:'Ver Propriedades',hero_cta2:'Publicar minha Fazenda',type_sale:'Venda',type_rent:'Aluguel',btn_search:'Buscar',ha:'ha',usd:'USD'},
  fr:{nav_search:'Chercher',nav_publish:'Publier un Bien',nav_login:'Connexion',hero_title1:'Fermes et Domaines',hero_title2:"d'Amérique du Sud",hero_cta1:'Voir les Propriétés',hero_cta2:'Publier mon Bien',type_sale:'Vente',type_rent:'Location',btn_search:'Rechercher',ha:'ha',usd:'USD'},
  it:{nav_search:'Cerca',nav_publish:'Pubblica Proprietà',nav_login:'Accedi',hero_title1:'Fattorie e Terreni',hero_title2:"dell'America del Sud",hero_cta1:'Vedi Proprietà',hero_cta2:'Pubblica la mia Proprietà',type_sale:'Vendita',type_rent:'Affitto',btn_search:'Cerca',ha:'ha',usd:'USD'},
  de:{nav_search:'Suchen',nav_publish:'Immobilie einstellen',nav_login:'Anmelden',hero_title1:'Bauernhöfe & Ländereien',hero_title2:'in Südamerika',hero_cta1:'Immobilien ansehen',hero_cta2:'Mein Objekt einstellen',type_sale:'Kauf',type_rent:'Miete',btn_search:'Suchen',ha:'ha',usd:'USD'},
  nl:{nav_search:'Zoeken',nav_publish:'Woning plaatsen',nav_login:'Inloggen',hero_title1:'Boerderijen en Landerijen',hero_title2:'in Zuid-Amerika',hero_cta1:'Bekijk objecten',hero_cta2:'Mijn woning plaatsen',type_sale:'Koop',type_rent:'Huur',btn_search:'Zoeken',ha:'ha',usd:'USD'},
  ru:{nav_search:'Поиск',nav_publish:'Опубликовать',nav_login:'Войти',hero_title1:'Фермы и угодья',hero_title2:'в Южной Америке',hero_cta1:'Смотреть объекты',hero_cta2:'Опубликовать объект',type_sale:'Продажа',type_rent:'Аренда',btn_search:'Найти',ha:'га',usd:'USD'},
};

let currentLang = localStorage.getItem('lang') || 'es';

function t(key) {
  return (LANGS[currentLang] && LANGS[currentLang][key]) || (LANGS['es'] && LANGS['es'][key]) || key;
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    const v = t(k);
    if (el.tagName === 'INPUT' && el.placeholder) el.placeholder = v;
    else el.textContent = v;
  });
  const cl = document.getElementById('currentLang');
  if (cl) cl.textContent = currentLang.toUpperCase();
  document.documentElement.lang = currentLang;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyLang();
  const lm = document.getElementById('langMenu');
  if (lm) lm.classList.remove('open');
}

function toggleLangMenu() {
  const lm = document.getElementById('langMenu');
  if (lm) lm.classList.toggle('open');
}

// ── Countries data ──
let countriesData = {};

async function loadCountriesData() {
  try {
    const r = await fetch('/api/search/countries');
    countriesData = await r.json();
  } catch {}
}

function populateCountrySelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const first = sel.options[0];
  sel.innerHTML = '';
  sel.appendChild(first);
  Object.keys(countriesData).forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
}

function loadProvinces(country, targetId) {
  const sel = document.getElementById(targetId);
  if (!sel) return;
  const first = sel.options[0];
  sel.innerHTML = '';
  sel.appendChild(first);
  const provs = countriesData[country] || [];
  provs.forEach(p => {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    sel.appendChild(o);
  });
}

// ── API helper ──
async function api(method, path, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = 'Bearer ' + token;
  }
  const opts = { method, headers };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const r = await fetch('/api' + path, opts);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'Error ' + r.status);
  return data;
}

// ── Auth helpers ──
function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
function getToken() { return localStorage.getItem('token'); }
function isLoggedIn() { return !!getToken(); }
function logout() {
  localStorage.removeItem('token'); localStorage.removeItem('user');
  window.location = '/login';
}

// ── Listing card builder ──
function buildListingCard(l, lang) {
  const photo = (l.media && l.media.length) ? '/uploads/' + l.media[0].filename : null;
  const price = l.total_price ? formatPrice(l.total_price) : '—';
  return `<div class="listing-card" onclick="window.location='/listing?id=${l.id}'">
    <div class="card-img">
      ${photo ? '<img src="' + photo + '" alt="' + escHtml(l.title) + '" loading="lazy">' : '<div class="no-photo"><i class="fas fa-seedling"></i></div>'}
      <span class="card-badge ${l.transaction_type === 'rent' ? 'rent' : ''}">${l.transaction_type === 'rent' ? t('type_rent') : t('type_sale')}</span>
      ${l.verifications_count >= 5 ? '<span class="card-verif"><i class="fas fa-check-circle"></i> Verificado</span>' : (l.verifications_count > 0 ? '<span class="card-verif"><i class="fas fa-clock"></i> ' + l.verifications_count + '/5</span>' : '')}
    </div>
    <div class="card-body">
      <div class="card-title">${escHtml(l.title)}</div>
      <div class="card-location"><i class="fas fa-map-marker-alt"></i>${escHtml(l.province)}, ${escHtml(l.country)}</div>
      <div class="card-specs">
        ${l.hectares ? '<div class="card-spec"><i class="fas fa-ruler-combined"></i>' + l.hectares.toLocaleString() + ' ' + t('ha') + '</div>' : ''}
        ${l.has_river ? '<div class="card-spec"><i class="fas fa-water"></i>' + t('feat_river') + '</div>' : ''}
        ${l.num_houses > 0 ? '<div class="card-spec"><i class="fas fa-home"></i>' + l.num_houses + '</div>' : ''}
      </div>
      <div class="card-price">${t('usd')} ${price}</div>
      ${l.price_per_hectare > 0 ? '<div class="card-pph">USD ' + formatPrice(l.price_per_hectare) + '/há</div>' : ''}
    </div>
  </div>`;
}

function formatPrice(n) {
  if (!n) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString();
}

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Nav scroll effect ──
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav || nav.classList.contains('nav-solid')) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── Update nav auth state ──
function updateNavAuth() {
  const btn = document.getElementById('navAuthBtn');
  const u = getUser();
  if (!btn) return;
  if (u) {
    btn.textContent = u.name.split(' ')[0];
    btn.href = '/dashboard';
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
  await loadCountriesData();
  applyLang();
  initNavScroll();
  updateNavAuth();

  // Populate any country selects on page
  ['qsCountry','fCountry','nlCountry','country'].forEach(id => populateCountrySelect(id));

  // Close lang menu on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.lang-selector')) {
      const lm = document.getElementById('langMenu');
      if (lm) lm.classList.remove('open');
    }
  });
});
