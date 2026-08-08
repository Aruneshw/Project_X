from typing import Dict, Any

class ResolutionCalculator:
    """
    Agent responsible for complex math and logic to determine optimal resolution paths
    such as prorated refunds, restocking fees, and replacement costs.
    """

    def __init__(self):
        # Base policy configurations
        self.restocking_fee_pct = 0.15  # 15%
        self.depreciation_per_month = 0.05 # 5% per month

    def calculate_refund(self, order_total: float, months_owned: int, reason: str, customer_tier: str) -> Dict[str, Any]:
        """
        Calculates the exact refund amount based on time owned, reason, and customer status.
        """
        refund_amount = order_total
        deductions = []

        # If item is defective or damaged upon arrival, 100% refund, no restocking fee
        if reason in ["defective", "damaged_in_transit"]:
            return {
                "final_refund": round(refund_amount, 2),
                "deductions": deductions,
                "resolution_type": "full_refund",
                "rationale": "100% refund approved for defective/damaged goods."
            }

        # Apply depreciation for buyer's remorse if owned for > 1 month
        if months_owned > 0:
            depreciation = min(order_total * (self.depreciation_per_month * months_owned), order_total * 0.5)
            refund_amount -= depreciation
            deductions.append(f"Depreciation ({months_owned} months): -${depreciation:.2f}")

        # Apply restocking fee unless they are a VIP/Gold tier
        if customer_tier.lower() not in ["gold", "platinum", "vip"]:
            restocking_fee = order_total * self.restocking_fee_pct
            refund_amount -= restocking_fee
            deductions.append(f"Restocking Fee (15%): -${restocking_fee:.2f}")
        else:
            deductions.append("Restocking Fee Waived (Loyalty Tier Benefit)")

        # Ensure refund doesn't go below 0
        final_refund = max(refund_amount, 0.0)

        return {
            "final_refund": round(final_refund, 2),
            "deductions": deductions,
            "resolution_type": "partial_refund" if final_refund < order_total else "full_refund",
            "rationale": f"Calculated based on {months_owned} months ownership and {customer_tier} tier."
        }
