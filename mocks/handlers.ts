import { http, HttpResponse } from 'msw';
import {
  AuOptionCategoryDtoArraySchema,
  ExRTabDtoArraySchema,
  ExROptionPutRequestSchema,
  UpdatedOptionsSchema,
  VanillaOptionPutRequestSchema
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
  validatedExRMockData = ExRTabDtoArraySchema.parse(exrOptionData);
  validatedAuMockData = AuOptionCategoryDtoArraySchema.parse(auOptionData);
} catch (error) {
  console.error('Mock data validation failed:', error);
  throw error;
}

/**
 * 更新されたオプションのモックデータ作成 (Vanilla用)
 */
const mockUpdatedOptionsVanilla: UpdatedOptions = {
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

const validatedUpdatedOptionsVanilla = UpdatedOptionsSchema.parse(mockUpdatedOptionsVanilla);

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

    const { CategoryId, OptionId, Selection } = result.data;

    // CategoryIdとOptionIdが0のときは202を返す（ボディなし）
    if (CategoryId === 0 && OptionId === 0) {
      return new HttpResponse(null, { status: 202 });
    }

    // 既存のモックデータからカテゴリを探す
    let sourceCategory = null;
    for (const tab of validatedExRMockData) {
      const catIndex = tab.Categories.findIndex(c => c.Id === CategoryId);
      if (catIndex !== -1) {
        sourceCategory = tab.Categories[catIndex];

        // モックデータを更新して状態を保持する
        let found = false;
        sourceCategory.Options = sourceCategory.Options.map(opt => {
          if (opt.Id === OptionId) {
            found = true;
            return { ...opt, Selection };
          }
          return opt;
        });

        if (!found) {
          sourceCategory.Options.push({
            Id: OptionId,
            IsActive: true,
            TranslatedName: "Mock Option",
            Selection: Selection,
            Format: "{0}",
            RangeMeta: {
              Type: "Int32",
              Values: [0, 1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            },
            Childs: []
          });
        }
        break;
      }
    }

    let updatedOptions: ExROptionDto[] = [];
    if (sourceCategory) {
      updatedOptions = sourceCategory.Options;
    } else {
      // 見つからない場合はダミーを生成（テスト用）
      updatedOptions = [
        {
          Id: OptionId,
          IsActive: true,
          TranslatedName: "Mock Option",
          Selection: Selection,
          Format: "{0}",
          RangeMeta: {
            Type: "Int32",
            Values: [0, 1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
          },
          Childs: []
        },
        {
          Id: 51, // Spawn Count for Role tests
          IsActive: true,
          TranslatedName: "Mock Option 2",
          Selection: 0,
          Format: "{0}",
          RangeMeta: { Type: "Int32", Values: [0, 1, 2, 3] },
          Childs: []
        }
      ];
    }

    const response: UpdatedOptions = {
      UpdatedCategory: {
        Id: CategoryId,
        Name: sourceCategory ? sourceCategory.Name : "Mock Category",
        Options: updatedOptions
      },
      ChainUpdatedOption: []
    };

    // レスポンスデータのバリデーション
    const validatedResponse = UpdatedOptionsSchema.parse(response);

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

    return HttpResponse.json(validatedUpdatedOptionsVanilla);
  }),
];
