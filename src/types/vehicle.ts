export interface XitecLog {
  id: string;          // Khớp với "id" từ API CCCD
  name: string;        // Khớp với "name" từ API CCCD
  birth?: string;      // Thêm trường ngày sinh nếu cần dùng
  place?: string
  nationalId: string;
  driverName: string;
  nationalIdImage: string;
  licensePlate: string;
  licensePlateImage: string;
  driverFaceImage: string;
  entryTime: string;
}


export interface ApiResponseCCCD {
  status: string;
  data: {
    id: string;
    name: string;
    birth: string;
    sex: string | null;
    place: string;
  };
}