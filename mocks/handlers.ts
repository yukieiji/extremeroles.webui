import { http, HttpResponse } from 'msw';
import {
  AuOptionCategoryDtoArraySchema,
  ExRTabDtoArraySchema,
  ExROptionPutRequestSchema,
  UpdatedOptionsSchema,
  VanillaOptionPutRequestSchema,
  RoleAssignFilterDtoSchema
} from '@/type';
import type { UpdatedOptions, ExRTabDto, AuOptionCategoryDto, ExROptionDto, ExRCategoryDto, CategoryOptionDto, RoleAssignFilterDto } from '@/type';

// JSONファイルのロード
import exrOptionData from './get/exr/setting-webui-dev_20260503.json';
import auOptionData from './get/au/setting-webui-dev_20260607.json';
import roleFilterData from './get/exr/roleassign-dev_20260503.json';

/**
 * Zodを使用してロードしたデータのバリデーションを実施
 */
const masterValidatedExRMockData: ExRTabDto[] = ExRTabDtoArraySchema.parse(exrOptionData);
const masterValidatedAuMockData: AuOptionCategoryDto[] = AuOptionCategoryDtoArraySchema.parse(auOptionData);
const masterRoleFilterData: RoleAssignFilterDto = RoleAssignFilterDtoSchema.parse(roleFilterData);

let curValidatedExRMockData: ExRTabDto[] = structuredClone(masterValidatedExRMockData);
let curValidatedAuMockData: AuOptionCategoryDto[] = structuredClone(masterValidatedAuMockData);

/**
 * 更新されたオプションのモックデータ作成
 */
const mockUpdatedOptions: UpdatedOptions = {
  UpdatedCategory: {
    Id: 1,
    Name: 'ゲーム設定',
    ColorCode: null,
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
  ChainUpdateCategory: null,
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

    // 実際にデータを更新する
    let updatedCategory: ExRCategoryDto | null = null;
    const chainUpdatedOptions: CategoryOptionDto[] = [];

    const tab = curValidatedExRMockData.find(t => t.Id === TabId);
    if (tab) {
      const category = tab.Categories.find(c => c.Id === CategoryId);
      if (category) {
        const updateAllMatchingOptions = (options: ExROptionDto[], id: number, selection: number) => {
          let found = false;
          for (const opt of options) {
            if (opt.Id === id) {
              opt.Selection = selection;
              opt.IsActive = true; 
              found = true;
            }
            if (opt.Childs && updateAllMatchingOptions(opt.Childs, id, selection)) {
              found = true;
            }
          }
          return found;
        };

        // メインターゲットの更新
        updateAllMatchingOptions(category.Options, OptionId, Selection);
        updatedCategory = category;
      }
    }

    // CategoryIdとOptionIdが0のときは202を返す（ボディなし）
    if (CategoryId === 0 && OptionId === 0) {
      return new HttpResponse(null, { status: 202 });
    }

    // それ以外はUpdatedOptionsを返す
    const mockUpdatedOptions: UpdatedOptions = {
      UpdatedCategory: updatedCategory,
      ChainUpdatedOption: chainUpdatedOptions,
      ChainUpdateCategory: null,
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
   * GET /exr/role/filter/ のハンドラー
   */
  http.get('/exr/role/filter/', () => {
    return HttpResponse.json(masterRoleFilterData);
  }),

  /**
   * POST /exr/role/filter/ のハンドラー
   */
  http.post('/exr/role/filter/', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  /**
   * GET /au/translation/batch/optionunit/ のハンドラー
   */
  http.get('/au/translation/batch/optionunit/', () => {
    return HttpResponse.json([
      {
        Key: 'Multiplier',
        Param: [],
        Result: '倍率: {0}'
      },
      {
        Key: 'EmptyFormat',
        Param: [],
        Result: ''
      }
    ]);
  }),

  /**
   * GET /au/translation/batch/ のハンドラー
   */
  http.post('/au/translation/batch/', () => {
    return HttpResponse.json([
      {
        Key: 'optionOff',
        Param: [],
        Result: '<color=#ff0000>OFF</color>'
      },
      {
        Key: 'optionOn',
        Param: [],
        Result: '<color=#00ff00>ON</color>'
      }
    ]);
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

    const { OptionName, NewValue } = validatedRequest.data;

    // 実際にデータを更新する
    for (const category of curValidatedAuMockData) {
      const option = category.Options.find(o => o.Info.OptionName === OptionName);
      if (option) {
        option.Value = NewValue;
        break;
      }
    }

    return HttpResponse.json(validatedUpdatedOptions);
  }),

  /**
   * POST /exr/option/csv/ のハンドラー
   */
  http.post('/exr/option/csv/', async ({ request }) => {
    const body = await request.json() as { CsvBody: string };
    if (body.CsvBody === 'TRIGGER_ERROR') {
      return new HttpResponse(null, { status: 500 });
    }
    return new HttpResponse(null, { status: 200 });
  }),

  /**
   * GET /exr/option/csv/ のハンドラー
   */
  http.get('/exr/option/csv/', () => {
    return HttpResponse.json({
      ExportAt: new Date().toISOString(),
      Version: '1.0.0',
      CsvBody: 'Header1,Header2\nValue1,Value2',
    });
  }),

  /**
   * モックデータをリセットするハンドラー
   */
  http.post('/mock/reset', () => {
    curValidatedExRMockData = structuredClone(masterValidatedExRMockData);
    curValidatedAuMockData = structuredClone(masterValidatedAuMockData);
    return new HttpResponse(null, { status: 200 });
  }),
];
