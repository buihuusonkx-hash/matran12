export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // Trắc nghiệm nhiều phương án
  TRUE_FALSE = 'TRUE_FALSE',           // Trắc nghiệm đúng/sai
  SHORT_ANSWER = 'SHORT_ANSWER'        // Trắc nghiệm trả lời ngắn
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
  // Part I: Multiple Choice (Recognition, Understanding)
  mc_recognition: number;
  mc_understanding: number;
  // Part II: True/False (Recognition, Understanding, Application)
  tf_recognition: number;
  tf_understanding: number;
  tf_application: number;
  // Part III: Short Answer (Understanding, Application, Advanced)
  sa_understanding: number;
  sa_application: number;
  sa_advanced: number;
}

export interface MatrixGroup {
  id: string;
  name: string;
  items: MatrixItem[];
}

export interface MatrixData {
  groups: MatrixGroup[];
}
