import { http, HttpResponse } from 'msw';
import { ExRTabDtoArraySchema, OptionTab } from '../src/type';
import type { ExRTabDto } from '../src/type';

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
              Type: 'Double',
              Selection: 1,
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
              Type: 'Toggle',
              Selection: 0,
              Values: [false, true],
            },
            Childs: [
              {
                Id: 202,
                IsActive: false,
                TransedName: 'キルクールダウン',
                Selection: 2,
                Format: '{0}s',
                RangeMeta: {
                  Type: 'Float',
                  Selection: 2,
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
 * Zodを使用してモックデータのバリデーションを実施
 */
const validatedMockData = ExRTabDtoArraySchema.parse(mockExRTabDtoList);

export const handlers = [
  /**
   * GET /exr/option/ のハンドラー
   */
  http.get('/exr/option/', () => {
    return HttpResponse.json(validatedMockData);
  }),
];
