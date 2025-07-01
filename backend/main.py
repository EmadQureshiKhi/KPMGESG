from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from io import BytesIO
import json
from typing import Dict, Any, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=" ESG Analytics API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "kpmgesg.vercel.app"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize column names: lowercase, replace spaces with underscores"""
    # Convert column names to strings first, then clean them
    df.columns = [str(col).lower().replace(' ', '_').replace('-', '_').replace('.', '_') for col in df.columns]
    
    # Handle unnamed columns (like 'Unnamed: 0', 'Unnamed: 1', etc.)
    new_columns = []
    for i, col in enumerate(df.columns):
        if col.startswith('unnamed'):
            # Try to use the first row value as column name if it's meaningful
            if i < len(df.columns) and not pd.isna(df.iloc[0, i]):
                potential_name = str(df.iloc[0, i]).lower().replace(' ', '_').replace('-', '_')
                if potential_name and potential_name != 'nan':
                    new_columns.append(potential_name)
                else:
                    new_columns.append(f'column_{i+1}')
            else:
                new_columns.append(f'column_{i+1}')
        else:
            new_columns.append(col)
    
    df.columns = new_columns
    return df

def detect_header_row(df: pd.DataFrame) -> int:
    """Detect which row contains the actual headers"""
    # Check first few rows to find the one that looks most like headers
    for i in range(min(5, len(df))):
        row = df.iloc[i]
        # Count non-null, non-numeric values that could be headers
        potential_headers = 0
        for val in row:
            if pd.notna(val) and isinstance(val, str) and not str(val).isdigit():
                potential_headers += 1
        
        # If more than half the row contains potential header strings, use this row
        if potential_headers > len(row) * 0.5:
            return i
    
    return 0  # Default to first row

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and validate the uploaded data"""
    try:
        logger.info(f"Original data shape: {df.shape}")
        logger.info(f"Original columns: {list(df.columns)}")
        
        # Detect header row
        header_row = detect_header_row(df)
        logger.info(f"Detected header row at index: {header_row}")
        
        # If header row is not 0, use that row as headers and drop previous rows
        if header_row > 0:
            # Use the detected row as column names
            new_headers = []
            for col_idx, val in enumerate(df.iloc[header_row]):
                if pd.notna(val) and str(val).strip():
                    new_headers.append(str(val).strip())
                else:
                    new_headers.append(f'column_{col_idx+1}')
            
            df.columns = new_headers
            # Drop rows before and including the header row
            df = df.iloc[header_row + 1:].reset_index(drop=True)
        
        # Standardize column names
        df = clean_column_names(df)
        
        logger.info(f"After header detection - shape: {df.shape}")
        logger.info(f"After header detection - columns: {list(df.columns)}")
        
        # Remove completely empty rows
        df = df.dropna(how='all')
        
        # Handle missing values in critical columns
        # Try to identify key columns by common names
        key_columns = []
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['employee', 'id', 'code', 'name']):
                key_columns.append(col)
        
        # Drop rows where key identifier columns are missing
        if key_columns:
            df = df.dropna(subset=key_columns[:1])  # Use first key column
        
        # Convert numeric columns
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['salary', 'allowance', 'age', 'experience', 'amount', 'cost']):
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Remove duplicates if we have an identifier column
        if key_columns:
            df = df.drop_duplicates(subset=[key_columns[0]])
        
        logger.info(f"Final cleaned data shape: {df.shape}")
        logger.info(f"Final columns: {list(df.columns)}")
        
        return df
        
    except Exception as e:
        logger.error(f"Error cleaning data: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Data cleaning failed: {str(e)}")

def generate_summary_statistics(df: pd.DataFrame) -> Dict[str, Any]:
    """Generate summary statistics from the cleaned data"""
    summary = {
        "total_records": len(df),
        "columns": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "summary_stats": {}
    }
    
    # Numeric summaries
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 0:
        summary["summary_stats"]["numeric"] = df[numeric_cols].describe().to_dict()
    
    # Categorical summaries
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        unique_vals = df[col].dropna().unique()
        if len(unique_vals) <= 20:  # Only for columns with reasonable number of categories
            summary["summary_stats"][col] = df[col].value_counts().head(10).to_dict()
    
    return summary

def prepare_chart_data(df: pd.DataFrame) -> Dict[str, Any]:
    """Prepare data for various chart visualizations"""
    chart_data = {}
    
    try:
        # Find department column
        dept_col = None
        for col in df.columns:
            if 'department' in col.lower() or 'dept' in col.lower():
                dept_col = col
                break
        
        if dept_col and dept_col in df.columns:
            dept_counts = df[dept_col].value_counts().head(10)
            chart_data["department_distribution"] = [
                {"name": str(dept), "value": int(count)} 
                for dept, count in dept_counts.items() if pd.notna(dept)
            ]
            
            # Find fuel allowance column
            fuel_col = None
            for col in df.columns:
                if 'fuel' in col.lower() and 'allowance' in col.lower():
                    fuel_col = col
                    break
            
            if fuel_col:
                fuel_by_dept = df.groupby(dept_col)[fuel_col].sum().sort_values(ascending=False).head(10)
                chart_data["fuel_allowance_by_department"] = [
                    {"department": str(dept), "total_fuel_allowance": float(amount)} 
                    for dept, amount in fuel_by_dept.items() if pd.notna(dept) and pd.notna(amount)
                ]
        
        # Find grade column
        grade_col = None
        for col in df.columns:
            if 'grade' in col.lower():
                grade_col = col
                break
        
        if grade_col:
            grade_counts = df[grade_col].value_counts()
            chart_data["employees_by_grade"] = [
                {"grade": str(grade), "count": int(count)} 
                for grade, count in grade_counts.items() if pd.notna(grade)
            ]
        
        # Find age column
        age_col = None
        for col in df.columns:
            if 'age' in col.lower():
                age_col = col
                break
        
        if age_col:
            age_data = df[age_col].dropna()
            if len(age_data) > 0:
                age_bins = pd.cut(age_data, bins=5)
                age_dist = age_bins.value_counts().sort_index()
                chart_data["age_distribution"] = [
                    {"age_range": str(interval), "count": int(count)} 
                    for interval, count in age_dist.items()
                ]
        
        # Find salary column
        salary_col = None
        for col in df.columns:
            if 'salary' in col.lower():
                salary_col = col
                break
        
        if salary_col:
            salary_data = df[salary_col].dropna()
            if len(salary_data) > 0:
                salary_stats = salary_data.describe()
                chart_data["salary_statistics"] = {
                    "mean": float(salary_stats['mean']),
                    "median": float(salary_stats['50%']),
                    "min": float(salary_stats['min']),
                    "max": float(salary_stats['max'])
                }
                
                # Salary by department
                if dept_col:
                    salary_by_dept = df.groupby(dept_col)[salary_col].mean().sort_values(ascending=False).head(10)
                    chart_data["average_salary_by_department"] = [
                        {"department": str(dept), "average_salary": float(salary)} 
                        for dept, salary in salary_by_dept.items() if pd.notna(dept) and pd.notna(salary)
                    ]
    
    except Exception as e:
        logger.error(f"Error preparing chart data: {str(e)}")
        chart_data["error"] = str(e)
    
    return chart_data

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    """Upload and process Excel file"""
    
    # Validate file type
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files (.xlsx, .xls) are allowed")
    
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Load into pandas DataFrame - don't assume first row is header
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(contents), engine='openpyxl', header=None)
        else:
            df = pd.read_excel(BytesIO(contents), engine='xlrd', header=None)
        
        logger.info(f"Raw data loaded - shape: {df.shape}")
        
        # Clean the data (this will handle header detection)
        cleaned_df = clean_data(df)
        
        # Generate summary statistics
        summary = generate_summary_statistics(cleaned_df)
        
        # Prepare chart data
        chart_data = prepare_chart_data(cleaned_df)
        
        # Convert DataFrame to records for table display
        table_data = cleaned_df.head(100).fillna('').to_dict('records')  # Limit to first 100 rows
        
        return {
            "status": "success",
            "message": f"Successfully processed {len(cleaned_df)} records",
            "summary": summary,
            "chart_data": chart_data,
            "table_data": table_data,
            "filename": file.filename
        }
        
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": " ESG Analytics API is running"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "ESG Analytics API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)