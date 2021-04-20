import makeLogger from '@/lib/makeLogger';

const logger = makeLogger('file/readFile');

const readFile = (_accept: string = '') => {
  return new Promise((resolve, reject) => {
    const onFileChange = (ev: Event) => {
      logger('onFileChnage', ev);
      resolve('');
    };

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    if (_accept !== '') fileInput.accept = _accept;
    fileInput.addEventListener('change', onFileChange);
    fileInput.click();
  });
};

export default readFile;
