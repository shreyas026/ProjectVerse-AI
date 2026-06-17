"""
ProjectVerse AI - Python ML Microservice
Serves Career Recommendation and Placement Prediction via REST API.

Runs on port 7001.
Usage: python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ============================================
# Load pre-trained models
# ============================================

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Career prediction models
career_rf = None
career_xgb = None
career_le = None
career_features = None

# Placement prediction models
placement_rf = None
placement_xgb = None
placement_features = None


def load_models():
    """Load all trained models"""
    global career_rf, career_xgb, career_le, career_features
    global placement_rf, placement_xgb, placement_features

    try:
        career_rf = joblib.load(os.path.join(MODELS_DIR, 'career_rf_model.pkl'))
        career_xgb = joblib.load(os.path.join(MODELS_DIR, 'career_xgb_model.pkl'))
        career_le = joblib.load(os.path.join(MODELS_DIR, 'career_label_encoder.pkl'))
        career_features = joblib.load(os.path.join(MODELS_DIR, 'career_feature_cols.pkl'))
        print(f"✅ Career models loaded ({len(career_le.classes_)} classes)")
    except Exception as e:
        print(f"⚠️  Career models not found: {e}")
        print("   Run 'python train_models.py' first")

    try:
        placement_rf = joblib.load(os.path.join(MODELS_DIR, 'placement_rf_model.pkl'))
        placement_xgb = joblib.load(os.path.join(MODELS_DIR, 'placement_xgb_model.pkl'))
        placement_features = joblib.load(os.path.join(MODELS_DIR, 'placement_feature_cols.pkl'))
        print(f"✅ Placement models loaded")
    except Exception as e:
        print(f"⚠️  Placement models not found: {e}")
        print("   Run 'python train_models.py' first")


# ============================================
# API Routes
# ============================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'models': {
            'career': career_rf is not None,
            'placement': placement_rf is not None,
        }
    })


@app.route('/predict/career', methods=['POST'])
def predict_career():
    """
    Career Recommendation Endpoint
    
    Input: { project_count, coding_score, certifications_count, problems_solved,
             github_commits, internship_count, hackathon_wins,
             has_ml_project, has_web_project, has_mobile_project, has_cloud_project }
    Output: Top 3 career recommendations with confidence scores
    """
    if career_rf is None or career_xgb is None:
        return jsonify({'error': 'Models not trained. Run train_models.py first'}), 503

    data = request.json
    
    # Extract features in the correct order
    features = np.array([[
        data.get('project_count', 0),
        data.get('coding_score', 0),
        data.get('certifications_count', 0),
        data.get('problems_solved', 0),
        data.get('github_commits', 0),
        data.get('internship_count', 0),
        data.get('hackathon_wins', 0),
        data.get('has_ml_project', 0),
        data.get('has_web_project', 0),
        data.get('has_mobile_project', 0),
        data.get('has_cloud_project', 0),
    ]]).reshape(1, -1)

    # Predict with both models
    rf_proba = career_rf.predict_proba(features)[0]
    xgb_proba = career_xgb.predict_proba(features)[0]

    # Ensemble average
    final_proba = (rf_proba + xgb_proba) / 2

    # Get top 3 careers
    top_indices = np.argsort(final_proba)[::-1][:3]
    careers = career_le.classes_

    recommendations = []
    for idx in top_indices:
        recommendations.append({
            'career': str(careers[idx]),
            'confidence': round(float(final_proba[idx]) * 100, 1),
            'match': get_career_match_reason(str(careers[idx]), data),
        })

    return jsonify({
        'success': True,
        'data': {
            'recommendations': recommendations,
            'topCareer': str(careers[top_indices[0]]),
            'confidence': round(float(final_proba[top_indices[0]]) * 100, 1),
        }
    })


@app.route('/predict/placement', methods=['POST'])
def predict_placement():
    """
    Placement Prediction Endpoint
    
    Input: { project_count, coding_score, certifications_count, problems_solved,
             github_commits, internship_count, hackathon_wins, cgpa, contribution_score }
    Output: Placement readiness score (0-100) with breakdown
    """
    if placement_rf is None or placement_xgb is None:
        return jsonify({'error': 'Models not trained. Run train_models.py first'}), 503

    data = request.json

    features = np.array([[
        data.get('project_count', 0),
        data.get('coding_score', 0),
        data.get('certifications_count', 0),
        data.get('problems_solved', 0),
        data.get('github_commits', 0),
        data.get('internship_count', 0),
        data.get('hackathon_wins', 0),
        data.get('cgpa', 7.0),
        data.get('contribution_score', 0),
    ]]).reshape(1, -1)

    # Predict with both models
    rf_score = float(placement_rf.predict(features)[0])
    xgb_score = float(placement_xgb.predict(features)[0])

    # Ensemble average, clamped to 0-100
    final_score = round(max(0, min(100, (rf_score + xgb_score) / 2)), 1)

    # Determine category
    if final_score > 75:
        category = 'Ready'
    elif final_score > 50:
        category = 'Needs Improvement'
    else:
        category = 'Not Ready'

    # Generate suggestions
    suggestions = generate_placement_suggestions(data, final_score)

    return jsonify({
        'success': True,
        'data': {
            'readinessScore': final_score,
            'isReady': final_score > 75,
            'category': category,
            'breakdown': {
                'rfScore': round(rf_score, 1),
                'xgbScore': round(xgb_score, 1),
                'ensembleScore': final_score,
            },
            'suggestions': suggestions,
        }
    })


# ============================================
# Helper Functions
# ============================================

def get_career_match_reason(career, data):
    """Generate a human-readable reason for the career match"""
    reasons = {
        'Full Stack Developer': f"Strong web project experience ({data.get('project_count', 0)} projects)",
        'AI Engineer': f"ML expertise with coding score of {data.get('coding_score', 0)}",
        'Data Scientist': f"Analytical skills with {data.get('problems_solved', 0)} problems solved",
        'DevOps Engineer': f"Cloud experience with {data.get('github_commits', 0)} GitHub commits",
        'Mobile Developer': f"Mobile app development with {data.get('project_count', 0)} projects",
        'Cybersecurity Expert': f"{data.get('certifications_count', 0)} certifications earned",
    }
    return reasons.get(career, 'Based on your overall profile')


def generate_placement_suggestions(data, score):
    """Generate improvement suggestions based on weak areas"""
    suggestions = []
    
    if data.get('project_count', 0) < 3:
        suggestions.append('Build more projects (aim for 3-5 portfolio projects)')
    if data.get('coding_score', 0) < 1500:
        suggestions.append('Improve coding score by practicing on LeetCode/HackerRank')
    if data.get('certifications_count', 0) < 2:
        suggestions.append('Get industry certifications (AWS, Google Cloud, etc.)')
    if data.get('problems_solved', 0) < 100:
        suggestions.append('Solve more coding problems (target 100+ for interviews)')
    if data.get('internship_count', 0) < 1:
        suggestions.append('Apply for internships to gain industry experience')
    if data.get('cgpa', 0) < 7.0:
        suggestions.append('Focus on improving your CGPA (target 7.0+)')
    if data.get('github_commits', 0) < 200:
        suggestions.append('Contribute more to GitHub (aim for consistent commits)')

    if score > 75:
        suggestions = ['You are placement ready! Keep improving and start applying.']

    return suggestions[:5]  # Max 5 suggestions


# ============================================
# Main
# ============================================

if __name__ == '__main__':
    load_models()
    print(f"\n🚀 ML Service running on http://localhost:7001")
    print(f"   Endpoints:")
    print(f"   - GET  /health")
    print(f"   - POST /predict/career")
    print(f"   - POST /predict/placement")
    app.run(host='0.0.0.0', port=7001, debug=False)
