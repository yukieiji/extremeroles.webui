import { http, HttpResponse } from 'msw';
import {
  AuOptionCategoryDtoArraySchema,
  ExRTabDtoArraySchema,
  ExROptionPutRequestSchema,
  UpdatedOptionsSchema,
  VanillaOptionPutRequestSchema,
  OptionTab
} from '../src/type';
import type { UpdatedOptions, ExRTabDto, AuOptionCategoryDto, ExROptionDto } from '../src/type';

// JSONファイルのロード
import exrOptionData from './get/exr/setting-webui-dev_20260321.json';
import auOptionData from './get/au/setting-webui-dev_20260321.json';

/**
 * Zodを使用してロードしたデータのバリデーションを実施
 */
let validatedExRMockData: ExRTabDto[];
let validatedAuMockData: AuOptionCategoryDto[];

try {
  validatedExRMockData = ExRTabDtoArraySchema.parse(exrOptionData) as ExRTabDto[];
  validatedAuMockData = AuOptionCategoryDtoArraySchema.parse(auOptionData) as AuOptionCategoryDto[];
} catch (error) {
  console.error('Mock data validation failed:', error);
  throw error;
}

/**
 * 更新されたオプションのモックデータ作成
 */
const mockUpdatedOptions: UpdatedOptions = {
  UpdatedCategory: {
    Id: 1,
    Name: 'ゲーム設定',
    Options: [
      {
        Id: 101,
        IsActive: true,
        TranslatedName: '移動速度',
        Selection: 1,
        Format: '{0}x',
        RangeMeta: {
          Type: 'Single',
          Values: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
        },
        Childs: [],
      },
    ],
  },
  ChainUpdatedOption: [],
};

const validatedUpdatedOptions = UpdatedOptionsSchema.parse(mockUpdatedOptions);

export const handlers = [
  /**
   * GET /exr/option/ のハンドラー
   */
  http.get('/exr/option/', () => {
    return HttpResponse.json(validatedExRMockData);
  }),

  /**
   * PUT /exr/option/ のハンドラー
   */
  http.put('/exr/option/', async ({ request }) => {
    const body = await request.json();

    // Zodを使用してリクエストボディをバリデーション
    const result = ExROptionPutRequestSchema.safeParse(body);

    if (!result.success) {
      return new HttpResponse(null, { status: 400 });
    }

    const { TabId, CategoryId, OptionId, Selection } = result.data;

    // データの更新
    // モックデータ内のId（文字列の場合がある）を数値に変換して比較
    const getTabIdNum = (id: string | number): number => {
        if (typeof id === 'number') return id;
        const mapped = OptionTab[id as keyof typeof OptionTab];
        return typeof mapped === 'number' ? mapped : Number(id);
    };

    const tab = validatedExRMockData.find((t) => getTabIdNum(t.Id) === TabId);
    if (!tab) {
        return new HttpResponse(null, { status: 404 });
    }

    const category = tab.Categories.find((c) => c.Id === CategoryId);
    if (!category) {
        return new HttpResponse(null, { status: 404 });
    }

    // 不変性を保ちながらデータを更新
    let foundOption: ExROptionDto | undefined;
    const updateRecursive = (options: ExROptionDto[]): ExROptionDto[] => {
        return options.map((opt) => {
            if (opt.Id === OptionId) {
                foundOption = { ...opt, Selection: Selection };
                return foundOption;
            }
            if (opt.Childs.length > 0) {
                const oldFound = foundOption;
                const newChilds = updateRecursive(opt.Childs);
                // 子要素の探索で新しく見つかった場合のみ、オブジェクトを再生成
                if (foundOption && foundOption !== oldFound) {
                    return { ...opt, Childs: newChilds };
                }
            }
            return opt;
        });
    };

    const newOptions = updateRecursive(category.Options);

    if (!foundOption) {
        return new HttpResponse(null, { status: 404 });
    }

    // 全体のモックデータを更新
    validatedExRMockData = validatedExRMockData.map((t) => {
        if (getTabIdNum(t.Id) !== TabId) {
            return t;
        }
        return {
            ...t,
            Categories: t.Categories.map((c) => {
                if (c.Id !== CategoryId) {
                    return c;
                }
                return { ...c, Options: newOptions };
            }),
        };
    });

    // 更新後のカテゴリとオプションを取得
    const updatedTab = validatedExRMockData.find((t) => getTabIdNum(t.Id) === TabId);
    const updatedCategory = updatedTab?.Categories.find((c) => c.Id === CategoryId) || null;

    // それ以外はUpdatedOptionsを返す
    const mockUpdatedOptions: UpdatedOptions = {
      UpdatedCategory: updatedCategory,
      ChainUpdatedOption: [foundOption],
    };

    // レスポンスデータのバリデーション
    const validatedResponse = UpdatedOptionsSchema.parse(mockUpdatedOptions);

    return HttpResponse.json(validatedResponse);
  }),

  /**
   * GET /au/option/ のハンドラー
   */
  http.get('/au/option/', () => {
    return HttpResponse.json(validatedAuMockData);
  }),

  /**
   * PUT /au/option/ のハンドラー
   */
  http.put('/au/option/', async ({ request }) => {
    const body = await request.json();

    // リクエストボディのバリデーション
    const validatedRequest = VanillaOptionPutRequestSchema.safeParse(body);
    if (!validatedRequest.success) {
      return HttpResponse.json(validatedRequest.error, { status: 400 });
    }

    return HttpResponse.json(validatedUpdatedOptions);
  }),
];
