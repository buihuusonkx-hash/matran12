export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // Trắc nghiệm nhiều phương án
  TRUE_FALSE = 'TRUE_FALSE',           // Trắc nghiệm đúng/sai
  SHORT_ANSWER = 'SHORT_ANSWER',       // Trắc nghiệm trả lời ngắn
  ESSAY = 'ESSAY'                      // Tự luận
}

export enum CognitiveLevel {
  RECOGNITION = 'RECOGNITION', // Nhận biết
  UNDERSTANDING = 'UNDERSTANDING', // Thông hiểu
  APPLICATION = 'APPLICATION', // Vận dụng
  ADVANCED_APPLICATION = 'ADVANCED_APPLICATION' // Vận dụng cao
}

export interface MatrixItem {
  id: string;
  name: string;
  periods: number;
  // Dạng 1: Trắc nghiệm nhiều lựa chọn (NLC)
  mc_rec: number;
  mc_und: number;
  mc_app: number;
  // Dạng 2: Trắc nghiệm Đúng/Sai (Đ-S)
  tf_rec: number;
  tf_und: number;
  tf_app: number;
  // Dạng 3: Trắc nghiệm Trả lời ngắn (TLN)
  sa_rec: number;
  sa_und: number;
  sa_app: number;
  // Tự luận (TL)
  essay_app: number;
  essay_adv: number;
}

export interface MatrixGroup {
  id: string;
  name: string;
  items: MatrixItem[];
}

export interface MatrixData {
  grade: number;
  semester: string;
  examType: string;
  groups: MatrixGroup[];
}
