'use strict';

const china20Holdings = ['Tencent', 'Alibaba', 'Xiaomi', 'BYD', 'Meituan', 'JD.com', 'Baidu', 'NetEase', 'CATL', 'SMIC', 'Trip.com', 'Li Auto', 'XPeng', 'NIO', 'Pop Mart', 'Geely', 'Sunny Optical', 'Kingsoft', 'Lenovo', 'Anta'];
const chinaAIHoldings = [
  ['SMIC', 'Semiconductors'], ['Xiaomi', 'AI, devices & EV'],
  ['Baidu', 'Foundation models & autonomous driving'], ['Alibaba', 'Cloud & AI'],
  ['Tencent', 'AI & consumer platforms'], ['Horizon Robotics', 'Autonomous driving chips'],
  ['Cambricon', 'AI chips'], ['GigaDevice', 'Semiconductors'],
  ['CATL', 'Intelligent EV ecosystem'], ['UBTech', 'Humanoid robotics']
];
const products = {
  china20: {
    name: 'BOBIC CHINA 20', count: '20 example constituents',
    description: 'A diversified basket of leading Chinese companies. BOBIC periodically rebalances the underlying portfolio.',
    label: 'Illustrative holdings · Weights to be confirmed', className: '',
    holdings: china20Holdings.map(name => [name])
  },
  chinaai: {
    name: 'BOBIC CHINA AI', count: '10 example exposures',
    description: 'A thematic basket spanning AI, semiconductors, robotics and autonomous driving, including opportunities beyond familiar U.S. technology stocks.',
    label: 'Illustrative exposure · Weights to be confirmed', className: 'ai-list', holdings: chinaAIHoldings
  },
  chinaalpha: {
    name: 'BOBIC CHINA ALPHA', count: 'Dynamic allocation',
    description: 'An AI-managed strategy designed to dynamically reallocate across China opportunities as market conditions change.',
    label: 'Proposed strategy · Live allocations available at launch', className: 'strategy-list',
    holdings: [
      ['China equities', 'Exposure to leading Chinese companies.'],
      ['Thematic baskets', 'AI, semiconductors, robotics and other China growth themes.'],
      ['China-related ETFs', 'Broader or targeted exposure through eligible funds.'],
      ['Active rebalancing', 'Adjusting allocation across opportunities; no fixed weights are published.']
    ]
  },
  alibaba: { name: 'Alibaba · BABA' },
  tencent: { name: 'Tencent · 0700.HK' },
  xiaomi: { name: 'Xiaomi · 1810.HK' },
  byd: { name: 'BYD · 1211.HK' }
};
const tabs = Array.from(document.querySelectorAll('[data-product]'));
const panel = document.getElementById('product-panel');
function selectProduct(key) {
  const product = products[key];
  if (!product || !product.holdings) return;
  tabs.forEach(tab => {
    const selected = tab.dataset.product === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', 'tab-' + key);
  document.getElementById('selected-name').textContent = product.name;
  document.getElementById('holdings-count').textContent = product.count;
  document.getElementById('selected-description').textContent = product.description;
  document.getElementById('holdings-label').textContent = product.label;
  const list = document.getElementById('holdings-list');
  list.className = ['holdings-list', product.className].filter(Boolean).join(' ');
  list.replaceChildren(...product.holdings.map(([name, detail]) => {
    const item = document.createElement('span');
    item.textContent = name;
    if (detail) {
      const detailText = document.createElement('small');
      detailText.className = 'holding-detail';
      detailText.textContent = detail;
      item.append(detailText);
    }
    return item;
  }));
  document.getElementById('selected-invest').dataset.invest = key;
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProduct(tab.dataset.product));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectProduct(tabs[nextIndex].dataset.product);
    tabs[nextIndex].focus();
  });
});
document.querySelectorAll('[data-explore]').forEach(link => {
  link.addEventListener('click', () => selectProduct(link.dataset.explore));
});
const dialog = document.getElementById('invest-dialog');
const amount = document.getElementById('invest-amount');
let investmentKey = 'china20';
let opener;
document.querySelectorAll('[data-invest]').forEach(button => {
  button.addEventListener('click', () => {
    investmentKey = button.dataset.invest;
    const product = products[investmentKey];
    if (!product) return;
    opener = button;
    document.getElementById('invest-title').textContent = product.name;
    document.getElementById('order-product').textContent = product.name;
    dialog.showModal();
  });
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => opener?.focus());
document.getElementById('investment-preview-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const value = Number(amount.value);
  if (!Number.isFinite(value) || value <= 0) return;
  const subject = 'BOBIC China access: ' + products[investmentKey].name;
  const body = 'Hello BOBIC,\n\nI would like to receive launch and access information for ' + products[investmentKey].name + '.\n\nIllustrative amount of interest: ' + value.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' USDC.\n\nPlease share availability, eligibility, final product terms and fees. This is an enquiry, not an investment order.\n';
  window.location.href = 'mailto:contact@bobic.ai?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});
