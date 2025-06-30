import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

export interface ExcelUploadResponse {
  status: string;
  message: string;
  summary: {
    total_records: number;
    columns: string[];
    data_types: Record<string, string>;
    missing_values: Record<string, number>;
    summary_stats: any;
  };
  chart_data: {
    department_distribution?: Array<{ name: string; value: number }>;
    fuel_allowance_by_department?: Array<{ department: string; total_fuel_allowance: number }>;
    employees_by_grade?: Array<{ grade: string; count: number }>;
    age_distribution?: Array<{ age_range: string; count: number }>;
    salary_statistics?: {
      mean: number;
      median: number;
      min: number;
      max: number;
    };
    average_salary_by_department?: Array<{ department: string; average_salary: number }>;
  };
  table_data: Record<string, any>[];
  filename: string;
}

export const uploadExcelFile = async (file: File): Promise<ExcelUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;