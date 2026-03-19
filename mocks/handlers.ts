import { http, HttpResponse } from 'msw';
import {
  AuOptionCategoryDtoArraySchema,
  ExRTabDtoArraySchema,
  ExROptionPutRequestSchema,
  UpdatedOptionsSchema,
  OptionTab,
  OptionValueType,
} from '../src/type';
import type { AuOptionCategoryDto, ExRTabDto, UpdatedOptions } from '../src/type';

/**
 * モックデータの作成
 */
const mockExRTabDtoList: ExRTabDto[] = [
  {
    Id: OptionTab.GeneralTab,
    Name: '基本設定',
    Categories: [
      {
        Id: 1,
        Name: 'ゲーム設定',
        Options: [
          {
            Id: 101,
            IsActive: true,
            TransedName: '移動速度',
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
    ],
  },
  {
    Id: OptionTab.CrewmateTab,
    Name: 'クルーメイト',
    Categories: [
      {
        Id: 2,
        Name: '役職設定',
        Options: [
          {
            Id: 201,
            IsActive: true,
            TransedName: 'シェリフ',
            Selection: 0,
            Format: '{0}',
            RangeMeta: {
              Type: 'String',
              Values: ['無効', '有効'],
            },
            Childs: [
              {
                Id: 202,
                IsActive: false,
                TransedName: 'キルクールダウン',
                Selection: 2,
                Format: '{0}s',
                RangeMeta: {
                  Type: 'Single',
                  Values: [10, 20, 30, 40],
                },
                Childs: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Au系オプションのモックデータ作成
 */
const mockAuOptionCategoryDtoList: AuOptionCategoryDto[] = [
  {
    TranslatedTitle: 'ゲーム設定',
    Options: [
      {
        TranslatedTitle: 'マップ',
        TranslatedFormat: '{0}',
        Value: 0,
        Info: {
          ValueType: OptionValueType.Byte,
          OptionName: 1,
        },
        Range: ['The Skeld', 'Mira HQ', 'Polus', 'The Fungle'],
      },
      {
        TranslatedTitle: 'インポスターの数',
        TranslatedFormat: '{0}',
        Value: 2,
        Info: {
          ValueType: OptionValueType.Int,
          OptionName: 2,
        },
        Range: [1, 2, 3],
      },
      {
        TranslatedTitle: '匿名投票',
        TranslatedFormat: '{0}',
        Value: true,
        Info: {
          ValueType: OptionValueType.Bool,
          OptionName: 3,
        },
        Range: ['OFF', 'ON'],
      },
    ],
  },
  {
    TranslatedTitle: '役職設定',
    Options: [
      {
        TranslatedTitle: 'シェリフ',
        TranslatedFormat: '{0}',
        Value: {
          MaxCount: 1,
          Chance: 100,
        },
        Info: {
          ValueType: OptionValueType.RoleBase,
          OptionName: 101,
        },
        Range: null,
      },
      {
        TranslatedTitle: 'キルクールダウン',
        TranslatedFormat: '{0}s',
        Value: 20.5,
        Info: {
          ValueType: OptionValueType.Float,
          OptionName: 102,
        },
        Range: [10.0, 15.0, 20.0, 25.0, 30.0],
      },
    ],
  },
];

/**
 * Zodを使用してモックデータのバリデーションを実施
 */
const validatedExRMockData = ExRTabDtoArraySchema.parse(mockExRTabDtoList);
const validatedAuMockData = AuOptionCategoryDtoArraySchema.parse(mockAuOptionCategoryDtoList);

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

    const { CategoryId, OptionId } = result.data;

    // CategoryIdとOptionIdが0のときは202を返す（ボディなし）
    if (CategoryId === 0 && OptionId === 0) {
      return new HttpResponse(null, { status: 202 });
    }

    // それ以外はUpdatedOptionsを返す
    const mockUpdatedOptions: UpdatedOptions = {
      UpdatedCategory: validatedExRMockData[0].Categories[0],
      ChainUpdatedOption: [validatedExRMockData[0].Categories[0].Options[0]],
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
];
