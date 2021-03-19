function log(...text: string[]) {
  document.getElementById('log').innerText += text.join('\n') + '\n';
}

const drop = document.getElementById('drop');
function preventDefaults (e: Event) {
  e.preventDefault()
  e.stopPropagation()
}
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  drop.addEventListener(eventName, preventDefaults, false)
});

async function addFile(file: any, parent?: HTMLElement) {
  parent = parent || drop;
  if (file) {
    const el = document.createElement('div');
    el.innerText = file.name;
    parent.appendChild(el);
    if (file.isDirectory) {
      el.className = 'folder';
      const reader = file.createReader();
      const entries = await new Promise(resolve => reader.readEntries(entries => resolve(entries))) as any[];
      await Promise.all(entries.map(entry => addFile(entry, el)));
    } else {
      el.className = 'file';
      // let path = entry.fullPath;
      // if (path[0] === '/') {
      //   path = path.substr(1);
      // }
      // files[path] = await this.getFile(entry as WebKitFileEntry);
    }
  }
}
  
drop.addEventListener('drop', e => {
  e.preventDefault()
  e.stopPropagation()
  drop.innerHTML = '';
  for (let i = 0; i < e.dataTransfer.items.length; i++) {
    addFile(e.dataTransfer.items[i].webkitGetAsEntry())
  }
});