import axios from 'axios';
import FormData from 'form-data';
import isUrl from 'is-url';
import fs from 'fs';

const baseURL: string = 'https://gifyu.com';

const client = axios.create({ baseURL });

client.interceptors.request.use(
  (config) => {
    const message = `${config.method?.toUpperCase()} request sent to ${
      config.baseURL
    }${config.url} at ${new Date().toLocaleTimeString()}`;

    if (config.url !== '/') {
      console.log(message);
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

interface Credential {
  authToken: string;
  cookie: string;
}

interface FormParam {
  type: string;
  source: string;
  filename?: string;
  description?: string;
}

type ImageInput = {
  source: string;
  filename?: string;
  description?: string;
};

const getCredential = async (): Promise<Credential> => {
  try {
    const response = await client.get('/');
    const authToken = response.data
      .split('PF.obj.config.auth_token = ')[1]
      .split('"')[1];
    const cookie = response.headers['set-cookie'][0].split(';')[0];

    return { authToken, cookie };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getFormHeaders = (form: FormData, cookie: string) => ({
  headers: {
    ...form.getHeaders(),
    Cookie: `${cookie}`,
    Connection: 'keep-alive',
    Accept: 'application/json',
    Origin: 'https://gifyu.com',
    Referer: 'https://gifyu.com/',
    'sec-fetch-mode': 'cors',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
  },
  maxContentLength: Infinity,
  withCredentials: true
});

const getFormPostImage = (
  { authToken, cookie }: Credential,
  { type, source, filename, description }: FormParam
): { form: FormData; headers: object; cookie: string } => {
  const form = new FormData();

  form.append('nsfw', 0);
  form.append('action', 'upload');
  form.append('expiration', 0);
  form.append('timestamp', new Date().getTime());
  form.append('type', type);
  form.append('auth_token', authToken);

  if (filename) {
    form.append('title', filename);
  }

  if (description) {
    form.append('description', description);
  }

  if (type === 'file') {
    if (fs.existsSync(source))
      form.append('source', fs.createReadStream(source));
    else throw new Error(`No such file or directory ${source}`);
  } else {
    form.append('source', source);
  }

  const headers = getFormHeaders(form, cookie);

  return { form, headers, cookie };
};

const getFormPostAlbum = (
  { authToken, cookie }: Credential,
  idImages: string[] | string,
  albumName: string,
  albumPrivacy: string,
  albumDescription: string,
  albumPassword?: string
): { form: FormData; headers: object; cookie: string } => {
  const form = new FormData();

  form.append('auth_token', authToken);
  form.append('action', 'create-album');
  form.append('type', 'images');
  if (Array.isArray(idImages)) {
    idImages.forEach((id) => {
      form.append('album[ids][]', id);
    });
  }
  form.append('album[new]', 'true');
  form.append('album[name]', albumName);
  form.append('album[description]', albumDescription);
  form.append('album[privacy]', albumPrivacy);
  if (albumPrivacy === 'password') {
    form.append('album[password]', albumPassword);
  }

  const headers = getFormHeaders(form, cookie);

  return { form, headers, cookie };
};

const postImage = async (
  input: string | ImageInput,
  credential: Credential
) => {
  let formParam: FormParam;

  if (typeof input === 'string') {
    formParam = {
      type: typeof input === 'string' && isUrl(input) ? 'url' : 'file',
      source: input
    };
  } else {
    formParam = {
      type:
        typeof input.source === 'string' && isUrl(input.source)
          ? 'url'
          : 'file',
      source: input.source,
      filename: input.filename,
      description: input.description
    };
  }

  const { form, headers, cookie } = await getFormPostImage(
    credential,
    formParam
  );

  if (typeof input === 'string') {
    console.log(`Uploading ${input} ...`);
  } else {
    console.log(`Uploading ${input.source} ...`);
  }

  const { data } = await client.post('/json', form, headers);
  data.request.cookie = cookie;

  return data;
};

const postImages = async (input: string[], credential: Credential) => {
  const result = await Promise.allSettled(
    input.map(async (val) => postImage(val, credential))
  );
  const success: Array<object> = [];
  const failed: Array<object> = [];

  result.forEach((val) => {
    if (val.status === 'fulfilled') {
      success.push(val.value);
    } else {
      const error = {
        status_code: 400,
        error: {
          message: 'Error uploading file'
        }
      };

      failed.push(error);
    }
  });

  return { success, failed };
};

const createAlbum = async (
  credential: Credential,
  idImages: string[],
  albumName: string = 'My Album',
  albumPrivacy: string = 'private_but_link',
  albumDescription: string = '',
  albumPassword?: string
) => {
  const { form, headers } = getFormPostAlbum(
    credential,
    idImages,
    albumName,
    albumPrivacy,
    albumDescription,
    albumPassword
  );

  console.log(`Creating album ${albumName}`);
  const { data } = await client.post('/json', form, headers);
  return data;
};

const handleError = (error: any): object => {
  if (error.response) {
    return error.response.data;
  }

  return {
    status_code: 400,
    error: {
      message: error.message
    }
  };
};

const gifyu = async (
  input:
    | string
    | string[]
    | {
        source: string;
        filename?: string;
        description?: string;
      }
    | {
        source: string;
        filename?: string;
        description?: string;
      }[],
  album?: {
    title: string;
    description?: string;
    privacy?: 'public' | 'password' | 'private_but_link';
    password?: string;
  }
): Promise<object> => {
  try {
    const credential = await getCredential();

    if (typeof input === 'string') {
      const data = await postImage(input, credential);

      if (album) {
        const idImages = data.image.url_viewer.split('/')[4];
        const dataAlbum = await createAlbum(
          credential,
          idImages,
          album.title,
          album.privacy,
          album.description,
          album.privacy === 'password' ? album.password : ''
        );

        return { data, dataAlbum };
      }

      return data;
    }

    if (Array.isArray(input as string[])) {
      const data = await postImages(input as string[], credential);

      if (album) {
        const idImages = (data.success as Array<any>).map(
          (val) => val.image.url_viewer.split('/')[4]
        );
        const dataAlbum = await createAlbum(
          credential,
          idImages,
          album.title,
          album.privacy,
          album.description,
          album.privacy === 'password' ? album.password : ''
        );

        return { data, dataAlbum };
      }

      return data;
    }

    return await postImage(input as ImageInput, credential);
  } catch (error: any) {
    return handleError(error);
  }
};

export { gifyu };
