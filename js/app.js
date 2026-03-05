// ===== Merrali - Main JS =====

// Theme toggle
function toggleTheme() {
  var t = document.documentElement.getAttribute('data-theme') === 'light' ? '' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('merrali-theme', t);
  var icon = document.querySelector('#themeBtn i');
  if (icon) icon.className = t === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}
(function() {
  var saved = localStorage.getItem('merrali-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    var icon = document.querySelector('#themeBtn i');
    if (icon) icon.className = saved === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
})();

// i18n
var currentLang = localStorage.getItem('merrali-lang') || 'es';
var L = {
  es: {
    'nav.services':'Servicios','nav.products':'Productos','nav.countries':'Países','nav.how':'Cómo Funciona','nav.contact':'Contacto','nav.cta':'Cotizar Ahora',
    'hero.badge':'Importación y Exportación Profesional',
    'hero.title':'Conectamos <span class="gradient-text">mercados</span> en toda Latinoamérica',
    'hero.desc':'Importación y exportación de productos entre Paraguay, Argentina, Brasil y más países. Logística integral, despacho aduanero y asesoramiento comercial.',
    'hero.cta1':'Solicitar Cotización','hero.cta2':'Ver Productos',
    'hero.stat1':'Operaciones','hero.stat2':'Países','hero.stat3':'Clientes Activos',
    'serv.badge':'Servicios','serv.title':'Soluciones completas de comercio exterior',
    'serv.1t':'Importación','serv.1d':'Traemos tus productos desde cualquier origen. Gestión aduanera, transporte y entrega en tu depósito.',
    'serv.2t':'Exportación','serv.2d':'Llevamos tus productos al mundo. Documentación, logística y acompañamiento en todo el proceso.',
    'serv.3t':'Logística Integral','serv.3d':'Transporte terrestre, marítimo y aéreo. Almacenamiento y distribución en destino.',
    'serv.4t':'Asesoramiento','serv.4d':'Consultoría en comercio exterior, regulaciones, aranceles y oportunidades de mercado.',
    'prod.badge':'Productos','prod.title':'Catálogo de productos disponibles',
    'countries.badge':'Cobertura','countries.title':'Países donde operamos',
    'py.desc':'Base de operaciones principal','ar.desc':'Importación y exportación activa','br.desc':'Mayor socio comercial','uy.desc':'Operaciones en crecimiento','bo.desc':'Ruta comercial andina','cl.desc':'Conexión Pacífico',
    'how.badge':'Proceso','how.title':'¿Cómo funciona?',
    'how.1t':'Consultá','how.1d':'Contanos qué producto querés importar o exportar y a qué país.',
    'how.2t':'Cotizamos','how.2d':'Analizamos costos, aranceles, transporte y te enviamos una cotización detallada.',
    'how.3t':'Gestionamos','how.3d':'Nos encargamos de toda la logística, documentación y despacho aduanero.',
    'how.4t':'Entregamos','how.4d':'Recibís tu mercadería en destino. Seguimiento en tiempo real.',
    'cta.title':'¿Listo para expandir tu negocio?','cta.desc':'Contactanos y te asesoramos sin compromiso sobre tu próxima operación de importación o exportación.','cta.btn':'Contactar Ahora',
    'contact.badge':'Contacto','contact.title':'Hablemos de tu próximo negocio',
    'contact.wa':'WhatsApp','contact.waDesc':'Escribinos al WhatsApp','contact.email':'Email','contact.emailDesc':'info@merrali.com','contact.loc':'Ubicación','contact.locDesc':'Paraguay - Argentina - Brasil',
    'footer.copy':'© 2025 Merrali. Todos los derechos reservados.'
  },
  pt: {
    'nav.services':'Serviços','nav.products':'Produtos','nav.countries':'Países','nav.how':'Como Funciona','nav.contact':'Contato','nav.cta':'Orçamento',
    'hero.badge':'Importação e Exportação Profissional',
    'hero.title':'Conectamos <span class="gradient-text">mercados</span> em toda a América Latina',
    'hero.desc':'Importação e exportação de produtos entre Paraguai, Argentina, Brasil e mais países. Logística integral, despacho aduaneiro e assessoria comercial.',
    'hero.cta1':'Solicitar Orçamento','hero.cta2':'Ver Produtos',
    'hero.stat1':'Operações','hero.stat2':'Países','hero.stat3':'Clientes Ativos',
    'serv.badge':'Serviços','serv.title':'Soluções completas de comércio exterior',
    'serv.1t':'Importação','serv.1d':'Trazemos seus produtos de qualquer origem. Gestão aduaneira, transporte e entrega no seu depósito.',
    'serv.2t':'Exportação','serv.2d':'Levamos seus produtos ao mundo. Documentação, logística e acompanhamento em todo o processo.',
    'serv.3t':'Logística Integral','serv.3d':'Transporte terrestre, marítimo e aéreo. Armazenamento e distribuição no destino.',
    'serv.4t':'Assessoria','serv.4d':'Consultoria em comércio exterior, regulamentações, tarifas e oportunidades de mercado.',
    'prod.badge':'Produtos','prod.title':'Catálogo de produtos disponíveis',
    'countries.badge':'Cobertura','countries.title':'Países onde operamos',
    'py.desc':'Base de operações principal','ar.desc':'Importação e exportação ativa','br.desc':'Maior parceiro comercial','uy.desc':'Operações em crescimento','bo.desc':'Rota comercial andina','cl.desc':'Conexão Pacífico',
    'how.badge':'Processo','how.title':'Como funciona?',
    'how.1t':'Consulte','how.1d':'Diga-nos qual produto quer importar ou exportar e para qual país.',
    'how.2t':'Orçamos','how.2d':'Analisamos custos, tarifas, transporte e enviamos um orçamento detalhado.',
    'how.3t':'Gerenciamos','how.3d':'Cuidamos de toda a logística, documentação e despacho aduaneiro.',
    'how.4t':'Entregamos','how.4d':'Receba sua mercadoria no destino. Rastreamento em tempo real.',
    'cta.title':'Pronto para expandir seu negócio?','cta.desc':'Entre em contato e assessoramos sem compromisso sua próxima operação.','cta.btn':'Entrar em Contato',
    'contact.badge':'Contato','contact.title':'Vamos falar do seu próximo negócio',
    'contact.wa':'WhatsApp','contact.waDesc':'Nos escreva no WhatsApp','contact.email':'Email','contact.emailDesc':'info@merrali.com','contact.loc':'Localização','contact.locDesc':'Paraguai - Argentina - Brasil',
    'footer.copy':'© 2025 Merrali. Todos os direitos reservados.'
  },
  en: {
    'nav.services':'Services','nav.products':'Products','nav.countries':'Countries','nav.how':'How It Works','nav.contact':'Contact','nav.cta':'Get a Quote',
    'hero.badge':'Professional Import & Export',
    'hero.title':'We connect <span class="gradient-text">markets</span> across Latin America',
    'hero.desc':'Import and export of products between Paraguay, Argentina, Brazil and more countries. Comprehensive logistics, customs clearance and commercial advisory.',
    'hero.cta1':'Request a Quote','hero.cta2':'View Products',
    'hero.stat1':'Operations','hero.stat2':'Countries','hero.stat3':'Active Clients',
    'serv.badge':'Services','serv.title':'Complete foreign trade solutions',
    'serv.1t':'Import','serv.1d':'We bring your products from any origin. Customs management, transport and delivery to your warehouse.',
    'serv.2t':'Export','serv.2d':'We take your products to the world. Documentation, logistics and support throughout the process.',
    'serv.3t':'Integral Logistics','serv.3d':'Land, sea and air transport. Storage and distribution at destination.',
    'serv.4t':'Advisory','serv.4d':'Foreign trade consulting, regulations, tariffs and market opportunities.',
    'prod.badge':'Products','prod.title':'Available product catalog',
    'countries.badge':'Coverage','countries.title':'Countries where we operate',
    'py.desc':'Main operations base','ar.desc':'Active import & export','br.desc':'Largest trade partner','uy.desc':'Growing operations','bo.desc':'Andean trade route','cl.desc':'Pacific connection',
    'how.badge':'Process','how.title':'How does it work?',
    'how.1t':'Inquire','how.1d':'Tell us what product you want to import or export and to which country.',
    'how.2t':'We Quote','how.2d':'We analyze costs, tariffs, transport and send you a detailed quote.',
    'how.3t':'We Manage','how.3d':'We handle all logistics, documentation and customs clearance.',
    'how.4t':'We Deliver','how.4d':'Receive your goods at destination. Real-time tracking.',
    'cta.title':'Ready to expand your business?','cta.desc':'Contact us for a no-obligation consultation on your next import or export operation.','cta.btn':'Contact Now',
    'contact.badge':'Contact','contact.title':'Let\'s talk about your next deal',
    'contact.wa':'WhatsApp','contact.waDesc':'Write us on WhatsApp','contact.email':'Email','contact.emailDesc':'info@merrali.com','contact.loc':'Location','contact.locDesc':'Paraguay - Argentina - Brazil',
    'footer.copy':'© 2025 Merrali. All rights reserved.'
  }
};

function t(key) { return (L[currentLang] || L.es)[key] || (L.es)[key] || key; }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('merrali-lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if (val) el.innerHTML = val;
  });
  var langBtn = document.getElementById('langCurrent');
  if (langBtn) langBtn.textContent = lang.toUpperCase();
}

function cycleLang() {
  var langs = ['es','pt','en'];
  var idx = langs.indexOf(currentLang);
  setLang(langs[(idx + 1) % langs.length]);
}

// Smooth scroll
document.addEventListener('DOMContentLoaded', function() {
  setLang(currentLang);
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
});
