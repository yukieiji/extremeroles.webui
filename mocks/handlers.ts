import { http, HttpResponse } from 'msw';
import {
  AuOptionCategoryDtoArraySchema,
  ExRTabDtoArraySchema,
  ExROptionPutRequestSchema,
  UpdatedOptionsSchema,
  VanillaOptionPutRequestSchema
} from '../src/type';
import type { UpdatedOptions, ExRTabDto, AuOptionCategoryDto, ExROptionDto, ExRCategoryDto } from '../src/type';

// JSONファイルのロード
import exrOptionData from './get/exr/setting-webui-dev_20260321.json';
import auOptionData from './get/au/setting-webui-dev_20260321.json';

/**
 * Zodを使用してロードしたデータのバリデーションを実施
 */
const masterValidatedExRMockData: ExRTabDto[] = ExRTabDtoArraySchema.parse(exrOptionData);
const masterValidatedAuMockData: AuOptionCategoryDto[] = AuOptionCategoryDtoArraySchema.parse(auOptionData);

let curValidatedExRMockData: ExRTabDto[] = JSON.parse(JSON.stringify(masterValidatedExRMockData));
let curValidatedAuMockData: AuOptionCategoryDto[] = JSON.parse(JSON.stringify(masterValidatedAuMockData));

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
    return HttpResponse.json(curValidatedExRMockData);
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

    // CategoryIdとOptionIdが0のときは202を返す（ボディなし）
    if (CategoryId === 0 && OptionId === 0) {
      return new HttpResponse(null, { status: 202 });
    }

    // 実際にデータを更新する
    let updatedCategory: ExRCategoryDto | null = null;
    const tab = curValidatedExRMockData.find(t => t.Id === TabId);
    if (tab) {
      const category = tab.Categories.find(c => c.Id === CategoryId);
      if (category) {
        const updateOption = (options: ExROptionDto[]) => {
          for (const opt of options) {
            if (opt.Id === OptionId) {
              opt.Selection = Selection;
              opt.IsActive = true; 
              return true;
            }
            if (opt.Childs && updateOption(opt.Childs)) {
              return true;
            }
          }
          return false;
        };
        updateOption(category.Options);
        updatedCategory = category;
      }
    }

    // それ以外はUpdatedOptionsを返す
    const mockUpdatedOptions: UpdatedOptions = {
      UpdatedCategory: updatedCategory,
      ChainUpdatedOption: [],
    };

    // レスポンスデータのバリデーション
    const validatedResponse = UpdatedOptionsSchema.parse(mockUpdatedOptions);

    return HttpResponse.json(validatedResponse);
  }),

  /**
   * GET /au/option/ のハンドラー
   */
  http.get('/au/option/', () => {
    return HttpResponse.json(curValidatedAuMockData);
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

  /**
   * モックデータをリセットするハンドラー
   */
  http.post('/mock/reset', () => {
    curValidatedExRMockData = JSON.parse(JSON.stringify(masterValidatedExRMockData));
    curValidatedAuMockData = JSON.parse(JSON.stringify(masterValidatedAuMockData));
    return new HttpResponse(null, { status: 200 });
  }),
];
