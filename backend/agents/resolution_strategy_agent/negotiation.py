from typing import Dict, Any

class NegotiationAgent:
    """
    Advanced LLM wrapper responsible for Emotion-Aware Personalized Negotiation.
    Uses the customer's sentiment (from voice/text) and CLV to tailor the 
    tone and the refund/retention offers dynamically.
    """

    def generate_offer(self, clv_data: Dict[str, Any], sentiment: str, base_refund: float) -> str:
        """
        Dynamically generates a personalized response string imitating an LLM prompt.
        """
        is_high_value = clv_data.get("clv_score", 0) > 1000
        churn_risk = clv_data.get("churn_risk_category", "Low")
        
        # Base prompt generation
        prompt = f"Customer Sentiment: {sentiment.upper()}\n"
        prompt += f"Base Approved Refund: ${base_refund}\n\n"
        
        if sentiment in ["frustrated", "angry", "highly_stressed"]:
            if is_high_value or churn_risk == "High":
                prompt += (
                    "[Negotiation Strategy: EMPATHETIC RETENTION]\n"
                    f"Offer: Full Refund of ${base_refund} + Immediate $50 Store Credit.\n"
                    "Tone: Deeply apologetic, validating their frustration, emphasizing their importance as a VIP."
                )
            else:
                prompt += (
                    "[Negotiation Strategy: DE-ESCALATION]\n"
                    f"Offer: Process the ${base_refund} refund immediately without friction.\n"
                    "Tone: Calm, professional, direct, aiming to close the loop quickly to avoid further escalation."
                )
        else:
            if is_high_value:
                prompt += (
                    "[Negotiation Strategy: LOYALTY REWARD]\n"
                    f"Offer: Base refund ${base_refund} + free expedited shipping on next order.\n"
                    "Tone: Warm, appreciative of their continued business."
                )
            else:
                prompt += (
                    "[Negotiation Strategy: STANDARD]\n"
                    f"Offer: Standard policy refund of ${base_refund}.\n"
                    "Tone: Polite, helpful, policy-driven."
                )

        return prompt
