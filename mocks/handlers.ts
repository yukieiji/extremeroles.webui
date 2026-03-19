import { http, HttpResponse } from 'msw';
import { AuOptionCategoryDtoArraySchema, ExRTabDtoArraySchema, OptionTab, OptionValueType } from '../src/type';
import type { AuOptionCategoryDto, ExRTabDto } from '../src/type';

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
   * GET /au/option/ のハンドラー
   */
  http.get('/au/option/', () => {
    return HttpResponse.json(validatedAuMockData);
  }),
];
