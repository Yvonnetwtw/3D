// Reuse existing controls and IDs, so all original interactions stay connected.
const header=document.querySelector('.masthead');
const search=document.createElement('div');search.className='top-search';
const wrap=document.querySelector('.search-wrap');search.append(wrap);header.append(search);
const results=document.createElement('section');results.id='searchResults';results.className='search-results';results.hidden=true;results.setAttribute('aria-label','建築搜尋結果');
results.append(document.querySelector('.filters'),document.querySelector('.list-heading'),document.querySelector('#buildingList'));search.append(results);
const input=document.querySelector('#buildingSearch');input.placeholder='🔎 找建築：圖書館、藥學大樓、L…';input.setAttribute('aria-label','搜尋校園建築');input.setAttribute('aria-controls','searchResults');input.setAttribute('aria-expanded','false');
function showResults(on){results.hidden=!on;input.setAttribute('aria-expanded',String(on));}
input.addEventListener('focus',()=>showResults(true));input.addEventListener('input',()=>showResults(true));
results.addEventListener('click',e=>{if(e.target.closest('.building-row')){showResults(false);input.blur();}});
document.addEventListener('pointerdown',e=>{if(!search.contains(e.target))showResults(false);});
search.addEventListener('keydown',e=>{if(e.key==='Escape'){showResults(false);input.blur();}if(e.key==='ArrowDown'&&e.target===input){showResults(true);results.querySelector('.building-row')?.focus();e.preventDefault();}});
const nav=document.createElement('nav');nav.className='top-actions';nav.setAttribute('aria-label','校園探索功能');header.append(nav);
nav.append(document.querySelector('#walkToggle'),document.querySelector('#visitConfucius'),document.querySelector('#photosOpen'));
function dropdown(label,body){const d=document.createElement('details');d.className='top-dropdown';const summary=document.createElement('summary');summary.textContent=label;d.append(summary,body);nav.append(d);d.addEventListener('toggle',()=>{if(d.open)for(const other of nav.querySelectorAll('details'))if(other!==d)other.open=false;});return d;}
const scenic=document.createElement('div');scenic.className='top-popover scenic-menu';for(const id of ['gateView','treesView','statueOpen'])scenic.append(document.getElementById(id));
const tour=document.querySelector('#tour');scenic.append(tour,document.querySelector('#sourcesOpen'));const scenicDrop=dropdown('更多 ▾',scenic);scenic.addEventListener('click',e=>{if(e.target.closest('button'))scenicDrop.open=false;});
const sound=document.querySelector('.audio-panel');sound.classList.add('top-popover');dropdown('♫ 聲音 ▾',sound);
document.querySelector('#photosQuick').hidden=true;
document.addEventListener('pointerdown',e=>{for(const d of nav.querySelectorAll('details'))if(!d.contains(e.target))d.open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape')nav.querySelectorAll('details').forEach(d=>d.open=false);});
const chip=document.createElement('div');chip.className='campus-caption';chip.textContent='V10 · 嘉寶 Jiabao 校園探索 · 配置與外觀為示意';document.querySelector('.map-panel').append(chip);
