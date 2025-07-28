// src/utils/mockData.ts

export const mockInventoryData = [
  {
    id: 1,
    name: "삼성 갤럭시 S24",
    sku: "GALAXY-S24-256GB",
    quantity: 45,
    minQuantity: 10,
    location: "A-01-01",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z"
  },
  {
    id: 2,
    name: "아이폰 15 Pro",
    sku: "IPHONE15PRO-128GB",
    quantity: 8,
    minQuantity: 15,
    location: "A-01-02",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-12-19T16:45:00Z"
  },
  {
    id: 3,
    name: "맥북 에어 M3",
    sku: "MACBOOK-AIR-M3-13",
    quantity: 22,
    minQuantity: 5,
    location: "B-02-01",
    createdAt: "2024-02-01T11:15:00Z",
    updatedAt: "2024-12-20T09:20:00Z"
  },
  {
    id: 4,
    name: "LG 그램 17인치",
    sku: "LG-GRAM-17-2024",
    quantity: 3,
    minQuantity: 8,
    location: "B-02-02",
    createdAt: "2024-02-10T13:45:00Z",
    updatedAt: "2024-12-18T12:10:00Z"
  },
  {
    id: 5,
    name: "에어팟 프로 3세대",
    sku: "AIRPODS-PRO-3GEN",
    quantity: 78,
    minQuantity: 20,
    location: "C-03-01",
    createdAt: "2024-03-01T08:20:00Z",
    updatedAt: "2024-12-20T15:30:00Z"
  },
  {
    id: 6,
    name: "소니 WH-1000XM5",
    sku: "SONY-WH1000XM5-BLACK",
    quantity: 15,
    minQuantity: 12,
    location: "C-03-02",
    createdAt: "2024-03-15T14:00:00Z",
    updatedAt: "2024-12-19T11:25:00Z"
  }
];

export const mockApiResponse = {
  success: true,
  data: mockInventoryData,
  message: "재고 목록 조회 성공"
};
