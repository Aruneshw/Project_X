from typing import Dict, Any

class CLVAnalyzer:
    """
    Evaluates Customer Lifetime Value (CLV) and predicts Churn risk.
    Used by the escalation queue to prioritize high-value customers.
    """

    def analyze_customer(self, total_spend: float, purchase_frequency: int, active_months: int, recent_disputes: int) -> Dict[str, Any]:
        """
        Calculates CLV score and churn probability based on historical behavior.
        """
        # Simple ML heuristic mock
        clv_score = total_spend * (purchase_frequency / max(active_months, 1))

        # Churn risk increases with recent disputes, decreases with high purchase frequency
        churn_risk_score = (recent_disputes * 25) - (purchase_frequency * 5)
        
        # Clamp between 0 and 100
        churn_risk_score = max(0, min(churn_risk_score, 100))

        risk_category = "Low"
        if churn_risk_score > 70:
            risk_category = "High"
        elif churn_risk_score > 40:
            risk_category = "Medium"

        # Determine if we should offer a "retention bonus"
        recommend_retention_bonus = False
        bonus_amount = 0.0
        
        if risk_category in ["Medium", "High"] and clv_score > 1000:
            recommend_retention_bonus = True
            bonus_amount = min(clv_score * 0.05, 100.0) # Up to $100

        return {
            "clv_score": round(clv_score, 2),
            "churn_risk_pct": churn_risk_score,
            "churn_risk_category": risk_category,
            "recommend_retention_bonus": recommend_retention_bonus,
            "suggested_bonus_amount": round(bonus_amount, 2),
            "rationale": f"High value customer (CLV: ${clv_score:.2f}) at {risk_category} risk of churning."
        }
