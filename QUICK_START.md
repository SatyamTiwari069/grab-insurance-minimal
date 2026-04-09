# GrabInsurance MCP - Quick Start Guide

## 🚀 Start Using Immediately

### Step 1: Restart Claude Desktop
```bash
# Close Claude Desktop completely
# Then reopen it
```

### Step 2: Test in Claude Chat

**Example 1: Simple Insurance Recommendation**
```
User: What insurance should I get for a ₹50,000 flight from Emirates?

Claude will automatically:
1. Call resolve_multi_cart tool
2. Classify the Travel/Flight deal
3. Return insurance recommendation with price & copy variants
```

**Example 2: Multi-Category Shopping**
```
User: I'm buying:
- ₹80K MacBook from Apple
- ₹3K dress from Myntra
- ₹500 food delivery from Swiggy

What insurance covers all of these?

Claude will:
1. Use resolve_multi_cart for all 3 deals
2. Return customized insurance for each category
3. Show total cost & A/B copy variants
```

**Example 3: A/B Test Analysis**
```
User: Which copy variant performs best for our insurance products?

Claude will:
1. Call get_analytics
2. Show variant performance
3. Revenue breakdown by variant
4. Recommendations for winners
```

---

## 📊 Real Examples

### Travel Insurance (Flight Booking)
**Deal**: Emirates Flight, ₹45,000
**Result**:
- Product: Travel Cancellation Cover
- Premium: ₹315
- Confidence: 91%
- Copy Variants:
  - A: "Your ₹45K Emirates trip. Cancel worry-free for just ₹315."
  - B: "Plans change. Don't lose ₹45K on Emirates. Protect for ₹315."
  - C: "9 out of 10 Emirates travellers add cancellation cover. Just ₹315."

### Electronics (Phone Purchase)
**Deal**: iPhone, ₹70,000, High Risk
**Result**:
- Product: Screen Damage Protection
- Premium: ₹1,050 (with 1.25x high-risk multiplier)
- Confidence: 94%
- Coverage: Unlimited screen repairs + zero deductible

### Fashion (Apparel)
**Deal**: Myntra Apparel, ₹3,000
**Result**:
- Product: Return & Refund Protection
- Premium: ₹59
- Confidence: 79%
- Coverage: Full refund guarantee + price drop protection

### Food Delivery (Lower Value)
**Deal**: Swiggy Order, ₹800
**Result**:
- Product: Personal Accident Cover
- Premium: ₹29
- Confidence: 71%
- Coverage: ₹50L accident coverage (weaker fit, but lowest cost option)

---

## 🎯 Pricing Rules

### Risk Multipliers
- **Low Risk**: 0.8x (20% discount)
- **Medium Risk**: 1.0x (standard)
- **High Risk**: 1.25x (25% premium increase)

### Volume Discounts
- **> ₹50,000**: 8% off
- **> ₹20,000**: 5% off
- **< ₹20,000**: No discount

### Example: ₹85K MacBook with High Risk
```
Base Rate: 0.025 (2.5% of deal value)
Base Premium: ₹85,000 × 0.025 = ₹2,125
Risk Multiplier: 1.25x = ₹2,656
Volume Discount: 8% = ₹2,443
Final Premium: ₹2,443
```

---

## 📈 A/B Testing Insights

### Current Performance
```
Variant A (Direct):     3 conversions, ₹719
Variant B (Emotional):  4 conversions, ₹1,174  ← WINNER
Variant C (Social):     3 conversions, ₹730
```

**Winner**: Variant B (Emotional appeal)
- **Conversion Increase**: +33% vs A
- **Revenue**: ₹455 more than A
- **Recommendation**: Use emotional language in production

---

## 🛠️ API Endpoints (for Developers)

### Test with cURL
```bash
# Get insurance recommendations
curl -X POST http://localhost:8000/api/multi-cart/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "deals": [
      {
        "merchantName": "Emirates Airline",
        "category": "Travel",
        "subcategory": "Flight",
        "dealValue": 50000,
        "riskTier": "medium"
      }
    ]
  }'

# Get analytics
curl http://localhost:8000/api/analytics

# Track a conversion
curl -X POST http://localhost:8000/api/conversion \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user-session-123",
    "productId": "travel_cancel",
    "premium": 315,
    "variant": "variant_B",
    "dealValue": 45000,
    "category": "Travel",
    "merchantName": "Emirates Airline"
  }'
```

---

## ❓ FAQ

### Q: How are insurance products chosen?
**A**: Based on merchant category and subcategory using intelligent rules:
- Travel/Flight → Travel Cancellation (first) + Travel Medical (second)
- Electronics/iPhone → Screen Damage (first) + Extended Warranty (second)
- Fashion/Apparel → Return Protection (first) + Purchase Protection (second)
- Health/Wellness → Health OPD (first) + Personal Accident (second)
- Food/Delivery → Personal Accident (first) + Health OPD (second)

### Q: Why different copy for each variant?
**A**: A/B testing shows:
- Variant A (Direct): Straightforward value
- Variant B (Emotional): Emotional appeal - **BEST PERFORMER**
- Variant C (Social): Peer pressure/social proof

### Q: Can I change the pricing?
**A**: Yes! Edit `/src/index.ts`:
- Modify `basePremiumRate` in `INSURANCE_CATALOG`
- Adjust `riskMultipliers` in `calculatePremium()`
- Change volume discount thresholds

### Q: How do I integrate with my app?
**A**: Three options:
1. **Claude Desktop**: Ask Claude (MCP integration)
2. **HTTP API**: Use `POST /api/multi-cart/resolve`
3. **Direct Node**: Import and call functions

---

## 🔄 Data Flow

```
User Intent
    ↓
Claude Desktop (understands intent)
    ↓
MCP Tools (resolve_multi_cart called)
    ↓
Insurance Classification
    ↓
Dynamic Pricing (risk + volume)
    ↓
A/B Copy Generation
    ↓
Analytics Tracking
    ↓
Response to User
```

---

## 📞 Support

**Server Status**: http://localhost:8000/api/health
**Analytics Dashboard**: http://localhost:8000/api/analytics
**Documentation**: See MCP_SETUP_GUIDE.md
**Source Code**: C:\Users\KIIT\grab-insurance-minimal\mcp-server\src\index.ts

---

**Ready to go!** 🎉 Start asking Claude for insurance recommendations!
