type Doc = Record<string, unknown>;

// 内存里的 img_map，只实现 downloadImage 用到的查询子集。
// 遇到不认识的操作符直接抛错，免得假实现把写错的查询悄悄放过去。
function matchesCondition(value: unknown, cond: unknown): boolean {
  if (cond === null) {
    // 和 Mongo 一致：{ field: null } 同时匹配 null 和字段缺失。
    return value === null || value === undefined;
  }
  if (typeof cond !== 'object' || cond instanceof Date) {
    return value === cond;
  }
  return Object.entries(cond as Doc).every(([op, arg]) => {
    switch (op) {
      case '$type':
        if (arg !== 'string') {
          throw new Error(`fake img_map: unsupported $type ${String(arg)}`);
        }
        return typeof value === 'string';
      case '$ne':
        return !matchesCondition(value, arg);
      default:
        throw new Error(`fake img_map: unsupported operator ${op}`);
    }
  });
}

function matches(doc: Doc, filter: Doc): boolean {
  return Object.entries(filter).every(([field, cond]) =>
    matchesCondition(doc[field], cond),
  );
}

function fieldsToSet(update: Doc): Doc {
  const operators = Object.keys(update).filter((key) => key.startsWith('$'));
  if (operators.length === 0) {
    // Mongoose 把不带操作符的更新当作 $set。
    return update;
  }
  if (operators.length !== 1 || operators[0] !== '$set') {
    throw new Error(`fake img_map: unsupported update ${operators.join(',')}`);
  }
  return update.$set as Doc;
}

// 和 schema 上 pixiv_addr 的唯一索引一致：已有同 pixiv_addr 的记录时，插入按 E11000 失败。
function duplicateKeyError(pixivAddr: unknown): Error {
  return Object.assign(
    new Error(
      `E11000 duplicate key error collection: img_map index: pixiv_addr_1 dup key: { pixiv_addr: "${String(pixivAddr)}" }`,
    ),
    { code: 11000 },
  );
}

export class FakePixivImageModel {
  readonly docs: Doc[];

  constructor(docs: Doc[] = []) {
    this.docs = docs.map((doc) => ({ ...doc }));
  }

  findOne = jest.fn(
    async (filter: Doc) =>
      this.docs.find((doc) => matches(doc, filter)) ?? null,
  );

  updateOne = jest.fn(async (filter: Doc, update: Doc) => {
    const doc = this.docs.find((candidate) => matches(candidate, filter));
    if (!doc) {
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    }
    Object.assign(doc, fieldsToSet(update));
    return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
  });

  create = jest.fn(async (doc: Doc) => {
    if (this.docs.some((existing) => existing.pixiv_addr === doc.pixiv_addr)) {
      throw duplicateKeyError(doc.pixiv_addr);
    }
    const created = { ...doc };
    this.docs.push(created);
    return created;
  });

  docsFor(pixivAddr: string): Doc[] {
    return this.docs.filter((doc) => doc.pixiv_addr === pixivAddr);
  }
}
