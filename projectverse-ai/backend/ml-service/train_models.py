"""
ProjectVerse AI - ML Model Training Script
Trains Career Recommendation and Placement Prediction models
using RandomForest + XGBoost ensemble on synthetic student data.

Usage: python train_models.py
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, mean_absolute_error
import joblib
import os

np.random.seed(42)

# ============================================
# Generate Synthetic Student Data
# ============================================

def generate_student_data(n=500):
    """Generate synthetic student data for training"""
    
    careers = [
        'Full Stack Developer', 'AI Engineer', 'Data Scientist',
        'DevOps Engineer', 'Mobile Developer', 'Cybersecurity Expert'
    ]
    
    data = []
    for _ in range(n):
        # Generate features
        project_count = np.random.randint(0, 15)
        coding_score = np.random.randint(0, 3000)
        certifications_count = np.random.randint(0, 8)
        problems_solved = np.random.randint(0, 500)
        github_commits = np.random.randint(0, 1000)
        internship_count = np.random.randint(0, 4)
        hackathon_wins = np.random.randint(0, 5)
        cgpa = round(np.random.uniform(5.0, 10.0), 2)
        contribution_score = np.random.randint(0, 10000)
        
        # Binary skill indicators
        has_ml_project = int(np.random.random() > 0.5)
        has_web_project = int(np.random.random() > 0.3)
        has_mobile_project = int(np.random.random() > 0.6)
        has_cloud_project = int(np.random.random() > 0.7)
        
        # Determine career based on weighted features (realistic patterns)
        weights = np.zeros(len(careers))
        
        # Full Stack Developer - high web projects, good coding
        weights[0] = has_web_project * 3 + coding_score / 1000 + project_count * 0.3
        # AI Engineer - ML projects, high coding, certifications
        weights[1] = has_ml_project * 4 + coding_score / 800 + certifications_count * 0.5
        # Data Scientist - ML projects, problems solved
        weights[2] = has_ml_project * 3 + problems_solved / 100 + cgpa * 0.3
        # DevOps Engineer - cloud projects, github commits
        weights[3] = has_cloud_project * 4 + github_commits / 200 + internship_count
        # Mobile Developer - mobile projects
        weights[4] = has_mobile_project * 4 + project_count * 0.4 + coding_score / 1200
        # Cybersecurity - certifications, cloud, coding
        weights[5] = certifications_count * 0.8 + has_cloud_project * 2 + coding_score / 1500

        # Add randomness
        weights += np.random.normal(0, 0.5, len(careers))
        career = careers[np.argmax(weights)]
        
        # Calculate placement readiness (0-100)
        readiness = min(100, max(0, (
            project_count * 5 +
            min(coding_score / 30, 25) +
            certifications_count * 3 +
            min(problems_solved / 10, 15) +
            internship_count * 8 +
            hackathon_wins * 5 +
            (cgpa - 5) * 3 +
            contribution_score / 500
        ) + np.random.normal(0, 5)))
        
        data.append({
            'project_count': project_count,
            'coding_score': coding_score,
            'certifications_count': certifications_count,
            'problems_solved': problems_solved,
            'github_commits': github_commits,
            'internship_count': internship_count,
            'hackathon_wins': hackathon_wins,
            'cgpa': cgpa,
            'contribution_score': contribution_score,
            'has_ml_project': has_ml_project,
            'has_web_project': has_web_project,
            'has_mobile_project': has_mobile_project,
            'has_cloud_project': has_cloud_project,
            'career_path': career,
            'placement_readiness': round(readiness, 1),
        })
    
    return pd.DataFrame(data)


def train_career_model(df):
    """Train Career Recommendation Model (Classification)"""
    print("\n" + "="*50)
    print("Training Career Recommendation Model")
    print("="*50)
    
    feature_cols = [
        'project_count', 'coding_score', 'certifications_count',
        'problems_solved', 'github_commits', 'internship_count',
        'hackathon_wins', 'has_ml_project', 'has_web_project',
        'has_mobile_project', 'has_cloud_project'
    ]
    
    X = df[feature_cols]
    y = df['career_path']
    
    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )
    
    # Train RandomForest
    rf = RandomForestClassifier(
        n_estimators=200, max_depth=10, random_state=42, n_jobs=-1
    )
    rf.fit(X_train, y_train)
    rf_accuracy = accuracy_score(y_test, rf.predict(X_test))
    print(f"  RandomForest Accuracy: {rf_accuracy:.3f}")
    
    # Train XGBoost
    from xgboost import XGBClassifier
    xgb = XGBClassifier(
        n_estimators=200, max_depth=6, learning_rate=0.1,
        random_state=42, use_label_encoder=False, eval_metric='mlogloss'
    )
    xgb.fit(X_train, y_train)
    xgb_accuracy = accuracy_score(y_test, xgb.predict(X_test))
    print(f"  XGBoost Accuracy: {xgb_accuracy:.3f}")
    
    # Save models
    joblib.dump(rf, 'models/career_rf_model.pkl')
    joblib.dump(xgb, 'models/career_xgb_model.pkl')
    joblib.dump(le, 'models/career_label_encoder.pkl')
    joblib.dump(feature_cols, 'models/career_feature_cols.pkl')
    
    print(f"  Models saved to models/")
    print(f"  Career labels: {list(le.classes_)}")
    
    return rf, xgb, le


def train_placement_model(df):
    """Train Placement Prediction Model (Regression)"""
    print("\n" + "="*50)
    print("Training Placement Prediction Model")
    print("="*50)
    
    feature_cols = [
        'project_count', 'coding_score', 'certifications_count',
        'problems_solved', 'github_commits', 'internship_count',
        'hackathon_wins', 'cgpa', 'contribution_score'
    ]
    
    X = df[feature_cols]
    y = df['placement_readiness']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train RandomForest Regressor
    rf = RandomForestRegressor(
        n_estimators=200, max_depth=10, random_state=42, n_jobs=-1
    )
    rf.fit(X_train, y_train)
    rf_mae = mean_absolute_error(y_test, rf.predict(X_test))
    print(f"  RandomForest MAE: {rf_mae:.2f}")
    
    # Train XGBoost Regressor
    from xgboost import XGBRegressor
    xgb = XGBRegressor(
        n_estimators=200, max_depth=6, learning_rate=0.1, random_state=42
    )
    xgb.fit(X_train, y_train)
    xgb_mae = mean_absolute_error(y_test, xgb.predict(X_test))
    print(f"  XGBoost MAE: {xgb_mae:.2f}")
    
    # Save models
    joblib.dump(rf, 'models/placement_rf_model.pkl')
    joblib.dump(xgb, 'models/placement_xgb_model.pkl')
    joblib.dump(feature_cols, 'models/placement_feature_cols.pkl')
    
    print(f"  Models saved to models/")


if __name__ == '__main__':
    # Create models directory
    os.makedirs('models', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Generate and save data
    print("Generating synthetic student data (500 samples)...")
    df = generate_student_data(500)
    df.to_csv('data/student_data.csv', index=False)
    print(f"Data saved to data/student_data.csv ({len(df)} rows)")
    
    # Train models
    train_career_model(df)
    train_placement_model(df)
    
    print("\n" + "="*50)
    print("All models trained successfully!")
    print("="*50)
    print("\nTo start the ML service:")
    print("  python app.py")
