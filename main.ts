function log(...text: string[]) {
  document.getElementById('log').innerText += text.join('\n') + '\n';
}
document.addEventListener('load', () => {
  log('getting ready...');
  const drop = document.getElementById('drop');
  drop.addEventListener('drop', (...data) => {
    console.log(data);
  });
});