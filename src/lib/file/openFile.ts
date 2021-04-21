import makeLogger from '@/lib/makeLogger';
import makeError from '../makeError';
import makeResult from '../makeResult';

const logger = makeLogger('file/readFile');

interface openFileFunc {
  (_accept: string): Promise<FileList>;
}
const openFile: openFileFunc = (_accept = '') => {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    if (_accept !== '') fileInput.accept = _accept;

    const onFileChange = (ev: Event) => {
      logger('onFileChnage', ev, fileInput.value);
      if (!fileInput.files) return reject();
      resolve(fileInput.files);
    };

    fileInput.addEventListener('change', onFileChange);
    fileInput.click();
  });
};

const _readFile = (_file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const onFileLoad = (ev: ProgressEvent<FileReader>) => {
      if (!ev.target) return reject();
      resolve(ev.target.result);
    };
    fileReader.onload = onFileLoad;
    fileReader.readAsText(_file);
  });
};

interface readFileFunc {
  (_accept: string): Promise<resolvable<string>>;
}
const readFile: readFileFunc = async (_accept) => {
  try {
    const files = await openFile(_accept);
    if (!files) return makeError('FILE_MISSING');
    const [file] = Array.from(files);
    const result = await _readFile(file);
    return makeResult(result);
  } catch (err) {
    return makeError('ERROR_WHILE_READING', err);
  }
};

export default readFile;
