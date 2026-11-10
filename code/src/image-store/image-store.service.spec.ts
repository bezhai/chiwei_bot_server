import { FakePixivImageModel } from '../../test/fakes/pixiv-image-model.fake';
import { ImageStoreService } from './image-store.service';

const PIXIV_URL =
  'https://i.pximg.net/img-original/img/2026/11/09/12/00/00/123456_p0.png';
const FILE_NAME = '123456_p0.png';
const NOW = new Date('2026-11-10T04:00:00Z');
// NOW 按 UTC 和东八区都是 11 月 10 日。
const NEW_KEY = 'pixiv_img_v2/20261110/123456_p0.png';

// 直接构造 ImageStoreService（注入内存 img_map、假 OSS 和 proxy），避开 NestJS DI。
function makeService(docs: Array<Record<string, unknown>>) {
  const pixivImageModel = new FakePixivImageModel(docs);
  const innerOss: any = {
    uploadFile: jest.fn(async () => ({ res: { status: 200 } })),
  };
  const externalOss: any = {};
  const imageBuffer = Buffer.from('image-bytes');
  const proxyService: any = {
    proxyRequestBuffer: jest.fn(async () => imageBuffer),
  };
  const larkService: any = {};
  const service = new ImageStoreService(
    innerOss,
    externalOss,
    pixivImageModel as any,
    proxyService,
    larkService,
  );
  return { service, pixivImageModel, innerOss, proxyService, imageBuffer };
}

describe('ImageStoreService.downloadImage 在响应里返回 OSS key', () => {
  beforeEach(() => {
    jest.useFakeTimers({
      now: NOW,
      doNotFake: ['nextTick', 'setImmediate', 'queueMicrotask'],
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('img_map 已有非空 key：直接返回库里存的 key，不下载也不上传', async () => {
    const storedKey = 'pixiv_img_v2/20250101/123456_p0.png';
    const { service, pixivImageModel, innerOss, proxyService } = makeService([
      { pixiv_addr: FILE_NAME, tos_file_name: storedKey, illust_id: 123456 },
    ]);

    const result = await service.downloadImage(PIXIV_URL);

    expect(result).toEqual({ tos_file_name: storedKey });
    expect(proxyService.proxyRequestBuffer).not.toHaveBeenCalled();
    expect(innerOss.uploadFile).not.toHaveBeenCalled();
    expect(pixivImageModel.docsFor(FILE_NAME)).toEqual([
      { pixiv_addr: FILE_NAME, tos_file_name: storedKey, illust_id: 123456 },
    ]);
  });

  it('img_map 没有记录：上传后新建记录，返回新 key', async () => {
    const { service, pixivImageModel, innerOss, imageBuffer } = makeService([]);

    const result = await service.downloadImage(PIXIV_URL);

    expect(result).toEqual({ tos_file_name: NEW_KEY });
    expect(innerOss.uploadFile).toHaveBeenCalledWith(NEW_KEY, imageBuffer);
    expect(pixivImageModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        pixiv_addr: FILE_NAME,
        tos_file_name: NEW_KEY,
        illust_id: 123456,
      }),
    );
    expect(pixivImageModel.docsFor(FILE_NAME)).toHaveLength(1);
  });

  // worker 的 addImage 按 pixiv_addr upsert 元数据、不写 tos_file_name，
  // 这类记录的图从来没上传过。
  describe.each([
    ['null', { tos_file_name: null }],
    ['缺失', {}],
    ['空串', { tos_file_name: '' }],
  ])('img_map 已有记录但 key 为%s', (_label, keyField) => {
    const createTime = new Date('2026-11-09T04:10:00Z');
    const metadata = {
      pixiv_addr: FILE_NAME,
      illust_id: 123456,
      author: 'some-author',
      author_id: '42',
      title: 'some-title',
      visible: true,
      del_flag: false,
      multi_tags: [{ name: 'tag', translation: '标签', visible: true }],
      create_time: createTime,
      update_time: createTime,
    };

    it('上传后只给原记录补上 key，保留元数据，不新建记录，返回新 key', async () => {
      const { service, pixivImageModel, innerOss, imageBuffer } = makeService([
        { ...metadata, ...keyField },
      ]);

      const result = await service.downloadImage(PIXIV_URL);

      expect(result).toEqual({ tos_file_name: NEW_KEY });
      expect(innerOss.uploadFile).toHaveBeenCalledWith(NEW_KEY, imageBuffer);
      expect(pixivImageModel.create).not.toHaveBeenCalled();
      expect(pixivImageModel.docsFor(FILE_NAME)).toEqual([
        { ...metadata, tos_file_name: NEW_KEY, update_time: NOW },
      ]);
    });
  });
});
